import { API_URL, apiRequest, authenticatedRequest } from './apiConfig.js';

// Helper function for admin API calls with token from localStorage
const adminApiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  if (token) {
    return authenticatedRequest(endpoint, token, options);
  } else {
    return apiRequest(endpoint, options);
  }
};

// Admin Auth API
export const adminAPI = {
  // Login
  login: async (mobile, password) => {
    const data = await apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password })
    });
    
    if (data.success && data.token) {
      localStorage.setItem('adminToken', data.token);
    }
    
    return data;
  },
  
  // Verify session
  verify: async () => {
    return adminApiCall('/admin/verify');
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
  },
  
  // Check if logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('adminToken');
  },
  
  // Dashboard
  getDashboard: async () => {
    return adminApiCall('/admin/dashboard');
  },
  
  // Orders
  getOrders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return adminApiCall(`/admin/orders${query ? `?${query}` : ''}`);
  },
  
  getOrder: async (orderId) => {
    return adminApiCall(`/admin/orders/${orderId}`);
  },
  
  updateOrderStatus: async (orderId, status, note = '') => {
    return adminApiCall(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note })
    });
  },
  
  // Products
  getProducts: async () => {
    return adminApiCall('/admin/products');
  },
  
  updateProduct: async (productId, data) => {
    return adminApiCall(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  resetProduct: async (productId) => {
    return adminApiCall(`/admin/products/${productId}/override`, {
      method: 'DELETE'
    });
  },
  
  // Debug: Check database connection and overrides
  debugDatabase: async () => {
    return adminApiCall('/admin/debug/db');
  },
  
  // Coupons
  getCoupons: async () => {
    return adminApiCall('/admin/coupons');
  },
  
  createCoupon: async (couponData) => {
    return adminApiCall('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData)
    });
  },
  
  updateCoupon: async (id, couponData) => {
    return adminApiCall(`/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(couponData)
    });
  },
  
  deleteCoupon: async (id) => {
    return adminApiCall(`/admin/coupons/${id}`, {
      method: 'DELETE'
    });
  },
  
  toggleCoupon: async (id) => {
    return adminApiCall(`/admin/coupons/${id}/toggle`, {
      method: 'PATCH'
    });
  }
};

// Orders API (User-facing)
export const ordersAPI = {
  // Validate coupon
  validateCoupon: async (token, code, orderAmount, productIds) => {
    return authenticatedRequest('/orders/coupon/validate', token, {
      method: 'POST',
      body: JSON.stringify({ code, orderAmount, productIds })
    });
  },
  
  // Create order (Razorpay)
  createOrder: async (token, items, couponCode, address) => {
    return authenticatedRequest('/orders/create-order', token, {
      method: 'POST',
      body: JSON.stringify({ items, couponCode, address })
    });
  },
  
  // Verify payment
  verifyPayment: async (token, paymentData) => {
    return authenticatedRequest('/orders/verify-payment', token, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },
  
  // Get my orders
  getMyOrders: async (token) => {
    return authenticatedRequest('/orders/my-orders', token, {
      method: 'GET'
    });
  },
  
  // Get single order
  getOrder: async (token, orderId) => {
    return authenticatedRequest(`/orders/my-orders/${orderId}`, token, {
      method: 'GET'
    });
  }
};

export default adminAPI;
