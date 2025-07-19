// src/store/authStore.js
import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  
  // Initialize auth state from localStorage
  initializeAuth: () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          token,
          user,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      // Clear corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  // Login action
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(credentials);
      
      // Handle your backend's response format: { success: { token, user }, data: null }
      const responseData = response.data.success || response.data;
      const { token, user } = responseData;
      
      // Ensure we have valid data
      if (token && user) {
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update state
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        return { success: true, data: responseData };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  },

  // Signup action (for leaders)
  signup: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.signupLeader(userData);
      set({ isLoading: false });
      
      // Handle your backend's response format
      const responseData = response.data.success || response.data;
      
      return { success: true, data: responseData };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Signup failed' 
      };
    }
  },

  // Logout action
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset state
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await authAPI.getCurrentUser();
      const user = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
      
      return { success: true, data: user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to get user info' 
      };
    }
  },

  // Utility getters
  isLeader: () => {
    const { user } = get();
    return user?.role === 'leader';
  },

  isMember: () => {
    const { user } = get();
    return user?.role === 'member';
  },

  getUserRole: () => {
    const { user } = get();
    return user?.role || null;
  },

  getUserId: () => {
    const { user } = get();
    return user?.id || user?._id || null;
  },

  getUserName: () => {
    const { user } = get();
    return user?.name || user?.username || 'User';
  },

  getUserEmail: () => {
    const { user } = get();
    return user?.email || '';
  },
}));

export default useAuthStore;