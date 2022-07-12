import { MetaTags } from '@redwoodjs/web'
import SellersCell from 'src/components/SellersCell'

const SellerListAdminPage = () => {
  return (
    <>
      <MetaTags title="Seller List" description="Seller List page" />

      <h1 className="text-slate-500 mb-5 italic">All Sellers</h1>
      <SellersCell />
    </>
  )
}

export default SellerListAdminPage
