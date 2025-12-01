import React,{useState} from 'react'
import { Box, Button, Drawer, Stack, Toolbar, Typography } from '@mui/material'
import { Logo } from '../../assets/assets'
import LogoutIcon from '@mui/icons-material/Logout';

function AdminSlideBar() {

const [activeButton, setActiveButton] = useState('Valuation Summary');

const handleClick=(buttonName) => {
  setActiveButton(buttonName);
  console.log(`${buttonName} button clicked`);
}
  return (
    <Drawer variant="permanent" anchor="left" 
    sx={{
      '& .MuiDrawer-paper': { width: 260,  boxSizing: 'border-box', bgcolor: '#D9D9D9', color: '#fff', borderRight: '4px solid #990000', textAlign: 'center' },
     }} >
      <Toolbar/>
      <Box>
        <img 
          src={Logo} 
          alt="Admin Logo" 
          style={{ width: '160px', marginTop: '0px', marginBottom: '20px' }} 
        />
      </Box>
     <Box sx={{bgcolor:'#990000', py:1}}>
      <Typography variant='h6'>Admin Dashboard</Typography>
      </Box>

      <Stack sx={{mt:8, mb:8 }} spacing={2}>

        <Button size='large'  sx={{color: activeButton === 'Valuation Summary' ? '#ffffff' : '#000000', py:2, bgcolor: activeButton === 'Valuation Summary' ? '#000000' : 'transparent', borderRadius:0}} onClick={() => handleClick('Valuation Summary')}>Valuation Summary</Button>

        <Button size='large' sx={{color: activeButton === 'Available Valuations' ? '#ffffff' : '#000000',  py:2, mx:2, bgcolor: activeButton === 'Available Valuations' ? '#000000' : 'transparent', borderRadius:0}} href="#" onClick={() => handleClick('Available Valuations')}>Available Valuations</Button>

        <Button size='large' sx={{color: activeButton === 'Valuation History' ? '#ffffff' : '#000000', py:2, bgcolor: activeButton === 'Valuation History' ? '#000000' : 'transparent', borderRadius:0}} href="#" onClick={() => handleClick('Valuation History')}>Valuation History</Button>

        <Button size='large' sx={{color: activeButton === 'Performance' ? '#ffffff' : '#000000', py:2, bgcolor: activeButton === 'Performance' ? '#000000' : 'transparent', borderRadius:0}} href="#" onClick={() => handleClick('Performance')}>Performance</Button>
        <Button size='large' sx={{color: activeButton === 'Settings' ? '#ffffff' : '#000000', py:2, bgcolor: activeButton === 'Settings' ? '#000000' : 'transparent', borderRadius:0}} href="#" onClick={() => handleClick('Settings')}>Settings</Button>

      </Stack>

      <Button variant="contained" size='large' endIcon={<LogoutIcon />} sx={{position:'absolute', bottom:50, left:20, right:20, bgcolor:'#990000', color:'#ffffff'}}>Logout</Button>

    </Drawer>
  )
}

export default AdminSlideBar