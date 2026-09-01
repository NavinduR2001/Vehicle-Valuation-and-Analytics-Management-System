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

  
};

export default UserSettings;
