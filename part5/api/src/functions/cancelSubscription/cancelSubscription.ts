import type { APIGatewayEvent } from 'aws-lambda'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { stripe } from 'src/lib/stripe'

export const handler = async (event: APIGatewayEvent) => {
  logger.info('Invoked cancelSubscription function')
  if (event.httpMethod !== 'POST') {
    throw new Error('Only post method for this function please')
  }
  const { userId, subscriptionId } = JSON.parse(event.body)
  await db.user.update({
    where: { id: userId },
    data: {
      subscriptionId: null,
      subscriptionName: null,
      subscriptionStatus: null,
    },
  })
  await stripe.subscriptions.del(subscriptionId)
  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: 'Subscription deleted',
    }),
  }
}
