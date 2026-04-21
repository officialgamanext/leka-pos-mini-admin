import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// For local dev, we might not have tokens, but we added the middleware.
// If there's a token in localStorage, use it.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Add admin secret for development access
  config.headers['x-admin-secret'] = 'leka-admin-bypass-2024';
  return config;
});

export const adminApi = {
  getUsers: (page = 1, limit = 20) => api.get(`/admin/users?page=${page}&limit=${limit}`),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  
  getBusinesses: (page = 1, limit = 20) => api.get(`/admin/businesses?page=${page}&limit=${limit}`),
  getBusinessDetails: (ownerId, bizId) => api.get(`/admin/business/${ownerId}/${bizId}/details`),
  updateBusiness: (ownerId, bizId, data) => api.patch(`/admin/business/${ownerId}/${bizId}`, data),
  deleteBusiness: (ownerId, bizId) => api.delete(`/admin/business/${ownerId}/${bizId}`),
  
  getAllStaff: () => api.get('/admin/all-staff'),
};

export default api;
