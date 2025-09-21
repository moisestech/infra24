import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Create axios instance with default configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for adding auth tokens, etc.
  client.interceptors.request.use(
    (config) => {
      // Add any global request modifications here
      // e.g., add auth token from localStorage or cookies
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for handling common errors
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      // Handle common error cases
      if (error.response?.status === 401) {
        // Handle unauthorized access
        console.warn('Unauthorized access - redirecting to login');
        // You could redirect to login page here
      }
      
      if (error.response?.status === 403) {
        console.warn('Forbidden access');
      }
      
      if (error.response?.status >= 500) {
        console.error('Server error:', error.response.data);
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Export the configured client
export const apiClient = createApiClient();

// Generic API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// Generic error response
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Helper function for handling API responses
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// Helper function for handling API errors
export const handleApiError = (error: any): ApiError => {
  if (error.response?.data) {
    return {
      message: error.response.data.message || 'An error occurred',
      code: error.response.data.code,
      details: error.response.data.details,
    };
  }
  
  if (error.request) {
    return {
      message: 'Network error - please check your connection',
    };
  }
  
  return {
    message: error.message || 'An unexpected error occurred',
  };
};

