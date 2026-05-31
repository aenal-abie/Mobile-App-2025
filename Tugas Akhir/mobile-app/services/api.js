import axios from 'axios';
import storage from '../utils/storage';
import { API_CONFIG } from '../config/constants';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor Request: menambahkan token ke Header secara otomatis
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Gagal mengambil token dari storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor Response: menangani respon error secara global (seperti 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await storage.removeItem('token');
        await storage.removeItem('pengguna');
      } catch (storageError) {
        console.error('Gagal membersihkan storage:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
