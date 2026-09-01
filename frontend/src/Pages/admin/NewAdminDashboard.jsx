import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Dashboard, Assignment, History, BarChart, Settings, People } from '@mui/icons-material';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import AdminSummary from './AdminSummary';
import AdminRegisteredUsers from './AdminRegisteredUsers';
import AdminAvailableValuations from './AdminAvailableValuations';
import AdminHistory from './AdminHistory';
import AdminPerformance from './AdminPerformance';
import AdminSettings from './AdminSettings';
import { valuationService } from '../../services/services';

const menuItems = [
  { key: 'summary', label: 'Dashboard Summary', icon: <Dashboard /> },
  { key: 'available', label: 'Available Valuations', icon: <Assignment /> },
  { key: 'history', label: 'Valuation History', icon: <History /> },
  { key: 'performance', label: 'Performance', icon: <BarChart /> },
  { key: 'users', label: 'Registered Users', icon: <People /> },
  { key: 'settings', label: 'Settings', icon: <Settings /> },
];

const NewAdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('summary');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [availableValuations, setAvailableValuations] = useState([]);

  useEffect(() => {
    let mounted = true;
    valuationService.getAll({ status: 'MANAGER_APPROVED', limit: 100 })
      .then((res) => {
        if (mounted && res.data && Array.isArray(res.data.data)) {
          setAvailableValuations(res.data.data);
        }
      })
      .catch((err) => console.error(err));

    return () => { mounted = false; };
  }, []);

  const { companyCounts, totalAvailableCount } = useMemo(() => {
    const countsMap = {};
    availableValuations.forEach((v) => {
      const compName = v.submittedBy?.company?.name || 'Other Company';
      countsMap[compName] = (countsMap[compName] || 0) + 1;
    });

    const list = Object.entries(countsMap)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({ name, count }));

    return { companyCounts: list, totalAvailableCount: availableValuations.length };
  }, [availableValuations]);

  const pageMap = {
    'summary': { title: 'Dashboard Overview', component: <AdminSummary /> },
    'users': { title: 'Registered Users', component: <AdminRegisteredUsers /> },
    'available': { title: 'Available Valuations', component: <AdminAvailableValuations selectedCompany={selectedCompany} onRefresh={() => {
      valuationService.getAll({ status: 'MANAGER_APPROVED', limit: 100 })
        .then((res) => { if (res.data && Array.isArray(res.data.data)) setAvailableValuations(res.data.data); });
    }} /> },
    'history': { title: 'Valuation History', component: <AdminHistory /> },
    'performance': { title: 'Performance Analytics', component: <AdminPerformance /> },
    'settings': { title: 'System Settings', component: <AdminSettings /> },
  };

  const page = pageMap[activeMenu];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff' }}>
        <DashboardSidebar
        menuItems={menuItems}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        roleLabel="ADMIN CONTROL"
        roleColor="#990000"
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        companyCounts={companyCounts}
        totalAvailableCount={totalAvailableCount}
      />
      
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: '#fff' }}>
        <Typography variant="h4" fontWeight={800} color="#0f172a" mb={4} sx={{ borderLeft: '4px solid #990000', pl: 2 }}>
          {page?.title}
        </Typography>
        {page?.component}
      </Box>
    </Box>
  );
};

export default NewAdminDashboard;
