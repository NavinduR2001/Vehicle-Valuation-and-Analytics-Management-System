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

      {/* Navigation */}
      <List sx={{ flex: 1, py: 2, px: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const isActive = activeMenu === item.key;

          if (item.key === 'available') {
            const isMainAvailableActive = isActive && selectedCompany === 'All';
            return (
              <React.Fragment key={item.key}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      setActiveMenu('available');
                      setSelectedCompany('All');
                      setOpenAvailable((prev) => !prev);
                    }}
                    sx={{
                      borderRadius: 2,
                      py: 1.2,
                      px: 2,
                      background: isActive ? `linear-gradient(135deg, ${roleColor}14 0%, ${roleColor}08 100%)` : 'transparent',
                      border: isActive ? `1px solid ${roleColor}22` : '1px solid transparent',
                      '&:hover': {
                        background: `${roleColor}10`,
                        border: `1px solid ${roleColor}1f`,
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 38, color: isActive ? roleColor : 'rgba(15, 23, 42, 0.45)' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? '#0f172a' : 'rgba(15, 23, 42, 0.72)',
                      }}
                    />
                    <Chip
                      label={totalAvailableCount}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 11,
                        fontWeight: 700,
                        bgcolor: roleColor,
                        color: '#ffffff',
                        mr: 0.5,
                      }}
                    />
                    {openAvailable ? (
                      <ExpandLess fontSize="small" sx={{ color: 'rgba(15, 23, 42, 0.45)' }} />
                    ) : (
                      <ExpandMore fontSize="small" sx={{ color: 'rgba(15, 23, 42, 0.45)' }} />
                    )}
                  </ListItemButton>
                </ListItem>

                {/* Sub-menu collapse (Company-wise only, count > 0) */}
                <Collapse in={openAvailable} timeout="auto" unmountOnExit sx={{ pl: 2, pr: 1, mb: 1 }}>
                  <List component="div" disablePadding>
                    {activeCompanies.map((comp) => {
                      const isCompSelected = isActive && selectedCompany === comp.name;
                      return (
                        <Tooltip key={comp.name} title={`${comp.name} (${comp.count})`} placement="right" arrow>
                          <ListItemButton
                            onClick={() => {
                              setActiveMenu('available');
                              setSelectedCompany(comp.name);
                            }}
                            sx={{
                              borderRadius: 1.5,
                              py: 0.8,
                              px: 2,
                              mb: 0.3,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: isCompSelected ? `${roleColor}1a` : 'transparent',
                              borderLeft: isCompSelected ? `3px solid ${roleColor}` : '3px solid transparent',
                              '&:hover': { background: 'rgba(15,23,42,0.04)' },
                            }}
                          >
                            <ListItemText
                              primary={comp.name}
                              primaryTypographyProps={{
                                fontSize: 12.5,
                                fontWeight: isCompSelected ? 700 : 500,
                                color: isCompSelected ? roleColor : 'rgba(15,23,42,0.75)',
                                noWrap: true,
                              }}
                            />
                            <Chip
                              label={comp.count}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: 11,
                                fontWeight: 700,
                                bgcolor: isCompSelected ? roleColor : 'rgba(15,23,42,0.12)',
                                color: isCompSelected ? '#ffffff' : 'rgba(15,23,42,0.7)',
                                ml: 1,
                              }}
                            />
                          </ListItemButton>
                        </Tooltip>
                      );
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }

          return (
            <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => setActiveMenu(item.key)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  background: isActive ? `linear-gradient(135deg, ${roleColor}14 0%, ${roleColor}08 100%)` : 'transparent',
                  border: isActive ? `1px solid ${roleColor}22` : '1px solid transparent',
                  '&:hover': {
                    background: `${roleColor}10`,
                    border: `1px solid ${roleColor}1f`,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: isActive ? roleColor : 'rgba(15, 23, 42, 0.45)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? '#0f172a' : 'rgba(15, 23, 42, 0.72)',
                  }}
                />
                {isActive && (
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: roleColor }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2, py: 1.2, px: 2,
            border: '1px solid rgba(153,0,0,0.18)',
            '&:hover': { background: 'rgba(153,0,0,0.08)', border: '1px solid rgba(153,0,0,0.3)' },
            transition: 'all 0.2s ease',
          }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: '#990000' }}>
            <LogoutRounded />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: 14, fontWeight: 600, color: '#990000' }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default DashboardSidebar;
