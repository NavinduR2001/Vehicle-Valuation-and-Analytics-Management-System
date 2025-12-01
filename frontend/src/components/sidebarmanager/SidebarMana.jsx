import React from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';

const SidebarMana = ({ menuItems }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h6">Manager Menu</Typography>
      </Box>
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} button={true}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SidebarMana;