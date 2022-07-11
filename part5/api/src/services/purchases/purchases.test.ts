import {
  purchases,
  purchase,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from './purchases'
import type { StandardScenario } from './purchases.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('purchases', () => {
  scenario('returns all purchases', async (scenario: StandardScenario) => {
    const result = await purchases()

    expect(result.length).toEqual(Object.keys(scenario.purchase).length)
  })

  scenario('returns a single purchase', async (scenario: StandardScenario) => {
    const result = await purchase({ id: scenario.purchase.one.id })

    expect(result).toEqual(scenario.purchase.one)
  })

  scenario('creates a purchase', async (scenario: StandardScenario) => {
    const result = await createPurchase({
      input: {
        userId: scenario.purchase.two.userId,
        productId: scenario.purchase.two.productId,
        status: 'init',
      },
    })

    expect(result.userId).toEqual(scenario.purchase.two.userId)
    expect(result.productId).toEqual(scenario.purchase.two.productId)
    expect(result.status).toEqual('init')
  })

  scenario('updates a purchase', async (scenario: StandardScenario) => {
    const original = await purchase({ id: scenario.purchase.one.id })
    const result = await updatePurchase({
      id: original.id,
      input: { status: 'failed' },
    })

    expect(result.status).toEqual('failed')
  })

  scenario('deletes a purchase', async (scenario: StandardScenario) => {
    const original = await deletePurchase({ id: scenario.purchase.one.id })
    const result = await purchase({ id: original.id })

    expect(result).toEqual(null)
  })
})
