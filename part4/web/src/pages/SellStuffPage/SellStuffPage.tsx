import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import ProductsCell from 'src/components/ProductsCell'
import { stripeOnboarding } from 'src/lib/stripeOnboarding'

const SellStuffPage = () => {
  const { currentUser } = useAuth()
  const completeStripeOnboarding = () => {
    stripeOnboarding(currentUser.id)
  }
  return (
    <>
      <MetaTags title="Sell Stuff" description="Sell Stuff page" />

      <h1>Sell Stuff</h1>
      {currentUser?.stripeOnboardingDone ? (
        <ProductsCell userId={currentUser.id} />
      ) : (
        <div>
          You need to complete Stripe onboarding before adding products to sell
          on the platform{' '}
          <button onClick={completeStripeOnboarding}>Stripe Onboarding</button>
        </div>
      )}
      <Link to={routes.createProduct()}>Add Product</Link>
    </>
  )
}

export default SellStuffPage
