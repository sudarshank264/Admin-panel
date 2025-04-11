
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://35.244.11.78:9101/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically include the token for all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
