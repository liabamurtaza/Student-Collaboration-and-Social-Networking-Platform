import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

// Request interceptor to automatically add the token to headers
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage (or wherever you store it)
    const token = localStorage.getItem('token');
    
    // If a token exists, append it to the Authorization header
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