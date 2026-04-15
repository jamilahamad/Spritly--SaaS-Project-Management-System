import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    const publicAuthRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/forgot-password'
    ];

    const isResetPasswordRoute =
      config.url && config.url.startsWith('/auth/reset-password/');

    const shouldSkipToken =
      publicAuthRoutes.includes(config.url) || isResetPasswordRoute;

    if (token && !shouldSkipToken) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;