# Part 4: Sellers payouts with Stripe Connect

In this part we will use [Stripe Connect](https://stripe.com/docs/connect) to handle seller's payout when one of their product is being sold.
Connect allows us to payout our sellers. For each seller will have to create what stripe calls a _connected account_.

There are 3 types of connected accounts (more details [here](https://stripe.com/docs/connect/accounts)):

- **express**: The simplest integration, with little customization possible. Stripe handle account onboarding, management, and identity verification. Think Uber, Lyft, Airbnb, Etsy...
- **standard**: Have users that are familiar with running online businesses or might already have a Stripe account. Think Shopify
- **custom**: Want complete control over your user’s experience.

For our purpose we will choose the **express** account type.

## Connect setup

First you need to signup for Stripe Connect. Go to https://dashboard.stripe.com/connect/accounts/overview and click get started on the _Enable financial services and multi-party payments with Connect_ section
Just follow the instruction to enroll to Connect.

## Create a connected account when a seller signs up

First we will need to record the connected account id in the db. We already had a `stripeCustomerId` when buying a subscription, but that is slightly different, we want to be able to transfer money to that account. We'll add a `stripeAccountId`

We're also going to need to know if user completed the onboarding before selling anything. We'll do that with the property `stripeOnboardingDone`

```prisma
model User {
  id                   Int            @id @default(autoincrement())
  email                String         @unique
  hashedPassword       String
  salt                 String
  roles                String[]
  stripeClientSecret   String?
  resetToken           String?
  resetTokenExpiresAt  DateTime?
  subscriptionId       String?
  subscriptionName     String?
  stripeCustomerId     String?
  stripeAccountId      String?
  stripeOnboardingDone Boolean        @default(false)
  subscriptionStatus   PaymentStatus?
  products             Product[]
  purchases            Purchase[]
}
```

Then `yarn rw prisma migrate dev` to add the field in the DB.

The frontend will need to know about the current user's `stripeOnboardingDone` value, so we need to add it to the `getCurrentUser` method in `lib/auth.ts`:

```ts
export const getCurrentUser = async (session) => {
  return await db.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      roles: true,
      email: true,
      subscriptionStatus: true,
      subscriptionName: true,
      subscriptionId: true,
      stripeOnboardingDone: true,
    },
  })
}
```

We can now move to `functions/auth.ts` and add the logic to create connected accounts for sellers in the signupOptions':

```ts
const signupOptions = {
  // Whatever you want to happen to your data on new user signup. Redwood will
  // check for duplicate usernames before calling this handler. At a minimum
  // you need to save the `username`, `hashedPassword` and `salt` to your
  // user table. `userAttributes` contains any additional object members that
  // were included in the object given to the `signUp()` function you got
  // from `useAuth()`.
  //
  // If you want the user to be immediately logged in, return the user that
  // was created.
  //
  // If this handler throws an error, it will be returned by the `signUp()`
  // function in the form of: `{ error: 'Error message' }`.
  //
  // If this returns anything else, it will be returned by the
  // `signUp()` function in the form of: `{ message: 'String here' }`.
  handler: async ({
    username,
    hashedPassword,
    salt,
    userAttributes,
  }: {
    username: string
    hashedPassword: string
    salt: string
    userAttributes: any
  }) => {
    let stripeAccountId: string | undefined = undefined
    if (userAttributes.seller) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: username,
      })
      stripeAccountId = account.id
    }
    return db.user.create({
      data: {
        email: username,
        hashedPassword,
        salt,
        stripeAccountId,
        roles: userAttributes.seller ? ['seller'] : [],
        // name: userAttributes.name
      },
    })
  },

  errors: {
    // `field` will be either "username" or "password"
    fieldMissing: '${field} is required',
    usernameTaken: 'Username `${username}` already in use',
  },
}
```

## Get connected account onboarding link

We now need to make sure that the seller goes through stripe onboarding for their connected account, this will connect stripe and the seller's account in order to be able to transfer money to the seller when a purchase is completed.

After signup, is the user is a seller, we will call the backend and request an `account link`. That is a single use Stripe url for the user to complete the onboarding process before getting redirected to our platform.

We'll do that inside a function

```
yarn rw g function createStripeAccountLink
```

We will need to redirect to the website after stripe onboarding, so let's add an environment variable in our `.env` file for that:

```
WEBSITE_URL=http://localhost:8910
```

Here is the code for the function:

```ts
import type { APIGatewayEvent } from 'aws-lambda'
import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { User } from '@prisma/client'
import { stripe } from 'src/lib/stripe'

export const handler = async (event: APIGatewayEvent) => {
  logger.info('Invoked createSubscription function')
  if (event.httpMethod !== 'POST') {
    throw new Error('Only post method for this function please')
  }
  const { userId } = JSON.parse(event.body)
  if (userId) {
    const user = await getUser(+userId)
    if (user.stripeAccountId) {
      const accountLink = await stripe.accountLinks.create({
        account: user.stripeAccountId,
        refresh_url: process.env.WEBSITE_URL,
        return_url: process.env.WEBSITE_URL,
        type: 'account_onboarding',
      })
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: accountLink.url,
        }),
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
```

The main part is the call to `stripe.accountLinks.create` to get the url for the onboarding. The user is redirected to the `refresh_url` once he completes the onboarding flow, but as the doc says "This doesn’t mean that all information has been collected or that there are no outstanding requirements on the account". In case of error/failure, the user is redirected to the `return_url`. Here we put the same url for both. We will check if the onboarding has been completed successfully with webhooks.

## Redirect new sellers to Stripe's connected account onboarding flow

For that we need to create method that calls our `createStripeAccountLink` function and do the redirect
Let's create a `web/src/lib/stripeOnboarding.ts` file with this code:

```ts
export async function stripeOnboarding(userId: number) {
  const response = await fetch(
    `${global.RWJS_API_URL}/createStripeAccountLink`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    }
  )
  const { url } = await response.json()
  location.href = url
}
```

Now upon signup if the user is a seller and has not completed the onboarding we can call this method. In `SignupPage.tsx`:

```tsx
const SignupPage = () => {
  const { signUp, currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      if (
        currentUser.roles.includes('seller') &&
        !currentUser.stripeOnboardingDone
      ) {
        stripeOnboarding(currentUser.id)
      } else {
        navigate(routes.home())
      }
    }
  }, [currentUser])
```

## Flip the stripeOnboardingDone flag when onboarding is completed

Stripe documentation talks about 2 main ways of checking if payouts are enabled for a connected account (see [here](https://stripe.com/docs/connect/collect-then-transfer-guide)):

- Listening to account.updated webhooks
- Calling the Accounts API and inspecting the returned object

We will go with the webhook approach. First let's try to log the events that are coming upon creating a connected account
In `stripeWebhook.ts`, add `console.log(event.body)` at the beginning of the handler method then go through the signup process.
In the server output, we focus on the webhook with `"type": "account.updated"` and we see the property `payouts_enabled` getting set to true on the last webhook.
We can remove the `console.log` statement and add the actual implementation:

```ts
export const handler = async (event: APIGatewayEvent) => {
  logger.info('Invoked stripeWebhook function')
  const stripeEvent = JSON.parse(event.body)
  if (stripeEvent.type === 'account.updated') {
    checkAccountUpdate(stripeEvent)
    return
  }
...
}

async function checkAccountUpdate(event: StripeAccountUpdateEvent) {
  if (event.data.object.payouts_enabled) {
    await db.user.updateMany({
      where: { stripeAccountId: event.data.object.id },
      data: { stripeOnboardingDone: true },
    })
  }
}
```

## Verify onboarding is completed before selling products

We don't allow the user to create product until the onboarding is completed, and we will offer a button to complete the onboarding if it is not completed yet in `SellStuffPage.tsx`

```tsx
import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import ProductsCell from 'src/components/ProductsCell'
import { stripeOnboarding } from 'src/lib/stripeOnboarding'

const SellStuffPage = () => {
  const { currentUser } = useAuth()
  const completeStripeOnboarding = () => {
    stripeOnboarding(currentUser.id)
  }
  return (
    <>
      <MetaTags title="Sell Stuff" description="Sell Stuff page" />

      {currentUser?.stripeOnboardingDone ? (
        <ProductsCell userId={currentUser.id} />
      ) : (
        <div>
          You need to complete Stripe onboarding before adding products to sell
          on the platform{' '}
          <button onClick={completeStripeOnboarding}>Stripe Onboarding</button>
        </div>
      )}
      <Link
        to={routes.createProduct()}
        className="py-2 px-4 bg-indigo-400 rounded-md text-white font-bold mt-5 inline-block"
      >
        Add Product
      </Link>
    </>
  )
}

export default SellStuffPage
```

## Payout to connected account and collect fee

We will use Stripe Connect's [destination charge](https://stripe.com/docs/connect/destination-charges) to pay the connected account and collect a fee
First, let's set the fee we want to collect on every transaction in our marketplace. We can add this to our `.env` file:

```
PLATFORM_FEE=0.05
```

The only thing left to do is to modify the creation of the payment intent in `createPaymentIntent.ts`:

```ts
const paymentIntent = await stripe.paymentIntents.create({
  amount: product.price,
  currency: 'usd',
  customer: user.stripeCustomerId,
  automatic_payment_methods: {
    enabled: true,
  },
  application_fee_amount: product.price * +process.env.PLATFORM_FEE,
  transfer_data: {
    destination: product.user.stripeAccountId,
  },
})

...
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
```

You can now purchase one of the product and look on the [connect dashboard](https://dashboard.stripe.com/test/connect/accounts/overview) to see the seller being credited

## Verify subscription validity

Before selling stuff on the platfrom we will check that the seller has a valid subscription. Ideally we would want to check the validity of the seller's subscription for every product regularly, but that's outside the scope of this tutorial.

Let's add a `isSubscriptionValid` query to `subscriptions.sdl.ts`:

```graphql
type Query {
  subscriptions: [Subscription!]! @skipAuth
  isSubscriptionValid(userId: Int!): Boolean! @skipAuth
}
```

And in `services/subscriptions.ts`:

```ts
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
```

We now want to render the `Add Product` button on `SellStuffPage` only if the subscription is valid.
We need a new Cell to tell us if the subscription is valid prior to rendering the button

```
yarn rw g cell AddProduct
```

And add the following code to `AddProductCell.tsx`:

```tsx
import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import {
  IsSubscriptionValidQuery,
  IsSubscriptionValidQueryVariables,
} from 'types/graphql'

export const QUERY = gql`
  query IsSubscriptionValidQuery($userId: Int!) {
    isSubscriptionValid(userId: $userId)
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<IsSubscriptionValidQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  isSubscriptionValid,
}: CellSuccessProps<
  IsSubscriptionValidQuery,
  IsSubscriptionValidQueryVariables
>) => {
  if (isSubscriptionValid) {
    return <Link to={routes.createProduct()}>Add Product</Link>
  } else {
    return null
  }
}
```

We can now edit `SellStuffPage.tsx`:

```tsx
import { useAuth } from '@redwoodjs/auth'
import { MetaTags } from '@redwoodjs/web'
import ProductsCell from 'src/components/ProductsCell'
import AddProductCell from 'src/components/AddProductCell'
import { stripeOnboarding } from 'src/lib/stripeOnboarding'

const SellStuffPage = () => {
  const { currentUser } = useAuth()

  const completeStripeOnboarding = () => {
    stripeOnboarding(currentUser.id)
  }
  return (
    <>
      <MetaTags title="Sell Stuff" description="Sell Stuff page" />

      {currentUser?.stripeOnboardingDone ? (
        <>
          <ProductsCell userId={currentUser.id} />
          <AddProductCell userId={currentUser.id} />
        </>
      ) : (
        <>
          <div>
            You need to complete Stripe onboarding before adding products to
            sell on the platform{' '}
            <button onClick={completeStripeOnboarding}>
              Stripe Onboarding
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default SellStuffPage
```

You can now check that the `Add Product` button is rendering for a subscribed seller.
To check with a cancelled subscription go to https://dashboard.stripe.com/test/subscriptions and cancel the subscription of your logged in seller, then refresh the sell stuff page and the `Add Product` has disappeared.

# End of part 4

In this part we dug into Stripe Connect. There is a lot more to learn, Stripe covers a lot of use cases: Multi party payments, Multiple subscriptions and subscriptions quantities, customization of onboarding with custom connected account... But we saw how to use the product for the purpose of our luxury goods marketplace. You can look up the github repository for [this part](https://github.com/generalui/redwood-stripe/tree/main/part4)

In the next [part](../part5/readme.md) we will see how we can build a quick dashboard with our sellers, the subscriptions and the products they sold and the money they made us.
