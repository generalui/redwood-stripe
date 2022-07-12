import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const ManageSubscriptionPage = () => {
  const { currentUser, reauthenticate } = useAuth()
  const cancelSubscription = async () => {
    if (confirm('Do you really want to cancel your subscriptions?')) {
      const response = await fetch(
        `${global.RWJS_API_URL}/cancelSubscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser.id,
            subscriptionId: currentUser.subscriptionId,
          }),
        }
      )
      if (response.status === 201) {
        await reauthenticate()
        navigate(routes.home())
      }
    }
  }
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
