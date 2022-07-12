import type { SellersQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query SellersQuery {
    sellers {
      id
      email
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ sellers }: CellSuccessProps<SellersQuery>) => (
  <ul>
    {sellers.map((item) => (
      <li key={item.id}>
        <Link
          className="text-blue-800 underline my-3"
          to={routes.sellerAdmin({ userId: `${item.id}` })}
        >
          {item.email}
        </Link>
      </li>
    ))}
  </ul>
)
