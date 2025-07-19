// src/store/activityStore.js
import { create } from 'zustand';
import { teamAPI } from '../services/api';
import { toast } from 'react-toastify';

const useActivityStore = create((set, get) => ({
  // State
  logs: [],
  loading: false,
  error: null,
  filters: {
    user: '',
    role: '',
    from: '',
    to: '',
    search: ''
  },
  
  // Actions
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setLogs: (logs) => set({ logs }),
  
  setFilters: (filters) => set({ filters }),
  
  updateFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  
  clearFilters: () => set({
    filters: {
      user: '',
      role: '',
      from: '',
      to: '',
      search: ''
    }
  }),
  
  // Fetch activity logs with optional filtering
  fetchActivityLogs: async (customFilters = null) => {
    set({ loading: true, error: null });
    
    try {
      const { filters } = get();
      const queryParams = customFilters || filters;
      
      // Remove empty values and search from API params
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams)
          .filter(([key, value]) => value !== '' && key !== 'search')
      );
      
      const response = await teamAPI.getActivityLogs(filteredParams);
      
      if (response.data.success) {
        set({ 
          logs: response.data.logs || [],
          loading: false 
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch logs');
      }
      
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch activity logs';
      
      set({ 
        error: errorMessage,
        loading: false 
      });
      
      toast.error(errorMessage);
    }
  },
  
  // Apply current filters
  applyFilters: async () => {
    const { filters, fetchActivityLogs } = get();
    await fetchActivityLogs(filters);
  },
  
  // Clear filters and reload all logs
  clearAndReload: async () => {
    const { clearFilters, fetchActivityLogs } = get();
    clearFilters();
    await fetchActivityLogs({});
  },
  
  // Refresh logs with current filters
  refreshLogs: async () => {
    const { filters, fetchActivityLogs } = get();
    await fetchActivityLogs(filters);
  },
  
  // Get filtered logs based on search term (client-side filtering)
  getFilteredLogs: () => {
    const { logs, filters } = get();
    
    if (!filters.search) return logs;
    
    const searchTerm = filters.search.toLowerCase();
    return logs.filter(log => 
      log.user?.name?.toLowerCase().includes(searchTerm) ||
      log.action?.toLowerCase().includes(searchTerm) ||
      log.target?.toLowerCase().includes(searchTerm) ||
      log.user?.email?.toLowerCase().includes(searchTerm)
    );
  },
  
  // Reset store to initial state
  reset: () => set({
    logs: [],
    loading: false,
    error: null,
    filters: {
      user: '',
      role: '',
      from: '',
      to: '',
      search: ''
    }
  })
}));

export default useActivityStore;