import { render } from '@redwoodjs/testing/web'

import ManageSubscriptionPage from './ManageSubscriptionPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ManageSubscriptionPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ManageSubscriptionPage />)
    }).not.toThrow()
  })
})
