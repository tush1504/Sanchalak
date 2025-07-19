// src/pages/Member/MyTasks.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  PlayArrow,
  AccessTime,
  Star,
  EmojiEvents,
} from '@mui/icons-material';

// Stores
import useTaskStore from '../../store/taskStore';
import useDashboardStore from '../../store/dashboardStore';

// Components
import TaskHeroHeader from '../../components/member/TaskHeroHeader';
import TaskStatCard from '../../components/member/TaskStatCard';
import PerformanceOverview from '../../components/member/PerformanceOverview';
import TaskSearchFilter from '../../components/member/TaskSearchFilter';
import MemberTaskCard from '../../components/member/MemberTaskCard'; // Your existing component

const MyTasks = () => {
  const {
    myTasks,
    isLoading,
    isActionLoading,
    error,
    fetchMyTasks,
    updateTaskStatus,
    needsRefresh,
    refreshTasks,
    clearError,
  } = useTaskStore();

  const { refreshDashboard } = useDashboardStore();

  // Local state for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Fetch tasks on component mount
  useEffect(() => {
    if (needsRefresh() || myTasks.length === 0) {
      fetchMyTasks();
    }
  }, [fetchMyTasks, needsRefresh, myTasks.length]);

  // Clear error on mount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Calculate task statistics
  const getTaskStats = () => {
    const allTasks = myTasks || [];
    
    const total = allTasks.length;
    const completed = allTasks.filter(task => task.status === 'Completed').length;
    const inProgress = allTasks.filter(task => task.status === 'In-Progress').length;
    const pending = allTasks.filter(task => task.status === 'Pending').length;
    
    // Calculate overdue tasks
    const now = new Date();
    const overdue = allTasks.filter(task => {
      if (!task.deadline && !task.due) return false;
      const deadline = new Date(task.deadline || task.due);
      return deadline < now && task.status !== 'Completed';
    }).length;

    return { total, completed, inProgress, pending, overdue };
  };

  // Filter and search tasks
  const getFilteredTasks = () => {
    let filteredTasks = myTasks;

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filteredTasks;
  };

  // Event handlers
  const handleRefresh = async () => {
    await refreshTasks(true); // true for myTasks
    await refreshDashboard('member');
  };

  const handleUpdateTaskStatus = async (taskId, statusData) => {
    const result = await updateTaskStatus(taskId, statusData);
    if (result.success) {
      await refreshDashboard('member');
    }
    return result;
  };

  // Get computed values
  const taskStats = getTaskStats();
  const filteredTasks = getFilteredTasks();
  const completionPercentage = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Hero Header */}
      <TaskHeroHeader isLoading={isLoading} onRefresh={handleRefresh} />

      {/* Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <TaskStatCard
            title="Assigned Tasks"
            value={taskStats.total}
            icon={<Assignment />}
            color="#2196F3"
            subtitle="Total tasks assigned to you"
            percentage={taskStats.total > 0 ? 100 : 0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TaskStatCard
            title="In Progress"
            value={taskStats.inProgress}
            icon={<PlayArrow />}
            color="#FF9800"
            subtitle="Currently working on"
            percentage={taskStats.total > 0 ? Math.round((taskStats.inProgress / taskStats.total) * 100) : 0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TaskStatCard
            title="Completed"
            value={taskStats.completed}
            icon={<CheckCircle />}
            color="#4CAF50"
            subtitle="Successfully finished"
            percentage={completionPercentage}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TaskStatCard
            title="Overdue"
            value={taskStats.overdue}
            icon={<AccessTime />}
            color="#F44336"
            subtitle="Tasks past deadline"
            percentage={taskStats.total > 0 ? Math.round((taskStats.overdue / taskStats.total) * 100) : 0}
          />
        </Grid>
      </Grid>

      {/* Performance Overview */}
      <PerformanceOverview completionPercentage={completionPercentage} taskStats={taskStats} />

      {/* Search and Filter */}
      <TaskSearchFilter 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter} 
        setPriorityFilter={setPriorityFilter}
      />

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4,
            borderRadius: '15px',
            border: '2px solid #fca5a5',
            bgcolor: '#fef2f2',
            fontSize: '1.1rem',
            fontWeight: 600,
          }} 
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && myTasks.length === 0 && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            bgcolor: 'white',
            borderRadius: '25px',
            border: '2px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          }}
        >
          <CircularProgress size={80} sx={{ mb: 3, color: '#9C27B0' }} />
          <Typography variant="h5" sx={{ color: '#475569', fontWeight: 600 }}>
            Loading your tasks...
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
            Please wait while we fetch your assignments
          </Typography>
        </Box>
      )}

      {/* Tasks Grid */}
      {!isLoading || myTasks.length > 0 ? (
        <Box>
          {filteredTasks.length > 0 ? (
            <>
              {/* Results Header */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 4,
                  p: 3,
                  bgcolor: 'white',
                  borderRadius: '15px',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                }}
              >
                <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 700 }}>
                  📝 My Tasks ({filteredTasks.length} tasks)
                </Typography>
                <Chip 
                  label={`${Math.round((filteredTasks.length / Math.max(myTasks.length, 1)) * 100)}% shown`}
                  sx={{ 
                    bgcolor: '#f3e8ff', 
                    color: '#7c3aed', 
                    fontWeight: 700,
                    fontSize: '1rem',
                    height: '40px',
                  }}
                />
              </Box>

              {/* Task Cards Grid */}
              <Grid container spacing={4}>
                {filteredTasks.map((task) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={task._id || task.id}>
                    <MemberTaskCard
                      task={task}
                      onUpdateStatus={handleUpdateTaskStatus}
                      isActionLoading={isActionLoading}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            /* Empty State */
            <Paper 
              sx={{ 
                p: 8, 
                textAlign: 'center', 
                borderRadius: '25px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: '3px dashed #cbd5e1',
                boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
              }}
            >
              <Assignment sx={{ fontSize: 150, color: '#94a3b8', mb: 4 }} />
              <Typography variant="h3" sx={{ color: '#475569', mb: 3, fontWeight: 800 }}>
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? '🔍 No Tasks Found'
                  : '📝 No Tasks Assigned Yet'
                }
              </Typography>
              <Typography variant="h6" sx={{ color: '#64748b', mb: 5, maxWidth: 500, mx: 'auto' }}>
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your search terms or filters to find the tasks you\'re looking for.'
                  : 'Your task list is empty right now. When your team leader assigns tasks, they\'ll appear here for you to track and complete.'
                }
              </Typography>
              {(!searchTerm && statusFilter === 'all' && priorityFilter === 'all') && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<Star />}
                    label="Ready for new challenges"
                    sx={{ 
                      bgcolor: '#f3e8ff', 
                      color: '#7c3aed',
                      fontWeight: 600,
                      fontSize: '1rem',
                      py: 2,
                      px: 3,
                    }}
                  />
                  <Chip 
                    icon={<EmojiEvents />}
                    label="Waiting for assignments"
                    sx={{ 
                      bgcolor: '#fef3c7', 
                      color: '#d97706',
                      fontWeight: 600,
                      fontSize: '1rem',
                      py: 2,
                      px: 3,
                    }}
                  />
                </Box>
              )}
            </Paper>
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default MyTasks;