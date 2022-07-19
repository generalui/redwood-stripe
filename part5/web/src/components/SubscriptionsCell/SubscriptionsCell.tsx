import type { Subscription } from 'types/graphql'
import { CellSuccessProps, CellFailureProps, useMutation } from '@redwoodjs/web'
import { useAuth } from '@redwoodjs/auth'
import { useEffect, useState } from 'react'
import Subscribe from '../Subscribe/Subscribe'
import { toast } from '@redwoodjs/web/toast'

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

const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscriptionMutation($id: String!) {
    createSubscription(id: $id)
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
  const [create, { data }] = useMutation(CREATE_SUBSCRIPTION)
  useEffect(() => {
    if (data) {
      if (data.createSubscription) {
        reauthenticate()
        setClientSecret(data.createSubscription)
      } else {
        toast.error('Could not create subscription')
      }
    }
  }, [data])
  const isCurrentSubscription = (subscriptionName: string) =>
    currentUser?.subscriptionName === subscriptionName &&
    currentUser?.subscriptionStatus === 'success'
  return (
    <div className="w-80 mx-auto">
      <p className="text-slate-500 text-center">Pick a subscription</p>
      <ul>
        {subscriptions.map((item) => {
          return (
            <li key={item.id}>
              <button
                onClick={() =>
                  create({
                    variables: { id: item.id },
                  })
                }
                disabled={isCurrentSubscription(item.name)}
                className={`py-2 px-4 ${
                  isCurrentSubscription(item.name)
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
      {clientSecret && (
        <Subscribe
          clientSecret={clientSecret}
          onClose={() => setClientSecret(null)}
        />
      )}
    </div>
  )
}
