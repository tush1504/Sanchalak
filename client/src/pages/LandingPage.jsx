// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

// Components
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';

const LandingPage = () => {
  const [animationTrigger, setAnimationTrigger] = useState(false);

  useEffect(() => {
    setAnimationTrigger(true);
  }, []);

  return (
    <Box 
      sx={{ 
        width: '100%',
        minHeight: '100vh', 
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <HeroSection animationTrigger={animationTrigger} />
      <FeaturesSection animationTrigger={animationTrigger} />
      <TestimonialsSection animationTrigger={animationTrigger} />
      <CTASection />

      {/* Global CSS animations */}
      <style jsx global>{`
        @keyframes progressLoad {
          0% { width: 0%; }
          100% { width: 95%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          width: 100%;
        }
      `}</style>
    </Box>
  );
};

export default LandingPage;