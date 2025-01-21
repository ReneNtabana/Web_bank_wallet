import api from './api';
import { Budget, CreateBudgetDto } from '../types';

export const budgetService = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get('/budgets');
    const statusResponse = await api.get('/budgets/status');
    const budgetStatus = statusResponse.data;
    
    return response.data.map((budget: Budget) => {
      const status = budgetStatus.find((s: any) => s.id === budget._id);
      return {
        ...budget,
        currentSpending: status?.spent || 0
      };
    });
  },

  getById: async (id: string): Promise<Budget> => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  create: async (data: CreateBudgetDto): Promise<Budget> => {
    console.log('Budget service sending:', data);
    const formattedData = {
      categoryId: data.category,
      amount: data.amount,
      period: data.period,
      startDate: data.startDate,
      endDate: data.endDate,
      notifications: {
        enabled: data.notifications?.enabled || false,
        threshold: data.notifications?.threshold || 80
      }
    };
    const response = await api.post('/budgets', formattedData);
    console.log('Budget service response:', response.data);
    return response.data;
  },

  update: async (id: string, data: Partial<Budget>): Promise<Budget> => {
    const formattedData = {
      ...data,
      categoryId: data.category?._id,
      notifications: data.notifications && {
        enabled: data.notifications.enabled,
        threshold: data.notifications.threshold || 80
      }
    };
    const response = await api.put(`/budgets/${id}`, formattedData);
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