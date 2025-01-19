import api from './api';
import { Transaction } from '../types';

export interface CreateTransactionData {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  accountId: number;
  categoryId: number;
  description?: string;
  date?: Date;
}

const transactionService = {
  getTransactions: async (params?: { 
    limit?: number; 
    offset?: number;
    startDate?: Date;
    endDate?: Date;
    type?: 'income' | 'expense' | 'transfer';
    accountId?: number;
    categoryId?: number;
  }) => {
    const response = await api.get<Transaction[]>('/transactions', { params });
    return response.data;
  },

  getTransaction: async (id: number) => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data: CreateTransactionData) => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },

  updateTransaction: async (id: number, data: Partial<CreateTransactionData>) => {
    const response = await api.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: number) => {
    await api.delete(`/transactions/${id}`);
  },
};

export default transactionService; 