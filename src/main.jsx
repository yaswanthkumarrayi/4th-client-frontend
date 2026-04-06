import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './components/CartContext'
import { AuthProvider } from './components/AuthContext'
import { ProductConfigProvider } from './components/ProductConfigContext'
import { CheckoutProvider } from './components/CheckoutContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ProductConfigProvider>
        <CartProvider>
          <CheckoutProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CheckoutProvider>
        </CartProvider>
      </ProductConfigProvider>
    </AuthProvider>
  </React.StrictMode>,
)
