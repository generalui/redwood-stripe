import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

const Subscribe = ({ clientSecret }: { clientSecret: string }) => {
  const { currentUser } = useAuth()
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
    if (paymentIntent.status === 'succeeded') navigate(routes.sellStuff())
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
