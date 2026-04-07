// API Service for communicating with backend
import { apiRequest, authenticatedRequest } from './apiConfig.js';

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
    return authenticatedRequest('/auth/sync', token, {
      method: 'POST',
    });
  },
};

// User API calls - all require Authorization header
export const userAPI = {
  // Get user profile
  getProfile: async (token) => {
    return authenticatedRequest('/user/profile', token, {
      method: 'GET',
    });
  },

  // Update user profile
  updateProfile: async (token, data) => {
    return authenticatedRequest('/user/profile', token, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Order API calls - all require Authorization header
export const orderAPI = {
  // Get user's orders
  getMyOrders: async (token) => {
    return authenticatedRequest('/orders/my-orders', token, {
      method: 'GET',
    });
  },

  // Get order by ID
  getOrderById: async (token, orderId) => {
    return authenticatedRequest(`/orders/my-orders/${orderId}`, token, {
      method: 'GET',
    });
  },

  // Delete order
  deleteOrder: async (token, orderId) => {
    return authenticatedRequest(`/orders/my-orders/${orderId}`, token, {
      method: 'DELETE',
    });
  },
};

export default { authAPI, userAPI, orderAPI };
