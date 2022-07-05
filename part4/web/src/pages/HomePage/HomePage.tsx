import { useAuth } from '@redwoodjs/auth'
import { Form, SelectField } from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'
import { ChangeEvent, useState } from 'react'
import ProductsCell from 'src/components/ProductsCell'
import { CATEGORIES } from 'src/constants'

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

export default HomePage
