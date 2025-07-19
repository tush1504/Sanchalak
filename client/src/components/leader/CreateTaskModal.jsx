// src/components/leader/CreateTaskModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  InputAdornment,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
  Close,
  Assignment,
  Person,
  Flag,
  CalendarToday,
  Description,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Store
import useLeaderStore from '../../store/leaderStore';

// Validation schema
const schema = yup.object({
  title: yup
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
  deadline: yup
    .date()
    .min(new Date(), 'Deadline must be in the future')
    .required('Deadline is required'),
  priority: yup
    .string()
    .oneOf(['Low', 'Medium', 'High'], 'Please select a valid priority')
    .required('Priority is required'),
  assignedTo: yup
    .string()
    .required('Please assign the task to a team member'),
});

const CreateTaskModal = ({ open, onClose, onSubmit, isLoading }) => {
  const { members, fetchAllMembers } = useLeaderStore();
  const [membersLoading, setMembersLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      deadline: null,
      priority: 'Medium',
      assignedTo: '',
    },
  });

  // Watch priority to show different colors
  const watchedPriority = watch('priority');

  // Fetch members when modal opens
  useEffect(() => {
    if (open && members.length === 0) {
      setMembersLoading(true);
      fetchAllMembers().finally(() => setMembersLoading(false));
    }
  }, [open, members.length, fetchAllMembers]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    // Format the data to match your backend expectations
    const taskData = {
      title: data.title,
      description: data.description,
      deadline: data.deadline.toISOString(),
      priority: data.priority,
      assignedTo: data.assignedTo,
    };

    const result = await onSubmit(taskData);
    if (result?.success) {
      reset();
      onClose();
    }
  };

  // Get priority styling
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      case 'Low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Assignment sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Create New Task
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Assign a new task to your team member
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleClose} size="large">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Task Title */}
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Task Title"
                    placeholder="Enter a clear and descriptive task title"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Assignment color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />

              {/* Task Description */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Task Description"
                    placeholder="Provide detailed instructions and requirements"
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                          <Description color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />

              {/* Priority and Deadline Row */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* Priority */}
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <FormControl sx={{ minWidth: 200 }} error={!!errors.priority}>
                      <InputLabel>Priority Level</InputLabel>
                      <Select
                        {...field}
                        label="Priority Level"
                        startAdornment={
                          <InputAdornment position="start">
                            <Flag sx={{ color: getPriorityColor(watchedPriority) }} />
                          </InputAdornment>
                        }
                        sx={{
                          borderRadius: 2,
                        }}
                      >
                        <MenuItem value="Low">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label="📌 LOW"
                              size="small"
                              sx={{ bgcolor: '#e8f5e8', color: '#4caf50', fontWeight: 600 }}
                            />
                            <Typography>Low Priority</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="Medium">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label="⚡ MEDIUM"
                              size="small"
                              sx={{ bgcolor: '#fff3e0', color: '#ff9800', fontWeight: 600 }}
                            />
                            <Typography>Medium Priority</Typography>
                          </Box>
                        </MenuItem>
                        <MenuItem value="High">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label="🔥 HIGH"
                              size="small"
                              sx={{ bgcolor: '#ffebee', color: '#f44336', fontWeight: 600 }}
                            />
                            <Typography>High Priority</Typography>
                          </Box>
                        </MenuItem>
                      </Select>
                      {errors.priority && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.priority.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />

                {/* Deadline */}
                <Controller
                  name="deadline"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Deadline"
                      minDate={dayjs().add(1, 'day')}
                      slotProps={{
                        textField: {
                          error: !!errors.deadline,
                          helperText: errors.deadline?.message,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday color="action" />
                              </InputAdornment>
                            ),
                          },
                          sx: {
                            flexGrow: 1,
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          },
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Assign To */}
              <Controller
                name="assignedTo"
                control={control}
                render={({ field }) => (
                  <FormControl error={!!errors.assignedTo}>
                    <InputLabel>Assign To Team Member</InputLabel>
                    <Select
                      {...field}
                      label="Assign To Team Member"
                      startAdornment={
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: 2,
                      }}
                      disabled={membersLoading}
                    >
                      {membersLoading ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Loading team members...
                        </MenuItem>
                      ) : members.length > 0 ? (
                        members.map((member) => (
                          <MenuItem key={member._id} value={member._id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: member.role === 'leader' ? '#2196f3' : '#9c27b0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '0.8rem',
                                  fontWeight: 'bold',
                                }}
                              >
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </Box>
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  {member.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {member.email} • {member.role}
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          <Typography color="text.secondary">
                            No team members available. Add members first.
                          </Typography>
                        </MenuItem>
                      )}
                    </Select>
                    {errors.assignedTo && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.assignedTo.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Info Box */}
            <Box
              sx={{
                mt: 3,
                p: 3,
                bgcolor: 'primary.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.200',
              }}
            >
              <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600, mb: 1 }}>
                📧 Automatic Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The assigned team member will receive an email notification with task details immediately after creation.
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button
              onClick={handleClose}
              disabled={isLoading}
              size="large"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || members.length === 0}
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                minWidth: 140,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Task'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CreateTaskModal;