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
    // CRITICAL: Multi-layer validation to prevent "Invalid status: undefined" errors
    
    // Layer 1: Check if status exists
    if (status === undefined || status === null) {
      console.error('❌ adminAPI.updateOrderStatus: Status is undefined/null:', status);
      return { success: false, message: 'Status is required and cannot be undefined or null' };
    }
    
    // Layer 2: Check if status is a string
    if (typeof status !== 'string') {
      console.error('❌ adminAPI.updateOrderStatus: Status is not a string:', { status, type: typeof status });
      return { success: false, message: `Status must be a string, got ${typeof status}` };
    }
    
    // Layer 3: Normalize and check for empty
    const normalizedStatus = status.trim().toLowerCase();
    
    if (normalizedStatus === '') {
      console.error('❌ adminAPI.updateOrderStatus: Status is empty string');
      return { success: false, message: 'Status cannot be empty' };
    }
    
    // Layer 4: Check for 'undefined' or 'null' as strings
    if (normalizedStatus === 'undefined' || normalizedStatus === 'null') {
      console.error('❌ adminAPI.updateOrderStatus: Status is literal string "undefined"/"null":', status);
      return { success: false, message: 'Status cannot be the string "undefined" or "null"' };
    }
    
    // Layer 5: Log what we're sending
    console.log('📤 adminAPI.updateOrderStatus:', { 
      orderId, 
      originalStatus: status,
      normalizedStatus, 
      note: note || '' 
    });
    
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
    // CRITICAL: Multi-layer validation to prevent "No valid fields" errors
    
    // Layer 1: Check productId
    if (productId === undefined || productId === null) {
      console.error('❌ adminAPI.updateProduct: productId is undefined/null');
      return { success: false, message: 'Product ID is required' };
    }
    
    const numericProductId = Number(productId);
    if (isNaN(numericProductId) || numericProductId <= 0) {
      console.error('❌ adminAPI.updateProduct: Invalid productId:', productId);
      return { success: false, message: 'Product ID must be a positive number' };
    }
    
    // Layer 2: Check data object
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      console.error('❌ adminAPI.updateProduct: Data is not an object:', data);
      return { success: false, message: 'Update data must be an object' };
    }
    
    // Layer 3: Build cleaned data with only valid fields
    const cleanedData = {};
    
    // pricePerKg - must be a valid positive number
    if (data.pricePerKg !== undefined && data.pricePerKg !== null && data.pricePerKg !== '') {
      const price = Number(data.pricePerKg);
      if (!isNaN(price) && price > 0) {
        cleanedData.pricePerKg = price;
      } else {
        console.warn('⚠️ adminAPI.updateProduct: Invalid pricePerKg ignored:', data.pricePerKg);
      }
    }
    
    // inStock - boolean (MUST handle false correctly!)
    if (data.inStock !== undefined && data.inStock !== null) {
      // Explicitly convert to boolean, handling both true/false and 'true'/'false' strings
      cleanedData.inStock = data.inStock === true || data.inStock === 'true';
      console.log('📌 inStock will be set to:', cleanedData.inStock, '(input was:', data.inStock, ')');
    }
    
    // isActive - boolean
    if (data.isActive !== undefined && data.isActive !== null) {
      cleanedData.isActive = data.isActive === true || data.isActive === 'true';
    }
    
    // stockQuantity - number >= 0 or null
    if (data.stockQuantity !== undefined) {
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
    
    // Layer 4: Check if we have any valid fields to update
    if (Object.keys(cleanedData).length === 0) {
      console.error('❌ adminAPI.updateProduct: No valid fields to update');
      console.error('   Original data:', JSON.stringify(data));
      return { success: false, message: 'No valid fields provided for update. Please provide pricePerKg, inStock, isActive, or stockQuantity.' };
    }
    
    // Layer 5: Log and send
    console.log('📤 adminAPI.updateProduct:', { 
      productId: numericProductId, 
      originalData: data,
      cleanedData 
    });
    
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
