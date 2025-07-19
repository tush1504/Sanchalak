// src/components/member/MemberTaskCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Assignment,
  Person,
  CalendarToday,
  Flag,
  Schedule,
  CheckCircle,
  PlayArrow,
  AccessTime,
  Update,
  KeyboardArrowDown,
  Send,
} from '@mui/icons-material';

const MemberTaskCard = ({ task, onUpdateStatus, isActionLoading }) => {
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const statusMenuOpen = Boolean(statusMenuAnchor);

  const handleStatusMenuOpen = (event) => {
    setStatusMenuAnchor(event.currentTarget);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    handleStatusMenuClose();
    await onUpdateStatus(task._id, newStatus);
  };

  // Get priority styling
  const getPriorityDetails = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return {
          color: '#f44336',
          bgColor: '#ffebee',
          icon: '🔥',
          label: 'HIGH',
        };
      case 'medium':
        return {
          color: '#ff9800',
          bgColor: '#fff3e0',
          icon: '⚡',
          label: 'MEDIUM',
        };
      case 'low':
        return {
          color: '#4caf50',
          bgColor: '#e8f5e8',
          icon: '📌',
          label: 'LOW',
        };
      default:
        return {
          color: '#757575',
          bgColor: '#f5f5f5',
          icon: '📋',
          label: priority?.toUpperCase() || 'NORMAL',
        };
    }
  };

  // Get status styling
  const getStatusDetails = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          color: '#4caf50',
          bgColor: '#e8f5e8',
          icon: <CheckCircle />,
          label: 'Completed',
          progress: 100,
          canUpdate: false,
        };
      case 'in-progress':
        return {
          color: '#2196f3',
          bgColor: '#e3f2fd',
          icon: <PlayArrow />,
          label: 'In Progress',
          progress: 60,
          canUpdate: true,
        };
      case 'pending':
        return {
          color: '#ff9800',
          bgColor: '#fff3e0',
          icon: <Schedule />,
          label: 'Pending',
          progress: 0,
          canUpdate: true,
        };
      default:
        return {
          color: '#757575',
          bgColor: '#f5f5f5',
          icon: <Assignment />,
          label: status || 'Unknown',
          progress: 0,
          canUpdate: true,
        };
    }
  };

  // Format deadline
  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: '#f44336', isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: '#ff9800', isOverdue: false };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: '#ff9800', isOverdue: false };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} days left`, color: '#2196f3', isOverdue: false };
    } else {
      return { text: date.toLocaleDateString(), color: '#4caf50', isOverdue: false };
    }
  };

  const priorityDetails = getPriorityDetails(task.priority);
  const statusDetails = getStatusDetails(task.status);
  const deadlineInfo = formatDeadline(task.deadline);

  // Get card background based on priority and status
  const getCardBackground = () => {
    if (statusDetails.label === 'Completed') {
      return 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%)';
    }
    if (deadlineInfo.isOverdue) {
      return 'linear-gradient(135deg, #ffebee 0%, #ffffff 100%)';
    }
    switch (task.priority?.toLowerCase()) {
      case 'high':
        return 'linear-gradient(135deg, #ffebee 0%, #ffffff 100%)';
      case 'medium':
        return 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)';
      case 'low':
        return 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%)';
      default:
        return 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)';
    }
  };

  // Get available status options for update
  const getStatusOptions = () => {
    const currentStatus = task.status?.toLowerCase();
    const options = [];
    
    if (currentStatus === 'pending') {
      options.push(
        { value: 'In-Progress', label: 'Start Working', icon: <PlayArrow />, color: '#2196f3' }
      );
    }
    
    if (currentStatus === 'pending' || currentStatus === 'in-progress') {
      options.push(
        { value: 'Completed', label: 'Mark Complete', icon: <CheckCircle />, color: '#4caf50' }
      );
    }
    
    if (currentStatus === 'in-progress') {
      options.push(
        { value: 'Pending', label: 'Move to Pending', icon: <Schedule />, color: '#ff9800' }
      );
    }
    
    return options;
  };

  const statusOptions = getStatusOptions();

  return (
    <Card
      sx={{
        height: '320px',
        background: getCardBackground(),
        borderRadius: '16px',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        overflow: 'hidden',
        border: `2px solid ${deadlineInfo.isOverdue ? '#f44336' : priorityDetails.color}40`,
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 16px 32px ${priorityDetails.color}30`,
          border: `2px solid ${priorityDetails.color}80`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: deadlineInfo.isOverdue 
            ? 'linear-gradient(90deg, #f44336 0%, #d32f2f 100%)'
            : `linear-gradient(90deg, ${priorityDetails.color} 0%, ${priorityDetails.color}80 100%)`,
        },
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: '#1a202c',
              mb: 1,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {task.title}
          </Typography>
          
          {/* Priority Chip */}
          <Chip
            label={`${priorityDetails.icon} ${priorityDetails.label}`}
            size="small"
            sx={{
              bgcolor: priorityDetails.bgColor,
              color: priorityDetails.color,
              fontWeight: 700,
              fontSize: '0.75rem',
              border: `1px solid ${priorityDetails.color}30`,
            }}
          />
        </Box>

        {/* Description */}
        {task.description && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
              flexGrow: 1,
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Created By */}
        {task.createdBy && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Assigned by: {task.createdBy.name || 'Team Leader'}
            </Typography>
          </Box>
        )}

        {/* Status and Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Chip
              icon={statusDetails.icon}
              label={statusDetails.label}
              size="small"
              sx={{
                bgcolor: statusDetails.bgColor,
                color: statusDetails.color,
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: statusDetails.color,
                },
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 600, color: statusDetails.color }}>
              {statusDetails.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={statusDetails.progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: `${statusDetails.color}20`,
              '& .MuiLinearProgress-bar': {
                bgcolor: statusDetails.color,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Deadline */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarToday sx={{ fontSize: 16, mr: 1, color: deadlineInfo.color }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: deadlineInfo.color,
              fontWeight: 600,
              flex: 1,
            }}
          >
            {deadlineInfo.text}
          </Typography>
          {deadlineInfo.isOverdue && (
            <Chip
              label="OVERDUE"
              size="small"
              sx={{
                bgcolor: '#ffebee',
                color: '#f44336',
                fontWeight: 700,
                fontSize: '0.7rem',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                  '100%': { opacity: 1 },
                },
              }}
            />
          )}
        </Box>

        {/* Action Buttons */}
        {statusOptions.length > 0 && (
          <Box sx={{ mt: 'auto' }}>
            <Divider sx={{ mb: 2, opacity: 0.5 }} />
            <Button
              fullWidth
              variant="contained"
              endIcon={<KeyboardArrowDown />}
              onClick={handleStatusMenuOpen}
              disabled={isActionLoading}
              sx={{
                borderRadius: 2,
                py: 1.2,
                fontWeight: 600,
                background: `linear-gradient(45deg, ${statusDetails.color} 30%, ${statusDetails.color}80 90%)`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${statusDetails.color}90 30%, ${statusDetails.color} 90%)`,
                },
              }}
            >
              <Update sx={{ mr: 1 }} />
              Update Status
            </Button>
          </Box>
        )}
      </CardContent>

      {/* Status Update Menu */}
      <Menu
        anchorEl={statusMenuAnchor}
        open={statusMenuOpen}
        onClose={handleStatusMenuClose}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            border: '1px solid rgba(0,0,0,0.1)',
            minWidth: '200px',
          }
        }}
      >
        {statusOptions.map((option, index) => (
          <MenuItem 
            key={option.value}
            onClick={() => handleStatusUpdate(option.value)}
            sx={{
              py: 1.5,
              '&:hover': {
                bgcolor: `${option.color}10`,
              }
            }}
          >
            <ListItemIcon>
              {React.cloneElement(option.icon, { 
                fontSize: 'small', 
                sx: { color: option.color } 
              })}
            </ListItemIcon>
            <ListItemText>
              <Typography sx={{ fontWeight: 600, color: option.color }}>
                {option.label}
              </Typography>
            </ListItemText>
            {option.value === 'Completed' && (
              <Send sx={{ fontSize: 16, color: option.color, ml: 1 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
};

export default MemberTaskCard;