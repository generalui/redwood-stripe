import type { FindProductQuery, FindProductQueryVariables } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query FindProductQuery($id: Int!) {
    product: product(id: $id) {
      id
      price
      name
      description
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindProductQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ product }: CellSuccessProps<FindProductQuery>) => {
  return (
    <>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <b>{product.price}</b>
    </>
  )
}
