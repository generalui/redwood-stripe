import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { useEffect } from 'react'
import SubscriptionsCell from 'src/components/SubscriptionsCell'

const PickSubscriptionPage = () => {
  const { isAuthenticated } = useAuth()
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(routes.login())
    }
  }, [isAuthenticated])
  return <SubscriptionsCell />
}

export default PickSubscriptionPage
