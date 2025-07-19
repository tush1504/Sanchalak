// src/components/common/LeftSidebar.jsx
import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const LeftSidebar = ({ items }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -50,
          left: -50,
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -30,
          right: -30,
          width: '120px',
          height: '120px',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 1,
        },
      }}
    >
      <Toolbar>
        <Box sx={{ width: '100%', textAlign: 'center', py: 2, position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            {user?.role === 'leader' ? '👑 Leader Panel' : '👤 Member Panel'}
          </Typography>
          <Chip
            label={user?.name}
            size="small"
            sx={{
              fontWeight: 'bold',
              fontSize: '0.75rem',
              mt: 4,
              bgcolor: 'rgba(233, 8, 124, 0.81)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          />
        </Box>
      </Toolbar>

      <Divider sx={{ mx: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <List sx={{ px: 2, py: 1, position: 'relative', zIndex: 2, flexGrow: 1 }}>
        {items?.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  py: 1.5,
                  px: 2,
                  transition: 'all 0.3s ease',
                  background: isActive
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'transparent',
                  color: 'white',
                  backdropFilter: isActive ? 'blur(10px)' : 'none',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                  borderRadius: '10px',
                  '&:hover': {
                    background: isActive
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(4px)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                    minWidth: '40px',
                  },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 700 : 500,
                    textShadow: isActive ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: '20px',
                      fontSize: '0.7rem',
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Pro Tip Section */}
      <Box sx={{ px: 3, py: 2, position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            p: 2,
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontWeight: 600,
              display: 'block',
              mb: 0.5,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
             Pro Tip
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.4,
              fontSize: '0.75rem',
            }}
          >
            {user?.role === 'leader'
              ? 'Keep email notifications ON to recieve task completion status.'
              : 'Mark tasks as completed to notify your leader instantly!'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LeftSidebar;