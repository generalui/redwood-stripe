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

export const Success = ({
  products,
  userId,
}: CellSuccessProps<ProductsQuery>) => {
  const { currentUser } = useAuth()
  const [clientSecret, setClientSecret] = useState('')
  const [purchaseId, setPurchaseId] = useState<number | undefined>()
  const [productId, setProductId] = useState<number | undefined>()
  const buy = async (productId: number) => {
    setProductId(productId)
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
      <table className="border">
        <thead className="text-left">
          <tr
            className="text-slate-500 uppercase tracking-widest"
            style={{ fontSize: '11px' }}
          >
            <th className="text-center p-4">id</th>
            <th className="p-4">name</th>
            <th className="p-4">description</th>
            <th className="p-4">category</th>
            <th className="p-4">image</th>
            <th className="p-4">price</th>
            {!userId && (
              <>
                <th className="p-4"></th>
                <th className="p-4"></th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            return (
              <tr
                key={item.id}
                className={productId === item.id ? 'bg-slate-100' : ''}
              >
                <td className="p-4">{item.id}</td>
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.description}</td>
                <td className="p-4">{item.category}</td>
                <td className="p-4">
                  {item.imageUrl && (
                    <img width="100" src={item.imageUrl} alt={item.name} />
                  )}
                </td>
                <td className="p-4">
                  $
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}
                </td>
                {!userId && (
                  <>
                    <td className="p-4">
                      {productId === item.id ? (
                        'Buying...'
                      ) : (
                        <button
                          className="py-2 px-4 bg-indigo-400 rounded-md text-white font-bold"
                          onClick={() => buy(item.id)}
                        >
                          Buy
                        </button>
                      )}
                    </td>
                    <td className="p-4">
                      {item.owned && (
                        <span className="font-bold italic text-slate-400">
                          You own it
                        </span>
                      )}
                    </td>
                  </>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
      {clientSecret && (
        <Checkout
          clientSecret={clientSecret}
          purchaseId={purchaseId}
          onClose={() => {
            setClientSecret(null)
            setProductId(null)
          }}
        />
      )}
    </>
  )
}
