import React, { useState, useEffect } from 'react';
import {
  Box, Container, TextField, Button, Typography, InputAdornment,
  IconButton, Alert, CircularProgress, Link, MenuItem, Grid, LinearProgress,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Person, Phone, Badge, Business } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService, companyService } from '../../services/services';
import { Logo, LogoNew } from '../../assets/assets';

const validatePassword = (pw) => {
  const checks = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    special: /[@$!%*?&]/.test(pw),
  };
  return checks;
};

const Register = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    companyId: '', idCardNumber: '', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState([]);
  const [pwChecks, setPwChecks] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    companyService.getCompanies().then((res) => setCompanies(res.data.companies || [])).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'password') setPwChecks(validatePassword(value));
  };

  const pwStrength = Object.values(pwChecks).filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (pwStrength < 5) return setError('Password must meet all requirements.');
    setLoading(true);
    try {
      const res = await authService.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        companyId: form.companyId,
        idCardNumber: form.idCardNumber,
        password: form.password,
      });
      const { token, user } = res.data;
      localStorage.setItem('vvs_token', token);
      localStorage.setItem('vvs_user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 3, p: 5,
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ padding:1, background:'white', mb:2, display:'flex', justifyContent:'center', borderRadius:1, alignItems:'center',width:'fit-content', mx:'auto' }}
            ><img src={LogoNew} alt="Logo" style={{ height: 55, marginBottom: 10 }} /></Box>
            
            <Typography variant="h5" fontWeight={700} color="#fff">Create Account</Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.5)" mt={0.5}>
              Register to access the valuation portal
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(153,0,0,0.1)', color: '#ff6666', border: '1px solid rgba(153,0,0,0.3)' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ width: '100%', flexDirection: 'column' }}>
              <Grid item xs={6}>
                <TextField fullWidth name="firstName" label="First Name" value={form.firstName}
                  onChange={handleChange} required sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#990000', fontSize: 18 }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth name="lastName" label="Last Name" value={form.lastName}
                  onChange={handleChange} required sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#990000', fontSize: 18 }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth name="email" label="Email Address" type="email" value={form.email}
                  onChange={handleChange} required sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#990000', fontSize: 18 }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth name="phone" label="Phone Number" value={form.phone}
                  onChange={handleChange} required sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#990000', fontSize: 18 }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth select name="companyId" label="Insurance Company" value={form.companyId}
                  onChange={handleChange} required sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Business sx={{ color: '#990000', fontSize: 18 }} /></InputAdornment> }}
                  SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: '#1a1a1a', color: '#fff' } } } }}
                >
                  {companies.map((c) => (
                    <MenuItem key={c.id} value={c.id} sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(153,0,0,0.1)' } }}>{c.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth name="idCardNumber" label="NIC / ID Card Number" value={form.idCardNumber}
                  onChange={handleChange} required sx={fieldSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Badge sx={{ color: '#990000', fontSize: 18 }} /></InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth name="password" label="Password" type={showPassword ? 'text' : 'password'}
                  value={form.password} onChange={handleChange} required sx={fieldSx}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#990000', fontSize: 18 }} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'rgba(255,255,255,0.4)' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {form.password && (
                  <Box mt={1}>
                    <LinearProgress
                      variant="determinate"
                      value={(pwStrength / 5) * 100}
                      sx={{
                        height: 4, borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: pwStrength < 3 ? '#cc0000' : pwStrength < 5 ? '#ff9900' : '#00cc44',
                        },
                      }}
                    />
                    <Typography variant="caption" color="rgba(255,255,255,0.4)" mt={0.5} display="block">
                      {['Too Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][pwStrength]} — Need: 8+ chars, uppercase, lowercase, number, special char
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth name="confirmPassword" label="Confirm Password" type="password"
                  value={form.confirmPassword} onChange={handleChange} required sx={fieldSx}
                  error={form.confirmPassword && form.password !== form.confirmPassword}
                  helperText={form.confirmPassword && form.password !== form.confirmPassword ? 'Passwords do not match' : ''}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#990000', fontSize: 18 }} /></InputAdornment> }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit" fullWidth variant="contained" disabled={loading}
              sx={{
                mt: 3, mb: 2, py: 1.5, fontSize: 16, fontWeight: 700,
                background: 'linear-gradient(135deg, #990000 0%, #cc0000 100%)',
                borderRadius: 2, boxShadow: '0 4px 20px rgba(153,0,0,0.4)',
                '&:hover': { background: 'linear-gradient(135deg, #770000 0%, #aa0000 100%)', transform: 'translateY(-1px)' },
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'CREATE ACCOUNT'}
            </Button>
          </form>

          <Typography variant="body2" color="rgba(255,255,255,0.4)" textAlign="center">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: '#990000', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

const fieldSx = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#990000' },
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& .MuiOutlinedInput-input': {
      color: '#fff',
      WebkitTextFillColor: '#fff',
    },
    '& .MuiSelect-select': {
      color: '#fff',
      WebkitTextFillColor: '#fff',
    },
    '& input:-webkit-autofill': {
      WebkitTextFillColor: '#fff',
      caretColor: '#fff',
      boxShadow: '0 0 0 1000px rgba(255,255,255,0.03) inset',
    },
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(153,0,0,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#990000' },
    bgcolor: 'rgba(255,255,255,0.03)',
  },
  '& .MuiFormHelperText-root': { color: '#ff6666' },
};

export default Register;
