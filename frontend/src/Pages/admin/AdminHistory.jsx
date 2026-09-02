import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Chip, CircularProgress, TablePagination, TextField, Button,
  InputAdornment, MenuItem, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Grid,
} from '@mui/material';
import { Search, Visibility, Close, Image } from '@mui/icons-material';
import { valuationService, imageUrl } from '../../services/services';

const STATUS_COLORS = {
  PENDING: { label: 'Pending', color: '#ff9900', bg: 'rgba(255,153,0,0.1)' },
  MANAGER_APPROVED: { label: 'Manager Approved', color: '#00aaff', bg: 'rgba(0,170,255,0.1)' },
  ADMIN_APPROVED: { label: 'Final Approved', color: '#00cc44', bg: 'rgba(0,204,68,0.1)' },
  REJECTED: { label: 'Rejected', color: '#ff3333', bg: 'rgba(255,51,51,0.1)' },
};

const normalizeImagePath = (img) => {
  if (!img) return null;

  if (typeof img === 'string') {
    const trimmed = img.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeImagePath(Array.isArray(parsed) ? parsed[0] : parsed);
      } catch {
        // fall through to treating it as a raw path
      }
    }

    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  if (Array.isArray(img)) return normalizeImagePath(img[0]);

  const candidate = img.path || img.url || img.src || img.image;
  return normalizeImagePath(candidate);
};

const normalizeImages = (images) => {
  if (!images) return [];

  if (Array.isArray(images)) {
    return images.flatMap((item) => {
      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (!trimmed) return [];

        if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
          try {
            const parsed = JSON.parse(trimmed);
            return normalizeImages(parsed);
          } catch {
            return [trimmed];
          }
        }

        return [trimmed];
      }

      if (item && typeof item === 'object') {
        return normalizeImages(item.path || item.url || item.src || item.image || item.images);
      }

      return [];
    });
  }

  if (typeof images === 'string') {
    const trimmed = images.trim();
    if (!trimmed) return [];

    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeImages(parsed);
      } catch {
        return [trimmed];
      }
    }

    return [trimmed];
  }

  if (typeof images === 'object') {
    return normalizeImages(images.path || images.url || images.src || images.image || images.images);
  }

  return [];
};

const resolveImageSrc = (img) => {
  const path = normalizeImagePath(img);
  return path ? (path.startsWith('http') ? path : imageUrl(path)) : null;
};

