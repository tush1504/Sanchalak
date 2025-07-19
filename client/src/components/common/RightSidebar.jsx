// src/components/common/RightSidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Toolbar,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  WbSunny,
  NightsStay,
  CloudQueue,
  AccessTime,
  CalendarMonth,
  Today,
  Business,
} from '@mui/icons-material';

const RightSidebar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get calendar data for current month
  const getCalendarData = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    const firstDay = new Date(year, month, 1);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const current = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push({
          date: current.getDate(),
          isCurrentMonth: current.getMonth() === month,
          isToday: current.getMonth() === month && current.getDate() === today,
          fullDate: new Date(current),
        });
        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);
    }
    
    return {
      calendar,
      monthName: now.toLocaleDateString('en-US', { month: 'long' }),
      year,
      today,
    };
  };

  // Get time-based theme
  const getTimeTheme = () => {
    const hour = currentTime.getHours();
    
    if (hour < 6) {
      return { 
        period: "Night", 
        icon: <NightsStay />, 
        gradient: 'linear-gradient(135deg, #2C3E50 0%, #3F51B5 100%)',
        message: "Late Night Focus"
      };
    } else if (hour < 12) {
      return { 
        period: "Morning", 
        icon: <WbSunny />, 
        gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
        message: "Fresh Start"
      };
    } else if (hour < 17) {
      return { 
        period: "Afternoon", 
        icon: <WbSunny />, 
        gradient: 'linear-gradient(135deg, #FF7043 0%, #FFAB91 100%)',
        message: "Peak Hours"
      };
    } else if (hour < 22) {
      return { 
        period: "Evening", 
        icon: <CloudQueue />, 
        gradient: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
        message: "Winding Down"
      };
    } else {
      return { 
        period: "Night", 
        icon: <NightsStay />, 
        gradient: 'linear-gradient(135deg, #2C3E50 0%, #3F51B5 100%)',
        message: "Evening Focus"
      };
    }
  };

  // Format time
  const formatTime = (date) => {
    return {
      time: date.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
      }),
      seconds: date.getSeconds(),
    };
  };

  const calendarData = getCalendarData();
  const timeTheme = getTimeTheme();
  const { time, seconds } = formatTime(currentTime);

  return (
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 1,
        },
      }}
    >
      <Toolbar />
      
      <Box sx={{ 
        p: 2, 
        flexGrow: 1, 
        position: 'relative', 
        zIndex: 2, 
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: 'calc(100vh - 64px)', // Account for toolbar
      }}>
        
        {/* 1. TIME SECTION */}
        <Card
          sx={{
            background: timeTheme.gradient,
            borderRadius: '16px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
            color: 'white',
            flex: '0 0 auto',
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 2.5, px: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  mr: 1,
                  width: 32,
                  height: 32,
                  backdropFilter: 'blur(10px)',
                }}
              >
                {timeTheme.icon}
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {timeTheme.period}
              </Typography>
            </Box>
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 1,
                fontFamily: '"Roboto Mono", monospace',
                textShadow: '0 3px 10px rgba(0,0,0,0.3)',
                letterSpacing: '1px',
                fontSize: '2.5rem',
              }}
            >
              {time}
            </Typography>
            
            {/* Seconds Progress */}
            <Box sx={{ width: '70%', mx: 'auto', mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={(seconds / 60) * 100}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'white',
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
            
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
              {timeTheme.message}
            </Typography>
          </CardContent>
        </Card>

        {/* 2. DATE SECTION */}
        <Card
          sx={{
            background: timeTheme.gradient,
            borderRadius: '16px',
            boxShadow: '0 12px 28px rgba(76, 175, 80, 0.15)',
            color: 'white',
            flex: '0 0 auto',
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 2.5}}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  mr: 1,
                  width: 32,
                  height: 32,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CalendarMonth />
              </Avatar>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                Today's Date
              </Typography>
            </Box>
            
            {/* Large Day Number */}
            <Typography
              variant="h1"
              sx={{
                fontWeight: 500,
                
                fontFamily: '"Roboto", sans-serif',
                textShadow: '0 3px 10px rgba(0,0,0,0.3)',
                letterSpacing: '2px',
                fontSize: '3rem',
                lineHeight: 1,
              }}
            >
              {calendarData.today}
            </Typography>
            
            {/* Month */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                
                textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                letterSpacing: '1px',
                fontSize: '1.8rem',
              }}
            >
              {calendarData.monthName.toUpperCase()}
            </Typography>
            
            {/* Day and Year */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                opacity: 0.95,
                fontSize: '1.1rem',
              }}
            >
              {currentTime.toLocaleDateString('en-US', { weekday: 'long' })}, {calendarData.year}
            </Typography>
          </CardContent>
        </Card>

        {/* 3. SANCHALAK SECTION */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
            borderRadius: '16px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
            color: 'white',
            flex: '0 0 auto',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#667eea',
                  width: 36,
                  height: 36,
                  mr: 1.5,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                }}
              >
                <Business sx={{ fontSize: 20 }} />
              </Avatar>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 900,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.3rem',
                }}
              >
                Sanchalak
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              sx={{ 
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.85rem',
                textAlign: 'justify',
              }}
            >
              <strong>Your Ultimate Task Management Solution.</strong><br/>
              Streamline team collaboration, track progress, and achieve goals efficiently.<br/>
              Built for leaders and teams who value productivity and organization.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default RightSidebar;