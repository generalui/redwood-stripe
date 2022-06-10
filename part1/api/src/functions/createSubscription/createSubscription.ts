import type { APIGatewayEvent } from 'aws-lambda'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { stripe } from 'src/lib/stripe'
import { User } from '@prisma/client'
import Stripe from 'stripe'

export const handler = async (event: APIGatewayEvent) => {
  logger.info('Invoked createSubscription function')
  if (event.httpMethod !== 'POST') {
    throw new Error('Only post method for this function please')
  }
  const { userId, subscriptionId } = JSON.parse(event.body)
  if (userId && subscriptionId) {
    const user = await getUser(+userId)
    const product = await getSubscription(subscriptionId)
    const customer = await stripe.customers.create({
      name: user.email,
    })
    const priceId = product.default_price as string
    try {
      const { clientSecret } = await createSubscription(customer.id, priceId)
      await db.user.update({
        where: { id: user.id },
        data: {
          stripeClientSecret: clientSecret,
          subscriptionStatus: 'init',
          subscriptionName: product.name,
        },
      })
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientSecret,
        }),
      }
    } catch (error) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: error.message }),
      }
    }
  }
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: 'nothing happened...',
    }),
  }
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

async function createSubscription(
  customerId: string,
  priceId: string
): Promise<{ clientSecret: string; subscriptionId: string }> {
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
    subscriptionId: subscription.id,
  }
}
