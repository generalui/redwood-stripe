import { MetaTags } from '@redwoodjs/web'
import ListPaymentsCell from 'src/components/ListPaymentsCell'

const AdminPage = () => {
  return (
    <>
      <MetaTags title="Admin" description="Admin page" />

      <h1 className="text-slate-500 mb-5 italic">List of payments</h1>
      <ListPaymentsCell />
    </>
  )
}

export default AdminPage
