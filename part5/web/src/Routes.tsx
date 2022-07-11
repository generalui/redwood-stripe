// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set, Private } from '@redwoodjs/router'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import MainLayout from './layouts/MainLayout/MainLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={AdminLayout}>
        <Private unauthenticated="home" roles="admin">
          <Route path="/seller-list-admin" page={SellerListAdminPage} name="sellerListAdmin" />
          <Route path="/seller-admin/{userId:number}" page={SellerAdminPage} name="sellerAdmin" />
          <Route path="/admin" page={AdminPage} name="admin" />
        </Private>
      </Set>
      <Set wrap={MainLayout}>
        <Private unauthenticated="home">
          <Route path="/pick-subscription" page={PickSubscriptionPage} name="pickSubscription" />
          <Route path="/sell-stuff" page={SellStuffPage} name="sellStuff" />
          <Route path="/manage-subscription" page={ManageSubscriptionPage} name="manageSubscription" />
          <Route path="/create-product" page={CreateProductPage} name="createProduct" />
          <Route path="/my-purchases" page={MyPurchasesPage} name="myPurchases" />
        </Private>
        <Route path="/" page={HomePage} name="home" />
      </Set>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
