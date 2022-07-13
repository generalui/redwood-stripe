import { useAuth } from '@redwoodjs/auth'
import { MetaTags } from '@redwoodjs/web'
import MyPurchasesCell from 'src/components/MyPurchasesCell'

const MyPurchasesPage = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <MetaTags title="My purchases" description="My purchases" />
      <h1 className="text-slate-500 mb-5 italic">My Products</h1>
      {currentUser ? (
        <>
          <MyPurchasesCell userId={currentUser.id} />
        </>
      ) : (
        'Login/Signup to access your purchases'
      )}
    </>
  )
}

export default MyPurchasesPage
