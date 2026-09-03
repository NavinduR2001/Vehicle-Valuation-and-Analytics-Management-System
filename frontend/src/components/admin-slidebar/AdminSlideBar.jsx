import React, { useState } from 'react';
import {
  Box, Button, Drawer, Stack, Toolbar, Typography, Collapse, List,
  ListItemButton, ListItemText, Chip, Tooltip,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import { Logo } from '../../assets/assets';

function AdminSlideBar({
  activeButton,
  setActiveButton,
  selectedCompany = 'All',
  setSelectedCompany = () => {},
  companies = [],
  totalAvailableCount = 0,
}) {
  const [openAvailable, setOpenAvailable] = useState(true);

  const handleClick = (buttonName) => {
    setActiveButton(buttonName);
    if (buttonName === 'Available Valuations') {
      setSelectedCompany('All');
      setOpenAvailable((prev) => !prev);
    }
  };

  const handleCompanyClick = (companyName) => {
    setActiveButton('Available Valuations');
    setSelectedCompany(companyName);
  };

  // Only include companies that have at least 1 available valuation (count > 0)
  const activeCompanies = companies.filter((c) => c.count > 0);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        '& .MuiDrawer-paper': {
          width: 270,
          boxSizing: 'border-box',
          bgcolor: '#D9D9D9',
          color: '#000000',
          borderRight: '4px solid #990000',
          textAlign: 'center',
          overflowY: 'auto',
        },
      }}
    >
      <Toolbar />
      <Box>
        <img
          src={Logo}
          alt="Admin Logo"
          style={{ width: '160px', marginTop: '0px', marginBottom: '20px' }}
        />
      </Box>
      <Box sx={{ bgcolor: '#990000', py: 1 }}>
        <Typography variant="h6" color="#ffffff" fontWeight={700}>
          Admin Dashboard
        </Typography>
      </Box>

      <Stack sx={{ mt: 4, mb: 12, px: 1.5 }} spacing={1}>
        {/* Valuation Summary */}
        <Button
          fullWidth
          size="large"
          sx={{
            justifyContent: 'flex-start',
            color: activeButton === 'Valuation Summary' ? '#ffffff' : '#000000',
            py: 1.5,
            px: 2,
            bgcolor: activeButton === 'Valuation Summary' ? '#000000' : 'transparent',
            borderRadius: 0,
            fontWeight: 600,
            textTransform: 'none',
          }}
          onClick={() => handleClick('Valuation Summary')}
        >
          Valuation Summary
        </Button>

        {/* Available Valuations Main Tab */}
        <Box>
          <Button
            fullWidth
            size="large"
            onClick={() => handleClick('Available Valuations')}
            sx={{
              justifyContent: 'space-between',
              color: activeButton === 'Available Valuations' ? '#ffffff' : '#000000',
              py: 1.5,
              px: 2,
              bgcolor: activeButton === 'Available Valuations' ? '#000000' : 'transparent',
              borderRadius: 0,
              fontWeight: 700,
              textTransform: 'none',
            }}
          >
            <Typography fontSize={14.5} fontWeight={700}>
              Available Valuations
            </Typography>
            <Box display="flex" alignItems="center" gap={0.8}>
              <Chip
                label={totalAvailableCount}
                size="small"
                sx={{
                  height: 22,
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: activeButton === 'Available Valuations' ? '#990000' : '#000000',
                  color: '#ffffff',
                }}
              />
              {openAvailable ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </Box>
          </Button>

          {/* Sub-tabs List (Company-wise only, count > 0) */}
          <Collapse in={openAvailable} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ mt: 0.5, bgcolor: 'rgba(0,0,0,0.03)' }}>
              {activeCompanies.map((comp) => {
                const isSelected =
                  activeButton === 'Available Valuations' && selectedCompany === comp.name;
                return (
                  <Tooltip key={comp.name} title={`${comp.name} (${comp.count})`} placement="right" arrow>
                    <ListItemButton
                      onClick={() => handleCompanyClick(comp.name)}
                      sx={{
                        py: 0.9,
                        px: 2,
                        pl: 3,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: isSelected ? '#990000' : 'transparent',
                        color: isSelected ? '#ffffff' : '#000000',
                        '&:hover': {
                          bgcolor: isSelected ? '#770000' : 'rgba(153,0,0,0.08)',
                        },
                      }}
                    >
                      <ListItemText
                        primary={comp.name}
                        primaryTypographyProps={{
                          fontSize: 12.5,
                          fontWeight: isSelected ? 700 : 500,
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
                          bgcolor: isSelected ? '#ffffff' : '#990000',
                          color: isSelected ? '#990000' : '#ffffff',
                          ml: 1,
                        }}
                      />
                    </ListItemButton>
                  </Tooltip>
                );
              })}
            </List>
          </Collapse>
        </Box>

        {/* Valuation History */}
        <Button
          fullWidth
          size="large"
          sx={{
            justifyContent: 'flex-start',
            color: activeButton === 'Valuation History' ? '#ffffff' : '#000000',
            py: 1.5,
            px: 2,
            bgcolor: activeButton === 'Valuation History' ? '#000000' : 'transparent',
            borderRadius: 0,
            fontWeight: 600,
            textTransform: 'none',
          }}
          onClick={() => handleClick('Valuation History')}
        >
          Valuation History
        </Button>

        {/* Performance */}
        <Button
          fullWidth
          size="large"
          sx={{
            justifyContent: 'flex-start',
            color: activeButton === 'Performance' ? '#ffffff' : '#000000',
            py: 1.5,
            px: 2,
            bgcolor: activeButton === 'Performance' ? '#000000' : 'transparent',
            borderRadius: 0,
            fontWeight: 600,
            textTransform: 'none',
          }}
          onClick={() => handleClick('Performance')}
        >
          Performance
        </Button>

        {/* Registered Users */}
        <Button
          fullWidth
          size="large"
          sx={{
            justifyContent: 'flex-start',
            color: activeButton === 'Registered Users' ? '#ffffff' : '#000000',
            py: 1.5,
            px: 2,
            bgcolor: activeButton === 'Registered Users' ? '#000000' : 'transparent',
            borderRadius: 0,
            fontWeight: 600,
            textTransform: 'none',
          }}
          onClick={() => handleClick('Registered Users')}
        >
          Registered Users
        </Button>

        {/* Settings */}
        <Button
          fullWidth
          size="large"
          sx={{
            justifyContent: 'flex-start',
            color: activeButton === 'Settings' ? '#ffffff' : '#000000',
            py: 1.5,
            px: 2,
            bgcolor: activeButton === 'Settings' ? '#000000' : 'transparent',
            borderRadius: 0,
            fontWeight: 600,
            textTransform: 'none',
          }}
          onClick={() => handleClick('Settings')}
        >
          Settings
        </Button>
      </Stack>

      <Button
        variant="contained"
        size="large"
        endIcon={<LogoutIcon />}
        sx={{
          position: 'absolute',
          bottom: 50,
          left: 20,
          right: 20,
          bgcolor: '#990000',
          color: '#ffffff',
        }}
      >
        Logout
      </Button>
    </Drawer>
  );
}

export default AdminSlideBar;
