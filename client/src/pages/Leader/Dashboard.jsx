// src/pages/Leader/Dashboard.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People,
  Assignment,
  Timeline,
} from '@mui/icons-material';

import Layout from '../../components/common/Layout';
import LeaderHome from './LeaderHome';
import Members from './Members';
import Tasks from './Tasks';
import ActivityLog from './ActivityLog';


const LeaderDashboard = () => {

 

  const sidebarItems = [
    {
      label: 'Dashboard',
      path: '/leader',
      icon: <DashboardIcon />,
    },
    {
      label: 'My Team',
      path: '/leader/members',
      icon: <People />// We'll make this dynamic later
    },
    {
      label: 'Tasks',
      path: '/leader/tasks',
      icon: <Assignment />, // We'll make this dynamic later
    },
    {
      label: 'Activity Log',
      path: '/leader/activity',
      icon: <Timeline />,
    },
  ];

  return (
    <Layout sidebarItems={sidebarItems}>
      <Routes>
        <Route index element={<LeaderHome />} />
        <Route path="members" element={<Members />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="activity" element={<ActivityLog />} />
        <Route path="*" element={<Navigate to="/leader" replace />} />
      </Routes>
    </Layout>
  );
};

export default LeaderDashboard;