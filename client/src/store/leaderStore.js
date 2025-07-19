// src/store/teamStore.js
import { create } from 'zustand';
import { teamAPI } from '../services/api';
import { toast } from 'react-toastify';

const useLeaderStore = create((set, get) => ({
  // State
  members: [],
  isLoading: false,
  isActionLoading: false, // For add/remove operations
  error: null,
  lastFetched: null,

  // Actions
  fetchAllMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await teamAPI.getAllMembers();
      const data = response.data;
      
      // Handle your backend format: { success: true, count: X, teamMembers: [...] }
      const members = data.teamMembers || [];
      
      set({
        members: members,
        isLoading: false,
        lastFetched: new Date(),
        error: null,
      });
      
      return { success: true, data: members };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch team members';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  addMember: async (memberData) => {
    set({ isActionLoading: true, error: null });
    try {
      const response = await teamAPI.addMember(memberData);
      const data = response.data;
      
      if (data.success) {
        // Add the new member to the current list
        const newMember = data.member;
        set((state) => ({
          members: [...state.members, newMember],
          isActionLoading: false,
        }));
        
        toast.success(data.message || 'Member added successfully!');
        return { success: true, data: newMember };
      } else {
        throw new Error(data.message || 'Failed to add member');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add member';
      set({
        isActionLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  removeMember: async (memberId) => {
    set({ isActionLoading: true, error: null });
    try {
      const response = await teamAPI.removeMember(memberId);
      const data = response.data;
      
      if (data.success) {
        // Remove the member from the current list
        set((state) => ({
          members: state.members.filter(member => member._id !== memberId),
          isActionLoading: false,
        }));
        
        toast.success(data.message || 'Member removed successfully!');
        return { success: true };
      } else {
        throw new Error(data.message || 'Failed to remove member');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove member';
      set({
        isActionLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Search and filter members
  searchMembers: (searchTerm) => {
    const { members } = get();
    if (!searchTerm) return members;
    
    return members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  filterMembersByRole: (role) => {
    const { members } = get();
    if (!role || role === 'all') return members;
    
    return members.filter(member => member.role === role);
  },

  // Get member by ID
  getMemberById: (memberId) => {
    const { members } = get();
    return members.find(member => member._id === memberId);
  },

  // Get member count
  getMemberCount: () => {
    const { members } = get();
    return members.length;
  },

  // Get members by role count
  getMembersByRoleCount: () => {
    const { members } = get();
    return {
      total: members.length,
      leaders: members.filter(m => m.role === 'leader').length,
      members: members.filter(m => m.role === 'member').length,
    };
  },

  // Check if data needs refresh (older than 5 minutes)
  needsRefresh: () => {
    const { lastFetched } = get();
    if (!lastFetched) return true;
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastFetched < fiveMinutesAgo;
  },

  // Refresh members data
  refreshMembers: async () => {
    return await get().fetchAllMembers();
  },

  // Clear store data
  clearMembers: () => {
    set({
      members: [],
      error: null,
      lastFetched: null,
    });
  },

  // Set error
  setError: (error) => {
    set({ error });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useLeaderStore;