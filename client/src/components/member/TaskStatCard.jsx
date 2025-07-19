// src/components/member/TaskStatCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
} from '@mui/material';

const TaskStatCard = ({ title, value, icon, color, subtitle, percentage }) => (
  <Card
    sx={{
      height: '180px',
      background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
      border: `2px solid ${color}30`,
      borderRadius: '20px',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: `0 20px 40px ${color}40`,
        border: `2px solid ${color}60`,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -20,
        right: -20,
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: `${color}15`,
        zIndex: 1,
      },
    }}
  >
    <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <Avatar 
          sx={{ 
            bgcolor: color, 
            mr: 2, 
            width: 50,
            height: 50,
            boxShadow: `0 8px 20px ${color}40`,
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 24 } })}
        </Avatar>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, color, mb: 0.5, fontSize: '2rem' }}>
            {value}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a202c', fontSize: '0.95rem' }}>
            {title}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500, display: 'block' }}>
        {subtitle}
      </Typography>
      {percentage !== undefined && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>Progress</Typography>
            <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.7rem' }}>{percentage}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              bgcolor: `${color}20`,
              '& .MuiLinearProgress-bar': { 
                bgcolor: color,
                borderRadius: 3,
              },
              borderRadius: 3,
              height: 6,
            }}
          />
        </Box>
      )}
    </CardContent>
  </Card>
);

export default TaskStatCard;