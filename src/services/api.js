// API Service for communicating with backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Debug logging
  console.log(`🌐 API Request: ${options.method || 'GET'} ${endpoint}`);

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ API Error [${endpoint}]:`, data.message);
      throw new Error(data.message || 'Request failed');
    }
    
    console.log(`✅ API Success [${endpoint}]`);
    return data;
  } catch (error) {
    console.error(`❌ API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  // Google authentication - sends token in BODY
  googleAuth: async (token) => {
    if (!token) {
      throw new Error('No token provided');
    }
    return apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  // Email registration
  register: async (name, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Email login
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Sync user (for Firebase auth) - sends token in HEADER
  syncUser: async (token) => {
    if (!token) {
      throw new Error('No token provided');
    }
    return apiRequest('/auth/sync', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// User API calls - all require Authorization header
export const userAPI = {
  // Get user profile
  getProfile: async (token) => {
    if (!token) {
      throw new Error('No token provided');
    }
    return apiRequest('/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Update user profile
  updateProfile: async (token, data) => {
    if (!token) {
      throw new Error('No token provided');
    }
    return apiRequest('/user/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },
};

// Order API calls - all require Authorization header
export const orderAPI = {
  // Get user's orders
  getMyOrders: async (token) => {
    if (!token) {
      throw new Error('No token provided');
    }
    return apiRequest('/orders/my-orders', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Get order by ID
  getOrderById: async (token, orderId) => {
    if (!token) {
      throw new Error('No token provided');
    }
    return apiRequest(`/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Delete order
  deleteOrder: async (token, orderId) => {
    if (!token) {
      throw new Error('No token provided');
    }
    return apiRequest(`/orders/my-orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default { authAPI, userAPI, orderAPI };
