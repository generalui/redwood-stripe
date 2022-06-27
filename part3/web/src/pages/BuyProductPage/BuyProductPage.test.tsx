import { render } from '@redwoodjs/testing/web'

import BuyProductPage from './BuyProductPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('BuyProductPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<BuyProductPage />)
    }).not.toThrow()
  })
})
