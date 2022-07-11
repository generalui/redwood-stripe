export const schema = gql`
  scalar URL

  type Subscription {
    id: ID!
    name: String!
    description: String
    price: Int!
    currency: String!
  }

  type Query {
    subscriptions: [Subscription!]! @skipAuth
    isSubscriptionValid(userId: Int!): Boolean! @skipAuth
  }
`
