import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import {
  IsSubscriptionValidQuery,
  IsSubscriptionValidQueryVariables,
} from 'types/graphql'

export const QUERY = gql`
  query IsSubscriptionValidQuery($userId: Int!) {
    isSubscriptionValid(userId: $userId)
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<IsSubscriptionValidQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({
  isSubscriptionValid,
}: CellSuccessProps<
  IsSubscriptionValidQuery,
  IsSubscriptionValidQueryVariables
>) => {
  if (isSubscriptionValid) {
    return (
      <Link
        to={routes.createProduct()}
        className="py-2 px-4 bg-indigo-400 rounded-md text-white font-bold mt-5 inline-block"
      >
        Add Product
      </Link>
    )
  } else {
    return null
  }
}
