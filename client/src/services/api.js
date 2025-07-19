// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Leader signup
  signupLeader: (userData) => api.post('/auth/signup', userData),
  
  // Login (both leader and member)
  login: (credentials) => api.post('/auth/login', credentials),
};

// Team Management API (Leader only)
export const teamAPI = {
  // Get all members under leader
  getAllMembers: () => api.get('/leader/all'),
  
  // Add new member/leader
  addMember: (memberData) => api.post('/leader/add', memberData),
  
  // Remove member
  removeMember: (memberId) => api.delete(`/leader/remove/${memberId}`),
  
  // Get activity logs with optional filtering
  getActivityLogs: (params = {}) => api.get('/leader/log', { params }),
};

// Task Management API
export const taskAPI = {
  // Leader: Get all tasks
  getAllTasks: () => api.get('/task/all'),
  
  // Leader: Create new task
  createTask: (taskData) => api.post('/task/create', taskData),
  
  // Leader: Delete task
  deleteTask: (taskId) => api.delete(`/task/delete/${taskId}`),
  
  // Member: Get assigned tasks
  getMyTasks: () => api.get('/task/mytask'),
  
  // Member: Update task status
  updateTaskStatus: (taskId, statusData) => api.patch(`/task/status/${taskId}`, statusData),
};

// Dashboard API
export const dashboardAPI = {
  // Leader dashboard stats
  getLeaderDashboard: () => api.get('/dashboard/leader'),
  
  // Member dashboard stats  
  getMemberDashboard: () => api.get('/dashboard/member'),
};

export default api;