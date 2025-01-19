import api from './api';
import { Budget, CreateBudgetData } from '../types';

const budgetService = {
  getBudgets: async () => {
    const response = await api.get<Budget[]>('/budgets');
    return response.data;
  },

  getBudget: async (id: number) => {
    const response = await api.get<Budget>(`/budgets/${id}`);
    return response.data;
  },

  createBudget: async (data: CreateBudgetData) => {
    const response = await api.post<Budget>('/budgets', data);
    return response.data;
  },

  updateBudget: async (id: number, data: Partial<CreateBudgetData>) => {
    const response = await api.put<Budget>(`/budgets/${id}`, data);
    return response.data;
  },

  deleteBudget: async (id: number) => {
    await api.delete(`/budgets/${id}`);
  },

  getBudgetStatus: async () => {
    const response = await api.get('/budgets/status');
    return response.data;
  }
};

export default budgetService; 