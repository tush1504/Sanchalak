// src/components/landing/TestimonialsSection.jsx
import React from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Fade,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const TestimonialsSection = ({ animationTrigger }) => {
  

  const testimonials = [
    {
      quote: "Really good design/documentation, pretty much everything is nicely setup. Support team is very responsive to problems. Highly recommended to everyone! I'm your fan already.",
      author: "Sarah Johnson",
      role: "CEO, XYZ Company",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b123?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote: "This is an example page. It's different from a blog post because it will stay in one place and will show up in your site navigation (in most themes).",
      author: "Michael Chen", 
      role: "Managing Director RRC Co.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote: "Highly recommended to everyone! I'm your fan already. Really good design/documentation, pretty much everything is nicely setup. Support team is very responsive to problems.",
      author: "Emily Rodriguez",
      role: "CEO, Tech Company",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  ];

 

  return (
    <Box
      sx={{
        width: '100%',
        py: 10,
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        position: 'relative',
        margin: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ width: '100%' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: '#1a202c',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Our Happy Customers
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#64748b',
              fontWeight: 400,
              fontSize: '1.2rem',
            }}
          >
            Words of praise by our valuable customers
          </Typography>
        </Box>

        {/* Testimonials Row */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              justifyContent: 'center',
              alignItems: 'stretch',
              overflow: 'hidden',
              px: { xs: 0, md: 8 },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <Fade in={animationTrigger} timeout={1000 + index * 200} key={index}>
                <Card
                  sx={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    flex: '1',
                    minWidth: { xs: '280px', md: '320px' },
                    maxWidth: { xs: '320px', md: '380px' },
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <CardContent 
                    sx={{ 
                      p: 4, 
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#4a5568',
                        lineHeight: 1.6,
                        mb: 3,
                        fontSize: '0.95rem',
                        fontWeight: 400,
                        flex: 1,
                      }}
                    >
                      {testimonial.quote}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                      <Avatar
                        src={testimonial.avatar}
                        sx={{
                          width: 48,
                          height: 48,
                          mr: 2,
                          border: '2px solid #f1f5f9',
                        }}
                      />
                      <Box>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 600,
                            color: '#1a202c',
                            fontSize: '1rem',
                            mb: 0.5,
                          }}
                        >
                          {testimonial.author}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontSize: '0.875rem',
                          }}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;