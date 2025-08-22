// client/src/lib/auth.ts
import api from './api';

export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  signup: async (data: {
    username: string;
    password: string;
    shopNames: string[];
  }) => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    // Token is automatically stored by api interceptor
    return response.data;
  },

  login: async (data: {
    username: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    // Token is automatically stored by api interceptor
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local token
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  validate: async () => {
    const response = await api.get('/auth/validate');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  getToken: () => {
    return localStorage.getItem('auth_token');
  }
};
