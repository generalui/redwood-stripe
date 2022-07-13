import { useAuth } from '@redwoodjs/auth'
import {
  FieldError,
  Form,
  Label,
  NumberField,
  SelectField,
  Submit,
  TextAreaField,
  TextField,
} from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags, useMutation } from '@redwoodjs/web'
import { CATEGORIES } from 'src/constants'
import { CreateProductInput } from 'types/graphql'

const CREATE_PRODUCT = gql`
  mutation CreateProductMutation($input: CreateProductInput!) {
    createProduct(input: $input) {
      name
      description
      price
    }
  }
`

const CreateProductPage = () => {
  const { currentUser } = useAuth()
  const [create] = useMutation(CREATE_PRODUCT)
  const onSubmit = async (data: CreateProductInput) => {
    await create({ variables: { input: { ...data, userId: currentUser?.id } } })
    navigate(routes.sellStuff())
  }
  return (
    <>
      <MetaTags title="CreateProduct" description="CreateProduct page" />
      <div className="w-96 mx-auto">
        <div className="text-slate-500 font-bold mb-4 text-lg text-center">
          New Product
        </div>
        <Form onSubmit={onSubmit}>
          <table>
            <tbody>
              <tr>
                <td className="text-right uppercase text-sm tracking-widest text-slate-400 w-28">
                  <Label name="name">Name</Label>
                </td>
                <td>
                  <TextField
                    className="bg-slate-100 p-2 m-2 w-64"
                    name="name"
                    validation={{
                      required: {
                        value: true,
                        message: 'Product name is required',
                      },
                    }}
                  />
                  <FieldError name="name" />
                </td>
              </tr>
              <tr>
                <td className="text-right uppercase text-sm tracking-widest text-slate-400 w-28">
                  <Label name="category">Category</Label>
                </td>
                <td>
                  <SelectField
                    className="bg-slate-100 p-2 m-2 w-64"
                    name="category"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </SelectField>
                  <FieldError name="category" />
                </td>
              </tr>
              <tr>
                <td className="text-right uppercase text-sm tracking-widest text-slate-400 w-28">
                  <Label name="description">Description</Label>
                </td>
                <td>
                  <TextAreaField
                    className="bg-slate-100 p-2 m-2 w-64"
                    name="description"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-right uppercase text-sm tracking-widest text-slate-400 w-28">
                  <Label name="imageUrl">Image URL</Label>
                </td>
                <td>
                  <TextField
                    className="bg-slate-100 p-2 m-2 w-64"
                    name="imageUrl"
                  />
                </td>
              </tr>
              <tr>
                <td className="text-right uppercase text-sm tracking-widest text-slate-400 w-28">
                  <Label name="price">Price</Label>
                </td>
                <td>
                  <NumberField
                    className="bg-slate-100 p-2 m-2 w-64"
                    name="price"
                    validation={{
                      required: {
                        value: true,
                        message: 'Product price is required',
                      },
                    }}
                  />
                  <FieldError name="price" />
                </td>
              </tr>
            </tbody>
          </table>

          <Submit className="mt-4 float-right py-2 px-4 bg-indigo-400 rounded-md text-white font-bold mr-2">
            Add
          </Submit>
        </Form>
      </div>
    </>
  )
}

export default CreateProductPage
