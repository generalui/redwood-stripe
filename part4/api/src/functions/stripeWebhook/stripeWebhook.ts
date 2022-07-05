import type { APIGatewayEvent } from 'aws-lambda'
import { logger } from 'src/lib/logger'
import { PaymentStatus } from '@prisma/client'
import { db } from 'src/lib/db'

type StripeAccountUpdateEvent = {
  type: string
  data: {
    object: {
      id: string
      payouts_enabled: boolean
    }
  }
}

export const handler = async (event: APIGatewayEvent) => {
  logger.info('Invoked stripeWebhook function')
  const stripeEvent = JSON.parse(event.body)
  if (stripeEvent.type === 'account.updated') {
    checkAccountUpdate(stripeEvent)
    return
  }
  const status: PaymentStatus | null =
    stripeEvent.type === 'payment_intent.succeeded'
      ? 'success'
      : stripeEvent.type === 'payment_intent.payment_failed'
      ? 'failed'
      : null
  if (status) {
    const paymentIntent = stripeEvent.data.object
    const clientSecret = paymentIntent.client_secret
    if (await isSubscriptionClientSecret(clientSecret)) {
      await db.user.updateMany({
        where: { stripeClientSecret: clientSecret },
        data: {
          stripeClientSecret: null,
          subscriptionStatus: status,
        },
      })
    } else {
      await db.purchase.updateMany({
        where: { clientSecret },
        data: { clientSecret: null, status: 'success' },
      })
    }
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

async function isSubscriptionClientSecret(clientSecret: string) {
  return !!(await db.user.count({
    where: { stripeClientSecret: clientSecret },
  }))
}

async function checkAccountUpdate(event: StripeAccountUpdateEvent) {
  if (event.data.object.payouts_enabled) {
    await db.user.updateMany({
      where: { stripeAccountId: event.data.object.id },
      data: { stripeOnboardingDone: true },
    })
  }
}
