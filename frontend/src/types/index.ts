export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
  createdAt: string;
  updatedAt: string;
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
  _id: string;
  user: string;
  name: string;
  type: 'bank' | 'cash' | 'mobile_money' | 'other';
  balance: number;
  currency: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  name: string;
  type: 'bank' | 'cash' | 'mobile_money' | 'other';
  balance: number;
  currency?: string;
  description?: string;
}

export interface UpdateAccountDto {
  name?: string;
  type?: 'bank' | 'cash' | 'mobile_money' | 'other';
  balance?: number;
  currency?: string;
  description?: string;
  isActive?: boolean;
}

export interface Transaction {
  _id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  date: string;
  account: {
    _id: string;
    name: string;
    type: string;
  };
  category: {
    _id: string;
    name: string;
    type?: string;
    icon?: string;
    color?: string;
  };
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  account: {
    _id: string;
    name: string;
    type: string;
  };
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  description: string;
  category: string;
  date: string;
}

export interface UpdateTransactionDto {
  account: string;
  toAccount?: string;
  category?: string;
  amount?: number;
  type?: 'income' | 'expense' | 'transfer';
  description?: string;
  date?: string | undefined;
}

export interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  user?: string;
  icon?: string;
  color?: string;
}

export interface CreateCategoryDto {
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  type?: 'income' | 'expense';
  color?: string;
  icon?: string;
  isActive?: boolean;
}

export interface Budget {
  _id: string;
  category: {
    _id: string;
    name: string;
    type: string;
    color?: string;
  };
  amount: number;
  period: string;
  startDate: string;
  endDate: string;
  notifications: {
    enabled: boolean;
    threshold: number;
  };
  currentSpending: number;
  isActive: boolean;
}

export interface CreateBudgetDto {
  category: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  notifications?: {
    enabled: boolean;
    threshold: number;
  };
}

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