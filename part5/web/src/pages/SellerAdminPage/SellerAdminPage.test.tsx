import { render } from '@redwoodjs/testing/web'

import SellerAdminPage from './SellerAdminPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SellerAdminPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SellerAdminPage />)
    }).not.toThrow()
  })
})
