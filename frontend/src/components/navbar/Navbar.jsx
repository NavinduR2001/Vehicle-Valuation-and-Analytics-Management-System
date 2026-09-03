import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box,
  Drawer, List, ListItem, ListItemButton, ListItemText,
  useMediaQuery, useTheme, Avatar, Menu, MenuItem, Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Logo } from '../../assets/assets';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { imageUrl } from '../../services/services';

const NAV_LINKS = [
  { text: 'Home', href: '/' },
  { text: 'About', href: '#about' },
  { text: 'Services', href: '#services' },
  { text: 'Contact', href: '#contact' },
];

const ROLE_PATHS = { ADMIN: '/admin', MANAGER: '/manager', USER: '/dashboard' };

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/login');
  };

  const dashboardPath = user ? ROLE_PATHS[user.role] || '/dashboard' : '/dashboard';

  const getInitials = (u) =>
    u ? `${(u.firstName || '')[0]}${(u.lastName || '')[0]}`.toUpperCase() : 'U';

  const drawer = (
    <Box sx={{ textAlign: 'center', bgcolor: '#fff', height: '100%' }}>
      <Box sx={{ py: 2, borderBottom: '1px solid #eee' }}>
        <img src={Logo} alt="Logo" style={{ height: 44 }} />
      </Box>
      <List>
        {NAV_LINKS.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{ textAlign: 'center', color: '#000', '&:hover': { color: '#990000', bgcolor: '#fff5f5' } }}
              onClick={() => setMobileOpen(false)}
              href={item.href}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink} to={dashboardPath}
                sx={{ textAlign: 'center', color: '#fff', bgcolor: '#990000', mx: 3, borderRadius: 2, my: 0.5, '&:hover': { bgcolor: '#770000' } }}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                sx={{ textAlign: 'center', color: '#990000', mx: 3, borderRadius: 2 }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink} to="/login"
                sx={{ textAlign: 'center', color: '#fff', bgcolor: '#990000', mx: 3, borderRadius: 2, my: 0.5, '&:hover': { bgcolor: '#770000' } }}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink} to="/register"
                sx={{ textAlign: 'center', color: '#990000', border: '1px solid #990000', mx: 3, borderRadius: 2, '&:hover': { bgcolor: '#fff5f5' } }}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          px: { xs: 1, sm: 2, md: 4 },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 72 } }}>
          {/* Logo */}
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src={Logo} alt="Ravan Auto Care" style={{ height: 56, width: 'auto' }} />
          </Box>

          {/* Desktop Nav */}
          {!isMobile && (
            <>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {NAV_LINKS.map((item) => (
                  <Button
                    key={item.text}
                    href={item.href}
                    sx={{
                      color: '#000',
                      px: 2.5, py: 0.8,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: 15,
                      fontWeight: 500,
                      '&:hover': { color: '#990000', bgcolor: '#fff5f5' },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>

              {/* Auth Buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                {isAuthenticated && user ? (
                  <>
                    <Button
                      component={RouterLink} to={dashboardPath}
                      startIcon={<DashboardIcon />}
                      sx={{
                        color: '#990000', textTransform: 'none', fontSize: 15, fontWeight: 600,
                        '&:hover': { bgcolor: '#fff5f5' },
                      }}
                    >
                      Dashboard
                    </Button>

                    <Box
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.8, borderRadius: 2, '&:hover': { bgcolor: '#f5f5f5' } }}
                    >
                      <Avatar
                        src={user.profileImage ? imageUrl(user.profileImage) : undefined}
                        sx={{ width: 36, height: 36, bgcolor: '#990000', fontSize: 13, fontWeight: 700 }}
                      >
                        {getInitials(user)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600} color="#000">
                        {user.firstName}
                      </Typography>
                      <KeyboardArrowDownIcon sx={{ color: '#666', fontSize: 18 }} />
                    </Box>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                      PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}
                    >
                      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                        <Typography variant="body2" fontWeight={700} color="#000">
                          {`${user.firstName} ${user.lastName}`}
                        </Typography>
                        <Typography variant="caption" color="#666">{user.role}</Typography>
                      </Box>
                      <MenuItem component={RouterLink} to={dashboardPath} onClick={() => setAnchorEl(null)}
                        sx={{ gap: 1.5, py: 1.2, '&:hover': { bgcolor: '#fff5f5', color: '#990000' } }}>
                        <DashboardIcon fontSize="small" sx={{ color: '#990000' }} /> Dashboard
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.2, color: '#990000', '&:hover': { bgcolor: '#fff5f5' } }}>
                        <LogoutIcon fontSize="small" /> Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      component={RouterLink} to="/login"
                      startIcon={<LoginIcon />}
                      sx={{
                        color: '#990000', textTransform: 'none', fontSize: 15, fontWeight: 600,
                        border: '1px solid rgba(153,0,0,0.25)', borderRadius: 2, px: 2.5,
                        '&:hover': { bgcolor: '#fff5f5', border: '1px solid #990000' },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={RouterLink} to="/register"
                      startIcon={<PersonAddIcon />}
                      variant="contained"
                      sx={{
                        bgcolor: '#990000', textTransform: 'none', fontSize: 15, fontWeight: 600,
                        borderRadius: 2, px: 2.5, boxShadow: 'none',
                        '&:hover': { bgcolor: '#770000', boxShadow: '0 4px 12px rgba(153,0,0,0.3)' },
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ color: '#990000' }}>
              <MenuIcon sx={{ fontSize: 32 }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;