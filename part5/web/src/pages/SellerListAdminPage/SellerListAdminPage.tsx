import { MetaTags } from '@redwoodjs/web'
import SellersCell from 'src/components/SellersCell'

const SellerListAdminPage = () => {
  return (
    <>
      <MetaTags title="Seller List" description="Seller List page" />

      <h1>Seller Page</h1>
      <SellersCell />
    </>
  )
}

export default SellerListAdminPage
