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
}: {
  clientSecret: string
  purchaseId: number
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
      checkForConfirmation()
    }
  }

  const checkForConfirmation = () =>
    getPurchaseStatus({ variables: { purchaseId } })

  useEffect(() => {
    if (data.purchase.status === 'success') {
      navigate(routes.home())
      return
    }
    if (data.purchase.status !== 'failed') {
      setTimeout(checkForConfirmation, 2000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button>Pay now</button>
      <div>
        {loading
          ? 'checking status'
          : error
          ? 'Oops something happened'
          : message}
      </div>
    </form>
  )
}

export default Checkout
