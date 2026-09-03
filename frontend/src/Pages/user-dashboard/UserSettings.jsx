import React, { useState, useRef } from 'react';
import {
  Box, Grid, TextField, Button, Typography, Avatar, Divider,
  Alert, CircularProgress, IconButton,
} from '@mui/material';
import { Edit, CameraAlt, Save, Lock, CheckCircle } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { userService, imageUrl } from '../../services/services';
import toast from 'react-hot-toast';

const fieldSx = {
  '& .MuiInputLabel-root': { color: 'rgba(15,23,42,0.55)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#990000' },
  '& .MuiOutlinedInput-root': {
    color: '#0f172a',
    '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(153,0,0,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#990000' },
    bgcolor: '#ffffff',
  },
};

const cardSx = {
  bgcolor: '#ffffff',
  border: '1px solid rgba(15,23,42,0.08)',
  borderRadius: 3, p: 3,
};

const UserSettings = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [pwError, setPwError] = useState('');
  const fileRef = useRef();

  const handleProfileSave = async () => {
    setProfileLoading(true);
    setProfileError('');
    try {
      await userService.updateProfile(profile);
      updateUser(profile);
      toast.success('Profile updated successfully!');
    } catch (e) {
      setProfileError(e.response?.data?.message || 'Update failed');
      toast.error('Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwError('');
    if (passwords.newPassword !== passwords.confirmPassword) return setPwError('New passwords do not match.');
    if (passwords.newPassword.length < 8) return setPwError('New password must be at least 8 characters.');
    setPwLoading(true);
    try {
      await userService.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (e) {
      setPwError(e.response?.data?.message || 'Password change failed');
      toast.error('Password change failed');
    } finally {
      setPwLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgLoading(true);
    const fd = new FormData();
    fd.append('profileImage', file);
    try {
      const res = await userService.uploadProfileImage(fd);
      updateUser({ profileImage: res.data.profileImage });
      toast.success('Profile image updated!');
    } catch (e) {
      toast.error('Image upload failed.');
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <Box>
      {/* Profile Image */}
      <Box sx={cardSx} mb={3}>
        <Typography variant="h6" fontWeight={700} color="#0f172a" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 20, bgcolor: '#990000', borderRadius: 1 }} />
          Profile Picture
        </Typography>
        <Box display="flex" alignItems="center" gap={3}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user?.profileImage ? imageUrl(user.profileImage) : undefined}
                sx={{ width: 90, height: 90, bgcolor: '#990000', fontSize: 32, fontWeight: 700, border: '3px solid rgba(153,0,0,0.3)' }}
            >
              {user ? `${(user.firstName || '')[0]}${(user.lastName || '')[0]}`.toUpperCase() : 'U'}
            </Avatar>
            {imgLoading && (
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.6)', borderRadius: '50%' }}>
                <CircularProgress size={28} sx={{ color: '#990000' }} />
              </Box>
            )}
          </Box>
          <Box>
            <input type="file" ref={fileRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
            <Button
              variant="outlined" startIcon={<CameraAlt />}
              onClick={() => fileRef.current?.click()}
              disabled={imgLoading}
              sx={{ borderColor: 'rgba(15,23,42,0.15)', color: '#0f172a', '&:hover': { borderColor: '#990000', bgcolor: 'rgba(153,0,0,0.06)' } }}
            >
              Change Photo
            </Button>
            <Typography variant="caption" color="rgba(15,23,42,0.55)" display="block" mt={0.5}>
              JPEG, PNG or WEBP. Max 5MB.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Profile Details */}
      <Box sx={cardSx} mb={3}>
        <Typography variant="h6" fontWeight={700} color="#0f172a" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 20, bgcolor: '#990000', borderRadius: 1 }} />
          Personal Information
        </Typography>

        {profileError && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(153,0,0,0.08)', color: '#b91c1c', border: '1px solid rgba(153,0,0,0.25)' }}>{profileError}</Alert>}

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="First Name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} sx={fieldSx} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Last Name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} sx={fieldSx} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Phone Number" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} sx={fieldSx} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" value={user?.email || ''} disabled sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], color: 'rgba(15,23,42,0.45)' } }} helperText="Email cannot be changed" FormHelperTextProps={{ sx: { color: 'rgba(15,23,42,0.45)' } }} />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button
            variant="contained" startIcon={profileLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Save />}
            onClick={handleProfileSave} disabled={profileLoading}
            sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' }, px: 4, py: 1.2 }}
          >
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>

      {/* Change Password */}
      <Box sx={cardSx}>
        <Typography variant="h6" fontWeight={700} color="#0f172a" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 20, bgcolor: '#990000', borderRadius: 1 }} />
          Change Password
        </Typography>

        {pwError && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(153,0,0,0.08)', color: '#b91c1c', border: '1px solid rgba(153,0,0,0.25)' }}>{pwError}</Alert>}

        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField fullWidth label="Current Password" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} sx={fieldSx} InputProps={{ startAdornment: <Lock sx={{ color: '#990000', mr: 1 }} /> }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="New Password" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} sx={fieldSx} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Confirm New Password" type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} sx={fieldSx} error={passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword} helperText={passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword ? 'Passwords do not match' : ''} FormHelperTextProps={{ sx: { color: '#ff6666' } }} />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button
            variant="contained" startIcon={pwLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Lock />}
            onClick={handlePasswordChange} disabled={pwLoading}
            sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' }, px: 4, py: 1.2 }}
          >
            {pwLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UserSettings;
