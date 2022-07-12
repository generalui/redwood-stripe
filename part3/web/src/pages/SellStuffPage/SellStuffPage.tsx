import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import ProductsCell from 'src/components/ProductsCell'

const SellStuffPage = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <MetaTags title="Sell Stuff" description="Sell Stuff page" />

      {currentUser && <ProductsCell userId={currentUser.id} />}
      <Link
        to={routes.createProduct()}
        className="py-2 px-4 bg-indigo-400 rounded-md text-white font-bold mt-5 inline-block"
      >
        Add Product
      </Link>
    </>
  )
}

export default SellStuffPage
