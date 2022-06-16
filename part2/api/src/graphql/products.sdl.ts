export const schema = gql`
  type Product {
    id: Int!
    name: String!
    description: String
    imageUrl: String
    user: User!
    userId: Int!
  }

  type Query {
    products: [Product!]! @requireAuth
    product(id: Int!): Product @requireAuth
  }

  input CreateProductInput {
    name: String!
    description: String
    imageUrl: String
    userId: Int!
  }

  input UpdateProductInput {
    name: String
    description: String
    imageUrl: String
    userId: Int
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product! @requireAuth
    updateProduct(id: Int!, input: UpdateProductInput!): Product! @requireAuth
    deleteProduct(id: Int!): Product! @requireAuth
  }
`
