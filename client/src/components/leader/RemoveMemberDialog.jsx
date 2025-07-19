// src/components/leader/RemoveMemberDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Warning,
  Person,
  AdminPanelSettings,
} from '@mui/icons-material';

const RemoveMemberDialog = ({ open, onClose, onConfirm, member, isLoading }) => {
  if (!member) return null;

  // Get member's initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role details
  const getRoleDetails = (role) => {
    switch (role.toLowerCase()) {
      case 'leader':
        return {
          color: 'primary',
          icon: <AdminPanelSettings sx={{ fontSize: 16 }} />,
          label: 'Leader'
        };
      case 'member':
        return {
          color: 'secondary',
          icon: <Person sx={{ fontSize: 16 }} />,
          label: 'Member'
        };
      default:
        return {
          color: 'default',
          icon: <Person sx={{ fontSize: 16 }} />,
          label: role
        };
    }
  };

  const roleDetails = getRoleDetails(member.role);

  const handleConfirm = async () => {
    const result = await onConfirm(member._id);
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
          borderRadius: 2,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning sx={{ mr: 1, color: 'error.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Remove Team Member
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Member Info Card */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            mb: 3,
            bgcolor: 'grey.50',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              bgcolor: roleDetails.color === 'primary' ? '#2196f3' : '#9c27b0',
              fontWeight: 'bold',
            }}
          >
            {getInitials(member.name)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {member.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {member.email}
            </Typography>
            <Chip
              icon={roleDetails.icon}
              label={roleDetails.label}
              color={roleDetails.color}
              size="small"
            />
          </Box>
        </Box>

        {/* Warning Message */}
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>This action cannot be undone.</strong> The member will lose access to:
          </Typography>
          <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
            <li>All assigned tasks and project data</li>
            <li>Team communications and updates</li>
            <li>Access to the team dashboard</li>
          </Box>
        </Alert>

        <Typography variant="body1" sx={{ color: 'text.primary' }}>
          Are you sure you want to remove <strong>{member.name}</strong> from your team?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
          sx={{
            borderRadius: 2,
            minWidth: 120,
            background: 'linear-gradient(45deg, #f44336 30%, #e57373 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Remove Member'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveMemberDialog;