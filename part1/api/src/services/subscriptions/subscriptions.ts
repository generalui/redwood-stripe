import Stripe from 'stripe'
import { stripe } from 'src/lib/stripe'
import { db } from 'src/lib/db'
import { User } from '@prisma/client'

export const subscriptions = async () => {
  // Get a list of active products
  const { data: products } = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  })

  // Return the list of objects as defined in the sdl
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: (p.default_price as Stripe.Price).unit_amount,
    currency: (p.default_price as Stripe.Price).currency,
  }))
}

export const createSubscription = async ({ id }: { id: string }) => {
  const userId = context.currentUser?.id
  if (userId && id) {
    const user = await getUser(+userId)
    const product = await getSubscription(id)
    const customer = await stripe.customers.create({
      name: user.email,
    })
    const priceId = product.default_price as string
    const { clientSecret } = await createStripeSubscription(
      customer.id,
      priceId
    )
    await db.user.update({
      where: { id: user.id },
      data: {
        stripeClientSecret: clientSecret,
        subscriptionStatus: 'init',
        subscriptionName: product.name,
      },
    })
    return clientSecret
  }
  throw new Error('Could not create subscription')
}

async function getUser(userId: number): Promise<User> {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new Error(`No users found with id=${userId}`)
  }
  return user
}

async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Product> {
  const product = await stripe.products.retrieve(subscriptionId)
  if (!product || !product.active || !product.default_price) {
    throw new Error(`No subscriptions found with id=${subscriptionId}`)
  }
  return product
}

async function createStripeSubscription(
  customerId: string,
  priceId: string
): Promise<{ clientSecret: string }> {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  })
  return {
    clientSecret: (
      (subscription.latest_invoice as Stripe.Invoice)
        .payment_intent as Stripe.PaymentIntent
    ).client_secret,
  }
}
