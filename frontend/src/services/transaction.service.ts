import api from './api';
import { Transaction } from '../types';
import accountService from './account.service';

export interface CreateTransactionData {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  accountId: number;
  categoryId: number;
  description?: string;
  date?: Date;
  toAccountId?: number;
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

  createTransaction: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await api.post('/transactions', data);
    
    // If it's a transfer, update both accounts
    if (data.type === 'transfer' && data.toAccountId) {
      await Promise.all([
        accountService.updateAccount(data.accountId, { balance: -data.amount }),
        accountService.updateAccount(data.toAccountId, { balance: data.amount })
      ]);
    } else {
      // For regular transactions, just update one account
      const amount = data.type === 'income' ? data.amount : -data.amount;
      await accountService.updateAccount(data.accountId, { balance: amount });
    }
    
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