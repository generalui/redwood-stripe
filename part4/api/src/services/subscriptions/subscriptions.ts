import Stripe from 'stripe'
import { stripe } from 'src/lib/stripe'
import { db } from 'src/lib/db'

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

export const isSubscriptionValid = async ({ userId }: { userId: number }) => {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (user?.subscriptionStatus === 'success') {
    const subscription = await stripe.subscriptions.retrieve(
      user.subscriptionId
    )
    return subscription.status === 'active'
  }
  return false
}
