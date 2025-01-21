import api from './api';
import { Transaction, CreateTransactionDto, UpdateTransactionDto } from '../types';
import { accountService } from './account.service';

export const transactionService = {
  getAll: async (params?: { limit?: number }): Promise<Transaction[]> => {
    const response = await api.get('/transactions', { params });
    console.log('Transactions response:', response.data);
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const formattedData = {
      accountId: data.account._id,    
      categoryId: data.category,      
      amount: data.amount,            
      type: data.type,               
      description: data.description,  
      date: data.date               
    };

    const response = await api.post('/transactions', formattedData);
    
    if (data.type === 'transfer' && data.account._id) {
      await Promise.all([
        accountService.update(data.account._id, { balance: -data.amount, name: data.account.name }),
        accountService.update(data.account._id, { balance: data.amount, name: data.account.name })
      ]);
    } else {
      const amount = data.type === 'income' ? data.amount : -data.amount;
      await accountService.update(data.account._id, { balance: amount, name: data.account.name });
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