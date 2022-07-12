import { db } from 'src/lib/db'
import type {
  QueryResolvers,
  MutationResolvers,
  ProductResolvers,
} from 'types/graphql'

export const products: QueryResolvers['products'] = ({
  userId,
  category,
}: {
  userId?: number
  category?: string
}) => {
  return db.product.findMany({ where: { userId, category } })
}

export const product: QueryResolvers['product'] = ({ id }) => {
  return db.product.findUnique({
    where: { id },
  })
}

export const createProduct: MutationResolvers['createProduct'] = ({
  input,
}) => {
  const { userId, ...data } = input
  return db.product.create({
    data: { ...data, user: { connect: { id: userId } } },
  })
}

export const updateProduct: MutationResolvers['updateProduct'] = ({
  id,
  input,
}) => {
  return db.product.update({
    data: input,
    where: { id },
  })
}

export const deleteProduct: MutationResolvers['deleteProduct'] = ({ id }) => {
  return db.product.delete({
    where: { id },
  })
}

export const Product: ProductResolvers = {
  user: (_obj, { root }) =>
    db.product.findUnique({ where: { id: root.id } }).user(),
  owned: async (_obj, { root }) => {
    const count = await db.purchase.count({
      where: {
        userId: context.currentUser?.id,
        productId: root.id,
        status: 'success',
      },
    })
    return count > 0
  },
}
