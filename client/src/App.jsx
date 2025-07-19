// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Store
import useAuthStore from './store/authStore'; 

// Components
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import LeaderDashboard from './pages/Leader/Dashboard';
import MemberDashboard from './pages/Member/Dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

// Enhanced theme for Sanchalak
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#667eea',
//       light: '#764ba2',
//       dark: '#5a6fd8',
//     },
//     secondary: {
//       main: '#E91E63',
//       light: '#F06292',
//       dark: '#C2185B',
//     },
//     success: {
//       main: '#4CAF50',
//       light: '#8BC34A',
//     },
//     warning: {
//       main: '#FF9800',
//       light: '#FFB74D',
//     },
//     background: {
//       default: '#f8fafc',
//       paper: '#ffffff',
//     },
//     text: {
//       primary: '#1a202c',
//       secondary: '#64748b',
//     },
//   },
//   typography: {
//     fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
//     h1: {
//       fontWeight: 900,
//       fontSize: '3.5rem',
//     },
//     h2: {
//       fontWeight: 800,
//       fontSize: '3rem',
//     },
//     h3: {
//       fontWeight: 700,
//       fontSize: '2.5rem',
//     },
//     h4: {
//       fontWeight: 700,
//       fontSize: '2rem',
//     },
//     h5: {
//       fontWeight: 600,
//       fontSize: '1.5rem',
//     },
//     h6: {
//       fontWeight: 600,
//       fontSize: '1.25rem',
//     },
//     body1: {
//       fontSize: '1rem',
//       lineHeight: 1.6,
//     },
//     body2: {
//       fontSize: '0.875rem',
//       lineHeight: 1.5,
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//           borderRadius: 12,
//           fontWeight: 600,
//           padding: '10px 24px',
//           fontSize: '1rem',
//           boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
//           transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
//           '&:hover': {
//             transform: 'translateY(-2px)',
//             boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
//           },
//         },
//         contained: {
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           '&:hover': {
//             background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
//           },
//         },
//         outlined: {
//           borderWidth: '2px',
//           '&:hover': {
//             borderWidth: '2px',
//           },
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
//           border: '1px solid rgba(102, 126, 234, 0.1)',
//           transition: 'all 0.3s ease',
//           '&:hover': {
//             transform: 'translateY(-4px)',
//             boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
//           },
//         },
//       },
//     },
//     MuiChip: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           fontWeight: 600,
//           fontSize: '0.875rem',
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: 16,
//           boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .MuiOutlinedInput-root': {
//             borderRadius: 12,
//             '&:hover .MuiOutlinedInput-notchedOutline': {
//               borderColor: '#667eea',
//             },
//             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//               borderColor: '#667eea',
//               borderWidth: '2px',
//             },
//           },
//         },
//       },
//     },
//   },
//   shape: {
//     borderRadius: 12,
//   },
// });

function App() {
  const { initializeAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ping`);
        console.log("Server wake-up ping sent");
      } catch (error) {
        console.error("Wake-up ping failed:", error.message);
      }
    };
  
    
    wakeUpServer();
  
    const interval = setInterval(wakeUpServer, 10 * 60 * 1000);
  
    return () => clearInterval(interval);
  }, []);

  return (
    // <ThemeProvider theme={theme}>
      // <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            {/* Landing Page - Public Route */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Navigate to={user?.role === 'leader' ? '/leader' : '/member'} replace />
                ) : (
                  <LandingPage />
                )
              } 
            />

            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to={user?.role === 'leader' ? '/leader' : '/member'} replace />
                ) : (
                  <Login />
                )
              } 
            />
            <Route 
              path="/signup" 
              element={
                isAuthenticated ? (
                  <Navigate to={user?.role === 'leader' ? '/leader' : '/member'} replace />
                ) : (
                  <Signup />
                )
              } 
            />

            {/* Protected Routes - Leader */}
            <Route
              path="/leader/*"
              element={
                <ProtectedRoute allowedRoles={['leader']}>
                  <LeaderDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Member */}
            <Route
              path="/member/*"
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Enhanced Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontSize: '0.95rem',
            }}
            progressStyle={{
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            }}
          />
        </div>
      </Router>
    // </ThemeProvider>
  );
}

export default App;