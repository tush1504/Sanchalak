// src/components/leader/DeleteTaskDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Warning,
  Assignment,
  Person,
  CalendarToday,
  Flag,
  Delete,
} from '@mui/icons-material';

const DeleteTaskDialog = ({ open, onClose, onConfirm, task, isLoading }) => {
  if (!task) return null;

  // Get priority styling
  const getPriorityDetails = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return {
          color: '#f44336',
          bgColor: '#ffebee',
          icon: '🔥',
          label: 'HIGH PRIORITY',
        };
      case 'medium':
        return {
          color: '#ff9800',
          bgColor: '#fff3e0',
          icon: '⚡',
          label: 'MEDIUM PRIORITY',
        };
      case 'low':
        return {
          color: '#4caf50',
          bgColor: '#e8f5e8',
          icon: '📌',
          label: 'LOW PRIORITY',
        };
      default:
        return {
          color: '#757575',
          bgColor: '#f5f5f5',
          icon: '📋',
          label: 'NORMAL PRIORITY',
        };
    }
  };

  // Format deadline
  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const priorityDetails = getPriorityDetails(task.priority);

  const handleConfirm = async () => {
    const result = await onConfirm(task.id || task._id);
    if (result?.success) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ mr: 2, color: 'error.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
              Delete Task
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              This action cannot be undone
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Task Info Card */}
        <Box
          sx={{
            p: 3,
            mb: 3,
            bgcolor: 'grey.50',
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'grey.200',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${priorityDetails.color} 0%, ${priorityDetails.color}80 100%)`,
            },
          }}
        >
          {/* Task Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Assignment sx={{ color: 'primary.main', mr: 2, mt: 0.5, fontSize: 28 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#1a202c' }}>
                {task.title}
              </Typography>
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
          </Box>

          {/* Task Description */}
          {task.description && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                p: 2,
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                fontStyle: 'italic',
              }}
            >
              "{task.description}"
            </Typography>
          )}

          {/* Task Details */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Assigned To */}
            {task.assignedTo && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ fontSize: 20, mr: 1.5, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Assigned to: {task.assignedTo}
                  </Typography>
                  {task.assignee_email && (
                    <Typography variant="caption" color="text.secondary">
                      {task.assignee_email}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            {/* Deadline */}
            {(task.deadline || task.due) && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ fontSize: 20, mr: 1.5, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Deadline: {formatDeadline(task.deadline || task.due)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Warning Message */}
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Warning:</strong> Deleting this task will permanently remove it from the system. The assigned team member will no longer see this task in their dashboard.
          </Typography>
        </Alert>

        {/* Confirmation Text */}
        <Typography variant="body1" sx={{ color: 'text.primary', textAlign: 'center' }}>
          Are you sure you want to delete{' '}
          <strong>"{task.title}"</strong>?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          size="large"
          sx={{ 
            borderRadius: 2,
            px: 3,
            fontWeight: 600,
          }}
        >
          Keep Task
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isLoading}
          size="large"
          sx={{
            borderRadius: 2,
            px: 4,
            minWidth: 140,
            background: 'linear-gradient(45deg, #f44336 30%, #e57373 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
            },
            fontWeight: 700,
          }}
          startIcon={isLoading ? null : <Delete />}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Delete Task'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskDialog;