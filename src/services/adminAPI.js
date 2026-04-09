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

// Valid order statuses
const VALID_ORDER_STATUS = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];

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
    // Validate status
    if (status === undefined || status === null || typeof status !== 'string') {
      return { success: false, message: 'Valid status is required' };
    }
    
    const normalizedStatus = status.trim().toLowerCase();
    
    if (!normalizedStatus || normalizedStatus === 'undefined' || normalizedStatus === 'null') {
      return { success: false, message: 'Status cannot be empty' };
    }
    
    if (!VALID_ORDER_STATUS.includes(normalizedStatus)) {
      return { success: false, message: `Invalid status. Must be one of: ${VALID_ORDER_STATUS.join(', ')}` };
    }
    
    return adminApiCall(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: normalizedStatus, note: note || '' })
    });
  },
  
  // Products
  getProducts: async () => {
    return adminApiCall('/admin/products');
  },
  
  updateProduct: async (productId, data) => {
    // Validate productId
    if (productId === undefined || productId === null) {
      return { success: false, message: 'Product ID is required' };
    }
    
    const numericProductId = Number(productId);
    if (isNaN(numericProductId) || numericProductId <= 0) {
      return { success: false, message: 'Product ID must be a positive number' };
    }
    
    // Validate data object
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { success: false, message: 'Update data must be an object' };
    }
    
    // Build cleaned data with only valid fields
    const cleanedData = {};
    
    // pricePerKg - must be a valid positive number
    if (data.pricePerKg !== undefined && data.pricePerKg !== null && data.pricePerKg !== '') {
      const price = Number(data.pricePerKg);
      if (!isNaN(price) && price > 0) {
        cleanedData.pricePerKg = price;
      }
    }
    
    // inStock - boolean
    if ('inStock' in data) {
      cleanedData.inStock = data.inStock === true || data.inStock === 'true' || data.inStock === 1;
    }
    
    // isActive - boolean
    if ('isActive' in data) {
      cleanedData.isActive = data.isActive === true || data.isActive === 'true' || data.isActive === 1;
    }
    
    // stockQuantity - number >= 0 or null
    if ('stockQuantity' in data) {
      if (data.stockQuantity === null || data.stockQuantity === '') {
        cleanedData.stockQuantity = null;
      } else {
        const qty = Number(data.stockQuantity);
        if (!isNaN(qty) && qty >= 0) {
          cleanedData.stockQuantity = qty;
        }
      }
    }
    
    // name - non-empty string
    if (data.name !== undefined && data.name !== null && String(data.name).trim() !== '') {
      cleanedData.name = String(data.name).trim();
    }
    
    // category - string
    if (data.category !== undefined && data.category !== null && data.category !== '') {
      cleanedData.category = data.category;
    }
    
    // Check if we have any valid fields to update
    if (Object.keys(cleanedData).length === 0) {
      return { success: false, message: 'No valid fields provided for update' };
    }
    
    return adminApiCall(`/admin/products/${numericProductId}`, {
      method: 'PUT',
      body: JSON.stringify(cleanedData)
    });
  },
  
  resetProduct: async (productId) => {
    return adminApiCall(`/admin/products/${productId}/override`, {
      method: 'DELETE'
    });
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
  validateCoupon: async (token, code, orderAmount, productIds) => {
    return authenticatedRequest('/orders/coupon/validate', token, {
      method: 'POST',
      body: JSON.stringify({ code, orderAmount, productIds })
    });
  },
  
  createOrder: async (token, items, couponCode, address) => {
    return authenticatedRequest('/orders/create-order', token, {
      method: 'POST',
      body: JSON.stringify({ items, couponCode, address })
    });
  },
  
  verifyPayment: async (token, paymentData) => {
    return authenticatedRequest('/orders/verify-payment', token, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },
  
  getMyOrders: async (token) => {
    return authenticatedRequest('/orders/my-orders', token, {
      method: 'GET'
    });
  },
  
  getOrder: async (token, orderId) => {
    return authenticatedRequest(`/orders/my-orders/${orderId}`, token, {
      method: 'GET'
    });
  }
};

export default adminAPI;
