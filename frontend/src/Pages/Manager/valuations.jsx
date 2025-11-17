import React, { useState } from 'react';
import SidebarMana from '../../Components/sidebarmanager/SidebarMana.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
} from '@mui/material';


const valuations = () => {
  const [selectedValuation, setSelectedValuation] = useState(null);

  const menuItems = ['Dashboard', 'Valuations', 'Reports', 'Settings'];

  const valuationsData = [
    {
      regNo: 'CAO2020',
      date: '11/11/2025',
      company: "People's leasing",
      userName: 'User 1',
      model: 'Pulsar 150',
      details: {
        regNo: 'EP-BDW-8094',
        inspectionDate: '7/20/2025',
        inspectionPlace: 'Batticaloa',
        make: 'BAJAJ',
        model: 'Pulsar 150',
        engineNo: 'DHZWGB24637',
        chassisNo: 'MD2A12CZ5GWB47307',
        engineCC: '149.00999999999999',
        yom: '2016',
        fuelType: 'Petrol (Gasoline)',
      },
    },
  ];

  const handleViewClick = (valuation) => {
    setSelectedValuation(valuation);
  };

  const handleHideClick = () => {
    setSelectedValuation(null);
  };

  const handleApproveClick = (valuation) => {
    alert(`Valuation for ${valuation.regNo} has been approved.`);
  };

  const handleRejectClick = (valuation) => {
    alert(`Valuation for ${valuation.regNo} has been rejected.`);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarMana menuItems={menuItems} />
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reg No.</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Model</TableCell>
                <TableCell sx={{paddingLeft:'100px'}}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ bgcolor: '#8d8888ff' }}>
              {valuationsData.map((valuation, index) => (
                <TableRow key={index}>
                  <TableCell>{valuation.regNo}</TableCell>
                  <TableCell>{valuation.date}</TableCell>
                  <TableCell>{valuation.company}</TableCell>
                  <TableCell>{valuation.userName}</TableCell>
                  <TableCell>{valuation.model}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewClick(valuation)}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApproveClick(valuation)}
                      sx={{ marginLeft: '10px' }}
                    >
                      Approve
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRejectClick(valuation)}
                        sx={{ marginLeft: '10px' }}
                    >
                        Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedValuation && (
          <Paper sx={{ padding: '20px', marginTop: '20px', bgcolor: '#8d8888ff' }}>
            <TableContainer>
                <TableBody>
                    <TableRow>
                        <TableCell>
                             <Typography><strong>Reg No:</strong> {selectedValuation.details.regNo}</Typography>
                             <Typography><strong>Make:</strong> {selectedValuation.details.make}</Typography>
                             <Typography><strong>Model:</strong> {selectedValuation.details.model}</Typography>
                             <Typography><strong>Chassis No:</strong> {selectedValuation.details.chassisNo}</Typography>
                             <Typography><strong>Engine CC:</strong> {selectedValuation.details.engineCC}</Typography>
                        </TableCell>
                        <TableCell>
                             <Typography><strong>Inspection Date:</strong> {selectedValuation.details.inspectionDate}</Typography>
                             <Typography><strong>Inspection Place:</strong> {selectedValuation.details.inspectionPlace}</Typography>
                             <Typography><strong>Engine No:</strong> {selectedValuation.details.engineNo}</Typography>
                             <Typography><strong>YOM:</strong> {selectedValuation.details.yom}</Typography>
                             <Typography><strong>Fuel Type:</strong> {selectedValuation.details.fuelType}</Typography>

                        </TableCell>
                        <TableCell>
                             <Button
                             variant="contained"
                             color="secondary"
                             onClick={handleHideClick}
                             sx={{ marginTop: '20px' }}
                            >
                                Hide
                             </Button>

                        </TableCell>
                    </TableRow>
                </TableBody>
            </TableContainer>
          
            
          
           
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default valuations;
