import { render } from '@redwoodjs/testing/web'

import SellStuffPage from './SellStuffPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SellStuffPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SellStuffPage />)
    }).not.toThrow()
  })
})
