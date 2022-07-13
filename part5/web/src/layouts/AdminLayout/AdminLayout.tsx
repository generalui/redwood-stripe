import { useAuth } from '@redwoodjs/auth'
import { Link, navigate, routes } from '@redwoodjs/router'
import { useEffect, useState } from 'react'

type AdminLayoutProps = {
  children?: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
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
    <div>
      <div className="overflow-hidden p-2 bg-amber-100 flex justify-between text-amber-800">
        <div className="font-bold italic">Upmarket - Admin</div>
        <nav>
          <ul className="flex gap-3 text-sm">
            {isAuthenticated && (
              <li className="text-amber-500 italic text-sm">
                {currentUser.email}
              </li>
            )}
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
      </div>
      <div className="m-3">{children}</div>
    </div>
  )
}

export default AdminLayout
