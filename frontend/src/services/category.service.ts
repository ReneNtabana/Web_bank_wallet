import api from './api';
import { Category } from '../types';

export interface CreateCategoryData {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  parentId?: number;
}

const categoryService = {
  getCategories: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  getCategory: async (id: number) => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: CreateCategoryData) => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: Partial<CreateCategoryData>) => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    await api.delete(`/categories/${id}`);
  },
};

export default categoryService; 