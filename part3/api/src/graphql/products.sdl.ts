export const schema = gql`
  type Product {
    id: Int!
    price: Float!
    name: String!
    category: String!
    description: String
    imageUrl: String
    user: User!
    userId: Int!
    owned: Boolean
  }

  type Query {
    products(userId: Int, category: String): [Product!]! @requireAuth
    product(id: Int!): Product @requireAuth
  }

  input CreateProductInput {
    name: String!
    category: String!
    description: String
    imageUrl: String
    price: Float!
    userId: Int!
  }

  input UpdateProductInput {
    name: String
    category: String
    description: String
    imageUrl: String
    price: Float
    userId: Int
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product! @requireAuth
    updateProduct(id: Int!, input: UpdateProductInput!): Product! @requireAuth
    deleteProduct(id: Int!): Product! @requireAuth
  }
`
