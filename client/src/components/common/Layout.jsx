// src/components/common/Layout.jsx
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import useAuthStore from '../../store/authStore';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

const DRAWER_WIDTH = 280;
const RIGHT_SIDEBAR_WIDTH = 320;

const Layout = ({ children, sidebarItems }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(!isMobile);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(!isTablet);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully!');
    navigate('/');
    handleProfileMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setLeftDrawerOpen(!leftDrawerOpen)}
            sx={{ mr: 2, borderRadius: 0 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #fff 30%, #f0f8ff 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Sanchalak
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
              Welcome, {user?.name || 'User'}
            </Typography>
            
            <IconButton
              size="large"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ borderRadius: 0 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: '20px' }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 0,
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose} sx={{ borderRadius: 0 }}>
          <Settings sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ borderRadius: 0 }}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Left Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={leftDrawerOpen}
        onClose={() => setLeftDrawerOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            borderRight: '1px solid #e2e8f0',
            borderRadius: 0,
          },
        }}
      >
        <LeftSidebar items={sidebarItems} />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: leftDrawerOpen && !isMobile ? 0 : `-${DRAWER_WIDTH}px`,
          marginRight: rightDrawerOpen && !isTablet ? 0 : `-${RIGHT_SIDEBAR_WIDTH}px`,
          borderRadius: 0,
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ p: 3, borderRadius: 0 }}>
          {children}
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Drawer
        variant={isTablet ? 'temporary' : 'persistent'}
        anchor="right"
        open={rightDrawerOpen}
        onClose={() => setRightDrawerOpen(false)}
        sx={{
          width: RIGHT_SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: RIGHT_SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderLeft: 'none',
            borderRadius: 0,
          },
        }}
      >
        <RightSidebar />
      </Drawer>

      {/* Toggle Right Sidebar Button (for tablets) */}
      {isTablet && (
        <IconButton
          onClick={() => setRightDrawerOpen(!rightDrawerOpen)}
          sx={{
            position: 'fixed',
            right: 16,
            top: '50%',
            zIndex: theme.zIndex.drawer + 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 0,
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            },
          }}
        >
          {rightDrawerOpen ? '→' : '←'}
        </IconButton>
      )}
    </Box>
  );
};

export default Layout;