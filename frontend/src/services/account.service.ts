import api from './api';
import { Account } from '../types';

export interface CreateAccountData {
  name: string;
  type: Account['type'];
  balance: number;
  currency?: string;
  description?: string;
}

const accountService = {
  getAccounts: async () => {
    const response = await api.get<Account[]>('/accounts');
    return response.data;
  },

  getAccount: async (id: number) => {
    const response = await api.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  createAccount: async (data: CreateAccountData) => {
    const response = await api.post<Account>('/accounts', data);
    return response.data;
  },

  updateAccount: async (id: number, data: Partial<CreateAccountData>) => {
    const response = await api.put<Account>(`/accounts/${id}`, data);
    return response.data;
  },

  deleteAccount: async (id: number) => {
    await api.delete(`/accounts/${id}`);
  },
};

export default accountService; 