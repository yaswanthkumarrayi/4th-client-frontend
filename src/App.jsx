import ScrollToTop from './components/ScrollToTop';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Product from './pages/Product'
import Category from './pages/Category'
import Account from './pages/Account'
import Orders from './pages/Orders'

// Admin Pages
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './pages/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminOrders from './pages/AdminOrders'
import AdminProducts from './pages/AdminProducts'
import AdminCoupons from './pages/AdminCoupons'

function App() {
  return (
    <>
      <ScrollToTop />
      <AuthModal />
      <CheckoutModal />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Orders />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="coupons" element={<AdminCoupons />} />
        </Route>
        
        {/* Category Routes (must be last - catches /:slug) */}
        <Route path="/:slug" element={<Category />} />
      </Routes>
    </>
  )
}

export default App
