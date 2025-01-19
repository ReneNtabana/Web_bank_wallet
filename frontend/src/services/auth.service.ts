import api from './api';
import { User } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<User>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
};

export default authService; 