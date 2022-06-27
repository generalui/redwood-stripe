import { useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import ProductCell from 'src/components/ProductCell'

const BuyProductPage = () => {
  const { id } = useParams()
  return (
    <>
      <MetaTags title="BuyProduct" description="BuyProduct page" />
      <ProductCell id={+id} />
    </>
  )
}

export default BuyProductPage
