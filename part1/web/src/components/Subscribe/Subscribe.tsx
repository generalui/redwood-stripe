import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

const Subscribe = ({ clientSecret }: { clientSecret: string }) => {
  const { currentUser } = useAuth()
  const [message, setMessage] = useState('')
  // Initialize an instance of stripe.
  const stripe = useStripe()
  const elements = useElements()

  if (!stripe || !elements || !currentUser) {
    // Stripe.js has not loaded yet. Make sure to disable
    // form submission until Stripe.js has loaded.
    return null
  }

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement)

    // Use card Element to tokenize payment details
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
      // show error and collect new card details.
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
