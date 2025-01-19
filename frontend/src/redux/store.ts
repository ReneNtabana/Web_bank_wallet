import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 