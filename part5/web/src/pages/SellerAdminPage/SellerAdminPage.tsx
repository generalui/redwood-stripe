import { useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import SalesCell from 'src/components/SalesCell'

const SellerAdminPage = () => {
  const { userId } = useParams()
  return (
    <>
      <MetaTags title="Seller Admin" description="Seller Admin page" />

      <h1 className="text-slate-500 mb-5 italic">
        Sales of seller id={userId}
      </h1>
      {userId && <SalesCell userId={+userId} />}
    </>
  )
}

export default SellerAdminPage
