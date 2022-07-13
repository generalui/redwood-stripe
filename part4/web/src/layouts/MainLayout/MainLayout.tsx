import { useAuth } from '@redwoodjs/auth'
import { Link, navigate, routes, useLocation } from '@redwoodjs/router'
import { useEffect } from 'react'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation()
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const isAuthorizedSeller =
    currentUser?.subscriptionStatus === 'success' &&
    currentUser?.roles.includes('seller')

  useEffect(() => {
    if (
      location.pathname !== routes.pickSubscription() &&
      currentUser?.subscriptionStatus !== 'success' &&
      currentUser?.roles.includes('seller')
    ) {
      navigate(routes.pickSubscription())
    }
  }, [currentUser, location])
  return (
    <div>
      <div className="overflow-hidden p-2 bg-slate-100 flex justify-between text-slate-500">
        <div className="font-bold italic">Upmarket</div>
        <nav>
          <ul className="flex gap-3 text-sm">
            {isAuthenticated && (
              <li className="text-slate-300 italic text-sm">
                {currentUser.email}
              </li>
            )}
            <li>
              <Link to={routes.home()}>Home</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to={routes.myPurchases()}>My Purchases</Link>
                </li>
                <li>
                  <button onClick={logOut}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={routes.login()}>Login</Link>
                </li>
                <li>
                  <Link to={routes.signup()}>Signup</Link>
                </li>
              </>
            )}
            {isAuthorizedSeller && (
              <>
                <li>
                  <Link to={routes.sellStuff()}>Sell stuff</Link>
                </li>
                <li>
                  <Link to={routes.manageSubscription()}>
                    Manage my subscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <div className="m-3">{children}</div>
    </div>
  )
}

export default MainLayout
