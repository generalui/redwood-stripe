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
      {currentUser ? (
        <>
          <Form>
            <SelectField
              name="category"
              onChange={onChangeCategory}
              className="mb-4 bg-slate-100 p-2"
            >
              <option value="">No filters</option>
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
        <div className="text-xl my-10 text-slate-400 text-center">Welcome!</div>
      )}
    </>
  )
}

export default HomePage
