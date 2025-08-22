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
    return response.data;
  },

  login: async (data: {
    username: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  validate: async () => {
    const response = await api.get('/auth/validate');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
};
