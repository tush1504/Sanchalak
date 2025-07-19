// src/components/leader/BeautifulMemberCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert,
  Delete,
  Email,
  Person,
  AdminPanelSettings,
  CalendarToday,
  Star,
} from '@mui/icons-material';

const BeautifulMemberCard = ({ member, onRemove, isActionLoading }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = () => {
    handleMenuClose();
    onRemove?.(member);
  };

  // Get member's initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format join date
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get role-based styling
  const isLeader = member.role.toLowerCase() === 'leader';

  const cardStyles = isLeader ? {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    avatarBg: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
    textColor: 'white',
    shadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
    hoverShadow: '0 25px 50px rgba(102, 126, 234, 0.6)',
  } : {
    background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    avatarBg: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
    textColor: '#F8FAFF',
    shadow: '0 15px 35px rgba(116, 185, 255, 0.4)',
    hoverShadow: '0 25px 50px rgba(116, 185, 255, 0.6)',
  };

  return (
    <Card
      sx={{
        height: '320px',
        background: cardStyles.background,
        borderRadius: '20px',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        overflow: 'hidden',
        border: 'none',
        boxShadow: cardStyles.shadow,
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-15px) scale(1.03)',
          boxShadow: cardStyles.hoverShadow,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 1,
        },
      }}
    >
      {/* Decorative Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 1,
        }}
      />

      <CardContent sx={{ p: 3, position: 'relative', zIndex: 2, height: '100%' }}>
        {/* Menu Button */}
        <Box sx={{ position: 'absolute', top: 15, right: 15, zIndex: 3 }}>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            disabled={isActionLoading}
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
          {/* Avatar with Glow */}
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Avatar
              sx={{
                width: 85,
                height: 85,
                background: cardStyles.avatarBg,
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                zIndex: 1,
                position: 'relative',
              }}
            >
              {getInitials(member.name)}
            </Avatar>
            {/* Glow Effect */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: cardStyles.avatarBg,
                opacity: 0.4,
                filter: 'blur(20px)',
                zIndex: 0,
              }}
            />
          </Box>

          {/* Name */}
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800, 
              color: cardStyles.textColor,
              mb: 1,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              letterSpacing: '0.5px',
            }}
          >
            {member.name}
          </Typography>

          {/* Email */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, opacity: 0.9 }}>
            <Email sx={{ fontSize: 18, mr: 1, color: cardStyles.textColor }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: cardStyles.textColor,
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              {member.email}
            </Typography>
          </Box>

          {/* Role Badge */}
          <Chip
            icon={isLeader ? <AdminPanelSettings /> : <Person />}
            label={isLeader ? '👑 Team Leader' : '⭐ Team Member'}
            sx={{
              fontWeight: 700,
              fontSize: '0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: isLeader ? '#667eea' : '#0984e3',
              border: 'none',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              mb: 2,
              '& .MuiChip-icon': {
                color: isLeader ? '#667eea' : '#0984e3',
              },
            }}
          />

          {/* Join Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, opacity: 0.8 }}>
            <CalendarToday sx={{ fontSize: 16, mr: 1, color: cardStyles.textColor }} />
            <Typography variant="caption" sx={{ color: cardStyles.textColor, fontWeight: 600 }}>
              Since {formatJoinDate(member.createdAt || new Date())}
            </Typography>
          </Box>

          {/* Status */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              px: 3,
              py: 1,
              borderRadius: '25px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#00ff88',
                mr: 1,
                boxShadow: '0 0 15px #00ff88',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.7, transform: 'scale(1.3)' },
                  '100%': { opacity: 1, transform: 'scale(1)' },
                },
              }}
            />
            <Star sx={{ fontSize: 18, mr: 0.5, color: cardStyles.textColor }} />
            <Typography 
              variant="caption" 
              sx={{ 
                color: cardStyles.textColor,
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.5px',
              }}
            >
              ACTIVE
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Enhanced Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: '15px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            mt: 1,
            minWidth: '180px',
          }
        }}
      >
        <MenuItem 
          onClick={handleRemove} 
          sx={{ 
            color: '#e74c3c',
            borderRadius: '10px',
            mx: 1,
            my: 0.5,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              transform: 'scale(1.02)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: '#e74c3c' }} />
          </ListItemIcon>
          <ListItemText>
            Remove Member
          </ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default BeautifulMemberCard;