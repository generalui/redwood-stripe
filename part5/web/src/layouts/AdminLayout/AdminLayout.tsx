import { useAuth } from '@redwoodjs/auth'
import { Link, navigate, routes } from '@redwoodjs/router'
import { useEffect, useState } from 'react'

type MainLayoutProps = {
  children?: React.ReactNode
}

const AdminLayout = ({ children }: MainLayoutProps) => {
  const { currentUser, logOut } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (currentUser) {
      if (currentUser.roles.includes('admin')) {
        setIsAdmin(true)
      } else {
        navigate(routes.home())
      }
    }
  }, [currentUser])
  return (
    <>
      <nav>
        <h3>Menu</h3>
        <ul>
          <li>
            <Link to={routes.home()}>Home</Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <button onClick={logOut}>Logout</button>
              </li>
              <li>
                <Link to={routes.admin()}>Purchases</Link>
              </li>
              <li>
                <Link to={routes.sellerListAdmin()}>Sellers</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      {children}
    </>
  )
}

export default AdminLayout
