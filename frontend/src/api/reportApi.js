import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchReports() {
  const response = await api.get('/reports');
  return response.data;
}

export async function createReport(report) {
  const response = await api.post('/reports', report);
  return response.data;
}
