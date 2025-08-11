// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('sb-access-token');
  return token;
};

// Create headers with auth
const createHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Product API
export const productAPI = {
  // Get all products with optional filters
  getProducts: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiRequest(`/products${query ? `?${query}` : ''}`);
  },

  // Get single product by ID
  getProduct: async (id: string) => {
    return apiRequest(`/products/${id}`);
  },

  // Get product categories
  getCategories: async () => {
    return apiRequest('/products/categories');
  },

  // Check product availability
  checkAvailability: async (productId: string, startDate: string, endDate: string, quantity: number = 1) => {
    return apiRequest(`/products/${productId}/availability?startDate=${startDate}&endDate=${endDate}&quantity=${quantity}`);
  }
};

// Rental API
export const rentalAPI = {
  // Create new rental order
  createRental: async (data: {
    productId: string;
    startDate: string;
    endDate: string;
    quantity?: number;
    notes?: string;
  }) => {
    return apiRequest('/rentals', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Get user's rentals
  getRentals: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return apiRequest(`/rentals${query ? `?${query}` : ''}`);
  },

  // Get single rental by ID
  getRental: async (id: string) => {
    return apiRequest(`/rentals/${id}`);
  },

  // Update rental order
  updateRental: async (id: string, data: {
    startDate?: string;
    endDate?: string;
    quantity?: number;
    notes?: string;
    status?: string;
  }) => {
    return apiRequest(`/rentals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Cancel rental order
  cancelRental: async (id: string) => {
    return apiRequest(`/rentals/${id}/cancel`, {
      method: 'PUT'
    });
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    return apiRequest('/health');
  }
};

export default {
  productAPI,
  rentalAPI,
  healthAPI
};
