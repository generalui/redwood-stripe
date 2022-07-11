import { stripe } from 'src/lib/stripe'
import type { QueryResolvers } from 'types/graphql'

export const payments: QueryResolvers['payments'] = async ({
  userId,
}: {
  userId?: number
}) => {
  const params = userId ? { transfer_group: `${userId}` } : {}
  const charges = await stripe.charges.list(params)
  return charges.data.map((charge) => ({
    stripeId: charge.id,
    fromEmail: charge.billing_details.name,
    amount: charge.amount,
    status: charge.status,
    receiptUrl: charge.receipt_url,
    connectedAccountEmail: charge.metadata?.connectedAccountEmail,
    connectedAccountId: +charge.metadata?.connectedAccountId || undefined,
    type:
      charge.metadata?.type ||
      (charge.description === 'Subscription creation'
        ? 'subscription'
        : 'unknown'),
  }))
}
