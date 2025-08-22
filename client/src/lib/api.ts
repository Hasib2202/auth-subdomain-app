// client/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://auth-subdomain-server.onrender.com',
  withCredentials: true,
});

// Add request interceptor to include token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token updates
api.interceptors.response.use(
  (response) => {
    // If response contains access_token, store it
    if (response.data?.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
    }
    return response;
  },
  (error) => {
    // If we get 401, clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Only redirect if we're not already on login/signup pages
      if (typeof window !== 'undefined' &&
        !window.location.pathname.includes('/signin') &&
        !window.location.pathname.includes('/signup')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;