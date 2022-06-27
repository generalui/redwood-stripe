import type { APIGatewayEvent } from 'aws-lambda'
import { logger } from 'src/lib/logger'
import { SubscriptionStatus } from '@prisma/client'
import { db } from 'src/lib/db'

export const handler = async (event: APIGatewayEvent) => {
  logger.info('Invoked stripeWebhook function')
  const stripeEvent = JSON.parse(event.body)
  const subscriptionStatus: SubscriptionStatus | null =
    stripeEvent.type === 'payment_intent.succeeded'
      ? 'success'
      : stripeEvent.type === 'payment_intent.payment_failed'
      ? 'failed'
      : null
  if (subscriptionStatus) {
    const paymentIntent = stripeEvent.data.object
    await db.user.updateMany({
      where: { stripeClientSecret: paymentIntent.client_secret },
      data: {
        stripeClientSecret: null,
        subscriptionStatus,
      },
    })
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: { received: true },
    }),
  }
}
