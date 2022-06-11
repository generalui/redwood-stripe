import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'

const Subscribe = ({ clientSecret }: { clientSecret: string }) => {
  const { currentUser, reauthenticate } = useAuth()
  const [paymentDone, setPaymentDone] = useState(false)
  const [message, setMessage] = useState('')
  const stripe = useStripe()
  const elements = useElements()
  useEffect(() => {
    console.log('--->', paymentDone, JSON.stringify(currentUser))
    if (!paymentDone) return
    if (currentUser.subscriptionStatus === 'success') {
      navigate(routes.home())
    } else {
      setTimeout(() => reauthenticate(), 1000)
    }
  }, [currentUser, reauthenticate, paymentDone])

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
      setMessage('waiting for confirmation...')
      setPaymentDone(true)
      reauthenticate()
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
