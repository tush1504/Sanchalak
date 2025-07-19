// src/store/taskStore.js
import { create } from 'zustand';
import { taskAPI } from '../services/api';
import { toast } from 'react-toastify';

const useTaskStore = create((set, get) => ({
  // State
  tasks: [],
  myTasks: [],
  isLoading: false,
  isActionLoading: false,
  error: null,
  lastFetched: null,

  // Leader Actions
  fetchAllTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskAPI.getAllTasks();
      // Your backend returns array directly for getAllTasks
      const tasks = response.data || [];
      
      set({
        tasks: tasks,
        isLoading: false,
        lastFetched: new Date(),
        error: null,
      });
      
      return { success: true, data: tasks };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch tasks';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  createTask: async (taskData) => {
    set({ isActionLoading: true, error: null });
    try {
      const response = await taskAPI.createTask(taskData);
      const data = response.data;
      
      if (data.success) {
        // Add the new task to the current list (convert to getAllTasks format)
        const newTask = {
          id: data.data._id,
          title: data.data.title,
          due: data.data.deadline,
          priority: data.data.priority,
          assignedTo: 'Loading...', // Will be updated on next fetch
          assignee_email: '',
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
          isActionLoading: false,
        }));
        
        // Refresh tasks to get proper assignee info
        await get().fetchAllTasks();
        
        toast.success('Task created successfully! Email sent to assignee.');
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || 'Failed to create task');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create task';
      set({
        isActionLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  deleteTask: async (taskId) => {
    set({ isActionLoading: true, error: null });
    try {
      const response = await taskAPI.deleteTask(taskId);
      const data = response.data;
      
      if (data.success) {
        // Remove the task from the current list
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== taskId),
          isActionLoading: false,
        }));
        
        toast.success(data.message || 'Task deleted successfully!');
        return { success: true };
      } else {
        throw new Error(data.message || 'Failed to delete task');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete task';
      set({
        isActionLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Member Actions
  fetchMyTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskAPI.getMyTasks();
      const data = response.data;
      
      // Your backend returns { success: true, data: [...] }
      const tasks = data.success ? data.data : [];
      
      set({
        myTasks: tasks,
        isLoading: false,
        lastFetched: new Date(),
        error: null,
      });
      
      return { success: true, data: tasks };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch my tasks';
      set({
        isLoading: false,
        error: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  },

  updateTaskStatus: async (taskId, status) => {
    set({ isActionLoading: true, error: null });
    try {
      const response = await taskAPI.updateTaskStatus(taskId, { status });
      const data = response.data;
      
      if (data.success) {
        // Update the task in myTasks list
        set((state) => ({
          myTasks: state.myTasks.map(task => 
            task._id === taskId ? { ...task, status: status } : task
          ),
          isActionLoading: false,
        }));
        
        // Show different messages based on status
        if (status.toLowerCase() === 'completed') {
          toast.success('🎉 Task completed! Your leader has been notified.');
        } else {
          toast.success(`Task status updated to ${status}!`);
        }
        
        return { success: true, data: data.data };
      } else {
        throw new Error(data.message || 'Failed to update task status');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update task status';
      set({
        isActionLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Utility functions
  searchTasks: (searchTerm, isMyTasks = false) => {
    const { tasks, myTasks } = get();
    const taskList = isMyTasks ? myTasks : tasks;
    
    if (!searchTerm) return taskList;
    
    return taskList.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.assignedTo && task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  },

  filterTasksByStatus: (status, isMyTasks = false) => {
    const { tasks, myTasks } = get();
    const taskList = isMyTasks ? myTasks : tasks;
    
    if (!status || status === 'all') return taskList;
    
    return taskList.filter(task => task.status === status);
  },

  filterTasksByPriority: (priority, isMyTasks = false) => {
    const { tasks, myTasks } = get();
    const taskList = isMyTasks ? myTasks : tasks;
    
    if (!priority || priority === 'all') return taskList;
    
    return taskList.filter(task => task.priority === priority);
  },

  getTaskStats: (isMyTasks = false) => {
    const { tasks, myTasks } = get();
    const taskList = isMyTasks ? myTasks : tasks;
    
    return {
      total: taskList.length,
      pending: taskList.filter(task => task.status === 'Pending').length,
      inProgress: taskList.filter(task => task.status === 'In-Progress').length,
      completed: taskList.filter(task => task.status === 'Completed').length,
      high: taskList.filter(task => task.priority === 'High').length,
      medium: taskList.filter(task => task.priority === 'Medium').length,
      low: taskList.filter(task => task.priority === 'Low').length,
      overdue: taskList.filter(task => 
        new Date(task.deadline || task.due) < new Date() && 
        task.status !== 'Completed'
      ).length,
    };
  },

  getTaskById: (taskId, isMyTasks = false) => {
    const { tasks, myTasks } = get();
    const taskList = isMyTasks ? myTasks : tasks;
    return taskList.find(task => (task.id || task._id) === taskId);
  },

  // Check if data needs refresh (older than 5 minutes)
  needsRefresh: () => {
    const { lastFetched } = get();
    if (!lastFetched) return true;
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastFetched < fiveMinutesAgo;
  },

  // Refresh data
  refreshTasks: async (isMyTasks = false) => {
    if (isMyTasks) {
      return await get().fetchMyTasks();
    } else {
      return await get().fetchAllTasks();
    }
  },

  // Clear store data
  clearTasks: () => {
    set({
      tasks: [],
      myTasks: [],
      error: null,
      lastFetched: null,
    });
  },

  // Set/clear error
  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useTaskStore;