import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  Paper
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function App() {
  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* LEFT - image */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          bgcolor: "#f0f2f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          overflow: "hidden"
        }}
      >
        <Box sx={{ width: "90%", maxWidth: 600 }}>
          <img
            src="/car.png"
            alt="car"
            style={{ width: "100%" }}
          />
        </Box>
        
      </Grid>

      {/* RIGHT - form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
     
          height: "100vh",
          width: "50vw"
        }}
      >
        <Paper elevation={3} sx={{ width: "100%", maxWidth: 520, p: 4, borderRadius: 4 }}>
          <IconButton size="small" sx={{ mb: 1 }}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h4" fontWeight="700">
            Login your Account
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Please login to continue
          </Typography>

          <Typography sx={{ mt: 1 }}>Email</Typography>
          <TextField placeholder="Enter email address" fullWidth sx={{ mt: 1, mb: 2 }} />

          <Typography>Password</Typography>
          <Box sx={{ position: "relative" }}>
            <TextField
              type="password"
              placeholder="Enter Password"
              fullWidth
              sx={{ mt: 1, mb: 1 }}
            />
            <IconButton sx={{ position: "absolute", right: 8, top: 18 }}>
              <VisibilityOffIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#8b0000", "&:hover": { backgroundColor: "#6f0000" } }}
          >
            Login
          </Button>

          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
            <FormControlLabel control={<Checkbox />} label="Remember for 30 days" />
            <Typography sx={{ cursor: "pointer", color: "primary.main" }}>Forgot password</Typography>
          </Box>

          <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography sx={{ mx: 2 }}>OR</Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Button variant="outlined" fullWidth sx={{ mt: 2, textTransform: "none" }}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              style={{ width: 22, marginRight: 8 }}
            />
            Login with Google
          </Button>

          <Box textAlign="center" sx={{ mt: 2 }}>
            <Typography>
              Don’t have an account? <span style={{ color: "#d32f2f", cursor: "pointer" }}>Sign Up</span>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
