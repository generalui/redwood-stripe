import { render } from '@redwoodjs/testing/web'

import CreateProductPage from './CreateProductPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('CreateProductPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CreateProductPage />)
    }).not.toThrow()
  })
})
