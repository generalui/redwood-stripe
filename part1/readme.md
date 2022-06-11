# Prerequistes

## nvm and node

At the time of writting, redwood requires node version < 17. So if you don't have it already, install the latest node v16 version on your machine (I recommend using [nvm](https://github.com/nvm-sh/nvm) to manage your node versions)

```bash
nvm install v16.15.1
nvm alias default v16.15.1
nvm use v16.15.1
```

## yarn

`npm install -g yarn`

## postgres

`brew install postgres` on mac os, otherwise you can look up (postgres download page)[https://www.postgresql.org/download/]
Another option is to use (docker)[https://docs.docker.com/get-started/] (that's what I am using), here is the docker compose file you can use:

```yml
version: '3.1'

services:
  db:
    image: postgres:12
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=example
      - POSTGRES_DB=redwoodstripe
    ports:
      - 5432:5432
    volumes:
      - ./db-data/redwoodstripe:/var/lib/postgresql/data
```

And then `docker-compose up -d`

# Setup & Authentication

## Setup

Create the app
`yarn create redwood-app --ts ./redwood-stripe`

That's it...

## Authentication

Create backend authentication
`yarn rw setup auth dbAuth`

Create front-end authentication
`yarn rw generate dbAuth`

Update you prisma schema to include a user model that support the authentication we just installed. Remove the `UserExample` model from `prisma.schema` and add:

```prisma
enum SubscriptionStatus {
  init
  success
  failed
}

model User {
  id                  Int                 @id @default(autoincrement())
  email               String              @unique
  hashedPassword      String
  salt                String
  roles               String[]
  stripeClientSecret  String?
  resetToken          String?
  resetTokenExpiresAt DateTime?
  subscriptionName    String?
  subscriptionStatus  SubscriptionStatus?
}
```

A few fields we're adding here:

- **stripeClientSecret**: When we will initiate a payment intent this value is going to be needed in the front end to authenticate the transaction. But we also save it in the backend until stripe calls the stripe webhook endpoint with a `payment_intent.succeeded` event (or a `payment_intent.payment_failed`) in which case we can update the `subscriptionStatus` accordingly and delete the `stripeClientSecret` because it should not be reused
- **subscriptionName**: Keeps track of which kind of subscription the user has
- **roles**: We're not adding this one, but we're using it. It will contain the value `seller` to mark users that have a subscription and can sell stuff on our platform
- **subscriptionStatus**: Keeps track of whether the user paid his subscription or not

Generate a session secret
`yarn rw generate secret`

Setup db connection in .env:

```
DATABASE_URL=postgresql://postgres:example@localhost/redwoodstripe
SESSION_SECRET=<ouput from yarn rw generate secret>
NODE_ENV=development
```

Creare migration and user db table and call it whatever you want but `initial migration` makes up for a good name for this ... initial migration
`yarn rw prisma migrate dev`

Fire up the dev server
`yarn rw dev`

You should be able to signup on the /signup page
Or almost... You will get a `routes.home is not a function` error page.
Well, let's create a homepage first
`yarn rw generate page home`
In `Routes.tsx` a line was added:
`<Route path="/home" page={HomePage} name="home" />`
Let's make it the home page by updating the path
`<Route path="/" page={HomePage} name="home" />`

## Seller signup

Typically a market place has 2 different kind of users. Reguular users (buyers / customers) and sellers. We could also have admins, but that's outside the scope of this tutorial. We will use the roles attribute on the user model to store this information.

Update `SignupPage.tsx` with the following, right after `<FieldError name="password" className="rw-field-error" />`:

```html
<label name="seller" className="rw-label"> Seller </label>
<CheckboxField name="seller" className="rw-input" />
```

And while we're in this file, let's make another update because we want to signup with emails, not username, so modify the username input to be:

```tsx
<Label
  name="username"
  className="rw-label"
  errorClassName="rw-label rw-label-error"
>
  Email
</Label>
<TextField
  name="username"
  className="rw-input"
  errorClassName="rw-input rw-input-error"
  ref={usernameRef}
  validation={{
    pattern: {
      value: /(.+)@(.+){2,}\.(.+){2,}/,
      message: 'Incorrect email format',
    },
  }}
/>
```

Finally in `api/src/functions/auth.ts`, look for signupOptions' handler and add userAttributes to capture the seller boolean from the form's checkbox that we just added:

```ts
handler: ({ username, hashedPassword, salt, userAttributes }) => {
  return db.user.create({
    data: {
      email: username,
      hashedPassword: hashedPassword,
      salt: salt,
      roles: userAttributes.seller ? ['seller'] : [],
    },
  })
},
```

# List Subscriptions

We're now starting our first real task, so first step back and look up the internet if someone, maybe, has already done that and has a neat github repo to copy paste. The internet is a magical place and such repo indeed exists, and David Price himself contributed to it. I invite you to try to this redwood/stripe example [here](https://github.com/redwoodjs/example-store-stripe) and there is even a live demo [here](https://superstore-redwood-stripe.netlify.app/)

## Open a Stripe account

Signup for a new Stripe account [here](https://dashboard.stripe.com/register). Note that you need to verify your email, but you don't need to complete the account activation to play with sandbox environment (called `test mode` and is the default when you create an account)

## Install Stripe npm package

`yarn workspace api add stripe`
The documentation for this API package can be found [here](https://stripe.com/docs/api?lang=node)
According to this documentation, we will now need to create an instance of the API. Where can we add that? Well, prisma is already doing the same thing and is creating this singleton inside `lib/db.ts`, so I think `lib/stripe.ts` is a decent idea. There you can add this code:

```ts
import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SK, {
  apiVersion: '2020-08-27',
})
```

You now need to add a few variables to your .env file:

```
STRIPE_PK=pk_test_...
STRIPE_SK=sk_test_...
STRIPE_WEBHOOK_SK=whsec_...
```

The first 2 are coming directly from your [stripe dashboard](https://dashboard.stripe.com/test/dashboard)
The last one requires you to install the stripe deamon on your machine, you can find it [here](https://stripe.com/docs/stripe-cli)
Once installed, run the command

```bash
stripe listen --api-key=sk_test_... --print-secret
```

## Add some subscription products

We now want our marketplace to have the choice between 2 subscriptions:

- The Basic subscription. It won't cost much every month but then we'll take so much commission off the sales that this will probably not be sustainable so your sellers will want to upgrade to..
- The Pro subscription. A tad more pricey but then we just take 3% commission on each sale! A steal

As we've already seen, Redwood has a great [CLI tool](https://redwoodjs.com/docs/cli-commands). Among the available command is `exec` that allows you to run a script that you put inside the `scripts` folder. So, although we could go on the Stripe UI and create products manually, what's the fun of that? So let's go ahead and add a `seed-stripe-subscriptions.ts` inside the scripts folder and make it return a default async function:

```ts
export default async () => {}
```

We'll start using the stripe API. We'll use the 2 following commands:

- [list](https://stripe.com/docs/api/products/list?lang=node) To check that we did not already create the subscriptions
- [create](https://stripe.com/docs/api/products/create?lang=node) To create each subscription

We first define our subscriptions as a list of Stripe.ProductCreateParams

```ts
const subscriptions: Stripe.ProductCreateParams[] = [
  {
    name: 'Basic',
    description: "We'll take a 40% commission on everything you sell, hahaha",
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
    description:
      "We'll take a modest 3% commission on everything you sell, your success is our success",
    default_price_data: {
      currency: 'usd',
      unit_amount: 155000,
      recurring: {
        interval: 'month',
      },
    },
  },
]
```

We can then retrieve the products and check that they don't already exist on your Stripe account inside the function we just created:

```ts
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
```

And finally create the subcriptions

```ts
console.log('Seeding subscriptions')

for (const subscription of subscriptions) {
  console.log(`Creating ${subscription.name}`)
  await stripe.products.create(subscription)
}
```

And let the magic happen 🪄 `yarn rw exec seed-stripe-subscriptions --no-prisma`
You should get:

```
[XX:XX:XX] Running script [started]
Getting products
Seeding subscriptions
Creating Basic
Creating Pro
Done
[XX:XX:XX] Running script [completed]
```

## List subscriptions query

We need a new graphQL query to retrieve all available subscriptions from our Stripe account
To do this create `api/src/graphql/subscriptions.sdl.ts` and define your query like this:

```ts
export const schema = gql`
  scalar URL

  type Subscription {
    id: ID!
    name: String!
    description: String
    price: Int!
    currency: String!
  }

  type Query {
    subscriptions: [Subscription!]! @skipAuth
  }
`
```

Your IDE should see that the subscription query implementation is missing (at least VS Code does for me...), you can let your IDE create the skelton implementation for this query for you, or create a file `api/src/services/subscriptions/subscriptions.ts` and add the content that retrieve the list of subscription, this is very similar to our seeder earlier

```ts
import Stripe from 'stripe'
import { stripe } from 'src/lib/stripe'

export const subscriptions = async () => {
  // Get a list of active products
  const { data: products } = await stripe.products.list({
    active: true,
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
```

Let's now try our new graphql endpoint!
I usually use Postman to do that, but it's easier to print cURL commands, so here is our new graphql query:

```bash
curl --location --request POST 'http://localhost:8910/.redwood/functions/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"query { subscriptions {id name price currency}}","variables":{}}'
```

And... it fails!

When we look at the server output we see `Cannot return null for non-nullable field Subscription.price.`
Hmm, seems like that `default_price` is not what it supposed to be. And indeed, if we add a `console.log(products)` statement before our `return` statement and run that cURL command again, the server output is going to give a bit more insights into what's going on:

```
api | [
api |   {
api |     id: 'prod_LprBCp8SgI4rtX',
api |     object: 'product',
api |     active: true,
api |     attributes: [],
api |     created: 1654643163,
api |     default_price: 'price_1L8BTLCoThLt2WWY4gs2sBdk',
api |     description: "We'll take a 3% commission on everything you sell",
api |     images: [],
api |     livemode: false,
api |     metadata: {},
api |     name: 'Pro',
api |     package_dimensions: null,
api |     shippable: null,
api |     statement_descriptor: null,
api |     tax_code: null,
api |     type: 'service',
api |     unit_label: null,
api |     updated: 1654643164,
api |     url: null
api |   },
api |   {
api |     id: 'prod_LprBPR78YnJ34t',
api |     object: 'product',
api |     active: true,
api |     attributes: [],
api |     created: 1654643163,
api |     default_price: 'price_1L8BTLCoThLt2WWYTQOSOZJ0',
api |     description: "We'll take a 10% commission on everything you sell",
api |     images: [],
api |     livemode: false,
api |     metadata: {},
api |     name: 'Basic',
api |     package_dimensions: null,
api |     shippable: null,
api |     statement_descriptor: null,
api |     tax_code: null,
api |     type: 'service',
api |     unit_label: null,
api |     updated: 1654643163,
api |     url: null
api |   }
api | ]
```

The default_price returns a price id. Not super useful. But the stripe API sort of work like graphql and all you need to do is to add an `expand` param to the API call and it can populate that default_price for you
So let's change the list API call to

```ts
const { data: products } = await stripe.products.list({
  active: true,
  expand: ['data.default_price'],
})
```

It seems odd to me to have to put `data.` but if you don't put it, it gives you a nice error message that tells you to put it.

We finally get the result that we want:

```json
{
  "data": {
    "subscriptions": [
      {
        "id": "prod_LprBCp8SgI4rtX",
        "name": "Pro",
        "price": 15500,
        "currency": "usd",
        "priceId": "price_1L8BTLCoThLt2WWY4gs2sBdk"
      },
      {
        "id": "prod_LprBPR78YnJ34t",
        "name": "Basic",
        "price": 3500,
        "currency": "usd",
        "priceId": "price_1L8BTLCoThLt2WWYTQOSOZJ0"
      }
    ]
  }
}
```

# Subscribe

## Create a page to choose a subscription

Let's start by creating the page. But this page will first need to load the subscriptions to let the user choose among them. Redwood has a special type of component for that called a [Cell](https://redwoodjs.com/docs/cells#generating-a-cell). A cell is a special module with a defined set of exported variables and function that get pass to Redwood's internal `createCell` function that spits out an actual React component.
`yarn rw generate cell Subscriptions`

We'll also need a page to host this cell
`yarn rw generate page PickSubscription`
And in `PickSubscription.ts` call the cell

```ts
import SubscriptionsCell from 'src/components/SubscriptionsCell'

const PickSubscriptionPage = () => {
  return <SubscriptionsCell />
}

export default PickSubscriptionPage
```

Note the magic, we call `src/components/SubscriptionsCell` instead of `src/components/SubscriptionsCell/SubscriptionsCell` as we do for regular components

We need to update the Cell in order to get what we want and initiate the checkout process

1- The query does not return enough information, we also need name, price, currency, description

```ts
export const QUERY = gql`
  query SubscriptionsQuery {
    subscriptions {
      id
      name
      price
      priceId
      currency
      description
    }
  }
`
```

2- Although we don't want to do any styling, displaying object with JSON.stringify is still a little below us. So let's format the subscriptions in the success handler

```tsx
export const Success = ({
  subscriptions,
}: CellSuccessProps<{ subscriptions: Subscription[] }>) => {
  const { currentUser } = useAuth()
  const createSubscription = async (subscription: Subscription) => {
    // Get client secret from stripe...
  }
  return (
    <>
      <h1>Pick a subscription</h1>
      <p>Logged in as {currentUser.email}</p>
      <ul>
        {subscriptions.map((item) => {
          return (
            <li key={item.id}>
              {item.name} - {item.description} - <b>${item.price / 100}/mo</b>
              <button onClick={() => createSubscription(item)}>Pick</button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
```

## Redirect sellers without subscription to the pick subscription page

We want to compel sellers to pay for a subscription. For this we will add a layout where we will put a menu with a special option for seller, login/signup buttons for signed out user and a redirection to the pick subscription page for seller that have not paid for a subscription yet.

```
yarn rw generate layout MainLayout
```

And add this code in the body of the `MainLayout` component:

```tsx
const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation()
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const isAuthorizedSeller =
    currentUser?.subscriptionStatus === 'success' &&
    currentUser?.roles.includes('seller')

  useEffect(() => {
    if (
      location.pathname !== routes.pickSubscription() &&
      currentUser?.subscriptionStatus !== 'success' &&
      currentUser?.roles.includes('seller')
    ) {
      navigate(routes.pickSubscription())
    }
  }, [currentUser, location])
  return (
    <>
      <nav>
        <h3>Menu</h3>
        <ul>
          <li>
            <Link to={routes.home()}>Home</Link>
          </li>
          {isAuthenticated ? (
            <li>
              <button onClick={logOut}>Logout</button>
            </li>
          ) : (
            <>
              <li>
                <Link to={routes.login()}>Login</Link>
              </li>
              <li>
                <Link to={routes.signup()}>Signup</Link>
              </li>
            </>
          )}
          {isAuthorizedSeller && (
            <li>
              <Link to={routes.sellStuff()}>Sell stuff</Link>
            </li>
          )}
        </ul>
      </nav>
      {children}
    </>
  )
}
```

Redwood's `useAuth` hook really comes in handy here and gives us everything we need to display information based on the `currentUser` and even gives us a simple function to call to log the user out.

We also want to create a new page where the seller will be able to manage his products

```
yarn rw generate page SellStuff
```

Finally let's reorganize a bit our `Routes.tsx` to protect some routes and include our new layout:

```tsx
import { Router, Route, Set, Private } from '@redwoodjs/router'
import MainLayout from './layouts/MainLayout/MainLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Private unauthenticated="home">
          <Route
            path="/pick-subscription"
            page={PickSubscriptionPage}
            name="pickSubscription"
          />
          <Route path="/sell-stuff" page={SellStuffPage} name="sellStuff" />
        </Private>
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route
        path="/forgot-password"
        page={ForgotPasswordPage}
        name="forgotPassword"
      />
      <Route
        path="/reset-password"
        page={ResetPasswordPage}
        name="resetPassword"
      />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
```

## Introducting: Stripe Elements

We intentionally left the `createSubscription` method empty, because that's where we'll want to initiate a recurring payment. Stripe is providing a [great repository](https://github.com/stripe-samples/subscription-use-cases) full examples of different subscription models.

The Node implementation of these examples all use Express. With Redwood we'll use serverless functions instead. Let's start by creating the first function
`yarn rw g function createSubscription`

And copy this code inside

```ts
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
```

Let's unpack this a little bit:

- The handler retrieves in the body to the request a `userId` and `subscriptionId` so that's what our frontend will need to send
- Based on those we retrieve a user and a subscription (set `getUser` and `getSusbcription`)
- One subtlety about `getSubscription` is that it needs to return the `client_secret`, available in the deeply nested object `latest_invoice.payment_intent`. Fortunately Stripe API allows you to retrieve deeply nested objects with the `expand` keyword, all we have to do is

```ts
expand: ['latest_invoice.payment_intent'],
```

- We can now update the user model with the `subscriptionStatus`, `subscriptionName` and `clientSecret`. We need the client secret because when Stripe will confirm the trasaction, it will send this clientSecret and we can connect it to the user this way.

At this point it would be nice to test if this function is doing what it supposed to and we get redirected. Get a `userId` from your db (if there isn't any, go to http://localhost:8910/signup, create a user and look up his id), get a priceId (see the list subscriptions section) and try

```bash
curl --location --request GET 'http://localhost:8910/.redwood/functions/createSubscription?priceId=price_1L8BTLCoThLt2WWY4gs2sBdk&subscriptionName=Basic&userId=1' --header 'Content-Type: application/json'

```

You should get an html file in return and your payment activity table should have a new row

## Tying it all together

We're almost ready to try our subscription registration. We need 3 last things...

1. Call our new serverless function

First things first, let's update our `createSubscription` function in our `SubscriptionCell.tsx`:

```tsx
export const Success = ({
  subscriptions,
}: CellSuccessProps<{ subscriptions: Subscription[] }>) => {
  const { currentUser } = useAuth()
  const [clientSecret, setClientSecret] = useState('')
  const createSubscription = async (subscription: Subscription) => {
    const response = await fetch('/.redwood/functions/createSubscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUser.id,
        subscriptionId: subscription.id,
      }),
    })
    const { clientSecret } = await response.json()
    setClientSecret(clientSecret)
  }
  return (
    <>
      <h1>Pick a subscription</h1>
      <p>Logged in as {currentUser.email}</p>
      <ul>
        {subscriptions.map((item) => {
          return (
            <li key={item.id}>
              {item.name} - {item.description} - <b>${item.price / 100}/mo</b>
              <button onClick={() => createSubscription(item)}>Pick</button>
            </li>
          )
        })}
      </ul>
      {clientSecret && <Subscribe clientSecret={clientSecret} />}
    </>
  )
}
```

2. Display a form to enter payment information

Note that we call a `Subscribe` component but we haven't created it yet. So let's add it

```
yarn rw generate component Subscribe
```

That `Subscribe` component is a simple form whose content will be that CC fields handled directly by Stripe's `CardElement` component, all we have to do is to handle the submit event and send the form back to Stripe:

```tsx
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

const Subscribe = ({ clientSecret }: { clientSecret: string }) => {
  const { currentUser, reauthenticate } = useAuth()
  const [message, setMessage] = useState('')
  const stripe = useStripe()
  const elements = useElements()

  if (!stripe || !elements || !currentUser) {
    return null
  }

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const cardElement = elements.getElement(CardElement)
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: currentUser.email,
          },
        },
      }
    )
    if (error) {
      setMessage(error.message)
      return
    }
    if (paymentIntent.status === 'succeeded') {
      await reauthenticate()
      navigate(routes.sellStuff())
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button>Subscribe</button>
      <div>{message}</div>
    </form>
  )
}

export default Subscribe
```

This also redirects the user our `sellStuff` if payment is successful

3. Handle subscription status change in the backend

And try!
Go to http://localhost:8910/pick-subscription and pick a subscription, fill out the stripe checkout form (use 4242 4242 4242 4242 as CC number, rest doesn't matter as long as it is valid) and you should get redirected to your ngrok success url. But it fails... With something like 'Invalid Host Header".... Bummer. Interneting, interneting. It turns out that our dev server doesn't accept random host. The good news is [here](https://deploy-preview-605--redwoodjs.netlify.app/docs/webpack-configuration#webpack-dev-server) you can start your dev server with any webpack option and as it turns out, there is an [option](https://webpack.js.org/configuration/dev-server/#devserverallowedhosts) to allow any host. So, you can stop your dev server and restart it with this modified command: `yarn rw dev --forward="--allowed-hosts=all"` make that test again and you should get to the page with the path `/subscription-callback?success=true` as you defined it earlier in the serverless function.

## Let the server know about the new subscription: Stripe Webhooks

Let's create a serverless function that will handle events coming from stripe directly

```

yarn rw generate function stripeWebhook

```

For the moment let's just log the event, so replace the content of api/src/functions/stripeWebhook/stripeWebhook.ts with:

```ts
import type { APIGatewayEvent } from 'aws-lambda'
import { logger } from 'src/lib/logger'
import { SubscriptionStatus } from '@prisma/client'
import { db } from 'src/lib/db'

export const handler = async (event: APIGatewayEvent) => {
  logger.info('Invoked stripeWebhook function')
  console.log(event.body)
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
```

According to the Stripe docs, you need to install Stripe cli in order to capture webhook on your local machine. On a Mac you can do `brew install stripe/stripe-cli/stripe`, for other platforms, [Stripe got your back](https://stripe.com/docs/payments/handling-payment-events)

then `stripe login` in your terminal
then `stripe listen --forward-to http://localhost:8910/.redwood/functions/stripeWebhook`

We can now test the event
`stripe trigger payment_intent.succeeded`
This should output an event object in JSON format on your terminal window where you started Redwood

I was curious to see all the webhook that are triggered during the checkout process, but since those events are pretty verbose, I output just the type

```ts
console.log(JSON.parse(event.body).type)
```

And then go back to http://localhost:8910/pick-subscription and go through the process again, here is the list of event that stripe is sending to my webhook

```

charge.succeeded
checkout.session.completed
payment_method.attached
customer.created
customer.updated
invoice.created
invoice.finalized
customer.subscription.created
invoice.updated
customer.subscription.updated
invoice.paid
invoice.payment_succeeded
payment_intent.succeeded
payment_intent.created

```

According to the docs, it seems that `payment_intent.succeeded` is the event that signals successful payment

I then tried tried with one of the test CC with unsufficient funds `4000000000009995`, stripe has a [list of them](https://stripe.com/docs/testing)
And the list of events becomes

```

customer.created
charge.failed
customer.updated
invoice.created
invoice.finalized
customer.subscription.created
customer.updated
invoice.payment_failed
invoice.updated
payment_intent.created
payment_intent.payment_failed

```

We will take `payment_intent.payment_failed` as an indicator of failed payment

We can now update our stripeWebhook function accordingly

```ts
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
```

## One last problem

There is actually a problem with our subscribe component, when we do that:

```ts
if (paymentIntent.status === 'succeeded') {
  await reauthenticate()
  navigate(routes.sellStuff())
}
```

We reauthenticate and expect the User in the database to have the right `subscriptionStatus`.
But we don't know when stripe is calling our webhook to update the `subscriptionStatus` in our database. In this case we could use Apollo subscriptions, but for the sake of simplicity, we well just poll our backend and check if our user has been updated. Stripe won't send the notification to our webhook long after the payment has been confirmed. What we need is to just say that our payment is done, and then reauthenticate every second until the `currentUser.subscriptionStatus` is updated.

```tsx
const [paymentDone, setPaymentDone] = useState(false)
useEffect(() => {
  if (!paymentDone) return
  if (currentUser.subscriptionStatus === 'success') {
    navigate(routes.home())
  } else {
    setTimeout(() => reauthenticate(), 1000)
  }
}, [currentUser, reauthenticate, paymentDone])
```

and at the end of the `handleSubmit` method:

```ts
if (paymentIntent.status === 'succeeded') {
  setMessage('waiting for confirmation...')
  setPaymentDone(true)
  reauthenticate()
}
```

# End of part 1

Well done you made it through part 1!
It only gets easier from here (well I don't know I have not written part 2 yet, but I hope)
A few things you can do now:

- Jump to [part 2](../part2/)
- Look up the github repository for [part 1](https://github.com/generalui/redwood-stripe/tree/main/part1)
- Go on with your day, and get back to it once you cooled off a bit
