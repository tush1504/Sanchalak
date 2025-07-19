// src/components/leader/AddMemberModal.jsx
import React from 'react';
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
} from '@mui/material';
import {
  Close,
  Person,
  Email,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  role: yup
    .string()
    .oneOf(['member', 'leader'], 'Please select a valid role')
    .required('Role is required'),
});

const AddMemberModal = ({ open, onClose, onSubmit, isLoading }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      role: 'member',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    const result = await onSubmit(data);
    if (result?.success) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Add New Team Member
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Add a new member to your team. They will receive login credentials via email.
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Name Field */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  placeholder="Enter member's full name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
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

            {/* Email Field */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address"
                  placeholder="Enter member's email address"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
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

            {/* Role Field */}
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.role}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    {...field}
                    label="Role"
                    startAdornment={
                      <InputAdornment position="start">
                        <AdminPanelSettings color="action" />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="member">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, fontSize: 20 }} />
                        <Box>
                          <Typography variant="body1">Member</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Can view and update assigned tasks
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                    <MenuItem value="leader">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AdminPanelSettings sx={{ mr: 1, fontSize: 20 }} />
                        <Box>
                          <Typography variant="body1">Leader</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Can manage team and create tasks
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  </Select>
                  {errors.role && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {errors.role.message}
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
              p: 2,
              bgcolor: 'primary.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.200',
            }}
          >
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
              📧 Email Notification
            </Typography>
            <Typography variant="caption" color="text.secondary">
              The new member will receive an email with their login credentials and a welcome message.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              borderRadius: 2,
              minWidth: 120,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Add Member'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddMemberModal;