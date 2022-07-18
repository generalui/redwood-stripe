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
  }

  type Mutation {
    createSubscription(id: String!): String! @requireAuth
  }
`
