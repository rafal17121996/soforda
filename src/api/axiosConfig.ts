import axios from 'axios';

const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://192.168.100.3:8000',
  baseURL:  'https://app.sofortda-gmbh.de',
  timeout: 10000, 
});

// Dodawanie interceptorów, jeśli potrzebujesz
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;