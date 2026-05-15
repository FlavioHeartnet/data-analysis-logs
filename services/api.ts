/**
 * API Client Configuration
 * Uses axios with interceptors for auth tokens
 */

import axios from 'axios';

// In production, this would be your backend URL
const API_BASE_URL = 'https://api.observasync.dev/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // In production, we'd get the token from secure storage
    // For mock, we'll use a fake token
    const token = 'mock-jwt-token';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - redirect to login
      // In production: clear token, navigate to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
