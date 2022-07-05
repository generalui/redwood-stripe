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

      <h1>Add Product</h1>
      <Form onSubmit={onSubmit}>
        <Label name="name">Product Name</Label>
        <TextField
          name="name"
          validation={{
            required: {
              value: true,
              message: 'Product name is required',
            },
          }}
        />
        <FieldError name="category" />
        <Label name="category">Product Category</Label>
        <SelectField name="category">
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </SelectField>
        <FieldError name="category" />
        <Label name="description">Product Description</Label>
        <TextAreaField name="description" />
        <Label name="imageUrl">Image URL</Label>
        <TextField name="imageUrl" />
        <Label name="price">Product Price</Label>
        <NumberField
          name="price"
          validation={{
            required: {
              value: true,
              message: 'Product price is required',
            },
          }}
        />
        <FieldError name="price" />
        <Submit>Add</Submit>
      </Form>
    </>
  )
}

export default CreateProductPage
