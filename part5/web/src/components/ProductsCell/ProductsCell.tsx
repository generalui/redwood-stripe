import type { ProductsQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useAuth } from '@redwoodjs/auth'
import { useState } from 'react'
import Checkout from '../Checkout/Checkout'

export const QUERY = gql`
  query ProductsQuery($userId: Int, $category: String) {
    products(userId: $userId, category: $category) {
      id
      name
      category
      description
      price
      imageUrl
      owned
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ products }: CellSuccessProps<ProductsQuery>) => {
  const { currentUser } = useAuth()
  const [clientSecret, setClientSecret] = useState('')
  const [purchaseId, setPurchaseId] = useState<number | undefined>()
  const buy = async (productId: number) => {
    const response = await fetch(`${global.RWJS_API_URL}/createPaymentIntent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: currentUser.id,
        productId,
      }),
    })
    const { clientSecret, purchaseId } = await response.json()
    setClientSecret(clientSecret)
    setPurchaseId(purchaseId)
  }
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>description</th>
            <th>category</th>
            <th>image</th>
            <th>price</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>
                  {item.imageUrl && (
                    <img width="100" src={item.imageUrl} alt={item.name} />
                  )}
                </td>
                <td>{item.price}</td>
                <td>
                  <button onClick={() => buy(item.id)}>Buy</button>
                </td>
                <td>{item.owned && <span>You own it</span>}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {clientSecret && (
        <Checkout clientSecret={clientSecret} purchaseId={purchaseId} />
      )}
    </>
  )
}
