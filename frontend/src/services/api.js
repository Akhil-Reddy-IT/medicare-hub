import axios from 'axios';

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://medicare-hub-backend.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Inject Bearer token to request headers if logged in
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Unified endpoint requests helper
export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me')
};

export const doctorService = {
  list: (params) => API.get('/doctors', { params }),
  get: (id) => API.get(`/doctors/${id}`),
  getByUserId: (userId) => API.get(`/doctors/user/${userId}`),
  update: (id, data) => API.put(`/doctors/${id}`, data)
};

export const appointmentService = {
  create: (data) => API.post('/appointments', data),
  list: () => API.get('/appointments'),
  update: (id, data) => API.put(`/appointments/${id}`, data),
  delete: (id) => API.delete(`/appointments/${id}`)
};

export const recordService = {
  upload: (formData) => API.post('/records/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  list: (params) => API.get('/records', { params }),
  delete: (id) => API.delete(`/records/${id}`)
};

export const aiService = {
  symptomAnalysis: (symptoms) => API.post('/ai/symptom-analysis', { symptoms }),
  reportSummary: (data) => API.post('/ai/report-summary', data),
  healthInformation: (question) => API.post('/ai/health-information', { question }),
  wellnessRecommendations: (lifestyle) => API.post('/ai/wellness-recommendations', { lifestyle }),
  history: () => API.get('/ai/history')
};

export const adminService = {
  stats: () => API.get('/admin/stats'),
  usersList: (params) => API.get('/admin/users', { params }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`)
};
