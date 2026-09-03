import api from './api';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  uploadProfileImage: (formData) =>
    api.post('/users/upload-profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const companyService = {
  getCompanies: () => api.get('/companies'),
  getAllCompanies: (params) => api.get('/companies/all', { params }),
  createCompany: (data) => api.post('/companies', data),
  updateCompany: (id, data) => api.put(`/companies/${id}`, data),
  deleteCompany: (id) => api.delete(`/companies/${id}`),
};

export const valuationService = {
  create: (formData) =>
    api.post('/valuations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: (params) => api.get('/valuations', { params }),
  getById: (id) => api.get(`/valuations/${id}`),
  getAvailable: (params) => api.get('/valuations/available', { params }),
  inspect: (id, data) => api.put(`/valuations/${id}/inspect`, data),
  finalDecision: (id, data) => api.put(`/valuations/${id}/final-decision`, data),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getManagers: (params) => api.get('/admin/managers', { params }),
  createManager: (data) => api.post('/admin/managers', data),
  updateManager: (id, data) => api.put(`/admin/managers/${id}`, data),
  deleteManager: (id) => api.delete(`/admin/managers/${id}`),
  getPerformance: (params) => api.get('/admin/performance', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
};

export const reportService = {
  download: async (id) => {
    const response = await api.get(`/reports/${id}/download`, { responseType: 'blob' });
    const blobUrl = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = blobUrl;

    const disposition = response.headers['content-disposition'] || '';
    const match = disposition.match(/filename="?([^";]+)"?/i);
    link.download = match?.[1] || `report-${id}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  },
  view: (id) => `http://localhost:5000/api/reports/${id}/view`,
  openView: async (id) => {
    const response = await api.get(`/reports/${id}/view`, { responseType: 'blob' });
    const blobUrl = URL.createObjectURL(response.data);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000);
  },
};

export const imageUrl = (path) => path ? `http://localhost:5000${path}` : null;

// Ensure image URLs are absolute when stored as full URLs
export const toImageUrl = (path) => {
  if (!path) return null;
  if (typeof path !== 'string') return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://localhost:5000${path}`;
};
