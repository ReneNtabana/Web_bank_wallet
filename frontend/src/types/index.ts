export interface User {
  id: number;
  name: string;
  email: string;
  token?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
}

export interface Account {
  id: number;
  name: string;
  type: 'bank' | 'cash' | 'mobile_money' | 'other';
  balance: number;
  currency: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  date: Date;
  category: Category;
  account: Account;
  toAccount?: Account;
  status: 'completed' | 'pending' | 'cancelled';
  accountId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  runningBalance?: number;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  parentId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: number;
  categoryId: number;
  amount: number;
  currentSpending: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  notifications: {
    enabled: boolean;
    threshold?: number;
  };
  isActive: boolean;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetData {
  categoryId: number;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  notifications?: {
    enabled: boolean;
    threshold?: number;
  };
} 