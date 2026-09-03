import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Assignment, History, Settings } from '@mui/icons-material';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import ManagerAvailableValuations from './ManagerAvailableValuations';
import ManagerHistory from './ManagerHistory';
import UserSettings from '../user-dashboard/UserSettings';

const menuItems = [
  { key: 'available', label: 'Available Valuations', icon: <Assignment /> },
  { key: 'history', label: 'Valuation History', icon: <History /> },
  { key: 'settings', label: 'Settings', icon: <Settings /> },
];

const pageMap = {
  'available': { title: 'Available Valuations', component: <ManagerAvailableValuations /> },
  'history': { title: 'Valuation History', component: <ManagerHistory /> },
  'settings': { title: 'Account Settings', component: <UserSettings /> },
};

const ManagerDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('available');
  const page = pageMap[activeMenu];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff' }}>
      <DashboardSidebar
        menuItems={menuItems}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        roleLabel="MANAGER PANEL"
        roleColor="#0066cc"
      />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: '#fff' }}>
        <Typography variant="h4" fontWeight={800} color="#0f172a" mb={4} sx={{ borderLeft: '4px solid #0066cc', pl: 2 }}>
          {page?.title}
        </Typography>
        {page?.component}
      </Box>
    </Box>
  );
};

export default ManagerDashboard;
