import { useAuth } from '@redwoodjs/auth'
import { MetaTags } from '@redwoodjs/web'
import ProductsCell from 'src/components/ProductsCell'
import AddProductCell from 'src/components/AddProductCell'
import { stripeOnboarding } from 'src/lib/stripeOnboarding'

const SellStuffPage = () => {
  const { currentUser } = useAuth()

  const completeStripeOnboarding = () => {
    stripeOnboarding(currentUser.id)
  }
  return (
    <>
      <MetaTags title="Sell Stuff" description="Sell Stuff page" />

      {currentUser?.stripeOnboardingDone ? (
        <>
          <ProductsCell userId={currentUser.id} />
          <AddProductCell userId={currentUser.id} />
        </>
      ) : (
        <>
          <div>
            You need to complete Stripe onboarding before adding products to
            sell on the platform{' '}
            <button onClick={completeStripeOnboarding}>
              Stripe Onboarding
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default SellStuffPage
