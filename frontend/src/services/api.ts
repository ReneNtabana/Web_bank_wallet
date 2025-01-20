import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-bank-wallet.onrender.com/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const { token } = JSON.parse(userData);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;