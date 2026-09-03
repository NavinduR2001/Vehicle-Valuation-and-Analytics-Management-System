import { useState, useEffect } from "react";
import { Box, Typography,Stack } from "@mui/material";
import { ProfileImage } from "../../assets/assets";

function PerformanceCard() {
  const performanceData = [
    { id: 1, image: ProfileImage, name: "John Doe", companyName: "AutoValuators Inc.", valuations: 10, revenue: 10000 },
    { id: 2, image: ProfileImage, name: "Jane Smith", companyName: "ValueMyRide LLC", valuations: 8, revenue: 8000 },
    { id: 3, image: ProfileImage, name: "Mike Johnson", companyName: "CarWorth Experts", valuations: 15, revenue: 15000 },
    { id: 4, image: ProfileImage, name: "Emily Davis", companyName: "AutoPrice Solutions", valuations: 12, revenue: 12000 },
    { id: 5, image: ProfileImage, name: "David Wilson", companyName: "ValueAuto Pros", valuations: 9, revenue: 9000 }
  ];

  const [order, setOrder] = useState([]);

  useEffect(() => {
    const sorted = [...performanceData]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);
    setOrder(sorted);
  }, []);

  return (
    
    <div style={{ marginTop: '20px', marginBottom: '20px',display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', gap:'40px'}}>
      {order.map((item) => (
        <Box
          key={item.id}
          sx={{
            width:'100%',
            bgcolor: "#f0f0f0",
            p: 3,
            borderRadius: 2,
            boxShadow: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:'center',
            gap: 5,
          }}
        >
            <Box>
            <img 
                      src={item.image} 
                      alt="Admin Logo" 
                      style={{ width: '160px', marginTop: '0px', borderRadius:'50%' , objectFit: 'cover' }} 
                    />
            </Box>
            <Box >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#990000" }}>
            {item.name}
          </Typography>
          <Typography sx={{ color: "#555555", fontWeight:'700' }}>
            {item.companyName}
          </Typography>
          <Typography sx={{ color: "#555555" }}>
            Total Valuations: {item.valuations}
          </Typography>
          <Typography sx={{ color: "#555555" }}>
            Total Revenue: ${item.revenue}
          </Typography>
          </Box>
        </Box>
      ))}
      </div>

  );
}

export default PerformanceCard;
