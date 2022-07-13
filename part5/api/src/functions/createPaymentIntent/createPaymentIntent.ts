import type { APIGatewayEvent } from 'aws-lambda'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { stripe } from 'src/lib/stripe'
import { User, Product } from '@prisma/client'

export const handler = async (event: APIGatewayEvent) => {
  logger.info('Invoked createSubscription function')
  if (event.httpMethod !== 'POST') {
    throw new Error('Only post method for this function please')
  }
  const { userId, productId } = JSON.parse(event.body)
  if (userId && productId) {
    const user = await getUser(+userId)
    const product = await getProduct(+productId)
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: product.price * 100,
        currency: 'usd',
        customer: user.stripeCustomerId,
        automatic_payment_methods: {
          enabled: true,
        },
        application_fee_amount:
          product.price *
          100 *
          +process.env[
            `PLATFORM_FEE_${product.user.subscriptionName.toUpperCase()}`
          ],
        transfer_data: {
          destination: product.user.stripeAccountId,
        },
        metadata: {
          type: 'purchase',
          connectedAccountEmail: product.user.email,
          connectedAccountId: product.user.id,
        },
        transfer_group: `${product.user.id}`,
      })
      const clientSecret = paymentIntent.client_secret
      const purchase = await db.purchase.create({
        data: {
          userId,
          productId,
          clientSecret,
          status: 'init',
        },
      })
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientSecret,
          purchaseId: purchase.id,
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
  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      name: user.email,
    })
    await db.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    })
    return { ...user, stripeCustomerId: customer.id }
  }
  return user
}

async function getProduct(
  productId: number
): Promise<Product & { user: User }> {
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { user: true },
  })
  if (!product) {
    throw new Error(`No products found with id=${productId}`)
  }
  return product
}
