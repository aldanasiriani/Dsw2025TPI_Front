import axios from 'axios';

const API_URL = 'https://localhost:7138/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // 1. Buscamos si hay un token guardado en el navegador
    const token = localStorage.getItem('token'); 
    
    // 2. Si existe, lo pegamos en la cabecera como 'Bearer ...'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;