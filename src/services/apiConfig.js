/**
 * Centralized API Configuration
 * 
 * This file manages all API endpoint configurations and provides
 * a consistent way to make API calls across the application.
 */

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Log configuration (helpful for debugging deployment issues)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:');
  console.log('  Base URL:', API_BASE_URL);
  console.log('  Mode:', import.meta.env.MODE);
}

/**
 * Makes an authenticated API request
 * @param {string} endpoint - The API endpoint (e.g., '/user/profile')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} The response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${path}`;

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Remove body for GET requests
  if (config.method === 'GET') {
    delete config.body;
  }

  try {
    console.log(`🌐 ${config.method} ${url}`);
    if (config.body) {
      console.log('📤 Request body:', config.body);
    }
    
    const response = await fetch(url, config);
    const data = await response.json();

    console.log(`📥 Response status: ${response.status}`);
    console.log(`📥 Response data:`, JSON.stringify(data).substring(0, 500));

    if (!response.ok) {
      const errorMessage = data.message || `HTTP ${response.status}: ${response.statusText}`;
      console.error(`❌ API Error [${path}]:`, errorMessage);
      throw new Error(errorMessage);
    }

    console.log(`✅ Success [${path}]`);
    return data;
  } catch (error) {
    console.error(`❌ Request failed [${path}]:`, error.message);
    throw error;
  }
};

/**
 * Makes an authenticated API request with Authorization header
 * @param {string} endpoint - The API endpoint
 * @param {string} token - The authentication token
 * @param {object} options - Fetch options
 * @returns {Promise<any>} The response data
 */
export const authenticatedRequest = async (endpoint, token, options = {}) => {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Export the base URL for other uses (e.g., direct fetch calls)
export const API_URL = API_BASE_URL;

export default {
  apiRequest,
  authenticatedRequest,
  API_URL,
};
