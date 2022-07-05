import { render } from '@redwoodjs/testing/web'

import MyPurchasesPage from './MyPurchasesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MyPurchasesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MyPurchasesPage />)
    }).not.toThrow()
  })
})
