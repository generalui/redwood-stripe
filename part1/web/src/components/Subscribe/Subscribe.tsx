import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'

const Subscribe = ({
  clientSecret,
  onClose,
}: {
  clientSecret: string
  onClose: () => void
}) => {
  const { currentUser, reauthenticate } = useAuth()
  const [paymentDone, setPaymentDone] = useState(false)
  const [message, setMessage] = useState('')
  const stripe = useStripe()
  const elements = useElements()
  useEffect(() => {
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
    setMessage('Submitting payment...')
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
      setMessage('Waiting for confirmation...')
      setPaymentDone(true)
      reauthenticate()
    }
  }

  return (
    <div className="fixed left-1/2 top-20 -ml-48 p-5 w-96 shadow-lg rounded-md bg-slate-200 text-slate-500">
      <div className="font-bold text-sm uppercase tracking-wide mb-4 pb-2 text-center border-b border-slate-300">
        Subscribe
      </div>
      <form onSubmit={handleSubmit}>
        <CardElement />
        {message && <div className="text-slate-400 my-2 italic">{message}</div>}
        <div className="overflow-hidden">
          <button
            className="mt-4 float-left py-2 px-4 text-indigo-400 rounded-md font-bold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="mt-4 float-right py-2 px-4 bg-indigo-400 rounded-md text-white font-bold"
          >
            Subscribe now
          </button>
        </div>
      </form>
    </div>
  )
}

export default Subscribe
