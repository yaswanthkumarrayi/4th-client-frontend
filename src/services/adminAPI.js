const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
};

// Admin Auth API
export const adminAPI = {
  // Login
  login: async (mobile, password) => {
    const data = await apiCall('/admin/login', {
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
    return apiCall('/admin/verify');
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
    return apiCall('/admin/dashboard');
  },
  
  // Orders
  getOrders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/admin/orders${query ? `?${query}` : ''}`);
  },
  
  getOrder: async (orderId) => {
    return apiCall(`/admin/orders/${orderId}`);
  },
  
  updateOrderStatus: async (orderId, status, note = '') => {
    return apiCall(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note })
    });
  },
  
  // Products
  getProducts: async () => {
    return apiCall('/admin/products');
  },
  
  updateProduct: async (productId, data) => {
    return apiCall(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  resetProduct: async (productId) => {
    return apiCall(`/admin/products/${productId}/override`, {
      method: 'DELETE'
    });
  },
  
  // Coupons
  getCoupons: async () => {
    return apiCall('/admin/coupons');
  },
  
  createCoupon: async (couponData) => {
    return apiCall('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData)
    });
  },
  
  updateCoupon: async (id, couponData) => {
    return apiCall(`/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(couponData)
    });
  },
  
  deleteCoupon: async (id) => {
    return apiCall(`/admin/coupons/${id}`, {
      method: 'DELETE'
    });
  },
  
  toggleCoupon: async (id) => {
    return apiCall(`/admin/coupons/${id}/toggle`, {
      method: 'PATCH'
    });
  }
};

// Orders API (User-facing)
export const ordersAPI = {
  // Validate coupon
  validateCoupon: async (token, code, orderAmount, productIds) => {
    const response = await fetch(`${API_BASE}/orders/coupon/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ code, orderAmount, productIds })
    });
    return response.json();
  },
  
  // Create order (Razorpay)
  createOrder: async (token, items, couponCode, address) => {
    const response = await fetch(`${API_BASE}/orders/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items, couponCode, address })
    });
    return response.json();
  },
  
  // Verify payment
  verifyPayment: async (token, paymentData) => {
    const response = await fetch(`${API_BASE}/orders/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });
    return response.json();
  },
  
  // Get my orders
  getMyOrders: async (token) => {
    const response = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },
  
  // Get single order
  getOrder: async (token, orderId) => {
    const response = await fetch(`${API_BASE}/orders/my-orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};

export default adminAPI;
