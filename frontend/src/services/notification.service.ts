import api from './api';

export interface Notification {
  _id: string;
  user: string;
  type: 'budget' | 'transaction';
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
 budget?: {
     id: string;
     amount: number;
    spent: number;
    remaining: number;
    period: string;
  };
}

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  }
}; 