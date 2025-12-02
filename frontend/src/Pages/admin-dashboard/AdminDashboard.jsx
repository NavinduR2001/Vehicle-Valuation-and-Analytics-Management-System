import React,{useState} from 'react'
import AdminSlideBar from '../../components/admin-slidebar/AdminSlideBar'
import PerformanceCard from '../../components/admin-dashboard-components/PerformanceCard'
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Box, Typography, Select, MenuItem, TextField, Stack } from '@mui/material'
import AvailableTable from '../../components/admin-dashboard-components/AvailableTable';


function AdminDashboard() {
  const [activeButton, setActiveButton] = useState('Valuation Summary');
  const [quickRange, setQuickRange] = useState("today");
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState(dayjs());

   const handleQuickChange = (value) => {
    setQuickRange(value);

    switch (value) {
      case "last7":
        setStartDate(dayjs().subtract(7, "day"));
        setEndDate(dayjs());
        break;

      case "last30":
        setStartDate(dayjs().subtract(30, "day"));
        setEndDate(dayjs());
        break;

      case "today":
        setStartDate(dayjs());
        setEndDate(dayjs());
        break;

      case "thisMonth":
        setStartDate(dayjs().startOf("month"));
        setEndDate(dayjs().endOf("month"));
        break;

      case "custom":
        break;
    }
  };
  return (

    <Box sx={{display:"flex", flexDirection:"column", scrollBehavior:"smooth"}}>
        <AdminSlideBar activeButton={activeButton} setActiveButton={setActiveButton} />
        
        {/* Summary Section */}
        <Box component="main" id='summary' sx={{ display: activeButton === 'Valuation Summary' ? 'block' : 'none', flexGrow:1, p:3, ml: '260px', bgcolor: '#f5f5f5', minHeight: '100vh'}}>
        
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 7,mt:2 }}>
        <Typography variant="h4" gutterBottom sx={{color:'#990000', fontWeight:'bold'}}>
          Valuation Summary
        </Typography>
    
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        
        {/* Quick Options */}
        <Select sx={{ minWidth: 180 }} value={quickRange} onChange={(e) => handleQuickChange(e.target.value)}>
          <MenuItem value="last7">Last 7 Days</MenuItem>
          <MenuItem value="last30">Last 30 Days</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="thisMonth">This Month</MenuItem>
          <MenuItem value="custom">Custom Range</MenuItem>
        </Select>

        {/* Start Date Picker */}
        <DatePicker
          label="Start"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          disabled={quickRange !== "custom"}
          renderInput={(params) => <TextField {...params} />}
        />

        {/* End Date Picker */}
        <DatePicker
          label="End"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          disabled={quickRange !== "custom"}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </LocalizationProvider>
      </Box>

      <Stack spacing={4} direction="row" mb={4} sx={{ flexWrap: 'wrap' }}>
  <Box sx={{ bgcolor: '#ffffff', p: 2, borderRadius: 2, boxShadow: 1, textAlign: 'center', flex: 1, minWidth: '200px' }}>
    <Typography variant="h6">Total Companies</Typography>
    <Typography variant="h4" sx={{ color: '#990000', fontWeight: 'bold' }}>5</Typography>
  </Box>

  <Box sx={{ bgcolor: '#ffffff', p: 2, borderRadius: 2, boxShadow: 1, textAlign: 'center', flex: 1, minWidth: '200px' }}>
    <Typography variant="h6">Total Employees</Typography>
    <Typography variant="h4" sx={{ color: '#990000', fontWeight: 'bold' }}>12</Typography>
  </Box>

  <Box sx={{ bgcolor: '#ffffff', p: 2, borderRadius: 2, boxShadow: 1, textAlign: 'center', flex: 1, minWidth: '200px' }}>
    <Typography variant="h6" >Total Valuations</Typography>
    <Typography variant="h4" sx={{ color: '#990000', fontWeight: 'bold' }}>250</Typography>
  </Box>

  <Box sx={{ bgcolor: '#ffffff', p: 2, borderRadius: 2, boxShadow: 1, textAlign: 'center', flex: 1, minWidth: '200px' }}>
    <Typography variant="h6">Total Revenue (Rs)</Typography>
    <Typography variant="h4" sx={{ color: '#990000', fontWeight: 'bold' }}>120 000</Typography>
  </Box>
