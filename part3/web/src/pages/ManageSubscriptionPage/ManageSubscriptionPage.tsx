import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { useEffect } from 'react'

const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscriptionMutation($id: String!) {
    cancelSubscription(id: $id)
  }
`

const ManageSubscriptionPage = () => {
  const { currentUser, reauthenticate } = useAuth()
  const [cancel, { data }] = useMutation(CANCEL_SUBSCRIPTION)
  const cancelSubscription = async () => {
    if (confirm('Do you really want to cancel your subscription?')) {
      cancel({
        variables: { id: currentUser.subscriptionId },
      })
    }
  }
  useEffect(() => {
    if (data) {
      if (data.cancelSubscription) {
        reauthenticate()
        navigate(routes.home())
      } else {
        toast.error('Enable to cancel this subscription at the moment')
      }
    }
  }, [data])
  return (
    <>
      <MetaTags
        title="Manage My Subscription"
        description="Manage Subscription"
      />
      <div className="w-56 mx-auto">
        <p className="text-slate-500 text-center">
          Current subscription: {currentUser?.subscriptionName}
        </p>
        <ul>
          <li>
            <button
              onClick={() => navigate(routes.pickSubscription())}
              className="py-2 px-4 bg-indigo-400 rounded-md text-white font-bold w-56 mt-5"
            >
              Change subscription
            </button>
          </li>
          <li>
            <button
              onClick={cancelSubscription}
              className="py-2 px-4 bg-indigo-400 rounded-md text-white font-bold w-56 mt-5"
            >
              Cancel subscription
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default ManageSubscriptionPage
