import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLoginPage from './pages/UserLoginPage';
import UserSignUpForm from './pages/UserSignUpPage';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import BuyNow from './pages/BuyNow';
import Cart from './pages/Cart';
import AddToCartPage from './pages/AddToCartPage';
import Orders from './pages/Orders'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CategoryList from './pages/CategoryList';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/userlogin' element={<UserLoginPage />} />
        <Route path='/usersignup' element={<UserSignUpForm />} />
        <Route path='/home' element={<Home />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/orderdetail/:orderId" element={<ProductDetailsPage />} />
        <Route path="/buynow/:productId" element={<BuyNow />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/addtocart/:productId" element={<AddToCartPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/category/:category" element={<CategoryList />} />
      </Routes>
    </Router>
  )
}

export default App