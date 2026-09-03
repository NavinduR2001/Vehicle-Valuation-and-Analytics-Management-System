import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, TextField, Button, Avatar, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip,
  Alert, Switch, FormControlLabel, Divider, MenuItem, TablePagination,
  InputAdornment, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Save, Business, PersonAdd, Close, CameraAlt, Visibility, VisibilityOff } from '@mui/icons-material';
import { adminService, companyService, userService, imageUrl } from '../../services/services';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useRef } from 'react';

const fieldSx = {
  '& .MuiInputLabel-root': { color: 'rgba(15,23,42,0.55)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#990000' },
  '& .MuiOutlinedInput-root': {
    color: '#0f172a', bgcolor: '#ffffff',
    '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' },
    '&.Mui-focused fieldset': { borderColor: '#990000' },
    '&:hover fieldset': { borderColor: 'rgba(153,0,0,0.4)' },
  },
};

const cardSx = { bgcolor: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, p: 3, mb: 3 };

const AdminSettings = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const fileRef = useRef();

  // Managers
  const [managers, setManagers] = useState([]);
  const [managerLoading, setManagerLoading] = useState(true);
  const [addManagerOpen, setAddManagerOpen] = useState(false);
  const [managerForm, setManagerForm] = useState({ firstName: '', lastName: '', email: '', phone: '', idCardNumber: '', password: '', branch: '', canFinalApprove: false });
  const [showPassword, setShowPassword] = useState(false);
  const [managerSaving, setManagerSaving] = useState(false);
  const [companies, setCompanies] = useState([]);

  // Companies
  const [allCompanies, setAllCompanies] = useState([]);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [addCompanyOpen, setAddCompanyOpen] = useState(false);
  const [companyForm, setCompanyForm] = useState({ name: '', contactNo: '', address: '', valuationFee: '' });
  const [editCompany, setEditCompany] = useState(null);
  const [companySaving, setCompanySaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmCallback, setConfirmCallback] = useState(() => {});
  const getErrMsg = (err) => {
    return err?.response?.data?.errors ? err.response.data.errors.join(', ') : err?.response?.data?.message || 'An error occurred';
  };

  useEffect(() => {
    fetchManagers();
    fetchCompanies();
    companyService.getCompanies().then(r => setCompanies(r.data.companies || [])).catch(() => {});
  }, []);

  const fetchManagers = async () => {
    setManagerLoading(true);
    try { const r = await adminService.getManagers(); setManagers(r.data.managers || []); }
    catch (e) { console.error(e); } finally { setManagerLoading(false); }
  };

  const fetchCompanies = async () => {
    setCompanyLoading(true);
    try { const r = await companyService.getAllCompanies(); setAllCompanies(r.data.companies || []); }
    catch (e) { console.error(e); } finally { setCompanyLoading(false); }
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);
    try {
      await userService.updateProfile(profile);
      updateUser(profile);
      toast.success('Profile updated!');
    } catch (e) { toast.error('Update failed'); } finally { setProfileLoading(false); }
  };

  const handleImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgLoading(true);
    const fd = new FormData();
    fd.append('profileImage', file);
    try {
      const r = await userService.uploadProfileImage(fd);
      updateUser({ profileImage: r.data.profileImage });
      toast.success('Profile image updated!');
    } catch (e) { toast.error('Upload failed'); } finally { setImgLoading(false); }
  };

  const handleAddManager = async () => {
    setManagerSaving(true);
    try {
      await adminService.createManager(managerForm);
      toast.success('Manager created!');
      setAddManagerOpen(false);
      setManagerForm({ firstName: '', lastName: '', email: '', phone: '', idCardNumber: '', password: '', branch: '', canFinalApprove: false });
      fetchManagers();
    } catch (e) { toast.error(getErrMsg(e)); } finally { setManagerSaving(false); }
  };

  const handleToggleFinalApprove = async (manager) => {
    const nextVal = !manager.canFinalApprove;
    setManagers((prev) =>
      prev.map((m) => (m.id === manager.id ? { ...m, canFinalApprove: nextVal } : m))
    );
    try {
      await adminService.updateManager(manager.id, {
        firstName: manager.firstName,
        lastName: manager.lastName,
        phone: manager.phone,
        branch: manager.branch,
        isActive: manager.isActive,
        canFinalApprove: nextVal,
      });
      toast.success('Manager final approval permission updated!');
      fetchManagers();
    } catch (e) {
      toast.error(getErrMsg(e));
      fetchManagers();
    }
  };

  const handleDeleteManager = async (id) => {
    setConfirmTitle('Delete this manager?');
    setConfirmCallback(() => async () => {
      try {
        await adminService.deleteManager(id);
        toast.success('Manager deleted');
        fetchManagers();
      } catch (e) { toast.error(getErrMsg(e)); }
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleCompanySave = async () => {
    setCompanySaving(true);
    try {
      if (editCompany) {
        await companyService.updateCompany(editCompany.id, companyForm);
        toast.success('Company updated!');
      } else {
        await companyService.createCompany(companyForm);
        toast.success('Company added!');
      }
      setAddCompanyOpen(false);
      setEditCompany(null);
      setCompanyForm({ name: '', contactNo: '', address: '', valuationFee: '' });
      fetchCompanies();
    } catch (e) { toast.error(getErrMsg(e)); } finally { setCompanySaving(false); }
  };

  const handleDeleteCompany = async (id) => {
    setConfirmTitle('Delete this company?');
    setConfirmCallback(() => async () => {
      try {
        await companyService.deleteCompany(id);
        toast.success('Company deleted');
        fetchCompanies();
      } catch (e) { toast.error(getErrMsg(e)); }
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleToggleCompany = async (company) => {
    try {
      await companyService.updateCompany(company.id, { ...company, isActive: !company.isActive });
      toast.success(`Company ${!company.isActive ? 'activated' : 'deactivated'}`);
      fetchCompanies();
    } catch (e) { toast.error(getErrMsg(e)); }
  };

  return (
    <Box>
      {/* Profile */}
      <Box sx={cardSx}>
        <Typography variant="h6" fontWeight={700} color="#0f172a" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 20, bgcolor: '#990000', borderRadius: 1 }} /> Admin Profile
        </Typography>
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Box sx={{ position: 'relative' }}>
            <Avatar src={user?.profileImage ? imageUrl(user.profileImage) : undefined}
              sx={{ width: 80, height: 80, bgcolor: '#990000', fontSize: 28, fontWeight: 700, border: '3px solid rgba(153,0,0,0.3)' }}>
              {user ? `${(user.firstName || '')[0]}${(user.lastName || '')[0]}`.toUpperCase() : 'A'}
            </Avatar>
            {imgLoading && <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.6)', borderRadius: '50%' }}><CircularProgress size={24} sx={{ color: '#990000' }} /></Box>}
          </Box>
          <Box>
            <input type="file" ref={fileRef} onChange={handleImgUpload} accept="image/*" style={{ display: 'none' }} />
            <Button variant="outlined" startIcon={<CameraAlt />} onClick={() => fileRef.current?.click()} disabled={imgLoading}
              sx={{ borderColor: 'rgba(15,23,42,0.15)', color: '#0f172a', '&:hover': { borderColor: '#990000', bgcolor: 'rgba(153,0,0,0.06)' } }}>
              Change Photo
            </Button>
          </Box>
        </Box>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="First Name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} sx={fieldSx} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} sx={fieldSx} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} sx={fieldSx} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" value={user?.email || ''} disabled sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { color: 'rgba(15,23,42,0.45)' } }} /></Grid>
        </Grid>
        <Button variant="contained" onClick={handleProfileSave} disabled={profileLoading} startIcon={profileLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Save />}
          sx={{ mt: 3, bgcolor: '#990000', '&:hover': { bgcolor: '#770000' }, px: 4, py: 1.2 }}>
          {profileLoading ? 'Saving...' : 'Save Profile'}
        </Button>
      </Box>

      {/* Manager Management */}
      <Box sx={cardSx}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={700} color="#0f172a" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 20, bgcolor: '#990000', borderRadius: 1 }} /> Managers
          </Typography>
          <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setAddManagerOpen(true)}
            sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' }, fontWeight: 700 }}>
            Add Manager
          </Button>
        </Box>
        {managerLoading ? <CircularProgress sx={{ color: '#990000' }} /> : managers.length === 0
          ? <Typography color="rgba(15,23,42,0.55)" textAlign="center" py={3}>No managers yet</Typography>
          : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Name', 'Email', 'Phone', 'Branch', 'Final Approve', 'Status', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ color: 'rgba(15,23,42,0.7)', fontWeight: 700, fontSize: 11, borderBottom: '1px solid rgba(15,23,42,0.06)' }}>{h.toUpperCase()}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {managers.map((m) => (
                    <TableRow key={m.id} sx={{ '&:hover': { bgcolor: 'rgba(153,0,0,0.03)' }, borderBottom: '1px solid rgba(15,23,42,0.04)' }}>
                      <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>{`${m.firstName} ${m.lastName}`}</TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.55)', fontSize: 12 }}>{m.email}</TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.55)', fontSize: 12 }}>{m.phone}</TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.55)', fontSize: 12 }}>{m.branch || '—'}</TableCell>
                      <TableCell>
                        <Tooltip title={m.canFinalApprove ? "Can issue final valuation approval" : "Requires Admin final approval"} arrow>
                          <Switch
                            size="small"
                            checked={!!m.canFinalApprove}
                            onChange={() => handleToggleFinalApprove(m)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': { color: '#990000' },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#990000' },
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell><Chip label={m.isActive ? 'Active' : 'Inactive'} size="small" sx={{ bgcolor: m.isActive ? 'rgba(0,204,68,0.1)' : 'rgba(255,51,51,0.1)', color: m.isActive ? '#00cc44' : '#ff3333', fontWeight: 700, fontSize: 10 }} /></TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleDeleteManager(m.id)} sx={{ color: '#ff3333', '&:hover': { bgcolor: 'rgba(255,51,51,0.1)' } }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
      </Box>

      {/* Company Management */}
      <Box sx={cardSx}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={700} color="#fff" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 20, bgcolor: '#990000', borderRadius: 1 }} /> Insurance Companies
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => { setEditCompany(null); setCompanyForm({ name: '', contactNo: '', address: '', valuationFee: '' }); setAddCompanyOpen(true); }}
            sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' }, fontWeight: 700 }}>
            Add Company
          </Button>
        </Box>
        {companyLoading ? <CircularProgress sx={{ color: '#990000' }} /> : allCompanies.length === 0
          ? <Typography color="rgba(15,23,42,0.55)" textAlign="center" py={3}>No companies yet</Typography>
          : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Company Name', 'Contact', 'Address', 'Fee (Rs)', 'Employees', 'Status', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ color: 'rgba(15,23,42,0.7)', fontWeight: 700, fontSize: 11, borderBottom: '1px solid rgba(15,23,42,0.06)' }}>{h.toUpperCase()}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allCompanies.map((c) => (
                    <TableRow key={c.id} sx={{ '&:hover': { bgcolor: 'rgba(153,0,0,0.03)' }, borderBottom: '1px solid rgba(15,23,42,0.04)' }}>
                      <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>{c.name}</TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.55)', fontSize: 12 }}>{c.contactNo || '—'}</TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.45)', fontSize: 12, maxWidth: 180 }}><Typography noWrap variant="caption">{c.address || '—'}</Typography></TableCell>
                      <TableCell sx={{ color: '#00cc44', fontWeight: 600 }}>{c.valuationFee !== undefined ? `Rs. ${parseFloat(c.valuationFee).toLocaleString()}` : '—'}</TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.55)' }}>{c.employees?.length || 0}</TableCell>
                      <TableCell>
                        <Switch size="small" checked={c.isActive} onChange={() => handleToggleCompany(c)}
                          sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#990000' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#990000' } }} />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => { setEditCompany(c); setCompanyForm({ name: c.name, contactNo: c.contactNo || '', address: c.address || '', valuationFee: c.valuationFee || '' }); setAddCompanyOpen(true); }}
                          sx={{ color: '#00aaff', mr: 0.5, '&:hover': { bgcolor: 'rgba(0,170,255,0.1)' } }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteCompany(c.id)} sx={{ color: '#ff3333', '&:hover': { bgcolor: 'rgba(255,51,51,0.1)' } }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
      </Box>

      {/* Add Manager Dialog */}
      <Dialog open={addManagerOpen} onClose={() => setAddManagerOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: '#ffffff', color: '#0f172a', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3 } }}>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(15,23,42,0.08)', display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight={700} color="#0f172a">Add New Manager</Typography>
          <IconButton onClick={() => setAddManagerOpen(false)} sx={{ color: 'rgba(15,23,42,0.55)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField fullWidth label="First Name *" value={managerForm.firstName} onChange={(e) => setManagerForm({ ...managerForm, firstName: e.target.value })} sx={fieldSx} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Last Name *" value={managerForm.lastName} onChange={(e) => setManagerForm({ ...managerForm, lastName: e.target.value })} sx={fieldSx} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Email *" type="email" value={managerForm.email} onChange={(e) => setManagerForm({ ...managerForm, email: e.target.value })} sx={fieldSx} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Phone *" value={managerForm.phone} onChange={(e) => setManagerForm({ ...managerForm, phone: e.target.value })} sx={fieldSx} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="NIC / ID Number *" value={managerForm.idCardNumber} onChange={(e) => setManagerForm({ ...managerForm, idCardNumber: e.target.value })} sx={fieldSx} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Branch" value={managerForm.branch} onChange={(e) => setManagerForm({ ...managerForm, branch: e.target.value })} sx={fieldSx} placeholder="e.g. Colombo Main Branch" /></Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password *"
                type={showPassword ? 'text' : 'password'}
                value={managerForm.password}
                onChange={(e) => setManagerForm({ ...managerForm, password: e.target.value })}
                sx={fieldSx}
                helperText="Minimum 8 characters"
                FormHelperTextProps={{ sx: { color: 'rgba(15,23,42,0.45)' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                        sx={{ color: 'rgba(15,23,42,0.45)' }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={managerForm.canFinalApprove}
                    onChange={(e) => setManagerForm({ ...managerForm, canFinalApprove: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#990000' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#990000' },
                    }}
                  />
                }
                label={
                  <Typography fontSize={13} fontWeight={600} color="#0f172a">
                    Allow Manager to give Final Approval (Skip Admin Approval)
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(15,23,42,0.06)', px: 3, py: 2 }}>
          <Button variant="contained" onClick={handleAddManager} disabled={managerSaving}
            sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' }, fontWeight: 700 }}>
            {managerSaving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create Manager'}
          </Button>
          <Button onClick={() => setAddManagerOpen(false)} sx={{ color: 'rgba(15,23,42,0.6)' }}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog (themed) */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { bgcolor: '#ffffff', color: '#0f172a', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 2 } }}>
        <DialogTitle sx={{ color: '#0f172a', fontWeight: 700 }}>{confirmTitle}</DialogTitle>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: 'rgba(15,23,42,0.7)' }}>Cancel</Button>
          <Button variant="contained" onClick={() => { confirmCallback(); }} sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' } }}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Company Dialog */}
      <Dialog open={addCompanyOpen} onClose={() => setAddCompanyOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: '#ffffff', color: '#0f172a', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3 } }}>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(15,23,42,0.08)', display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight={700} color="#0f172a">{editCompany ? 'Edit Company' : 'Add Company'}</Typography>
          <IconButton onClick={() => setAddCompanyOpen(false)} sx={{ color: 'rgba(15,23,42,0.55)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}><TextField fullWidth label="Company Name *" value={companyForm.name} onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })} sx={fieldSx} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Contact Number" value={companyForm.contactNo} onChange={(e) => setCompanyForm({ ...companyForm, contactNo: e.target.value })} sx={fieldSx} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Valuation Fee (Rs) *" type="number" value={companyForm.valuationFee} onChange={(e) => setCompanyForm({ ...companyForm, valuationFee: e.target.value })} sx={fieldSx} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address" multiline rows={2} value={companyForm.address} onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })} sx={fieldSx} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(15,23,42,0.06)', px: 3, py: 2 }}>
          <Button variant="contained" onClick={handleCompanySave} disabled={companySaving}
            sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' }, fontWeight: 700 }}>
            {companySaving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : editCompany ? 'Update' : 'Add Company'}
          </Button>
          <Button onClick={() => setAddCompanyOpen(false)} sx={{ color: 'rgba(15,23,42,0.6)' }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSettings;
