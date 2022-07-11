export const schema = gql`
  type Payment {
    stripeId: String!
    fromEmail: String!
    amount: Int!
    status: String!
    receiptUrl: String!
    type: String!
    connectedAccountEmail: String
    connectedAccountId: Int
  }

  type Query {
    payments(userId: Int): [Payment!]! @requireAuth
  }
`
