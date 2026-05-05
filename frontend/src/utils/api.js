import axios from 'axios';

const defaultUrl = process.env.NODE_ENV === 'production' 
  ? 'https://financetracker-oejz.onrender.com' 
  : 'http://localhost:5000';
const rawUrl = process.env.NEXT_PUBLIC_API_URL || defaultUrl;
const API_URL = `${rawUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')}/api/v1`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
