/**
 * LAHAR - API Configuration
 *
 * This file centralizes all API configuration for the LAHAR e-commerce platform.
 * Structured for easy integration with PHP + MySQL backend.
 *
 * TO CONNECT BACKEND:
 * 1. Replace BASE_URL with your actual PHP backend URL
 * 2. Ensure CORS headers are configured on your server
 * 3. Implement the endpoint handlers in PHP
 * 4. Test API responses match the expected formats below
 */

const API_CONFIG = {
  // Base URL for all API requests
  BASE_URL: 'https://lahar-api.up.railway.app/api',

  // API Version (for future-proofing)
  VERSION: 'v1',

  // Endpoints configuration
  endpoints: {
    // Products
    products: '/products',
    productBySlug: (slug) => `/products/${slug}`,
    productById: (id) => `/products/id/${id}`,
    categories: '/categories',
    featured: '/products/featured',
    newArrivals: '/products/new',

    // Cart
    cart: '/cart',
    cartItem: (itemId) => `/cart/${itemId}`,

    // Orders
    orders: '/orders',
    orderById: (id) => `/orders/${id}`,

    // Authentication
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      me: '/auth/me',
      refresh: '/auth/refresh'
    },

    // Payments (Nepal-specific)
    payment: {
      esewa: '/payment/esewa',
      khalti: '/payment/khalti',
      cod: '/payment/cod'
    },

    // Wishlist
    wishlist: '/wishlist',
    wishlistItem: (productId) => `/wishlist/${productId}`,

    // Newsletter
    newsletter: '/newsletter',

    // Contact
    contact: '/contact'
  },

  // Default headers for all requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

  // Request timeout in ms
  timeout: 10000
};

/**
 * API Helper Class
 * Provides methods for making HTTP requests
 *
 * Currently uses localStorage/data for frontend prototype.
 * When backend is ready, replace the methods with actual fetch calls.
 */
class LaharAPI {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.headers = { ...API_CONFIG.headers };
    this.mockMode = true; // Set to false when backend is connected
  }

  /**
   * Build full URL from endpoint
   * @param {string} endpoint - API endpoint (e.g., '/products')
   * @param {object} params - URL parameters to replace (e.g., { slug: 'abc' })
   */
  buildUrl(endpoint, params = {}) {
    let url = `${this.baseUrl}${endpoint}`;

    // Replace route parameters like :id, :slug
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });

    return url;
  }

  /**
   * Make GET request
   * @param {string} endpoint - API endpoint
   * @param {object} params - URL parameters and query strings
   */
  async get(endpoint, params = {}) {
    if (this.mockMode) {
      return this.mockRequest('GET', endpoint, params);
    }

    const url = this.buildUrl(endpoint, params);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
        credentials: 'include'
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   */
  async post(endpoint, data = {}) {
    if (this.mockMode) {
      return this.mockRequest('POST', endpoint, data);
    }

    const url = this.buildUrl(endpoint);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        credentials: 'include',
        body: JSON.stringify(data)
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make PUT request
   */
  async put(endpoint, data = {}) {
    if (this.mockMode) {
      return this.mockRequest('PUT', endpoint, data);
    }

    const url = this.buildUrl(endpoint);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.headers,
        credentials: 'include',
        body: JSON.stringify(data)
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Make DELETE request
   */
  async delete(endpoint, params = {}) {
    if (this.mockMode) {
      return this.mockRequest('DELETE', endpoint, params);
    }

    const url = this.buildUrl(endpoint, params);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headers,
        credentials: 'include'
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle fetch response
   */
  async handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'An error occurred',
        errors: data.errors
      };
    }

    return data;
  }

  /**
   * Handle fetch error
   */
  handleError(error) {
    console.error('API Error:', error);
    throw error;
  }

  /**
   * MOCK REQUEST HANDLER
   * For frontend prototype - simulates backend responses
   * Remove this when connecting real backend
   */
  async mockRequest(method, endpoint, data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Mock responses based on endpoint
    if (endpoint.includes('/products')) {
      if (method === 'GET') {
        return { success: true, data: PRODUCTS };
      }
    }

    if (endpoint.includes('/cart')) {
      const cart = Cart.getItems();
      return { success: true, data: cart };
    }

    // Default success response
    return { success: true };
  }
}

// Create global API instance
const api = new LaharAPI();

// Export for module use
export { api, API_CONFIG };
