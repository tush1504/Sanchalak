// src/pages/Leader/StunningMembers.jsx - Replace your Members.jsx with this
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Fab,
  Avatar,
  LinearProgress,
  Paper,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  People,
  Refresh,
  Person,
  AdminPanelSettings,
  TrendingUp,
  Rocket,
  Star,
  Security,
} from '@mui/icons-material';

// Store
import useLeaderStore from '../../store/leaderStore';
import useDashboardStore from '../../store/dashboardStore';

// Components  
import BeautifulMemberCard from '../../components/leader/BeautifulMemberCard';
import AddMemberModal from '../../components/leader/AddMemberModal';
import RemoveMemberDialog from '../../components/leader/RemoveMemberDialog';

const StunningMembers = () => {
  const {
    members,
    isLoading,
    isActionLoading,
    error,
    fetchAllMembers,
    addMember,
    removeMember,
    searchMembers,
    filterMembersByRole,
    getMembersByRoleCount,
    needsRefresh,
    refreshMembers,
    clearError,
  } = useLeaderStore();

  const { refreshDashboard } = useDashboardStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch members on component mount
  useEffect(() => {
    if (needsRefresh() || members.length === 0) {
      fetchAllMembers();
    }
  }, [fetchAllMembers, needsRefresh, members.length]);

  // Clear error on mount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Filter and search members
  const getFilteredMembers = () => {
    let filteredMembers = members;
    filteredMembers = filterMembersByRole(roleFilter);
    if (searchTerm) {
      filteredMembers = searchMembers(searchTerm);
    }
    return filteredMembers;
  };

  const filteredMembers = getFilteredMembers();
  const memberCounts = getMembersByRoleCount();

  // Handlers
  const handleRefresh = async () => {
    await refreshMembers();
    await refreshDashboard('leader');
  };

  const handleAddMember = async (memberData) => {
    const result = await addMember(memberData);
    if (result.success) {
      await refreshDashboard('leader');
    }
    return result;
  };

  const handleRemoveMember = async (memberId) => {
    const result = await removeMember(memberId);
    if (result.success) {
      await refreshDashboard('leader');
    }
    return result;
  };

  const handleRemoveMemberClick = (member) => {
    setSelectedMember(member);
    setRemoveDialogOpen(true);
  };

  // Beautiful stat card component
  const StunningStatCard = ({ title, value, icon, color, subtitle, percentage }) => (
    <Card
      sx={{
        height: '190px', // Reduced from 180px
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
      <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 2, height: '100%' }}> {/* Reduced padding */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}> {/* Reduced margin */}
          <Avatar 
            sx={{ 
              bgcolor: color, 
              mr: 2, 
              width: 50,  // Reduced from 60
              height: 50, // Reduced from 60
              boxShadow: `0 8px 20px ${color}40`,
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 24 } })} {/* Smaller icon */}
          </Avatar>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, color, mb: 0.5, fontSize: '2rem' }}> {/* Reduced from 2.5rem */}
              {value}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a202c', fontSize: '0.95rem' }}> {/* Smaller font */}
              {title}
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500, display: 'block' }}> {/* Smaller text */}
          {subtitle}
        </Typography>
        {percentage && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}> {/* Reduced margin */}
              <Typography variant="caption" fontWeight={600} sx={{ fontSize: '0.7rem' }}>Growth</Typography>
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
                height: 6, // Kept same height for visibility
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* STUNNING Hero Header */}
      <Box 
        sx={{ 
          mb: 5, 
          p: 5,
          borderRadius: '25px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(102, 126, 234, 0.3)',
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
                 Team Command Center
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, mb: 3, maxWidth: '600px' }}>
                Manage your elite team members and build something extraordinary together
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Rocket />}
                  label="Team Building"
                  size="large"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Chip 
                  icon={<Security />}
                  label="Role Management"
                  size="large"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Chip 
                  icon={<Star />}
                  label="Performance"
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
                onClick={handleRefresh}
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
                Refresh Data
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => setAddModalOpen(true)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)',
                  fontWeight: 700,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Add Member
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* STUNNING Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} md={4}>
          <StunningStatCard
            title="Team Strength"
            value={memberCounts.total}
            icon={<People sx={{ fontSize: 30 }} />}
            color="#2196F3"
            subtitle="Active team members working together"
            percentage={memberCounts.total > 0 ? 85 : 0}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StunningStatCard
            title="Leaders"
            value={memberCounts.leaders}
            icon={<AdminPanelSettings sx={{ fontSize: 30 }} />}
            color="#9C27B0"
            subtitle="Leaders driving excellence"
            percentage={memberCounts.leaders > 0 ? 92 : 0}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StunningStatCard
            title="Members"
            value={memberCounts.members}
            icon={<Person sx={{ fontSize: 30 }} />}
            color="#4CAF50"
            subtitle="Contributors making impact"
            percentage={memberCounts.members > 0 ? 78 : 0}
          />
        </Grid>
      </Grid>

      {/* ENHANCED Search Section */}
      <Card 
        sx={{ 
          mb: 4,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '2px solid #e2e8f0',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TrendingUp sx={{ mr: 2, color: '#667eea', fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
              🔍 Find Your Team Members
            </Typography>
          </Box>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#667eea', fontSize: 24 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '15px',
                    bgcolor: 'white',
                    height: '60px',
                    fontSize: '1.1rem',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                      borderWidth: 2,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#667eea',
                      borderWidth: 2,
                    },
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel sx={{ fontSize: '1.1rem' }}>Filter by Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Filter by Role"
                  onChange={(e) => setRoleFilter(e.target.value)}
                  sx={{ 
                    borderRadius: '15px',
                    bgcolor: 'white',
                    height: '60px',
                    fontSize: '1.1rem',
                  }}
                >
                  <MenuItem value="all">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <People sx={{ mr: 2, color: '#64748b' }} />
                      All Roles
                    </Box>
                  </MenuItem>
                  <MenuItem value="leader">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AdminPanelSettings sx={{ mr: 2, color: '#9c27b0' }} />
                      Leaders Only
                    </Box>
                  </MenuItem>
                  <MenuItem value="member">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 2, color: '#4caf50' }} />
                      Members Only
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Active Filters */}
          {(searchTerm || roleFilter !== 'all') && (
            <Box sx={{ 
              mt: 3, 
              p: 3, 
              bgcolor: '#f1f5f9', 
              borderRadius: '15px', 
              border: '2px solid #e2e8f0' 
            }}>
              <Typography variant="h6" sx={{ color: '#475569', mb: 2, fontWeight: 600 }}>
                🎯 Active Filters
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {searchTerm && (
                  <Chip
                    label={`Search: "${searchTerm}"`}
                    onDelete={() => setSearchTerm('')}
                    sx={{
                      bgcolor: '#dbeafe',
                      color: '#1e40af',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      height: '35px',
                    }}
                  />
                )}
                {roleFilter !== 'all' && (
                  <Chip
                    label={`Role: ${roleFilter}`}
                    onDelete={() => setRoleFilter('all')}
                    sx={{
                      bgcolor: '#fce7f3',
                      color: '#be185d',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      height: '35px',
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4,
            borderRadius: '15px',
            border: '2px solid #fca5a5',
            bgcolor: '#fef2f2',
            fontSize: '1.1rem',
            fontWeight: 600,
          }} 
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && members.length === 0 && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            bgcolor: 'white',
            borderRadius: '25px',
            border: '2px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          }}
        >
          <CircularProgress size={80} sx={{ mb: 3, color: '#667eea' }} />
          <Typography variant="h5" sx={{ color: '#475569', fontWeight: 600 }}>
            Loading your amazing team...
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
            Please wait while we fetch the latest data
          </Typography>
        </Box>
      )}

      {/* Members Grid */}
      {!isLoading || members.length > 0 ? (
        <Box>
          {filteredMembers.length > 0 ? (
            <>
              {/* Results Header */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 4,
                  p: 3,
                  bgcolor: 'white',
                  borderRadius: '15px',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                }}
              >
                <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 700 }}>
                  👥 Your Team ({filteredMembers.length} members)
                </Typography>
                <Chip 
                  label={`${Math.round((filteredMembers.length / Math.max(members.length, 1)) * 100)}% shown`}
                  sx={{ 
                    bgcolor: '#f0f9ff', 
                    color: '#0369a1', 
                    fontWeight: 700,
                    fontSize: '1rem',
                    height: '40px',
                  }}
                />
              </Box>

              {/* Beautiful Member Cards Grid */}
              <Grid container spacing={4}>
                {filteredMembers.map((member) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={member._id}>
                    <BeautifulMemberCard
                      member={member}
                      onRemove={handleRemoveMemberClick}
                      isActionLoading={isActionLoading}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            /* Empty State */
            <Paper 
              sx={{ 
                p: 8, 
                textAlign: 'center', 
                borderRadius: '25px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: '3px dashed #cbd5e1',
                boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
              }}
            >
              <People sx={{ fontSize: 150, color: '#94a3b8', mb: 4 }} />
              <Typography variant="h3" sx={{ color: '#475569', mb: 3, fontWeight: 800 }}>
                {searchTerm || roleFilter !== 'all' 
                  ? '🔍 No Members Found'
                  : '🚀 Build Your Dream Team'
                }
              </Typography>
              <Typography variant="h6" sx={{ color: '#64748b', mb: 5, maxWidth: 500, mx: 'auto' }}>
                {searchTerm || roleFilter !== 'all'
                  ? 'Try adjusting your search terms or filters to find the members you\'re looking for.'
                  : 'Start building your amazing team by adding your first member. Great things happen when great people work together!'
                }
              </Typography>
              {(!searchTerm && roleFilter === 'all') && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={() => setAddModalOpen(true)}
                  sx={{
                    borderRadius: '15px',
                    py: 2,
                    px: 5,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 20px 45px rgba(102, 126, 234, 0.5)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Add Your First Team Member
                </Button>
              )}
            </Paper>
          )}
        </Box>
      ) : null}

      {/* Floating Action Button (Mobile) */}
      <Fab
        onClick={() => setAddModalOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          display: { xs: 'flex', md: 'none' },
          width: 70,
          height: 70,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            transform: 'scale(1.1)',
            boxShadow: '0 20px 45px rgba(102, 126, 234, 0.5)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <Add sx={{ fontSize: 30 }} />
      </Fab>

      {/* Modals */}
      <AddMemberModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddMember}
        isLoading={isActionLoading}
      />

      <RemoveMemberDialog
        open={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        onConfirm={handleRemoveMember}
        member={selectedMember}
        isLoading={isActionLoading}
      />
    </Box>
  );
};

export default StunningMembers;