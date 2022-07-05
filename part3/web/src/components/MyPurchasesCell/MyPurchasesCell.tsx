import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

type MyPurchase = {
  product: {
    id: number
    name: string
    category: string
    description?: string
    imageUrl?: string
    price: number
  }
}

type MyPurchases = {
  purchases: MyPurchase[]
}

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
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ purchases }: CellSuccessProps<MyPurchases>) => {
  return (
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>description</th>
          <th>category</th>
          <th>image</th>
          <th>price</th>
        </tr>
      </thead>
      <tbody>
        {purchases.map(({ product }) => {
          return (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.category}</td>
              <td>
                {product.imageUrl && (
                  <img width="100" src={product.imageUrl} alt={product.name} />
                )}
              </td>
              <td>{product.price}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
