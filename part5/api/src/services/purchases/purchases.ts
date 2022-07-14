import { db } from 'src/lib/db'
import type {
  QueryResolvers,
  MutationResolvers,
  PurchaseResolvers,
} from 'types/graphql'

export const purchases: QueryResolvers['purchases'] = ({
  userId,
}: {
  userId?: number
}) => {
  if (userId) {
    return db.purchase.findMany({ where: { userId } })
  }
  return db.purchase.findMany()
}

export const purchase: QueryResolvers['purchase'] = ({ id }) => {
  return db.purchase.findUnique({
    where: { id },
  })
}

export const createPurchase: MutationResolvers['createPurchase'] = ({
  input,
}) => {
  return db.purchase.create({
    data: input,
  })
}

export const updatePurchase: MutationResolvers['updatePurchase'] = ({
  id,
  input,
}) => {
  return db.purchase.update({
    data: input,
    where: { id },
  })
}

export const deletePurchase: MutationResolvers['deletePurchase'] = ({ id }) => {
  return db.purchase.delete({
    where: { id },
  })
}

export const Purchase: PurchaseResolvers = {
  user: (_obj, { root }) =>
    db.purchase.findUnique({ where: { id: root.id } }).user(),
  product: (_obj, { root }) =>
    db.purchase.findUnique({ where: { id: root.id } }).product(),
}
