import React, { useState } from 'react';
import {
  Box, Container, TextField, Button, Typography, InputAdornment,
  IconButton, Alert, CircularProgress, Link,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Logo, LogoNew } from '../../assets/assets';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const paths = { ADMIN: '/admin', MANAGER: '/manager', USER: '/dashboard' };
      navigate(paths[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box sx={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(153,0,0,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(153,0,0,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Container maxWidth="xs">
        <Box
          sx={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 3,
            p: 5,
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ padding:1, background:'white', mb:2, display:'flex', justifyContent:'center', borderRadius:1, alignItems:'center',width:'fit-content', mx:'auto' }}
            ><img src={LogoNew} alt="Logo" style={{ height: 55, marginBottom: 10 }} /></Box>
            <Typography variant="h5" fontWeight={700} color="#fff" sx={{ letterSpacing: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.5)" mt={0.5}>
              Sign in to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(153,0,0,0.1)', color: '#ff6666', border: '1px solid rgba(153,0,0,0.3)' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email sx={{ color: '#990000' }} /></InputAdornment>,
              }}
              sx={loginFieldSx}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#990000' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={loginFieldSx}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3, mb: 2, py: 1.5, fontSize: 16, fontWeight: 700,
                background: 'linear-gradient(135deg, #990000 0%, #cc0000 100%)',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(153,0,0,0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #770000 0%, #aa0000 100%)',
                  boxShadow: '0 6px 25px rgba(153,0,0,0.6)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': { background: '#333' },
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'SIGN IN'}
            </Button>
          </form>

          <Typography variant="body2" color="rgba(255,255,255,0.4)" textAlign="center">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" sx={{ color: '#990000', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Register here
            </Link>
          </Typography>

          <Typography variant="body2" color="rgba(255,255,255,0.4)" textAlign="center" mt={1}>
            <Link component={RouterLink} to="/" sx={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', '&:hover': { color: '#fff' } }}>
              ← Back to Home
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

const loginFieldSx = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#990000' },
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& .MuiOutlinedInput-input': {
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
};

export default Login;
