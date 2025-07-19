// src/components/member/TaskHeroHeader.jsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Assignment,
  Timeline,
  EmojiEvents,
  Refresh,
} from '@mui/icons-material';

const TaskHeroHeader = ({ isLoading, onRefresh }) => {
  return (
    <Box 
      sx={{ 
        mb: 5, 
        p: 5,
        borderRadius: '25px',
        background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(156, 39, 176, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -100,
          right: -100,
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
              📝 My Task Center
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 3, maxWidth: '600px' }}>
              Track your assignments, update progress, and achieve your goals
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<Assignment />}
                label="Task Updates"
                size="large"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 700,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip 
                icon={<Timeline />}
                label="Progress Tracking"
                size="large"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 700,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip 
                icon={<EmojiEvents />}
                label="Achievement"
                size="large"
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 700,
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={isLoading ? <CircularProgress size={20} /> : <Refresh />}
              onClick={onRefresh}
              disabled={isLoading}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                borderWidth: 2,
                fontWeight: 700,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderWidth: 2,
                }
              }}
            >
              Refresh Tasks
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskHeroHeader;