import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Chip, Collapse, Tooltip,
} from '@mui/material';
import { LogoutRounded, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { imageUrl } from '../../services/services';
import { Logo } from '../../assets/assets';

const DRAWER_WIDTH = 275;

const DashboardSidebar = ({
  menuItems,
  activeMenu,
  setActiveMenu,
  roleLabel,
  roleColor = '#990000',
  selectedCompany = 'All',
  setSelectedCompany = () => {},
  companyCounts = [],
  totalAvailableCount = 0,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openAvailable, setOpenAvailable] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (u) =>
    u ? `${(u.firstName || '')[0]}${(u.lastName || '')[0]}`.toUpperCase() : 'U';

  const activeCompanies = companyCounts.filter((c) => c.count > 0);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f7fb 100%)',
          borderRight: '1px solid rgba(15, 23, 42, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ pt: 3, pb: 2, px: 2, textAlign: 'center', borderBottom: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <img src={Logo} alt="Logo" style={{ height: 48, objectFit: 'contain' }} />
      </Box>

      {/* Role Badge */}
      <Box sx={{ px: 2, py: 1.5, background: `${roleColor}12`, borderBottom: `1px solid ${roleColor}22` }}>
        <Typography variant="caption" fontWeight={700} color={roleColor} letterSpacing={2} display="block" textAlign="center">
          {roleLabel}
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ px: 2, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <Avatar
          src={user?.profileImage ? imageUrl(user.profileImage) : undefined}
          sx={{
            width: 44, height: 44,
            bgcolor: `${roleColor}18`,
            color: roleColor,
            fontSize: 16, fontWeight: 700,
            border: `2px solid ${roleColor}22`,
          }}
        >
          {getInitials(user)}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" fontWeight={700} color="#0f172a" noWrap>
            {user ? `${user.firstName} ${user.lastName}` : 'User'}
          </Typography>
          <Typography variant="caption" color="rgba(15, 23, 42, 0.55)" noWrap display="block">
            {user?.email}
          </Typography>
        </Box>
      </Box>


    </Drawer>
  );
};

export default DashboardSidebar;
