// src/components/member/PerformanceOverview.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';

const PerformanceOverview = ({ completionPercentage, taskStats }) => {
  if (taskStats.total === 0) return null;

  return (
    <Card 
      sx={{ 
        mb: 4,
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            🎯 Your Performance
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 1 }}>
            {completionPercentage}%
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Task Completion Rate
          </Typography>
          <Box sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#4CAF50',
                  borderRadius: 6,
                },
              }}
            />
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            {completionPercentage >= 80 
              ? "🌟 Excellent work! You're crushing your goals!"
              : completionPercentage >= 60
              ? "💪 Great progress! Keep up the momentum!"
              : "🚀 You've got this! Let's complete more tasks!"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PerformanceOverview;
