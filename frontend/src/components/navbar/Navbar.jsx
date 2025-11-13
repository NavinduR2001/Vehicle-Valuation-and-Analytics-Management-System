import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import Person from '@mui/icons-material/PersonAdd';
import { Logo } from '../../assets/assets';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', active: true },
    { text: 'Valuation', active: false },
    { text: 'About', active: false },
    { text: 'Contact', active: false },
  ];

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              sx={{ textAlign: 'center' }}
              onClick={handleDrawerToggle}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ 
              textAlign: 'center',
              backgroundColor:'#990000', 
              color:'#fff',
              margin:'20px 60px',
              borderRadius:'8px', 
              py:0.5
            }}
            onClick={handleDrawerToggle}
          >
            <ListItemText primary="Login" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            sx={{ 
              textAlign: 'center',
              backgroundColor:'#990000', 
              color:'#fff',
              margin:'0px 60px',
              borderRadius:'8px', 
              py:0.5
            }}
            onClick={handleDrawerToggle}
          >
            <ListItemText primary="Register" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '10px 40px 10px 40px',
          width: '100%',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={Logo}
              alt="Ravan Auto Cars"
              style={{ height: '60px', width: 'auto' }}
            />
          </Box>

          {!isMobile && (
            <>
              <Box sx={{ display: 'flex', gap: 4 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    sx={{
                      color: item.active ? '#fff' : '#000',
                      backgroundColor: item.active ? '#990000' : 'transparent',
                      px: 3,
                      py: 0.5,
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontSize: '16px',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: item.active ? '#990000' : '#f5f5f5',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>

              {/* Login/Register Buttons */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  startIcon={<LoginIcon />}
                  sx={{
                    color: '#8B0000',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: 'transparent' }
                  }}
                >
                  Login
                </Button>
                
            

                <IconButton
                  sx={{
                    backgroundColor: '#990000',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#990000',
                    },
                  }}
                >
                  <Person sx={{fontSize:'18px'}}/>
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#000',
                    fontWeight: 600,
                    ml: -1,
                    cursor: 'pointer',
                    '&:hover': {
                        color: '#990000',
                    }
                }}
              >
                Register
              </Typography>

              </Box>
            </>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: '#990000' }}
            >
              <MenuIcon
              sx={{
                fontSize:'36px'
              }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;