import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminSignUpPage from './pages/AdminSignUpPage';
import AllUsers from './pages/AllUsers';
import ProductUploadForm from './pages/ProductUploadForm';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import BuyNow from './pages/BuyNow';
import AdminOrdersPage from './pages/AdminOrdersPage';
import EditProduct from './pages/EditProduct';
import CategoryList from './pages/CategoryList'

const App = () => {
  return (

    <Router>
      {/* <Navbar/> */}
      <Routes>
        <Route path='/register' element={<AdminSignUpPage />} />
        <Route path='/login' element={<AdminLoginPage />} />
        <Route path='/users' element={<AllUsers />} />
        <Route path='/upload' element={<ProductUploadForm />} />
        <Route path='/products' element={<ProductList />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/buynow/:productId" element={<BuyNow />} />
        <Route path="/orders" element={<AdminOrdersPage />} />
        <Route path="/products/:productId/edit" element={<EditProduct/>} />
        <Route path="/category/:category" element={<CategoryList />} />
      </Routes>
    </Router>
  )
}

export default App