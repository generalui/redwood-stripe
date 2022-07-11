import Stripe from 'stripe'
import { stripe } from 'api/src/lib/stripe'

const subscriptions: Stripe.ProductCreateParams[] = [
  {
    name: 'Basic',
    description: "We'll take a 10% commission on everything you sell",
    default_price_data: {
      currency: 'usd',
      unit_amount: 3500,
      recurring: {
        interval: 'month',
      },
    },
  },
  {
    name: 'Pro',
    description: "We'll take a 3% commission on everything you sell",
    default_price_data: {
      currency: 'usd',
      unit_amount: 15500,
      recurring: {
        interval: 'month',
      },
    },
  },
]

export default async () => {
  console.log('Getting products')
  const { data: products } = await stripe.products.list({
    active: true,
  })

  if (products.length) {
    const productNames = products.map((p) => p.name)
    for (const subscription of subscriptions) {
      if (productNames.includes(subscription.name)) {
        console.log(
          `The subscription ${subscription.name} exists already, delete it from your Stripe dashboard to run this script`
        )
        process.exit(1)
      }
    }
  }

  console.log('Seeding subscriptions')

  for (const subscription of subscriptions) {
    console.log(`Creating ${subscription.name}`)
    await stripe.products.create(subscription)
  }

  console.log('Done')
}
