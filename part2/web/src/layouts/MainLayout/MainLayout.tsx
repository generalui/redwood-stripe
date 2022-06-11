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
    console.log('--->2', JSON.stringify(currentUser))
    if (
      location.pathname !== routes.pickSubscription() &&
      currentUser?.subscriptionStatus !== 'success' &&
      currentUser?.roles.includes('seller')
    ) {
      navigate(routes.pickSubscription())
    }
  }, [currentUser, location])
  return (
    <>
      <nav>
        <h3>Menu</h3>
        <ul>
          <li>
            <Link to={routes.home()}>Home</Link>
          </li>
          {isAuthenticated ? (
            <li>
              <button onClick={logOut}>Logout</button>
            </li>
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
      {children}
    </>
  )
}

export default MainLayout
