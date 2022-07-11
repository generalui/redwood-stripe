import { render } from '@redwoodjs/testing/web'

import SellerListAdminPage from './SellerListAdminPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SellerListAdminPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SellerListAdminPage />)
    }).not.toThrow()
  })
})
