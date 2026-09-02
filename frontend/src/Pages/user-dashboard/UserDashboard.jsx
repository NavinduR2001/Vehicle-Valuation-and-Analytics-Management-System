import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { AddCircleOutline, History, Settings } from '@mui/icons-material';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import NewValuation from './NewValuation';
import ValuationHistory from './ValuationHistory';
import UserSettings from './UserSettings';

const menuItems = [
  { key: 'new-valuation', label: 'New Valuation', icon: <AddCircleOutline /> },
  { key: 'history', label: 'Valuation History', icon: <History /> },
  { key: 'settings', label: 'Settings', icon: <Settings /> },
];

const pageMap = {
  'new-valuation': { title: 'New Valuation Request', component: <NewValuation /> },
  'history': { title: 'Valuation History', component: <ValuationHistory /> },
  'settings': { title: 'Account Settings', component: <UserSettings /> },
};

const UserDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('new-valuation');
  const page = pageMap[activeMenu];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff' }}>
      <DashboardSidebar
        menuItems={menuItems}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        roleLabel="USER PORTAL"
        roleColor="#990000"
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          minHeight: '100vh',
          bgcolor: '#fff',
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          color="#0f172a"
          mb={4}
          sx={{
            borderLeft: '4px solid #990000',
            pl: 2,
            '& span': { color: '#990000' },
          }}
        >
          {page?.title}
        </Typography>

        {page?.component}
      </Box>
    </Box>
  );
};

export default UserDashboard;
