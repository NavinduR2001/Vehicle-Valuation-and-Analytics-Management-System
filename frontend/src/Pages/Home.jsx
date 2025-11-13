import React from "react";
import { Phone, Email, LocationOn,VerifiedUser, Engineering, Build } from "@mui/icons-material";
import Frame12 from "../assets/img/Frame12.png";
import Service1 from "../assets/img/Service1.png";
import Service2 from "../assets/img/Service2.png";
import Service3 from "../assets/img/Service3.png";
import Car from "../assets/img/Frame15.png";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ bgcolor: "#fff", color: "#000", fontFamily: "Poppins, sans-serif", m: 0, p: 0 }}>
      {/* ===== HEADER SECTION ===== */}
      <Box sx={{ position: "relative", bgcolor: "#fff", overflow: "visible", height: "800px" }}>
        <Container maxWidth="lg">
          <Grid container spacing={0} alignItems="center" >
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                py: { xs: 6, md: 12 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: { md: "80vh" },
                marginTop: { xs: 10, md: 5 }
              }}
            >
              <Typography variant="h3" fontWeight={760}>
                Welcome to
              </Typography>
              <Typography variant="h2" fontWeight={800} color="#990000" sx={{ my: 1 }} pt={0}>
                Ravan Auto Care
              </Typography>
              <Typography variant="h4" fontWeight={500} sx={{ mb: 2 }}>
                Vehicle Valuation Portal
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, pt: 2 }} fontWeight={300}>
                <span style={{ color: "#990000", fontWeight: 300 }}>Accurate </span>
                <span style={{ fontWeight: 300 }}>Vehicle Valuation.</span>
                <br />
                <span style={{ color: "#990000", fontWeight: 300 }}>Smarter </span><span style={{ fontWeight: 300 }}>Decisions.</span>
              </Typography>
              <Button variant="contained" color="error" sx={{ borderRadius: 2, width: 220, height: 50 }}>
                GET VALUATION
              </Button>
            </Grid>
          </Grid>
        </Container>

        {/* full-bleed image positioned at the right edge of the viewport */}
        <Box
          component="img"
          src={Frame12}
          alt="car"
          sx={{
            position: "absolute",
            right: 0,
            top: "45%",
            transform: "translateY(-50%)",
            width: { md: "50vw", xs: "75vw" },
            height: "100%",
            maxWidth: 1000,
            pointerEvents: "none",
          }}
        />
    </Box>
   

     <Box>
      <Container maxWidth="lg">
        <Box component="img" src={Car} alt="Car Image" position="relative" width="100%" height="auto" />
        

      </Container>
     </Box>

      {/* ===== ABOUT SECTION ===== */}
      <Box sx={{ py: 6, bgcolor: "#fff" }}>
          <Container maxWidth="lg">
          <Typography variant="h2"  sx={{ textAlign: "center" }} fontWeight={800} color="#990000" gutterBottom paddingBottom={6}>
            About US
          </Typography>
            <Typography
              variant="h6"
              sx={{
                bgcolor: "#000",
                color: "#fff",
                p: 8,
                borderRadius: 2,
                textAlign: "justify",
                /* responsive maxWidth: full width on small screens, up to 1200px on md+ */
                maxWidth: { xs: '100%', md: 1200 },
                mx: 'auto',
              }}
            >
            The key objective of the Ravan Auto Care is to provide a comprehensive, fair and trust worthy total Valuation
             Service. Our company is equipped with highly skilled vehicle inspections that have over 13 years’ experience in vehicle and machinery.
              In order to provide up to date reliable Valuation, we also look forward to provide customers maximum benefits of the information technology
               which is not effectively utilized in the vehicle Valuation industry at this juncture.
          </Typography>
        </Container>
      </Box>
      

      {/* ===== SERVICES SECTION ===== */}
      <Box sx={{ py: 6, bgcolor: "#fff" }}>
         <Container maxWidth="lg">
           <Typography
            variant="h3"
             textAlign="center"
            fontWeight={800}
            gutterBottom
            color="black"
            paddingBottom={6}
           >
            Our Services
          </Typography>

        <Grid
          container
           spacing={8}
          justifyContent="center"
          alignItems="stretch"
          wrap="nowrap"
     
            >
          {[
          {
          title: "Comprehensive Vehicle and Machinery Valuation",
          desc: "Accurate valuations for insurance, leasing and resale purposes conducted by experienced inspectors.",
          img: Service1,
         },
         {
          title: "Digital Valuation Management System",
          desc: "A secure online platform for vehicle data entry, tracking, inspection review and automated report generation.",
          img: Service2,
         },
         {
           title: "Vehicle Inspection and Verification",
          desc: "Detailed examination of registration, chassis, engine and overall condition to ensure authenticity and accuracy.",
          img: Service3,
         },
        ].map((service, index) => (
        <Grid
          item
          key={index}
          sx={{
            flex: "0 0 30%", 
            minWidth: 280,
            maxWidth: 340,
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "100%",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.03)" },
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={service.img}
              alt={service.title}
              sx={{ objectFit: "cover" }}
            />
               <CardContent>
               <Typography variant="h5" fontWeight="700" color="#990000" gutterBottom>
                  {service.title}
                 </Typography>
                <Typography variant="body2" fontSize={17}>{service.desc}</Typography>
            </CardContent>
             </Card>
                </Grid>
               ))}
           </Grid>
        </Container>
      </Box>


    
            {/* STRENGTH SECTION */}
      <Box sx={{ bgcolor: "#fff", py: 6 }}>
          <Container>
           <Typography
            variant="h3"
            textAlign="center"
            fontWeight={800}
            gutterBottom
           color="black"
            paddingBottom={6}
            >
            Our Strength
            </Typography>

          <Grid container spacing={6} justifyContent="center" textAlign="center">
          {[
        { title: "Years of Experience", value: "13+" },
        { title: "Highly Skilled & Certified Inspectors", value: " " },
        { title: "Accurate & Transparency", value: "100%" },
        { title: "Trustworthiness & Fairness", value: "100%" },
        { title: "Modern Technology", value: " " },
        { title: "Best Customer Satisfaction", value: "100%" },
             ].map((item, i) => (
           <Grid item xs={6} sm={4} md={3} key={i}>
             <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              bgcolor: "#990000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              boxShadow: 1,
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
              }}
             >
            {item.value.trim() === "" ? (
              item.title.includes("Inspectors") ? (
                <VerifiedUser sx={{ fontSize: 40, color: "#fff" }} />
              ) : item.title.includes("Technology") ? (
                <Engineering sx={{ fontSize: 40, color: "#fff" }} />
              ) : item.title.includes("Customer") ? (
                <Star sx={{ fontSize: 40, color: "#fff" }} />
              ) : (
                <Build sx={{ fontSize: 40, color: "#fff" }} />
              )
            ) : (
              <Typography variant="h4" fontWeight="bold" color="#fff">
                {item.value}
              </Typography>
            )}
           </Box>
          <Typography
            mt={3}
            fontSize={20}
            fontWeight={550}
            sx={{
              width: 150,
              mx: "auto",
              textAlign: "center",
              wordWrap: "break-word",
            }}
          >
            {item.title}
          </Typography>
          </Grid>
          ))}
       </Grid>
      </Container>
    </Box>

      


      {/*  CONTACT SECTION  */}
      <Box sx={{ py: 6 }}>
        <Container>
          <Typography variant="h3" color="#990000" textAlign="center" fontWeight={800} padding={6} gutterBottom>
            Contact
          </Typography>
          <Grid container spacing={0} justifyContent="center">
            <Grid item xs={12} md={6} width={700}>
              <iframe
                title="map"
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31672.26833157108!2d80.66346045!3d6.66234765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3e8a1d0e7c2e3%3A0x7e247cbccfbbf4df!2sBalangoda!5e0!3m2!1sen!2slk!4v1700000000000"

                width="100%"
                height="300"
                style={{ border: 0, borderRadius: "0" }}
                loading="lazy"
                allowFullScreen
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ bgcolor: "#990000", borderRadius: 0, p: 2, height: '98%' }}>
          <Typography
            variant="h6"
            color="#fff"
            mt={5}
            ml={2}
            mr={2}
            fontWeight={600}
              >
            Y. H. Nalaka Senevirathna
            </Typography>
            <Typography color="#fff" ml={2} mr={2}>
             Proprietor
            </Typography>

              <hr
                style={{
                marginLeft: '16px',
                marginRight: '16px',
                  borderColor: '#fff',
                opacity: 0.7,
               }}
            />
            <Box display="flex" alignItems="center" ml={2} mt={2}>
               <Phone sx={{ color: "#fff", mr: 1 }} />
               <Typography color="#fff">077 736 5498</Typography>
            </Box>

            <Box display="flex" alignItems="center" ml={2} mt={1}>
              <Email sx={{ color: "#fff", mr: 1 }} />
              <Typography color="#fff">ravanautocare@gmail.com</Typography>
            </Box>

            <Box display="flex" alignItems="center" ml={2} mt={1}>
              <LocationOn sx={{ color: "#fff", mr: 1 }} />
              <Typography color="#fff">Balangoda, Sri Lanka</Typography>
            </Box>
            </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
