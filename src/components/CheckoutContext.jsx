import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const CheckoutContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Debug: Log Razorpay key status (not the actual key for security)
console.log('[Checkout] Razorpay Key configured:', !!RAZORPAY_KEY_ID);

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

export const CheckoutProvider = ({ children }) => {
  const { user, getToken, openAuthModal } = useAuth();
  const { cartItems, clearCart, subtotal } = useCart();
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Validate coupon
  const validateCoupon = async (code) => {
    if (!code) return;
    
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Please login to apply coupon');
      }

      const productIds = cartItems.map(item => item.id);
      
      const response = await fetch(`${API_URL}/orders/coupon/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          orderAmount: subtotal,
          productIds
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setDiscount(data.coupon.discount);
        setCouponCode(code);
        return { success: true, discount: data.coupon.discount };
      } else {
        throw new Error(data.message || 'Invalid coupon');
      }
    } catch (err) {
      setAppliedCoupon(null);
      setDiscount(0);
      return { success: false, message: err.message };
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
  };

  // Open checkout
  const openCheckout = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    setIsCheckoutOpen(true);
  };

  // Close checkout
  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setError(null);
  };

  // Initiate payment
  const initiatePayment = async (address) => {
    if (!user) {
      openAuthModal();
      return { success: false, message: 'Please login first' };
    }

    if (cartItems.length === 0) {
      return { success: false, message: 'Cart is empty' };
    }

    if (!address || !address.name || !address.mobile || !address.address || !address.pincode) {
      return { success: false, message: 'Please fill all address fields' };
    }

    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication failed');
      }

      // Prepare cart items for backend
      const items = cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        weight: item.weight,
        quantity: item.quantity,
        image: item.image || '' // Include image for order display
      }));

      // Create order on backend
      const response = await fetch(`${API_URL}/orders/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items,
          couponCode: appliedCoupon?.code || null,
          address
        })
      });

      const data = await response.json();
      
      // Debug: Log order response
      console.log('[Checkout] Order response:', {
        success: data.success,
        orderId: data.razorpayOrder?.id,
        amount: data.razorpayOrder?.amount,
        currency: data.razorpayOrder?.currency
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Validate order data
      if (!data.razorpayOrder?.id) {
        throw new Error('Invalid order response: missing order ID');
      }

      // Validate Razorpay key
      if (!RAZORPAY_KEY_ID) {
        throw new Error('Razorpay key not configured. Check VITE_RAZORPAY_KEY_ID in .env');
      }

      // Validate Razorpay script is loaded
      if (typeof window.Razorpay !== 'function') {
        throw new Error('Razorpay script not loaded. Please refresh the page.');
      }

      // Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: 'Samskruthi Foods',
        description: 'Order Payment',
        order_id: data.razorpayOrder.id,
        handler: async function(response) {
          // Verify payment on backend
          await verifyPayment(response, data.order.orderId, token);
        },
        prefill: {
          name: address.name,
          email: user.email,
          contact: address.mobile
        },
        theme: {
          color: '#C17A56'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setError('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      return { success: true };
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
      setLoading(false);
      return { success: false, message: err.message };
    }
  };

  // Verify payment
  const verifyPayment = async (razorpayResponse, orderId, token) => {
    try {
      const response = await fetch(`${API_URL}/orders/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          orderId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart and close checkout
        clearCart();
        closeCheckout();
        removeCoupon();
        
        // Redirect to orders page if navigate is available
        if (window.ordersNavigate) {
          setTimeout(() => {
            window.ordersNavigate('/orders');
            window.ordersNavigate = null;
          }, 500);
        }
        
        return { success: true, order: data.order };
      } else {
        throw new Error(data.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const deliveryCharge = subtotal >= 500 ? 0 : 50;
  const total = subtotal - discount + deliveryCharge;

  return (
    <CheckoutContext.Provider
      value={{
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        loading,
        error,
        initiatePayment,
        validateCoupon,
        removeCoupon,
        couponCode,
        setCouponCode,
        appliedCoupon,
        discount,
        deliveryCharge,
        total
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutContext;
