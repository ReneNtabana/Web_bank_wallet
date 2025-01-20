import api from './api';
import { Budget, CreateBudgetDto } from '../types';

export const budgetService = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get('/budgets');
    return response.data;
  },

  getById: async (id: string): Promise<Budget> => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  create: async (data: CreateBudgetDto): Promise<Budget> => {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateBudgetDto>): Promise<Budget> => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },

  getBudgetStatus: async () => {
    const response = await api.get('/budgets/status');
    return response.data;
  }
}; 