import api from './api';
import { Account, CreateAccountDto, UpdateAccountDto } from '../types';

export const accountService = {
  getAll: async (): Promise<Account[]> => {
    const response = await api.get('/accounts');
    return response.data;
  },

  getById: async (id: string): Promise<Account> => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountDto): Promise<Account> => {
    const response = await api.post('/accounts', data);
    return response.data;
  },

  update: async (id: string, data: UpdateAccountDto): Promise<Account> => {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  }
}; 