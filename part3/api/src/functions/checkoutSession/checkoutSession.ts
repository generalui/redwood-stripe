import type { APIGatewayEvent } from 'aws-lambda'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { stripe } from 'src/lib/stripe'
import { User, Product } from '@prisma/client'
import Stripe from 'stripe'

export const handler = async (event: APIGatewayEvent) => {
  logger.info('Invoked createSubscription function')
  if (event.httpMethod !== 'POST') {
    throw new Error('Only post method for this function please')
  }
  const { userId, productId } = JSON.parse(event.body)
  if (userId && productId) {
    const user = await getUser(+userId)
    const product = await getProduct(+productId)
    const customer = await stripe.customers.create({
      name: user.email,
    })
    try {
      const { clientSecret, subscriptionId } = await createCheckoutSession(
        customer.id,
        product.price
      )
      await db.user.update({
        where: { id: user.id },
        data: {
          stripeClientSecret: clientSecret,
          subscriptionStatus: 'init',
          subscriptionName: product.name,
          subscriptionId,
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

async function getProduct(productId: number): Promise<Product> {
  const product = await db.product.findUnique({ where: { id: productId } })
  if (!product) {
    throw new Error(`No products found with id=${productId}`)
  }
  return product
}

async function createCheckoutSession(
  customerId: string,
  product: Product
): Promise<{ clientSecret: string; subscriptionId: string }> {
  const subscription = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  })
  return {
    clientSecret: (
      (subscription.latest_invoice as Stripe.Invoice)
        .payment_intent as Stripe.PaymentIntent
    ).client_secret,
    subscriptionId: subscription.id,
  }
}
