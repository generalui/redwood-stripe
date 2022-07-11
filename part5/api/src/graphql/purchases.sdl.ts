export const schema = gql`
  type Purchase {
    id: Int!
    user: User!
    userId: Int!
    product: Product!
    productId: Int!
    clientSecret: String
    status: PaymentStatus!
  }

  enum PaymentStatus {
    init
    success
    failed
  }

  type Query {
    purchases(userId: Int): [Purchase!]! @requireAuth
    purchase(id: Int!): Purchase @requireAuth
  }

  input CreatePurchaseInput {
    userId: Int!
    productId: Int!
    clientSecret: String
    status: PaymentStatus!
  }

  input UpdatePurchaseInput {
    userId: Int
    productId: Int
    clientSecret: String
    status: PaymentStatus
  }

  type Mutation {
    createPurchase(input: CreatePurchaseInput!): Purchase! @requireAuth
    updatePurchase(id: Int!, input: UpdatePurchaseInput!): Purchase!
      @requireAuth
    deletePurchase(id: Int!): Purchase! @requireAuth
  }
`
