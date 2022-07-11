import { render } from '@redwoodjs/testing/web'

import Subscribe from './Subscribe'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Subscribe', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Subscribe />)
    }).not.toThrow()
  })
})
