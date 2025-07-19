// src/pages/Member/Dashboard.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Assignment,
} from '@mui/icons-material';

import Layout from '../../components/common/Layout';
import MemberHome from './MemberHome';
import MyTasks from './MyTasks';


const MemberDashboard = () => {


  const sidebarItems = [
    {
      label: 'Dashboard',
      path: '/member',
      icon: <DashboardIcon />,
    },
    {
      label: 'My Tasks',
      path: '/member/tasks',
      icon: <Assignment />,
    },
  ];

  return (
    <Layout sidebarItems={sidebarItems}>
      <Routes>
        <Route index element={<MemberHome />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="*" element={<Navigate to="/member" replace />} />
      </Routes>
    </Layout>
  );
};

export default MemberDashboard;