const AdminHistory = () => {
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedVal, setSelectedVal] = useState(null);
  const [galleryImg, setGalleryImg] = useState(null);

  const handleView = (val) => {
    setSelectedVal(val);
    setViewDialogOpen(true);
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await valuationService.getAll({ page: page + 1, limit: rowsPerPage, search, status: statusFilter || undefined });
        setValuations(res.data.data || []);
        setTotal(res.data.pagination?.total || 0);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [page, rowsPerPage, search, statusFilter]);

  return (
    <Box>
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(15,23,42,0.35)' }} /></InputAdornment> }}
          sx={{ width: 300, '& .MuiOutlinedInput-root': { color: '#0f172a', bgcolor: '#ffffff', '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' } } }}
        />
        <TextField select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status"
          SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: '#ffffff', color: '#0f172a' } } } }}
          sx={{ width: 180, '& .MuiInputLabel-root': { color: 'rgba(15,23,42,0.55)' }, '& .MuiOutlinedInput-root': { color: '#0f172a', bgcolor: '#ffffff', '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' } } }}>
          <MenuItem value="" sx={{ color: '#0f172a', bgcolor: '#ffffff' }}>All Statuses</MenuItem>
          {Object.entries(STATUS_COLORS).map(([k, v]) => <MenuItem key={k} value={k} sx={{ color: '#0f172a', bgcolor: '#ffffff' }}>{v.label}</MenuItem>)}
        </TextField>
      </Box>

      <Box sx={{ bgcolor: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: '#990000' }} /></Box>
          : valuations.length === 0 ? <Box textAlign="center" py={8}><Typography color="rgba(15,23,42,0.55)">No records found</Typography></Box>
          : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(153,0,0,0.05)' }}>
                    {['Registration', 'Asset', 'User', 'Company', 'Price', 'Manager', 'Submitted', 'Status', 'Action'].map((h) => (
                      <TableCell key={h} sx={{ color: 'rgba(15,23,42,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: 1, borderBottom: '1px solid rgba(15,23,42,0.06)' }}>{h.toUpperCase()}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {valuations.map((val) => {
                    const status = STATUS_COLORS[val.status] || STATUS_COLORS.PENDING;
                    return (
                      <TableRow key={val.id} sx={{ '&:hover': { bgcolor: 'rgba(153,0,0,0.03)' }, borderBottom: '1px solid rgba(15,23,42,0.04)' }}>
                        <TableCell sx={{ color: '#0f172a', fontWeight: 700 }}>{val.vehicle?.registrationNo || '—'}</TableCell>
                        <TableCell sx={{ color: 'rgba(15,23,42,0.65)' }}>{val.vehicle?.assetType || '—'}</TableCell>
                        <TableCell sx={{ color: 'rgba(15,23,42,0.75)' }}>{val.submittedBy ? `${val.submittedBy.firstName} ${val.submittedBy.lastName}` : '—'}</TableCell>
                        <TableCell sx={{ color: 'rgba(15,23,42,0.55)', fontSize: 12 }}>{val.submittedBy?.company?.name || '—'}</TableCell>
                        <TableCell sx={{ color: val.valuationPrice ? '#00cc44' : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                          {val.valuationPrice ? `Rs. ${parseFloat(val.valuationPrice).toLocaleString()}` : '—'}
                        </TableCell>
                        <TableCell sx={{ color: 'rgba(15,23,42,0.55)', fontSize: 12 }}>{val.manager ? `${val.manager.firstName} ${val.manager.lastName}` : '—'}</TableCell>
                        <TableCell sx={{ color: 'rgba(15,23,42,0.5)', fontSize: 12 }}>{new Date(val.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell><Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: 10, border: `1px solid ${status.color}33` }} /></TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleView(val)} sx={{ color: '#00aaff', '&:hover': { bgcolor: 'rgba(0,170,255,0.1)' } }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        <TablePagination component="div" count={total} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          sx={{ color: 'rgba(15,23,42,0.55)', borderTop: '1px solid rgba(15,23,42,0.06)', '& .MuiSelect-icon': { color: 'rgba(15,23,42,0.45)' } }}
        />
      </Box>

      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { bgcolor: '#ffffff', color: '#0f172a', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(15,23,42,0.08)', pb: 2 }}>
          <Typography variant="h6" fontWeight={700} color="#0f172a">Valuation Details</Typography>
          <IconButton onClick={() => setViewDialogOpen(false)} sx={{ color: 'rgba(15,23,42,0.55)' }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedVal && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="rgba(15,23,42,0.55)" gutterBottom>VEHICLE INFORMATION</Typography>
                {[
                  ['Registration No', selectedVal.vehicle?.registrationNo],
                  ['Asset Type', selectedVal.vehicle?.assetType],
                  ['Make', selectedVal.vehicle?.make],
                  ['Model', selectedVal.vehicle?.model],
                  ['Engine No', selectedVal.vehicle?.engineNo],
                  ['Chassis No', selectedVal.vehicle?.chassisNo],
                  ['Year of Manufacture', selectedVal.vehicle?.yearOfManufacture],
                  ['Engine CC', selectedVal.vehicle?.engineCC],
                  ['Fuel Type', selectedVal.vehicle?.fuelType],
                ].map(([label, value]) => (
                  <Box key={label} mb={1}>
                    <Typography variant="caption" color="rgba(15,23,42,0.55)">{label}</Typography>
                    <Typography variant="body2" color="#0f172a" fontWeight={500}>{value || '—'}</Typography>
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="rgba(15,23,42,0.55)" gutterBottom>STATUS & DETAILS</Typography>
                {[
                  ['Inspection Date', selectedVal.vehicle?.inspectionDate],
                  ['Inspection Place', selectedVal.vehicle?.inspectionPlace],
                  ['First Reg. Date', selectedVal.vehicle?.firstRegistrationDate],
                  ['Submitted', new Date(selectedVal.createdAt).toLocaleString()],
                  ['Status', <Chip key="s" label={STATUS_COLORS[selectedVal.status]?.label} size="small" sx={{ bgcolor: STATUS_COLORS[selectedVal.status]?.bg, color: STATUS_COLORS[selectedVal.status]?.color }} />],
                  ['Valuation Price', selectedVal.valuationPrice ? `Rs. ${parseFloat(selectedVal.valuationPrice).toLocaleString()}` : 'Pending'],
                  ['Manager', selectedVal.manager ? `${selectedVal.manager.firstName} ${selectedVal.manager.lastName}` : '—'],
                ].map(([label, value]) => (
                  <Box key={label} mb={1}>
                    <Typography variant="caption" color="rgba(15,23,42,0.55)">{label}</Typography>
                    {typeof value === 'string' ? <Typography variant="body2" color="#0f172a" fontWeight={500}>{value}</Typography> : value}
                  </Box>
                ))}
                {selectedVal.managerNotes && (
                  <Box mt={2}>
                    <Typography variant="caption" color="rgba(15,23,42,0.55)">Notes</Typography>
                    <Typography variant="body2" color="rgba(15,23,42,0.75)" sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: 1, mt: 0.5 }}>
                      {selectedVal.managerNotes}
                    </Typography>
                  </Box>
                )}
              </Grid>

              {(() => {
                const imgs = normalizeImages(selectedVal?.vehicle?.images);
                if (imgs.length === 0) return null;
                return (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="rgba(15,23,42,0.55)" gutterBottom>VEHICLE IMAGES</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5, width: '100%' }}>
                      {imgs.map((img, i) => (
                        <Box key={i} sx={{ minWidth: 0 }}>
                          <Box
                            component="img"
                            src={resolveImageSrc(img)}
                            alt={`Vehicle ${i + 1}`}
                            onClick={() => setGalleryImg(resolveImageSrc(img))}
                            onError={(event) => { event.currentTarget.style.display = 'none'; }}
                            sx={{ width: '100%', height: 130, display: 'block', objectFit: 'cover', borderRadius: 2, cursor: 'pointer', border: '1px solid rgba(15,23,42,0.08)', '&:hover': { border: '1px solid #990000' }, transition: 'all 0.2s' }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                );
              })()}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(15,23,42,0.06)', px: 3, py: 2 }}>
          <Button onClick={() => setViewDialogOpen(false)} sx={{ color: 'rgba(15,23,42,0.6)' }}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!galleryImg} onClose={() => setGalleryImg(null)} maxWidth="lg" fullWidth
        PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.95)', border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogContent sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <IconButton onClick={() => setGalleryImg(null)} sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1 }}><Close /></IconButton>
          <Box component="img" src={galleryImg} alt="Full" sx={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 2 }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminHistory;
