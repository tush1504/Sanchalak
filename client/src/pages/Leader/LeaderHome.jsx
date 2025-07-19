// src/pages/Leader/LeaderHome.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  Add,
  Refresh,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import useDashboardStore from '../../store/dashboardStore';
import useAuthStore from '../../store/authStore';
import useLeaderStore from '../../store/leaderStore';
import useTaskStore from '../../store/taskStore';
import AddMemberModal from '../../components/leader/AddMemberModal';
import CreateTaskModal from '../../components/leader/CreateTaskModal';

const LeaderHome = () => {
  const { user } = useAuthStore();
  const {
    dashboardData,
    isLoading,
    error,
    fetchLeaderDashboard,
    refreshDashboard,
    needsRefresh,
    getStats,
    getRecentActivities,
    getPerformance,
  } = useDashboardStore();

  const { addMember } = useLeaderStore();
  const { createTask } = useTaskStore();

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch dashboard data on component mount
  useEffect(() => {
    if (needsRefresh()) {
      fetchLeaderDashboard();
    }
  }, [fetchLeaderDashboard, needsRefresh]);

  // Handle refresh
  const handleRefresh = async () => {
    await refreshDashboard('leader');
  };

  // Handle Add Member
  const handleAddMember = async (memberData) => {
    setActionLoading(true);
    try {
      await addMember(memberData);
      toast.success('Member added successfully! Login credentials sent via email.');
      setAddModalOpen(false);
      
      // Refresh dashboard to show updated stats
      setTimeout(() => {
        refreshDashboard('leader');
      }, 1000);
      
      return { success: true };
    } catch (error) {
      console.error('Error adding member:', error);
      toast.error(error.message || 'Failed to add member');
      return { success: false, error: error.message };
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Create Task
  const handleCreateTask = async (taskData) => {
    setActionLoading(true);
    try {
      await createTask(taskData);
      toast.success('Task created successfully! Assignee notified via email.');
      setCreateTaskModalOpen(false);
      
      // Refresh dashboard to show updated stats
      setTimeout(() => {
        refreshDashboard('leader');
      }, 1000);
      
      return { success: true };
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Failed to create task');
      return { success: false, error: error.message };
    } finally {
      setActionLoading(false);
    }
  };

  // Get data with fallbacks
  const stats = getStats() || {
    totalMembers: 0,
    activeTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  };

  const recentActivities = getRecentActivities();
  const performance = getPerformance() || {
    completionRate: 0,
    avgCompletionDays: 0,
    teamEngagement: 0,
  };

  const StatCard = ({ title, value, icon, color, percentage }) => (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {percentage !== undefined && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption">Progress</Typography>
              <Typography variant="caption">{percentage}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                bgcolor: `${color}20`,
                '& .MuiLinearProgress-bar': { bgcolor: color },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  // Format recent activities for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (isLoading && !dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#1a202c' }}>
            Leader Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.name}! Here's what's happening with your team today.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={isLoading ? <CircularProgress size={16} /> : <Refresh />}
          onClick={handleRefresh}
          disabled={isLoading}
          sx={{ minWidth: '120px' }}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Team Members"
            value={stats.totalMembers}
            icon={<People />}
            color="#2196F3"
            percentage={stats.totalMembers > 0 ? 85 : 0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Active Tasks"
            value={stats.activeTasks}
            icon={<Assignment />}
            color="#FF9800"
            percentage={stats.activeTasks > 0 ? 70 : 0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            icon={<CheckCircle />}
            color="#4CAF50"
            percentage={performance.completionRate}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Pending"
            value={stats.pendingTasks}
            icon={<Schedule />}
            color="#F44336"
            percentage={stats.pendingTasks > 0 ? 30 : 0}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: '#f4f0fa'  }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1, color: '#2196F3' }} />
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <Add />}
                    onClick={() => setAddModalOpen(true)}
                    disabled={actionLoading}
                    sx={{
                      py: 2,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                      },
                      '&:disabled': {
                        opacity: 0.7,
                      },
                    }}
                  >
                    Add Member
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <Add />}
                    onClick={() => setCreateTaskModalOpen(true)}
                    disabled={actionLoading}
                    sx={{
                      py: 2,
                      background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #388E3C 30%, #4CAF50 90%)',
                      },
                      '&:disabled': {
                        opacity: 0.7,
                      },
                    }}
                  >
                    Create Task
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: '#e6fdf4', p:'0 5rem 0 0' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              {recentActivities.length > 0 ? (
                <List sx={{ pt: 0 }}>
                  {recentActivities.slice(0, 4).map((activity, index) => (
                    <ListItem key={activity.id || index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: activity.type === 'task_completed' ? '#4CAF50' : 
                                    activity.type === 'member_added' ? '#2196F3' : '#FF9800',
                            width: 32,
                            height: 32,
                          }}
                        >
                          {activity.type === 'task_completed' ? <CheckCircle sx={{ fontSize: 16 }} /> :
                           activity.type === 'member_added' ? <People sx={{ fontSize: 16 }} /> :
                           <Assignment sx={{ fontSize: 16 }} />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box>
                            <strong>{activity.user}</strong> {activity.action}
                          </Box>
                        }
                        secondary={formatTime(activity.time)}
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ fontSize: '0.8rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent activities to display
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Team Performance Overview */}
      <Box sx={{ mt: 4 }}>
        <Card sx={{bgcolor: '#fbeff5'}}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Team Performance Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    {performance.completionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Task Completion Rate
                  </Typography>
                  <Chip 
                    label={performance.completionRate > 80 ? "↗ Excellent" : "→ Good"} 
                    size="small" 
                    color={performance.completionRate > 80 ? "success" : "default"} 
                    sx={{ mt: 1 }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                    {performance.avgCompletionDays || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. Days per Task
                  </Typography>
                  <Chip label="→ Stable" size="small" sx={{ mt: 1 }} />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
                    {performance.teamEngagement}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Team Engagement
                  </Typography>
                  <Chip 
                    label={performance.teamEngagement > 80 ? "↗ High" : "→ Moderate"} 
                    size="small" 
                    color={performance.teamEngagement > 80 ? "warning" : "default"}
                    sx={{ mt: 1 }} 
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Modals */}
      <AddMemberModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddMember}
        isLoading={actionLoading}
      />

      <CreateTaskModal
        open={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={actionLoading}
      />
    </Box>
  );
};

export default LeaderHome;