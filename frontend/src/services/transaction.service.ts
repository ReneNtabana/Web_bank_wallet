import api from './api';
import { Transaction, CreateTransactionDto, UpdateTransactionDto } from '../types';
import { accountService } from './account.service';

export const transactionService = {
  getAll: async (params?: { limit?: number }): Promise<Transaction[]> => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post('/transactions', data);
    
    // If it's a transfer, update both accounts
    if (data.type === 'transfer' && data.toAccount) {
      await Promise.all([
        accountService.update(data.account, { balance: -data.amount }),
        accountService.update(data.toAccount, { balance: data.amount })
      ]);
    } else {
      // For regular transactions, just update one account
      const amount = data.type === 'income' ? data.amount : -data.amount;
      await accountService.update(data.account, { balance: amount });
    }
    
    return response.data;
  },

  update: async (id: string, data: UpdateTransactionDto): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  getByAccount: async (accountId: string): Promise<Transaction[]> => {
    const response = await api.get(`/transactions/account/${accountId}`);
    return response.data;
  }
};

export default transactionService; 