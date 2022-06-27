import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import ProductsCell from 'src/components/ProductsCell'

const SellStuffPage = () => {
  const { currentUser } = useAuth()
  return (
    <>
      <MetaTags title="Sell Stuff" description="Sell Stuff page" />

      <h1>Sell Stuff</h1>
      {currentUser && <ProductsCell userId={currentUser.id} />}
      <Link to={routes.createProduct()}>Add Product</Link>
    </>
  )
}

export default SellStuffPage
