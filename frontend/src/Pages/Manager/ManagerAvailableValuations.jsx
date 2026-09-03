import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Chip, Button, CircularProgress, IconButton, TextField,
  InputAdornment, TablePagination, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Divider, Avatar,
} from '@mui/material';
import { Search, Visibility, Close, CheckCircle, Cancel, Image } from '@mui/icons-material';
import { valuationService, imageUrl } from '../../services/services';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const inputSx = {
  '& .MuiInputLabel-root': { color: 'rgba(15,23,42,0.55)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#0066cc' },
  '& .MuiOutlinedInput-root': {
    color: '#0f172a',
    '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(0,102,204,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#0066cc' },
    bgcolor: '#ffffff',
    '& .MuiOutlinedInput-input': { color: '#0f172a', WebkitTextFillColor: '#0f172a' },
  },
};

const ManagerAvailableValuations = () => {
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [inspectOpen, setInspectOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [galleryImg, setGalleryImg] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await valuationService.getAvailable({ page: page + 1, limit: rowsPerPage, search });
      setValuations(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getErrMsg = (err) => err?.response?.data?.errors ? err.response.data.errors.join(', ') : err?.response?.data?.message || 'An error occurred';

  useEffect(() => { fetchData(); }, [page, rowsPerPage, search]);

  const openInspect = (val) => { navigate(`/manager/inspect/${val.id}`); };

  const handleAction = async (action) => {
    if (action === 'approve' && (!price || parseFloat(price) <= 0)) {
      return toast.error('Please enter a valid valuation price.');
    }
    setActionLoading(true);
    try {
      await valuationService.inspect(selected.id, { action, valuationPrice: price, managerNotes: notes });
      toast.success(`Valuation ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      setInspectOpen(false);
      fetchData();
    } catch (e) {
      toast.error(getErrMsg(e));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box>
      {/* Search */}
      <Box mb={3}>
        <TextField
          placeholder="Search by registration number or make..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(15,23,42,0.35)' }} /></InputAdornment> }}
          sx={{ width: { xs: '100%', sm: 380 }, ...inputSx }}
        />
      </Box>

      <Box sx={{ bgcolor: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: '#0066cc' }} /></Box>
        ) : valuations.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography color="rgba(15,23,42,0.45)" variant="h6">No pending valuations</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(0,102,204,0.08)' }}>
                    {['User', 'Company', 'Registration No', 'Asset Type', 'Submitted', 'Action'].map((h) => (
                      <TableCell key={h} sx={{ color: 'rgba(15,23,42,0.7)', fontWeight: 700, fontSize: 12, letterSpacing: 1, borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
                        {h.toUpperCase()}
                      </TableCell>
                    ))}
                  </TableRow>
              </TableHead>
              <TableBody>
                {valuations.map((val) => {
                  const user = val.submittedBy;
                  const vehicle = val.vehicle;
                  return (
                    <TableRow key={val.id} sx={{ '&:hover': { bgcolor: 'rgba(15,23,42,0.04)' }, borderBottom: '1px solid rgba(15,23,42,0.04)' }}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: '#e6f2ff', color: '#004080', fontSize: 13, fontWeight: 700 }}>
                            {user ? `${(user.firstName || '')[0]}${(user.lastName || '')[0]}` : 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="#0f172a" fontWeight={600}>{user ? `${user.firstName} ${user.lastName}` : '—'}</Typography>
                            <Typography variant="caption" color="rgba(15,23,42,0.5)">{user?.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.6)', fontSize: 13 }}>{user?.company?.name || '—'}</TableCell>
                      <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>{vehicle?.registrationNo || '—'}</TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.6)' }}>{vehicle?.assetType || '—'}</TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.5)', fontSize: 13 }}>{new Date(val.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained" size="small"
                          startIcon={<Visibility fontSize="small" />}
                          onClick={() => openInspect(val)}
                          sx={{ bgcolor: '#0066cc', '&:hover': { bgcolor: '#0055aa' }, fontSize: 12, fontWeight: 700 }}
                        >
                          INSPECT
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          component="div" count={total} page={page}
          onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          sx={{ color: 'rgba(15,23,42,0.55)', borderTop: '1px solid rgba(15,23,42,0.06)', '& .MuiSelect-icon': { color: 'rgba(15,23,42,0.55)' } }}
        />
      </Box>

      {/* INSPECT MODAL */}
      <Dialog open={inspectOpen} onClose={() => setInspectOpen(false)} maxWidth="lg" fullWidth
        PaperProps={{ sx: { bgcolor: '#ffffff', color: '#0f172a', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, maxHeight: '90vh' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(15,23,42,0.08)', pb: 2 }}>
          <Typography variant="h6" fontWeight={700} color="#0f172a">Vehicle Inspection</Typography>
          <IconButton onClick={() => setInspectOpen(false)} sx={{ color: 'rgba(15,23,42,0.55)' }}><Close /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, overflow: 'auto' }}>
          {selected && (
            <Grid container spacing={3}>
              {/* Vehicle Details */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" fontWeight={700} color="rgba(15,23,42,0.55)" mb={2} letterSpacing={1}>VEHICLE DETAILS</Typography>
                {[
                  ['Registration No', selected.vehicle?.registrationNo],
                  ['Asset Type', selected.vehicle?.assetType],
                  ['Make', selected.vehicle?.make],
                  ['Model', selected.vehicle?.model],
                  ['Year', selected.vehicle?.yearOfManufacture],
                  ['Engine No', selected.vehicle?.engineNo],
                  ['Chassis No', selected.vehicle?.chassisNo],
                  ['Engine CC', selected.vehicle?.engineCC || 'N/A'],
                  ['Fuel Type', selected.vehicle?.fuelType],
                  ['Inspection Date', selected.vehicle?.inspectionDate],
                  ['Inspection Place', selected.vehicle?.inspectionPlace],
                ].map(([l, v]) => (
                  <Box key={l} mb={1.5}>
                    <Typography variant="caption" color="rgba(15,23,42,0.55)" display="block">{l}</Typography>
                    <Typography variant="body2" color="#0f172a" fontWeight={500}>{v || '—'}</Typography>
                  </Box>
                ))}
              </Grid>

              {/* User & Company Details */}
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" fontWeight={700} color="rgba(15,23,42,0.55)" mb={2} letterSpacing={1}>USER & COMPANY</Typography>
                {[
                  ['Name', selected.submittedBy ? `${selected.submittedBy.firstName} ${selected.submittedBy.lastName}` : '—'],
                  ['Email', selected.submittedBy?.email],
                  ['Phone', selected.submittedBy?.phone],
                  ['Company', selected.submittedBy?.company?.name],
                  ['Submitted', new Date(selected.createdAt).toLocaleString()],
                ].map(([l, v]) => (
                  <Box key={l} mb={1.5}>
                    <Typography variant="caption" color="rgba(15,23,42,0.55)" display="block">{l}</Typography>
                    <Typography variant="body2" color="#0f172a" fontWeight={500}>{v || '—'}</Typography>
                  </Box>
                ))}

                <Divider sx={{ borderColor: 'rgba(15,23,42,0.08)', my: 2 }} />

                {/* Manager Actions */}
                <Typography variant="subtitle2" fontWeight={700} color="rgba(15,23,42,0.55)" mb={2} letterSpacing={1}>INSPECTION ACTIONS</Typography>
                <TextField
                  fullWidth label="Valuation Price (Rs)" type="number"
                  value={price} onChange={(e) => setPrice(e.target.value)}
                  sx={{ ...inputSx, mb: 2 }}
                  inputProps={{ min: 0 }}
                  placeholder="Enter assessed value"
                />
                <TextField
                  fullWidth label="Notes / Remarks" multiline rows={3}
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  sx={inputSx}
                  placeholder="Add inspection notes..."
                />
              </Grid>

              {/* Image Gallery */}
              <Grid item xs={12} md={4}>
                  {(() => {
                    const imgs = Array.isArray(selected?.vehicle?.images) ? selected.vehicle.images : (selected?.vehicle?.images ? [selected.vehicle.images] : []);
                    return (
                      <>
                        <Typography variant="subtitle2" fontWeight={700} color="rgba(15,23,42,0.55)" mb={2} letterSpacing={1}>
                          VEHICLE IMAGES ({imgs.length})
                        </Typography>
                        {imgs.length > 0 ? (
                          <Grid container spacing={1.5}>
                            {imgs.map((img, i) => (
                                <Grid item xs={6} key={i}>
                                  <Box
                                    component="img"
                                    src={imageUrl(img)}
                                    alt={`Vehicle ${i + 1}`}
                                    onClick={() => setGalleryImg(imageUrl(img))}
                                    sx={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 1.5, cursor: 'pointer', border: '1px solid rgba(15,23,42,0.08)', '&:hover': { border: '1px solid #0066cc' }, transition: 'all 0.2s' }}
                                  />
                                </Grid>
                              ))}
                          </Grid>
                        ) : (
                          <Box textAlign="center" py={4}><Image sx={{ fontSize: 40, color: 'rgba(15,23,42,0.15)' }} /><Typography color="rgba(15,23,42,0.45)" variant="caption" display="block">No images</Typography></Box>
                        )}
                      </>
                    );
                  })()}
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid rgba(15,23,42,0.06)', px: 3, py: 2, gap: 1.5 }}>
          <Button
            variant="contained" startIcon={actionLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <CheckCircle />}
            onClick={() => handleAction('approve')} disabled={actionLoading}
            sx={{ bgcolor: '#006600', '&:hover': { bgcolor: '#005500' }, px: 3, py: 1.2, fontWeight: 700 }}
          >
            Approve
          </Button>
          <Button
            variant="contained" startIcon={actionLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Cancel />}
            onClick={() => handleAction('reject')} disabled={actionLoading}
            sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' }, px: 3, py: 1.2, fontWeight: 700 }}
          >
            Reject
          </Button>
          <Button onClick={() => setInspectOpen(false)} sx={{ color: 'rgba(15,23,42,0.55)' }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Fullscreen Gallery */}
      <Dialog open={!!galleryImg} onClose={() => setGalleryImg(null)} maxWidth="lg" fullWidth
        PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.95)', border: '1px solid rgba(255,255,255,0.1)' } }}
      >
        <DialogContent sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <IconButton onClick={() => setGalleryImg(null)} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1 }}>
            <Close />
          </IconButton>
          <Box component="img" src={galleryImg} alt="Full" sx={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 2 }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManagerAvailableValuations;
