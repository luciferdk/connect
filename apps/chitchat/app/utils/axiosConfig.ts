// utils/axiosConfig.ts

import axios from 'axios';

// Create axios instance with cookie support
const axiosInstance = axios.create({
  // ✅ Correct baseURL to the root of your API
  baseURL: 'http://192.168.1.12:8080',
  withCredentials: true,
});

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '../pages/HomePage';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
