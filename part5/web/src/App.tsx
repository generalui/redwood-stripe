import { AuthProvider } from '@redwoodjs/auth'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './scaffold.css'
import './index.css'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { Toaster } from '@redwoodjs/web/dist/toast'

const App = () => {
  const stripePromise = loadStripe(process.env.STRIPE_PK)

  return (
    <FatalErrorBoundary page={FatalErrorPage}>
      <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
        <AuthProvider
          type="dbAuth"
          config={{ fetchConfig: { credentials: 'include' } }}
        >
          <RedwoodApolloProvider
            graphQLClientConfig={{ httpLinkConfig: { credentials: 'include' } }}
          >
            <Elements stripe={stripePromise}>
              <Routes />
            </Elements>
            <Toaster
              position="bottom-right"
              toastOptions={{ success: { duration: 3000 } }}
            />
          </RedwoodApolloProvider>
        </AuthProvider>
      </RedwoodProvider>
    </FatalErrorBoundary>
  )
}

export default App
