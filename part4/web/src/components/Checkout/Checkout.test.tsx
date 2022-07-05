import { render } from '@redwoodjs/testing/web'

import Checkout from './Checkout'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Checkout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Checkout />)
    }).not.toThrow()
  })
})
