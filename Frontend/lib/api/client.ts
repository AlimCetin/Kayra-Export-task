import axios from 'axios';
import Cookies from 'js-cookie';

const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:5001/api';
const PRODUCT_API_URL = process.env.NEXT_PUBLIC_PRODUCT_API_URL || 'http://localhost:5000/api';

// Auth API Client
export const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API Client
export const productApi = axios.create({
  baseURL: PRODUCT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to Product API requests
productApi.interceptors.request.use(
  (config) => {
    // Try to get token from cookie
    let token = Cookies.get('token');
    
    // If token exists, always add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // If no token in cookie, try localStorage as fallback
      if (typeof window !== 'undefined') {
        const localToken = localStorage.getItem('token');
        if (localToken) {
          token = localToken;
          config.headers.Authorization = `Bearer ${token}`;
          // Sync to cookie for consistency
          Cookies.set('token', token, { expires: 7 });
        }
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
productApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove token from both cookie and localStorage
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      window.location.href = '/tr/login';
    }
    return Promise.reject(error);
  }
);

