# Part 3: Buying products

In this part we will see how a visitor of our marketplace can use stripe to perform a transaction and buy a product. We will also create a space were the buyer can see a list of the products he purchased.

## Fix homepage

Right now, there is an error on the homepage if you're logged out. It's ok for this demo to not show products to logged out users but it should not show an error. Let's test if the current user exists in `Homepage.tsx` and display message if it doesn't:

```tsx
const HomePage = () => {
  const { currentUser } = useAuth()
  const [category, setCategory] = useState('')
  const onChangeCategory = (ev: ChangeEvent<HTMLSelectElement>) => {
    setCategory(ev.target.value)
  }
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <h1>HomePage</h1>
      {currentUser ? (
        <>
          <Form>
            <SelectField name="category" onChange={onChangeCategory}>
              <option value="">-</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </SelectField>
          </Form>
          <ProductsCell category={category || undefined} />
        </>
      ) : (
        'Login/Signup to access products'
      )}
    </>
  )
}
```

## Create a buy product page

```
yarn rw g page BuyProduct
```

This page will need to have the product ID as a url param. Let's declare the following route inside the `Private` of our router:

```tsx
<Route path="/buy-product/:id" page={BuyProductPage} name="buyProduct" />
```

Now we add a link to buy the product on the product list `ProductsCell.tsx`:

```tsx
<td>
  <Link to={routes.buyProduct({ id: item.id })}>Buy</Link>
</td>
```

We can make a first update on `BuyProductPage.tsx` to check things are connected correctly and display the product id:

```tsx
import { useParams } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const BuyProductPage = () => {
  const { id } = useParams()
  return (
    <>
      <MetaTags title="BuyProduct" description="BuyProduct page" />

      <h1>buying product with id={id}</h1>
    </>
  )
}

export default BuyProductPage
```

We can already test this. Go to http://localhost:8910/, signup, create a buyer account, and click on buy on one of the products (if you don't have any products, you need to login/signup as a seller and create some products, see [part 2](../part2/readme.md) for more details.

## Implement the buy product page

This page starts by loading information about the product with the id passed as a url param. Redwood invites us to create a Cell for this kind of thing.

```
yarn rw g cell BuyProduct
```

By default the cell creates a query that only returns the `id` of the product, which is pretty useless, so let's add a few fields

```tsx
export const QUERY = gql`
  query FindProductQuery($id: Int!) {
    product: product(id: $id) {
      id
      price
      name
      description
    }
  }
```

Next, we can return a slightly better formatted version of our product in the success handler:

```tsx
export const Success = ({ product }: CellSuccessProps<FindProductQuery>) => {
  return (
    <>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <b>{product.price}</b>
    </>
  )
}
```

Here you might get a ts error on `product.name`, that's because we changed the query without updating the types, there is a command in redwood to regenerate the types that is really handy:

```
yarn rw g types
```

## Create checkout session function

The same way we used `stripe.subscriptions.create` in a `createSubscription` function to allow user to subscribe as a seller to our marketplace, we will create a `checkoutSession` function and use `stripe.checkout.sessions.create` (according to the [doc](https://stripe.com/docs/payments/accept-a-payment)) to allow users to buy a product from a seller.

```
yarn rw g function checkoutSession
```

# End of part 3

In this part we .... You can look up the github repository for [this part](https://github.com/generalui/redwood-stripe/tree/main/part3)

In the next [part](../part4/readme.md) we will see how to handle payouts to the sellers

```

```
