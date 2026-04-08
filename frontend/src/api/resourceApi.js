import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchResources(filters) {
  const params = {};
  if (filters.type) params.type = filters.type;
  if (filters.location) params.location = filters.location;
  if (filters.minCapacity) params.minCapacity = filters.minCapacity;
  const response = await api.get('/resources', { params });
  return response.data;
}

export async function createResource(resource) {
  const response = await api.post('/resources', resource);
  return response.data;
}

export async function updateResource(id, resource) {
  const response = await api.put(`/resources/${id}`, resource);
  return response.data;
}

export async function deleteResource(id) {
  await api.delete(`/resources/${id}`);
}
