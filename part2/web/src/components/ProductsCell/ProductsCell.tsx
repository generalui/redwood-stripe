import type { ProductsQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query ProductsQuery($userId: Int, $category: String) {
    products(userId: $userId, category: $category) {
      id
      name
      category
      description
      price
      imageUrl
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ products }: CellSuccessProps<ProductsQuery>) => {
  return (
    <table className="border">
      <thead className="text-left">
        <tr>
          <th className="text-center p-4">id</th>
          <th className="p-4">name</th>
          <th className="p-4">description</th>
          <th className="p-4">category</th>
          <th className="p-4">image</th>
          <th className="p-4">price</th>
        </tr>
      </thead>
      <tbody>
        {products.map((item) => {
          return (
            <tr key={item.id}>
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
                  minimumFractionDigits: 2,
                })}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
