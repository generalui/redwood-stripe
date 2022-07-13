import type { ListPaymentsQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query ListPaymentsQuery($userId: Int) {
    payments(userId: $userId) {
      stripeId
      fromEmail
      amount
      status
      receiptUrl
      type
      connectedAccountEmail
      connectedAccountId
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ payments }: CellSuccessProps<ListPaymentsQuery>) => {
  return (
    <>
      <table className="border">
        <thead className="text-left">
          <tr
            className="text-slate-500 uppercase tracking-widest"
            style={{ fontSize: '11px' }}
          >
            <th className="text-center p-4">id</th>
            <th className="p-4">type</th>
            <th className="p-4">email</th>
            <th className="p-4">amount</th>
            <th className="p-4">status</th>
            <th className="p-4">receipt</th>
            <th className="p-4">recipient</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((item) => {
            return (
              <tr key={item.stripeId}>
                <td className="p-4">{item.stripeId}</td>
                <td className="p-4">{item.type}</td>
                <td className="p-4">{item.fromEmail}</td>
                <td className="p-4">
                  $
                  {(item.amount / 100).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}
                </td>
                <td className="p-4">{item.status}</td>
                <td className="p-4">
                  <a
                    href={item.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-800 underline"
                  >
                    open
                  </a>
                </td>
                <td className="p-4">
                  {!!item.connectedAccountEmail && (
                    <Link
                      className="text-blue-800 underline"
                      to={routes.sellerAdmin({
                        userId: `${item.connectedAccountId}`,
                      })}
                    >
                      {item.connectedAccountEmail}
                    </Link>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
