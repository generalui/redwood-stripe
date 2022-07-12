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
    const response = await fetch(`${global.RWJS_API_URL}/createSubscription`, {
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
    <div className="w-80 mx-auto">
      <p className="text-slate-500 text-center">Pick a subscription</p>
      <ul>
        {subscriptions.map((item) => {
          return (
            <li key={item.id}>
              <button
                onClick={() => createSubscription(item)}
                disabled={currentUser?.subscriptionName === item.name}
                className={`py-2 px-4 ${
                  currentUser?.subscriptionName === item.name
                    ? 'bg-slate-200'
                    : 'bg-indigo-400'
                } rounded-md text-white font-bold w-80 mt-8`}
              >
                {item.name} - {item.description} - <b>${item.price / 100}/mo</b>
              </button>
            </li>
          )
        })}
      </ul>
      {clientSecret && <Subscribe clientSecret={clientSecret} />}
    </div>
  )
}
