import { MetaTags } from '@redwoodjs/web'
import ListPaymentsCell from 'src/components/ListPaymentsCell'

const AdminPage = () => {
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />

      <h1>Admin</h1>
      <ListPaymentsCell />
    </>
  )
}

export default AdminPage
