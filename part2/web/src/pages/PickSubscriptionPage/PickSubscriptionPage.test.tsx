import { render } from '@redwoodjs/testing/web'

import PickSubscriptionPage from './PickSubscriptionPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('PickSubscriptionPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PickSubscriptionPage />)
    }).not.toThrow()
  })
})
