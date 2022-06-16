import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const SellStuffPage = () => {
  return (
    <>
      <MetaTags title="Sell Stuff" description="Sell Stuff page" />

      <h1>Sell Stuff</h1>
      <p>
        Find me in <code>./web/src/pages/SellStuffPage/SellStuffPage.tsx</code>
      </p>
      <p>
        My default route is named <code>sellStuff</code>, link to me with `
        <Link to={routes.sellStuff()}>SellStuff</Link>`
      </p>
    </>
  )
}

export default SellStuffPage
