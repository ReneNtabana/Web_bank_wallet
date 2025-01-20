import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthState, User, ApiError } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const register = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: ApiError }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: ApiError }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 