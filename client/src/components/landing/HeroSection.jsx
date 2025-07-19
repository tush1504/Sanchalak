// src/components/landing/HeroSection.jsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Avatar,
  Chip,
  Paper,
  Fade,
  Slide,
} from '@mui/material';
import {
  PlayArrow,
  Star,
  EmojiEvents,
  Security,
  Business,
  Rocket,
  CheckCircle,
  Speed,
  People,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ animationTrigger }) => {
  const navigate = useNavigate();

  const stats = [
    { number: '100%', label: 'Task Completion Tracking', icon: <CheckCircle /> },
    { number: '24/7', label: 'Real-time Collaboration', icon: <Speed /> },
    { number: '∞', label: 'Scalable Team Size', icon: <People /> },
    { number: '99.9%', label: 'Uptime Reliability', icon: <Security /> },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: { xs: '60px 20px', md: '80px 40px' },
        margin: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -200,
          right: -200,
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 6s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          animation: 'float 8s ease-in-out infinite reverse',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, width: '100%', px: { xs: 2, md: 4 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in={animationTrigger} timeout={1000}>
              <Box sx={{ pr: { md: 4 } }}>
                {/* Logo/Brand */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      mr: 3,
                    }}
                  >
                    <Business sx={{ fontSize: 40, color: 'white' }} />
                  </Avatar>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      background: 'linear-gradient(45deg, #ffffff 30%, #f0f8ff 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                  >
                    Sanchalak
                  </Typography>
                </Box>

                {/* Tagline */}
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    mb: 3,
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    fontSize: { xs: '2rem', md: '3rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Your Ultimate Task Management Revolution
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 500,
                    mb: 4,
                    lineHeight: 1.6,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                  }}
                >
                  Streamline team collaboration, track progress, and achieve goals efficiently. 
                  Built for leaders and teams who value productivity and organization.
                </Typography>

                {/* CTA Buttons */}
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup')}
                    startIcon={<Rocket />}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      borderRadius: '50px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Started Free
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    startIcon={<PlayArrow />}
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '50px',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Sign In
                  </Button>
                </Box>

                {/* Trust Indicators */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<Star sx={{ color: '#FFD700 !important' }} />}
                    label="5.0 ★ ★ ★ ★ ★"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  <Chip
                    icon={<EmojiEvents sx={{ color: '#FFD700 !important' }} />}
                    label="Award Winning Design"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  <Chip
                    icon={<Security />}
                    label="100% Secure"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                </Box>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={6}>
            <Slide direction="left" in={animationTrigger} timeout={1200}>
              <Box sx={{ pl: { md: 4 } }}>
                {/* Dashboard Preview */}
                <Paper
                  elevation={24}
                  sx={{
                    p: 3,
                    borderRadius: '25px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.02)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                    🚀 Live Dashboard Preview
                  </Typography>
                  
                  {/* Mini Dashboard Cards */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <Paper
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '15px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            },
                          }}
                        >
                          <Avatar sx={{ bgcolor: '#667eea', mx: 'auto', mb: 1 }}>
                            {stat.icon}
                          </Avatar>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: '#667eea' }}>
                            {stat.number}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                            {stat.label}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Progress Bars */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      Team Performance: 95%
                    </Typography>
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.3)',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: '95%',
                          background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                          borderRadius: 4,
                          animation: 'progressLoad 2s ease-in-out',
                        }}
                      />
                    </Box>
                  </Box>

                  <Chip
                    label="✨ Real-time Updates"
                    sx={{
                      background: '#4CAF50',
                      color: 'white',
                      fontWeight: 600,
                      animation: 'pulse 2s infinite',
                    }}
                  />
                </Paper>
              </Box>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;