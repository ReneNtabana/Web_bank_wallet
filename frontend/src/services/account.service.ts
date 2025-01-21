import api from './api';
import { Account, CreateAccountDto, UpdateAccountDto } from '../types';

export const accountService = {
  getAll: async (): Promise<Account[]> => {
    const response = await api.get('/accounts');
    // Get latest balances for each account
    const accountsWithBalances = await Promise.all(
      response.data.map(async (account: Account) => {
        const currentAccount = await accountService.getById(account._id);
        return {
          ...account,
          balance: currentAccount.balance
        };
      })
    );
    return accountsWithBalances;
  },

  getById: async (id: string): Promise<Account> => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountDto): Promise<Account> => {
    const response = await api.post('/accounts', data);
    console.log('Accounts creation:', response.data);
    return response.data;
  },

  update: async (id: string, data: UpdateAccountDto): Promise<Account> => {
    // Get current account data first
    const currentAccount = await accountService.getById(id);
    
    const response = await api.put(`/accounts/${id}`, {
      ...currentAccount,
      ...data,
      balance: currentAccount.balance + (data.balance || 0)
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  }
}; 