// src/components/landing/CTASection.jsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100%',
        py: 10,
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textAlign: 'center',
        color: 'white',
        margin: 0,
      }}
    >
      <Container maxWidth="md" sx={{ width: '100%' }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            mb: 3,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
           Ready to Transform Your Team?
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 6,
            opacity: 0.9,
            lineHeight: 1.6,
          }}
        >
          Join the productivity revolution. Start managing your tasks like never before.
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            endIcon={<ArrowForward />}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.3rem',
              fontWeight: 700,
              borderRadius: '50px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'translateY(-5px) scale(1.05)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Start Your Journey
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '50px',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-3px)',
              },
            }}
          >
            I Have an Account
          </Button>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: 4,
            opacity: 0.8,
          }}
        >
           Free forever • No credit card required • Setup in 2 minutes
        </Typography>
      </Container>
    </Box>
  );
};

export default CTASection;