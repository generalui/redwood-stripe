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
      <h1>Manage My Subscription</h1>
      <p>Current subscription: {currentUser?.subscriptionName}</p>
      <div>
        Options:
        <ul>
          <li>
            <button onClick={() => navigate(routes.pickSubscription())}>
              Change subscription
            </button>
          </li>
          <li>
            <button onClick={cancelSubscription}>Cancel subscription</button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default ManageSubscriptionPage
