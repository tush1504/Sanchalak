// src/pages/Member/MemberHome.jsx
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
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  PlayArrow,
  AccessTime,
  TaskAlt,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import useAuthStore from '../../store/authStore';
import useTaskStore from '../../store/taskStore';

const MemberHome = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { myTasks, fetchMyTasks, updateTaskStatus, isLoading } = useTaskStore();
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch member data on component mount
  useEffect(() => {
    const fetchMemberData = async () => {
      setInitialLoading(true);
      try {
        await fetchMyTasks();
      } catch (error) {
        console.error('Error fetching member data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMemberData();
  }, [fetchMyTasks]);

  // Get upcoming tasks (not completed, sorted by deadline)
  const getUpcomingTasks = () => {
    if (!myTasks) return [];
    
    return myTasks
      .filter(task => task.status !== 'Completed')
      .sort((a, b) => {
        const deadlineA = new Date(a.deadline || a.due || '9999-12-31');
        const deadlineB = new Date(b.deadline || b.due || '9999-12-31');
        return deadlineA - deadlineB;
      })
      .slice(0, 4); // Show top 4 upcoming tasks
  };

  // Get recent completions from member's own tasks
  const getRecentCompletions = () => {
    if (!myTasks) return [];
    
    return myTasks
      .filter(task => task.status === 'Completed')
      .slice(0, 3) // Get last 3 completed tasks
      .map(task => ({
        task: task.title,
        completedAt: 'Recently completed'
      }));
  };

  // Calculate weekly progress
  const getWeeklyProgress = () => {
    if (!myTasks || myTasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const weeklyTasks = myTasks;
    const completedThisWeek = weeklyTasks.filter(task => task.status === 'Completed').length;
    
    const total = Math.max(weeklyTasks.length, 1);
    const percentage = Math.round((completedThisWeek / total) * 100);
    
    return {
      completed: completedThisWeek,
      total: weeklyTasks.length,
      percentage
    };
  };

  // Format deadline for task cards
  const formatDeadline = (deadline) => {
    if (!deadline) return 'No deadline';
    
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  // Handle task status update
  const handleTaskAction = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Pending' ? 'In-Progress' : 'Completed';
      await updateTaskStatus(taskId, { status: newStatus });
      
      if (newStatus === 'Completed') {
        toast.success('🎉 Task completed! Great job!');
      } else {
        toast.success('Task status updated successfully!');
      }
      
      // Refresh data
      fetchMyTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get real data
  const upcomingTasks = getUpcomingTasks();
  const recentCompletions = getRecentCompletions();
  const weeklyProgress = getWeeklyProgress();

  const TaskCard = ({ task }) => {
    const deadlineText = formatDeadline(task.deadline || task.due);
    const isOverdue = deadlineText.includes('overdue');
    
    return (
      <Card
        sx={{
          mb: 2,
          border: task.priority === 'High' ? '2px solid #ff9800' : 
                 isOverdue ? '2px solid #f44336' : '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1, mr: 1 }}>
              {task.title}
            </Typography>
            <Chip
              label={task.priority || 'Medium'}
              size="small"
              color={
                task.priority === 'High' ? 'warning' :
                task.priority === 'Medium' ? 'primary' : 'default'
              }
            />
          </Box>
          
          {task.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {task.description.length > 100 
                ? `${task.description.substring(0, 100)}...` 
                : task.description}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ 
                fontSize: 16, 
                mr: 0.5, 
                color: isOverdue ? '#f44336' : 'text.secondary' 
              }} />
              <Typography variant="body2" color={isOverdue ? 'error' : 'text.secondary'}>
                {deadlineText}
              </Typography>
            </Box>
            <Button
              size="small"
              variant="contained"
              startIcon={task.status === 'In-Progress' ? <TaskAlt /> : <PlayArrow />}
              onClick={() => handleTaskAction(task._id || task.id, task.status)}
              disabled={isLoading}
              sx={{
                background: task.status === 'In-Progress' ? 
                  'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)' :
                  'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
              }}
            >
              {task.status === 'In-Progress' ? 'Complete' : 'Start'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading Your Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#1a202c' }}>
          👤 My Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name}! Here's your personal task overview and progress.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Upcoming Tasks */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%', bgcolor:'#fef5f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ mr: 1, color: '#2196F3' }} />
                   My Upcoming Tasks
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/member/tasks')}
                  sx={{ minWidth: 'auto' }}
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => (
                    <TaskCard key={task._id || task.id} task={task} />
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      🎉 All caught up!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You have no pending tasks at the moment.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress & Recent Completions */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3, bgcolor: '#fbeff5' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                 Task Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Tasks Completed</Typography>
                  <Typography variant="body2">
                    {weeklyProgress.completed}/{weeklyProgress.total}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={weeklyProgress.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#e3f2fd',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#2196f3',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
              <Chip
                label={
                  weeklyProgress.percentage === 100 ? " Perfect score!" :
                  weeklyProgress.percentage >= 75 ? " Great progress!" :
                  weeklyProgress.percentage >= 50 ? " Keep going!" :
                  " Let's get started!"
                }
                color={
                  weeklyProgress.percentage >= 75 ? "success" :
                  weeklyProgress.percentage >= 50 ? "primary" : "warning"
                }
                size="small"
                sx={{ width: '100%', justifyContent: 'center' }}
              />
            </CardContent>
          </Card>

          <Card sx={{bgcolor: '#f1f2fd'}}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                 Recent Completions
              </Typography>
              {recentCompletions.length > 0 ? (
                <List sx={{ pt: 0 }}>
                  {recentCompletions.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#4CAF50', width: 32, height: 32 }}>
                            <CheckCircle sx={{ fontSize: 16 }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.task}
                          secondary={item.completedAt}
                          primaryTypographyProps={{ fontSize: '0.9rem' }}
                          secondaryTypographyProps={{ fontSize: '0.8rem' }}
                        />
                      </ListItem>
                      {index < recentCompletions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Complete some tasks to see them here!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Motivational Section */}
      <Box sx={{ mt: 4 }}>
        <Card
          sx={{
            background: weeklyProgress.percentage >= 75 ? 
              'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)' :
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              {weeklyProgress.percentage === 100 ? ' Outstanding work!' :
               weeklyProgress.percentage >= 75 ? ' You\'re doing amazing!' :
               weeklyProgress.percentage >= 50 ? ' Keep pushing forward!' :
               ' Let\'s get productive!'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              {weeklyProgress.percentage === 100 ? 
                'You\'ve completed all your tasks! Time to celebrate! 🎉' :
                `You've completed ${weeklyProgress.percentage}% of your tasks. ${
                  weeklyProgress.percentage >= 75 ? 'Almost there!' : 'Keep up the great work!'
                }`
              }
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/member/tasks')}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              View All My Tasks
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default MemberHome;