import type { ListPaymentsQuery } from 'types/graphql'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

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
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>type</th>
            <th>email</th>
            <th>amount</th>
            <th>status</th>
            <th>receipt</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((item) => {
            return (
              <tr key={item.stripeId}>
                <td>{item.stripeId}</td>
                <td>{item.type}</td>
                <td>{item.fromEmail}</td>
                <td>{item.amount}</td>
                <td>{item.status}</td>
                <td>
                  <a href={item.receiptUrl} target="_blank" rel="noreferrer">
                    open
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