</Stack>

    <Stack spacing={4} direction="row" mb={4} sx={{ flexWrap: 'wrap' }}>
          <Box sx={{ 
            bgcolor: '#ffffff', 
            p: 3, 
            borderRadius: 2, 
            boxShadow: 2, 
            height: '500px', 
            display: 'flex', 
            flexDirection: 'column',
            flex:'0.5',
       
          }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'left', fontWeight: 'bold', color: '#990000' }}>
              Valuations Over Time
            </Typography>
            <Box sx={{ 
              flexGrow: 1, 
              bgcolor: '#e0e0e0', 
              borderRadius: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
            }}>
              <Typography sx={{ color: '#777777' }}>[Chart Placeholder]</Typography>
            </Box>
          </Box>

           <Box sx={{ 
      bgcolor: '#ffffff', 
      p: 3, 
      borderRadius: 2, 
      boxShadow: 2, 
      height: '500px', 
      display: 'flex', 
      flexDirection: 'column',
      flex:'0.5',
    }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'left', fontWeight: 'bold', color: '#990000' }}>
        Revenue Over Time
      </Typography>
      <Box sx={{ 
        flexGrow: 1, 
        bgcolor: '#e0e0e0', 
        borderRadius: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        
      }}>
        <Typography sx={{ color: '#777777' }}>[Chart Placeholder]</Typography>
      </Box>
    </Box>

    </Stack>

   
          <Box sx={{ 
            bgcolor: '#ffffff', 
            p: 3, 
            borderRadius: 2, 
            boxShadow: 2, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
       
          }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'left', fontWeight: 'bold', color: '#990000' }}>
              Top Performers
            </Typography>
            

            {/* Content can be added here */}
           
             <PerformanceCard />
      
          </Box>

        </Box>

        <Box component="main" id='valuation' sx={{ display: activeButton === 'Available Valuations' ? 'block' : 'none', flexGrow:1, p:3, ml: '260px', bgcolor: '#f5f5f5', minHeight: '100vh'}}>
        <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: "column", alignItems: "flex-start", mb: 7,mt:2 }}>
        <Typography variant="h4"  gutterBottom sx={{color:'#990000', fontWeight:'bold'}}>
          Available Valuations
        </Typography>

        <Box sx={{ width: '100%', bgcolor: '#ffffff', mt: 4, height:'100%', borderRadius: 2, boxShadow: 2 }}>
          <AvailableTable />
        </Box>

        </Box>
        
        </Box>

        <Box component="main" id='history' sx={{ display: activeButton === 'Valuation History' ? 'block' : 'none', flexGrow:1, p:3, ml: '260px', bgcolor: '#f5f5f5', minHeight: '100vh'}}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 7,mt:2 }}>
        <Typography variant="h4" gutterBottom sx={{color:'#990000', fontWeight:'bold'}}>
          Valuation History
        </Typography>

        </Box>
        </Box>

        <Box component="main" id='performance' sx={{ display: activeButton === 'Performance' ? 'block' : 'none', flexGrow:1, p:3, ml: '260px', bgcolor: '#f5f5f5', minHeight: '100vh'}}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 7,mt:2 }}>
        <Typography variant="h4" gutterBottom sx={{color:'#990000', fontWeight:'bold'}}>
          Performance
        </Typography>

        </Box>
        </Box>

        <Box component="main" id='settings' sx={{ display: activeButton === 'Settings' ? 'block' : 'none', flexGrow:1, p:3, ml: '260px', bgcolor: '#f5f5f5', minHeight: '100vh'}}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 7,mt:2 }}>
        <Typography variant="h4" gutterBottom sx={{color:'#990000', fontWeight:'bold'}}>
          Setting
        </Typography>

        </Box>
        </Box>

    </Box>
  )
}

export default AdminDashboard