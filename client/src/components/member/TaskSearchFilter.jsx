// src/components/member/TaskSearchFilter.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search,
  TrendingUp,
  Schedule,
  PlayArrow,
  CheckCircle,
  Flag,
} from '@mui/icons-material';

const TaskSearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  priorityFilter, 
  setPriorityFilter 
}) => {
  return (
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
          <TrendingUp sx={{ mr: 2, color: '#9C27B0', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
            🔍 Find Your Tasks
          </Typography>
        </Box>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by task title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#9C27B0', fontSize: 24 }} />
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
                    borderColor: '#9C27B0',
                    borderWidth: 2,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9C27B0',
                    borderWidth: 2,
                  },
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: '1.1rem' }}>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ 
                  borderRadius: '15px',
                  bgcolor: 'white',
                  height: '60px',
                  fontSize: '1.1rem',
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="Pending">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Schedule sx={{ mr: 1, color: '#ff9800' }} />
                    Pending
                  </Box>
                </MenuItem>
                <MenuItem value="In-Progress">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PlayArrow sx={{ mr: 1, color: '#2196f3' }} />
                    In Progress
                  </Box>
                </MenuItem>
                <MenuItem value="Completed">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ mr: 1, color: '#4caf50' }} />
                    Completed
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: '1.1rem' }}>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
                sx={{ 
                  borderRadius: '15px',
                  bgcolor: 'white',
                  height: '60px',
                  fontSize: '1.1rem',
                }}
              >
                <MenuItem value="all">All Priority</MenuItem>
                <MenuItem value="High">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Flag sx={{ mr: 1, color: '#f44336' }} />
                     High
                  </Box>
                </MenuItem>
                <MenuItem value="Medium">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Flag sx={{ mr: 1, color: '#ff9800' }} />
                     Medium
                  </Box>
                </MenuItem>
                <MenuItem value="Low">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Flag sx={{ mr: 1, color: '#4caf50' }} />
                     Low
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        {/* Active Filters */}
        {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
          <Box sx={{ 
            mt: 3, 
            p: 3, 
            bgcolor: '#f1f5f9', 
            borderRadius: '15px', 
            border: '2px solid #e2e8f0' 
          }}>
            <Typography variant="h6" sx={{ color: '#475569', mb: 2, fontWeight: 600 }}>
               Active Filters
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={() => setSearchTerm('')}
                  sx={{
                    bgcolor: '#f3e8ff',
                    color: '#7c3aed',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    height: '35px',
                  }}
                />
              )}
              {statusFilter !== 'all' && (
                <Chip
                  label={`Status: ${statusFilter}`}
                  onDelete={() => setStatusFilter('all')}
                  sx={{
                    bgcolor: '#dbeafe',
                    color: '#1e40af',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    height: '35px',
                  }}
                />
              )}
              {priorityFilter !== 'all' && (
                <Chip
                  label={`Priority: ${priorityFilter}`}
                  onDelete={() => setPriorityFilter('all')}
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
  );
};

export default TaskSearchFilter;