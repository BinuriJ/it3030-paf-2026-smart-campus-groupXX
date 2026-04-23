import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchReports() {
  const response = await api.get('/reports');
  return response.data;
}

export async function createReport(report) {
  const response = await api.post('/reports', report);
  return response.data;
}
