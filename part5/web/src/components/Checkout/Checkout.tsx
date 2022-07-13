import { useAuth } from '@redwoodjs/auth'
import { useLazyQuery } from '@apollo/client'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'
import { navigate, routes } from '@redwoodjs/router'

const PURCHASE_STATUS_QUERY = gql`
  query PurchasesStatusQuery($purchaseId: Int!) {
    purchase(id: $purchaseId) {
      status
    }
  }
`

const Checkout = ({
  clientSecret,
  purchaseId,
  onClose,
}: {
  clientSecret: string
  purchaseId: number
  onClose: () => void
}) => {
  const { currentUser } = useAuth()
  const [message, setMessage] = useState('')
  const stripe = useStripe()
  const elements = useElements()
  const [getPurchaseStatus, { loading, error, data }] = useLazyQuery(
    PURCHASE_STATUS_QUERY
  )

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
      checkForConfirmation()
    }
  }

  const checkForConfirmation = () => {
    getPurchaseStatus({ variables: { purchaseId } })
  }

  useEffect(() => {
    if (purchaseId) {
      if (data?.purchase.status === 'success') {
        navigate(routes.myPurchases())
        return
      }
      if (data?.purchase.status !== 'failed') {
        setTimeout(checkForConfirmation, 2000)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div className="fixed left-1/2 top-20 -ml-48 p-5 w-96 shadow-lg rounded-md bg-slate-200 text-slate-500">
      <div className="font-bold text-sm uppercase tracking-wide mb-4 pb-2 text-center border-b border-slate-300">
        Checkout
      </div>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <div className="text-slate-400 my-2 italic">
          {loading
            ? 'checking status'
            : error
            ? 'Oops something happened'
            : message}
        </div>
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
            Pay now
          </button>
        </div>
      </form>
    </div>
  )
}

export default Checkout
