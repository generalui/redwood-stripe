import CreateProductPage from './CreateProductPage'
mockGraphQLMutation('CreateProductMutation', () => {
  console.log('mocked')
})
export const generated = () => {
  return <CreateProductPage />
}

export default { title: 'Pages/CreateProductPage' }
