
// src/pages/Leader/ActivityLog.jsx
import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  Stack
} from '@mui/material';
import {
  Search,
  FilterList,
  Refresh,
  Person,
  Schedule,
  Clear
} from '@mui/icons-material';
import useActivityStore from '../../store/activityStore';

const ActivityLog = () => {
  const {
    logs,
    loading,
    error,
    filters,
    updateFilter,
    clearFilters,
    fetchActivityLogs,
    applyFilters,
    clearAndReload,
    refreshLogs,
    getFilteredLogs
  } = useActivityStore();

  const filteredLogs = getFilteredLogs();

  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    return role === 'Leader' ? 'primary' : 'secondary';
  };

  const getActionIcon = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('member created')) return '👤';
    if (actionLower.includes('task created')) return '📝';
    if (actionLower.includes('task updated')) return '✏️';
    if (actionLower.includes('task deleted')) return '🗑️';
    if (actionLower.includes('member removed')) return '❌';
    return '📋';
  };

  const getActionColor = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('created')) return '#4caf50';
    if (actionLower.includes('updated')) return '#2196f3';
    if (actionLower.includes('deleted') || actionLower.includes('removed')) return '#f44336';
    return '#757575';
  };

  const handleFilterChange = (key, value) => {
    updateFilter(key, value);
  };

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleClearFilters = () => {
    clearAndReload();
  };

  const handleRefresh = () => {
    refreshLogs();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 600 }}>
          Activity Log
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track all user activities and system events
        </Typography>
      </Box>

      {/* Filters Section */}
      <Card sx={{ mb: 3, bgcolor:'#f1f2fd'}}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterList sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6" component="h2">
              Filters
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            {/* Search */}
            <Grid item xs={12} md={6} lg={3}>
              <TextField
                fullWidth
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* User Filter */}
            <Grid item xs={12} md={6} lg={2}>
              <TextField
                fullWidth
                label="User ID"
                value={filters.user}
                onChange={(e) => handleFilterChange('user', e.target.value)}
              />
            </Grid>

            {/* Role Filter */}
            <Grid item xs={12} md={6} lg={2}>
              <FormControl fullWidth>
                <InputLabel shrink>Role</InputLabel>
                <Select
                  value={filters.role}
                  label="Role"
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  displayEmpty
                  sx={{
                    minWidth: 120, // Ensure minimum width
                    '& .MuiSelect-select': {
                      paddingTop: '16px', // Add top padding when label is shrunk
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>All Roles</em>
                  </MenuItem>
                  <MenuItem value="Leader">Leader</MenuItem>
                  <MenuItem value="Member">Member</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Date From */}
            <Grid item xs={12} md={6} lg={2}>
              <TextField
                fullWidth
                type="date"
                label="From Date"
                value={filters.from}
                onChange={(e) => handleFilterChange('from', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(0)', // Makes the icon black
                    cursor: 'pointer',
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator:hover': {
                    filter: 'invert(0.2)', // Slightly darker on hover
                  },
                }}
              />
            </Grid>

            {/* Date To */}
            <Grid item xs={12} md={6} lg={2}>
              <TextField
                fullWidth
                type="date"
                label="To Date"
                value={filters.to}
                onChange={(e) => handleFilterChange('to', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter: 'invert(0)', // Makes the icon black
                    cursor: 'pointer',
                  },
                  '& input[type="date"]::-webkit-calendar-picker-indicator:hover': {
                    filter: 'invert(0.2)', // Slightly darker on hover
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<FilterList />}
                onClick={handleApplyFilters}
                disabled={loading}
              >
                Apply Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClearFilters}
                disabled={loading}
              >
                Clear All
              </Button>
            </Stack>
            <Button
              variant="contained"
              color="success"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Showing {filteredLogs.length} of {logs.length} activities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Paper>

      {/* Activity Logs */}
      <Card sx={{bgcolor:'#fef5f0'}}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Loading activity logs...
              </Typography>
            </Box>
          </Box>
        ) : error ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={handleRefresh}
            >
              Try Again
            </Button>
          </Box>
        ) : filteredLogs.length === 0 ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Activities Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {logs.length === 0 
                ? "No activity logs available" 
                : "Try adjusting your filters or search terms"
              }
            </Typography>
          </Box>
        ) : (
          <Box>
            {filteredLogs.map((log, index) => (
              <Box key={log._id}>
                <Box sx={{ p: 3, '&:hover': { bgcolor: 'action.hover' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getActionColor(log.action),
                        width: 40, 
                        height: 40,
                        fontSize: '1.2rem'
                      }}
                    >
                      {getActionIcon(log.action)}
                    </Avatar>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {log.user?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({log.user?.email || 'No email'})
                        </Typography>
                        <Chip 
                          label={log.role} 
                          color={getRoleColor(log.role)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body1" component="span" sx={{ fontWeight: 500 }}>
                          {log.action}
                        </Typography>
                        <Typography variant="body1" component="span" color="text.secondary" sx={{ mx: 1 }}>
                          →
                        </Typography>
                        <Typography variant="body1" component="span" color="primary.main" sx={{ fontWeight: 500 }}>
                          {log.target}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(log.timestamp)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {index < filteredLogs.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default ActivityLog;