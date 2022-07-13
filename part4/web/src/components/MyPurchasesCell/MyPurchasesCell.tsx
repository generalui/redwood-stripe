import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { PurchasessQuery } from 'types/graphql'

export const QUERY = gql`
  query PurchasessQuery($userId: Int) {
    purchases(userId: $userId) {
      product {
        id
        name
        description
        imageUrl
        category
        price
      }
      status
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ purchases }: CellSuccessProps<PurchasessQuery>) => {
  return (
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
        </tr>
      </thead>
      <tbody>
        {purchases
          .filter((purchase) => purchase.status === 'success')
          .map(({ product }, index) => {
            return (
              <tr key={index}>
                <td className="p-4">{product.id}</td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.description}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">
                  {product.imageUrl && (
                    <img
                      width="100"
                      src={product.imageUrl}
                      alt={product.name}
                    />
                  )}
                </td>
                <td className="p-4">
                  $
                  {product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}
                </td>
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}
