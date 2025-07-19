// src/pages/Leader/StunningTasks.jsx - Replace your Tasks.jsx with this
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Fab,
  Avatar,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Assignment,
  Refresh,
  Flag,
  CheckCircle,
  Schedule,
  PlayArrow,
  TrendingUp,
  Rocket,
  Star,
  Timeline,
} from '@mui/icons-material';

// Stores
import useTaskStore from '../../store/taskStore';
import useDashboardStore from '../../store/dashboardStore';

// Components  
import BeautifulTaskCard from '../../components/leader/BeautifulTaskCard';
import CreateTaskModal from '../../components/leader/CreateTaskModal';
import DeleteTaskDialog from '../../components/leader/DeleteTaskDialog';

const Tasks = () => {
  const {
    tasks,
    isLoading,
    isActionLoading,
    error,
    fetchAllTasks,
    createTask,
    deleteTask,
    searchTasks,
    filterTasksByStatus,
    filterTasksByPriority,
    getTaskStats,
    needsRefresh,
    refreshTasks,
    clearError,
  } = useTaskStore();

  const { refreshDashboard } = useDashboardStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    if (needsRefresh() || tasks.length === 0) {
      fetchAllTasks();
    }
  }, [fetchAllTasks, needsRefresh, tasks.length]);

  // Clear error on mount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Filter and search tasks
  const getFilteredTasks = () => {
    let filteredTasks = tasks;
  
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => {
        return task.status === statusFilter;
      });
    }
  
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => {
        return task.priority === priorityFilter;
      });
    }
  
    // Apply search filter (if you have searchTerm)
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task =>
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.assignedTo && task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  
    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();
  const taskStats = getTaskStats(false);

  // Handlers
  const handleRefresh = async () => {
    await refreshTasks(false);
    await refreshDashboard('leader');
  };

  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      await refreshDashboard('leader');
    }
    return result;
  };

  const handleDeleteTask = async (taskId) => {
    const result = await deleteTask(taskId);
    if (result.success) {
      await refreshDashboard('leader');
    }
    return result;
  };

  const handleDeleteTaskClick = (task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
  };

  // Beautiful stat card component
  const TaskStatCard = ({ title, value, icon, color, subtitle, percentage }) => (
    <Card
      sx={{
        height: '180px',
        background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
        border: `2px solid ${color}30`,
        borderRadius: '20px',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 20px 40px ${color}40`,
          border: `2px solid ${color}60`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -20,
          right: -20,
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `${color}15`,
          zIndex: 1,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 2, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar 
            sx={{ 
              bgcolor: color, 
              mr: 2, 
              width: 50,
              height: 50,
              boxShadow: `0 8px 20px ${color}40`,
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 24 } })}
          </Avatar>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color, mb: 0.5, fontSize: '2rem' }}>
              {value}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a202c', fontSize: '0.95rem' }}>
              {title}
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500, display: 'block' }}>
          {subtitle}
        </Typography>
        {percentage !== undefined && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>Progress</Typography>
              <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.7rem' }}>{percentage}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                bgcolor: `${color}20`,
                '& .MuiLinearProgress-bar': { 
                  bgcolor: color,
                  borderRadius: 3,
                },
                borderRadius: 3,
                height: 6,
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* STUNNING Hero Header */}
      <Box 
        sx={{ 
          mb: 5, 
          p: 5,
          borderRadius: '25px',
          background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(76, 175, 80, 0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -100,
            right: -100,
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
                 Task Control Center
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, mb: 3, maxWidth: '600px' }}>
                Create, assign, and track tasks to keep your team productive and organized
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Assignment />}
                  label="Task Creation"
                  size="large"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Chip 
                  icon={<Timeline />}
                  label="Progress Tracking"
                  size="large"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Chip 
                  icon={<Star />}
                  label="Team Performance"
                  size="large"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="large"
                startIcon={isLoading ? <CircularProgress size={20} /> : <Refresh />}
                onClick={handleRefresh}
                disabled={isLoading}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  borderWidth: 2,
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderWidth: 2,
                  }
                }}
              >
                Refresh Tasks
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => setCreateModalOpen(true)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  fontWeight: 700,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Create Task
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* STUNNING Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <TaskStatCard
            title="Total Tasks"
            value={taskStats.total}
            icon={<Assignment />}
            color="#FF6B6B"
            subtitle="All tasks in the system"
            percentage={taskStats.total > 0 ? 100 : 0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TaskStatCard
            title="Pending"
            value={taskStats.pending}
            icon={<Schedule />}
            color="#42A5F5"
            subtitle="Tasks not started yet!"
            percentage={taskStats.total > 0 ? Math.round((taskStats.pending / taskStats.total) * 100): 0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TaskStatCard
            title="In Progress"
            value={taskStats.inProgress}
            icon={<PlayArrow />}
            color="#FF9800"
            subtitle="Currently being worked on"
            percentage={taskStats.total > 0 ? Math.round((taskStats.inProgress / taskStats.total) * 100) : 0}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TaskStatCard
            title="Completed"
            value={taskStats.completed}
            icon={<CheckCircle />}
            color="#4CAF50"
            subtitle="Successfully finished tasks"
            percentage={taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}
          />
        </Grid>
      </Grid>

      {/* ENHANCED Search and Filter Section */}
      <Card 
        sx={{ 
          mb: 4,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '2px solid #e2e8f0',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrendingUp sx={{ mr: 2, color: '#4CAF50', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
               Search & Filter Tasks
            </Typography>
          </Box>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by title or assignee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#4CAF50', fontSize: 24 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '15px',
                    bgcolor: 'white',
                    height: '60px',
                    fontSize: '1.1rem',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4CAF50',
                      borderWidth: 2,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4CAF50',
                      borderWidth: 2,
                    },
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: '1.1rem' }}>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ 
                    borderRadius: '15px',
                    bgcolor: 'white',
                    height: '60px',
                    fontSize: '1.1rem',
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Pending">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Schedule sx={{ mr: 1, color: '#ff9800' }} />
                      Pending
                    </Box>
                  </MenuItem>
                  <MenuItem value="In-Progress">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PlayArrow sx={{ mr: 1, color: '#2196f3' }} />
                      In Progress
                    </Box>
                  </MenuItem>
                  <MenuItem value="Completed">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircle sx={{ mr: 1, color: '#4caf50' }} />
                      Completed
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: '1.1rem' }}>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  sx={{ 
                    borderRadius: '15px',
                    bgcolor: 'white',
                    height: '60px',
                    fontSize: '1.1rem',
                  }}
                >
                  <MenuItem value="all">All Priority</MenuItem>
                  <MenuItem value="High">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Flag sx={{ mr: 1, color: '#f44336' }} />
                       High
                    </Box>
                  </MenuItem>
                  <MenuItem value="Medium">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Flag sx={{ mr: 1, color: '#ff9800' }} />
                       Medium
                    </Box>
                  </MenuItem>
                  <MenuItem value="Low">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Flag sx={{ mr: 1, color: '#4caf50' }} />
                       Low
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Active Filters */}
          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
            <Box sx={{ 
              mt: 3, 
              p: 3, 
              bgcolor: '#f1f5f9', 
              borderRadius: '15px', 
              border: '2px solid #e2e8f0' 
            }}>
              <Typography variant="h6" sx={{ color: '#475569', mb: 2, fontWeight: 600 }}>
                 Active Filters
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {searchTerm && (
                  <Chip
                    label={`Search: "${searchTerm}"`}
                    onDelete={() => setSearchTerm('')}
                    sx={{
                      bgcolor: '#dcfce7',
                      color: '#166534',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      height: '35px',
                    }}
                  />
                )}
                {statusFilter !== 'all' && (
                  <Chip
                    label={`Status: ${statusFilter}`}
                    onDelete={() => setStatusFilter('all')}
                    sx={{
                      bgcolor: '#dbeafe',
                      color: '#1e40af',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      height: '35px',
                    }}
                  />
                )}
                {priorityFilter !== 'all' && (
                  <Chip
                    label={`Priority: ${priorityFilter}`}
                    onDelete={() => setPriorityFilter('all')}
                    sx={{
                      bgcolor: '#fce7f3',
                      color: '#be185d',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      height: '35px',
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

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
      {isLoading && tasks.length === 0 && (
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
          <CircularProgress size={80} sx={{ mb: 3, color: '#4CAF50' }} />
          <Typography variant="h5" sx={{ color: '#475569', fontWeight: 600 }}>
            Loading your task dashboard...
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
            Please wait while we fetch all tasks and assignments
          </Typography>
        </Box>
      )}

      {/* Tasks Grid */}
      {!isLoading || tasks.length > 0 ? (
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
                  📋 Task List ({filteredTasks.length} tasks)
                </Typography>
                <Chip 
                  label={`${Math.round((filteredTasks.length / Math.max(tasks.length, 1)) * 100)}% shown`}
                  sx={{ 
                    bgcolor: '#dcfce7', 
                    color: '#166534', 
                    fontWeight: 700,
                    fontSize: '1rem',
                    height: '40px',
                  }}
                />
              </Box>

              {/* Beautiful Task Cards Grid */}
              <Grid container spacing={4}>
                {filteredTasks.map((task) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={task.id || task._id}>
                    <BeautifulTaskCard
                      task={task}
                      onDelete={handleDeleteTaskClick}
                      isActionLoading={isActionLoading}
                      isLeaderView={true}
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
                  ? ' No Tasks Found'
                  : ' Ready to Create Tasks?'
                }
              </Typography>
              <Typography variant="h6" sx={{ color: '#64748b', mb: 5, maxWidth: 500, mx: 'auto' }}>
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your search terms or filters to find the tasks you\'re looking for.'
                  : 'Start organizing your team\'s work by creating your first task. Assign responsibilities, set deadlines, and track progress!'
                }
              </Typography>
              {(!searchTerm && statusFilter === 'all' && priorityFilter === 'all') && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={() => setCreateModalOpen(true)}
                  sx={{
                    borderRadius: '15px',
                    py: 2,
                    px: 5,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                    boxShadow: '0 15px 35px rgba(76, 175, 80, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #388E3C 0%, #689F38 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 20px 45px rgba(76, 175, 80, 0.5)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Create Your First Task
                </Button>
              )}
            </Paper>
          )}
        </Box>
      ) : null}

      {/* Floating Action Button (Mobile) */}
      <Fab
        onClick={() => setCreateModalOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          display: { xs: 'flex', md: 'none' },
          width: 70,
          height: 70,
          background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
          boxShadow: '0 15px 35px rgba(76, 175, 80, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #388E3C 0%, #689F38 100%)',
            transform: 'scale(1.1)',
            boxShadow: '0 20px 45px rgba(76, 175, 80, 0.5)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <Add sx={{ fontSize: 30 }} />
      </Fab>

      {/* Modals */}
      <CreateTaskModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={isActionLoading}
      />

      <DeleteTaskDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteTask}
        task={selectedTask}
        isLoading={isActionLoading}
      />
    </Box>
  );
};

export default Tasks;