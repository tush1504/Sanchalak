// src/components/landing/FeaturesSection.jsx
import React from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  Zoom,
} from '@mui/material';
import {
  Dashboard,
  Group,
  Assignment,
  Timeline,
  Analytics,
  CloudDone,
} from '@mui/icons-material';

const FeaturesSection = ({ animationTrigger }) => {
  const features = [
    {
      icon: <Dashboard sx={{ fontSize: 32 }} />,
      title: 'Smart Dashboard',
      description: 'Real-time insights and analytics with beautiful visualizations.',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: <Group sx={{ fontSize: 32 }} />,
      title: 'Team Collaboration',
      description: 'Seamless collaboration with role-based access control.',
      color: '#4CAF50',
      gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
    },
    {
      icon: <Assignment sx={{ fontSize: 32 }} />,
      title: 'Task Management',
      description: 'Create, assign, and track tasks with priority levels.',
      color: '#FF9800',
      gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
    },
    {
      icon: <Timeline sx={{ fontSize: 32 }} />,
      title: 'Activity Tracking',
      description: 'Complete timeline showing all team actions.',
      color: '#E91E63',
      gradient: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
    },
    {
      icon: <Analytics sx={{ fontSize: 32 }} />,
      title: 'Performance Analytics',
      description: 'Detailed metrics and completion rates for teams.',
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
    },
    {
      icon: <CloudDone sx={{ fontSize: 32 }} />,
      title: 'Real-time Updates',
      description: 'Live synchronization across all devices.',
      color: '#2196F3',
      gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
    },
  ];

  return (
    <Box 
      sx={{ 
        width: '100%',
        py: 10, 
        px: { xs: 2, md: 4 }, 
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        margin: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ width: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 3,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
             Powerful Features
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#64748b',
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: '1.2rem',
            }}
          >
            Everything you need to manage teams and tasks with unprecedented efficiency
          </Typography>
        </Box>

        {/* Perfect Square Grid - 2 rows x 3 columns */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            maxWidth: '900px',
            mx: 'auto',
          }}
        >
          {/* First Row - 3 Features */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 4,
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            {features.slice(0, 3).map((feature, index) => (
              <Zoom in={animationTrigger} timeout={800 + index * 150} key={index}>
                <Card
                  sx={{
                    width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 21px)' },
                    height: '280px',
                    borderRadius: '16px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      border: `1px solid ${feature.color}`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: feature.gradient,
                    },
                  }}
                >
                  <CardContent 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        background: feature.gradient,
                        mb: 3,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      }}
                    >
                      {feature.icon}
                    </Avatar>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: '#1a202c',
                        fontSize: '1.2rem',
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        lineHeight: 1.5,
                        fontSize: '0.95rem',
                        textAlign: 'center',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>

          {/* Second Row - 3 Features */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 4,
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            {features.slice(3, 6).map((feature, index) => (
              <Zoom in={animationTrigger} timeout={1200 + index * 150} key={index + 3}>
                <Card
                  sx={{
                    width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 21px)' },
                    height: '280px',
                    borderRadius: '16px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                      border: `1px solid ${feature.color}`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: feature.gradient,
                    },
                  }}
                >
                  <CardContent 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        background: feature.gradient,
                        mb: 3,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      }}
                    >
                      {feature.icon}
                    </Avatar>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: '#1a202c',
                        fontSize: '1.2rem',
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        lineHeight: 1.5,
                        fontSize: '0.95rem',
                        textAlign: 'center',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            ))}
          </Box>
        </Box>

        {/* Bottom tagline */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontStyle: 'italic',
            }}
          >
             Built with modern technology for maximum performance and reliability
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;