import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#0a0a0a">
        <CircularProgress sx={{ color: '#990000' }} size={50} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    // Redirect to the appropriate dashboard for their role
    const dashboardPaths = { ADMIN: '/admin', MANAGER: '/manager', USER: '/dashboard' };
    return <Navigate to={dashboardPaths[user?.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
