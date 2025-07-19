// src/components/leader/BeautifulTaskCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert,
  Delete,
  Assignment,
  Person,
  CalendarToday,
  Flag,
  Schedule,
  CheckCircle,
  PlayArrow,
  AccessTime,
} from '@mui/icons-material';

const BeautifulTaskCard = ({ task, onDelete, isActionLoading, isLeaderView = true }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete?.(task);
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

  // Get status styling - Handle missing status field
  const getStatusDetails = (status) => {
    // If status is missing, default to 'Pending'
    const statusValue = status ? status.trim() : 'Pending';
    
    // Debug logging
    console.log('Status debug:', {
      original: status,
      trimmed: statusValue,
      type: typeof status,
      willUseDefault: !status
    });
    
    // Check for exact matches (from your dropdown values)
    if (statusValue === 'Completed') {
      console.log('Matched: Completed');
      return {
        color: '#4caf50',
        bgColor: '#e8f5e8',
        iconComponent: CheckCircle,
        icon: '✅',
        label: 'Completed',
        progress: 100,
      };
    }
    
    if (statusValue === 'In-Progress') {
      console.log('Matched: In-Progress');
      return {
        color: '#2196f3',
        bgColor: '#e3f2fd',
        iconComponent: PlayArrow,
        icon: '⚡',
        label: 'In Progress',
        progress: 60,
      };
    }
    
    if (statusValue === 'Pending') {
      console.log('Matched: Pending');
      return {
        color: '#ff9800',
        bgColor: '#fff3e0',
        iconComponent: Schedule,
        icon: '⏳',
        label: 'Pending',
        progress: 0,
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
  const deadlineInfo = formatDeadline(task.deadline || task.due);


  // Get card background based on priority
  const getCardBackground = () => {
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

  return (
    <Card
      sx={{
        height: '240px', // Increased height to accommodate status display
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
      <CardContent sx={{ p: 3, height: '100%', position: 'relative' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 1 }}>
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
            
            {/* Priority and Status Chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
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
              
              <Chip
                label={`${statusDetails.icon} ${statusDetails.label}`}
                size="small"
                sx={{
                  bgcolor: statusDetails.bgColor,
                  color: statusDetails.color,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  border: `1px solid ${statusDetails.color}30`,
                }}
              />
            </Box>
          </Box>

          {/* Action Menu (Leader only) */}
          {isLeaderView && (
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              disabled={isActionLoading}
              sx={{ 
                opacity: 0.7,
                '&:hover': { opacity: 1, bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <MoreVert />
            </IconButton>
          )}
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
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Assignee (Leader view) */}
        {isLeaderView && task.assignedTo && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {task.assignedTo}
            </Typography>
          </Box>
        )}

        {/* Progress Bar with Status Info */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: statusDetails.color }}>
              {statusDetails.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={statusDetails.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: `${statusDetails.color}20`,
              '& .MuiLinearProgress-bar': {
                bgcolor: statusDetails.color,
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Deadline */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            position: 'absolute',
            bottom: 16,
            left: 24,
            right: 24,
          }}
        >
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
      </CardContent>

      {/* Action Menu */}
      {isLeaderView && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.1)',
            }
          }}
        >
          <MenuItem 
            onClick={handleDelete} 
            sx={{ 
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.50',
              }
            }}
          >
            <ListItemIcon>
              <Delete fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>Delete Task</ListItemText>
          </MenuItem>
        </Menu>
      )}
    </Card>
  );
};

export default BeautifulTaskCard;