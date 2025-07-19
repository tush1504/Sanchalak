// src/store/dashboardStore.js
import { create } from 'zustand';
import { dashboardAPI } from '../services/api';

const useDashboardStore = create((set, get) => ({
  // State
  dashboardData: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  // Actions
  fetchLeaderDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardAPI.getLeaderDashboard();
      const data = response.data.success; // Your backend format: { success: {...}, data: null }
      
      set({
        dashboardData: data,
        isLoading: false,
        lastFetched: new Date(),
        error: null,
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard data';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  fetchMemberDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardAPI.getMemberDashboard();
      const data = response.data.success; // Your backend format: { success: {...}, data: null }
      
      set({
        dashboardData: data,
        isLoading: false,
        lastFetched: new Date(),
        error: null,
      });
      
      return { success: true, data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard data';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  // Refresh dashboard data
  refreshDashboard: async (userRole) => {
    if (userRole === 'leader') {
      return await get().fetchLeaderDashboard();
    } else if (userRole === 'member') {
      return await get().fetchMemberDashboard();
    }
    return { success: false, error: 'Invalid user role' };
  },

  // Clear dashboard data
  clearDashboard: () => {
    set({
      dashboardData: null,
      error: null,
      lastFetched: null,
    });
  },

  // Check if data needs refresh (older than 5 minutes)
  needsRefresh: () => {
    const { lastFetched } = get();
    if (!lastFetched) return true;
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastFetched < fiveMinutesAgo;
  },

  // Get specific dashboard stats
  getStats: () => {
    const { dashboardData } = get();
    return dashboardData?.stats || null;
  },

  getRecentActivities: () => {
    const { dashboardData } = get();
    return dashboardData?.recentActivities || [];
  },

  getPerformance: () => {
    const { dashboardData } = get();
    return dashboardData?.performance || null;
  },

  getUpcomingTasks: () => {
    const { dashboardData } = get();
    return dashboardData?.upcomingTasks || [];
  },

  getRecentCompletions: () => {
    const { dashboardData } = get();
    return dashboardData?.recentCompletions || [];
  },

  getTaskBreakdown: () => {
    const { dashboardData } = get();
    return dashboardData?.taskBreakdown || null;
  },

  getTeamMembers: () => {
    const { dashboardData } = get();
    return dashboardData?.teamMembers || [];
  },
}));

export default useDashboardStore;