// client/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://auth-subdomain-server.onrender.com',
  withCredentials: true,
});

// Add request interceptor to include token in headers
api.interceptors.request.use((config) => {
  // Only access localStorage on client side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Debug logging for production issues
  if (process.env.NODE_ENV === 'production') {
    console.log('🔍 API Request:', {
      url: config.url,
      method: config.method,
      hasAuth: !!config.headers.Authorization,
      withCredentials: config.withCredentials
    });
  }

  return config;
});

// Add response interceptor to handle token updates
api.interceptors.response.use(
  (response) => {
    // Debug logging for production issues
    if (process.env.NODE_ENV === 'production') {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        hasToken: !!response.data?.access_token
      });
    }

    // If response contains access_token, store it (only on client side)
    if (typeof window !== 'undefined' && response.data?.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      console.log('🔑 Token stored in localStorage');
    }

    // If logout response asks to clear token
    if (typeof window !== 'undefined' && response.data?.clearToken) {
      localStorage.removeItem('auth_token');
      console.log('🗑️ Token cleared from localStorage');
    }

    return response;
  },
  (error) => {
    // Debug logging for production issues
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message
      });
    }

    // If we get 401, clear token and redirect to login (only on client side)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      console.log('🚫 401 Error - clearing token and redirecting');
      localStorage.removeItem('auth_token');
      // Only redirect if we're not already on login/signup pages
      if (!window.location.pathname.includes('/signin') &&
        !window.location.pathname.includes('/signup')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;