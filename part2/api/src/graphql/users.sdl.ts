export const schema = gql`
  type User {
    id: Int!
    email: String!
    hashedPassword: String!
    salt: String!
    roles: [String]!
    stripeClientSecret: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    subscriptionId: String
    subscriptionName: String
    subscriptionStatus: SubscriptionStatus
    product: [Product]!
  }

  enum SubscriptionStatus {
    init
    success
    failed
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: Int!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    hashedPassword: String!
    salt: String!
    roles: [String]!
    stripeClientSecret: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    subscriptionId: String
    subscriptionName: String
    subscriptionStatus: SubscriptionStatus
  }

  input UpdateUserInput {
    email: String
    hashedPassword: String
    salt: String
    roles: [String]!
    stripeClientSecret: String
    resetToken: String
    resetTokenExpiresAt: DateTime
    subscriptionId: String
    subscriptionName: String
    subscriptionStatus: SubscriptionStatus
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: Int!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: Int!): User! @requireAuth
  }
`
