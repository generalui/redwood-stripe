import type { Subscription } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useAuth } from '@redwoodjs/auth'
import { useState } from 'react'
import Subscribe from '../Subscribe/Subscribe'

export const QUERY = gql`
  query SubscriptionsQuery {
    subscriptions {
      id
      name
      price
      currency
      description
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  subscriptions,
}: CellSuccessProps<{ subscriptions: Subscription[] }>) => {
  const { currentUser, reauthenticate } = useAuth()
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
    await reauthenticate()
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
