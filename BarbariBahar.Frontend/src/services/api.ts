// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    // Prioritize tokens based on the current context of the app if possible,
    // but for simplicity, we check for them in a specific order.
    // Admin > Driver > Customer
    const adminToken = localStorage.getItem('admin_token');
    const driverToken = localStorage.getItem('driver_token');
    const customerToken = localStorage.getItem('customer_token');

    const token = adminToken || driverToken || customerToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
