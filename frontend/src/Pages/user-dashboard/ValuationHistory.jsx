import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Chip, Button, CircularProgress, Avatar, Tooltip, TablePagination,
  TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, IconButton,
} from '@mui/material';
import { Search, Download, Visibility, Close, Image } from '@mui/icons-material';
import { valuationService, reportService, toImageUrl } from '../../services/services';

const STATUS_COLORS = {
  PENDING: { label: 'Pending', color: '#ff9900', bg: 'rgba(255,153,0,0.1)' },
  MANAGER_APPROVED: { label: 'Under Review', color: '#00aaff', bg: 'rgba(0,170,255,0.1)' },
  ADMIN_APPROVED: { label: 'Approved', color: '#00cc44', bg: 'rgba(0,204,68,0.1)' },
  REJECTED: { label: 'Rejected', color: '#ff3333', bg: 'rgba(255,51,51,0.1)' },
};

const normalizeImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (error) {
      return images.split(',').map((img) => img.trim()).filter(Boolean);
    }
    return [images].filter(Boolean);
  }
  return [];
};

const ValuationHistory = () => {
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedVal, setSelectedVal] = useState(null);
  const [galleryImg, setGalleryImg] = useState(null);

  const fetchValuations = async () => {
    setLoading(true);
    try {
      const res = await valuationService.getAll({ page: page + 1, limit: rowsPerPage, search });
      setValuations(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchValuations(); }, [page, rowsPerPage, search]);

  const handleView = (val) => { setSelectedVal(val); setViewDialogOpen(true); };

  const handleDownload = async (reportId) => {
    try {
      await reportService.download(reportId);
    } catch (error) {
      console.error(error);
    }
  };
  return (
      <Box>
        {/* Search */}
        <Box mb={3}>
          <TextField
            placeholder="Search by registration number, make, model..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(255,255,255,0.3)' }} /></InputAdornment>,
            }}
            sx={{
              width: { xs: '100%', sm: 380 },
              '& .MuiInputLabel-root': { color: 'rgba(15,23,42,0.55)' },
              '& .MuiOutlinedInput-root': {
                color: '#0f172a',
                bgcolor: '#ffffff',
                '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' },
                '&:hover fieldset': { borderColor: 'rgba(153,0,0,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#990000' },
              },
            }}
          />
        </Box>
  
        <Box sx={{ bgcolor: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress sx={{ color: '#990000' }} />
            </Box>
          ) : valuations.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography color="rgba(15,23,42,0.6)" variant="h6">No valuations found</Typography>
              <Typography color="rgba(15,23,42,0.45)" variant="body2" mt={1}>Submit your first valuation request</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(153,0,0,0.05)' }}>
                    {['Vehicle', 'Registration No', 'Asset Type', 'Submitted', 'Status', 'Valuation Price', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ color: 'rgba(15,23,42,0.7)', fontWeight: 700, fontSize: 12, letterSpacing: 1, borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
                        {h.toUpperCase()}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {valuations.map((val) => {
                    const status = STATUS_COLORS[val.status] || STATUS_COLORS.PENDING;
                    const vehicle = val.vehicle;
                    const images = normalizeImages(vehicle?.images);
                    const mainImg = images[0];
                    return (
                      <TableRow key={val.id} sx={{ '&:hover': { bgcolor: 'rgba(153,0,0,0.03)' }, borderBottom: '1px solid rgba(15,23,42,0.04)' }}>
                        <TableCell>
                          <Avatar
                            src={mainImg ? toImageUrl(mainImg) : undefined}
                            variant="rounded"
                            sx={{ width: 48, height: 48, bgcolor: '#f8fafc', border: '1px solid rgba(15,23,42,0.08)' }}
                          >
                            <Image sx={{ color: 'rgba(15,23,42,0.35)' }} />
                          </Avatar>
                        </TableCell>
                        <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>{vehicle?.registrationNo || '—'}</TableCell>
                        <TableCell sx={{ color: 'rgba(15,23,42,0.7)' }}>{vehicle?.assetType || '—'}</TableCell>
                        <TableCell sx={{ color: 'rgba(15,23,42,0.55)', fontSize: 13 }}>
                          {new Date(val.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={status.label}
                            size="small"
                            sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: 11, border: `1px solid ${status.color}33` }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: val.valuationPrice ? '#00cc44' : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                          {val.valuationPrice ? `Rs. ${parseFloat(val.valuationPrice).toLocaleString()}` : '—'}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => handleView(val)} sx={{ color: '#00aaff', '&:hover': { bgcolor: 'rgba(0,170,255,0.1)' } }}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {val.status === 'ADMIN_APPROVED' && val.report && (
                              <Tooltip title="Download Report">
                                <IconButton size="small" onClick={() => handleDownload(val.report.id)} sx={{ color: '#00cc44', '&:hover': { bgcolor: 'rgba(0,204,68,0.1)' } }}>
                                  <Download fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
  
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
            sx={{ color: 'rgba(15,23,42,0.55)', borderTop: '1px solid rgba(15,23,42,0.06)', '& .MuiSelect-icon': { color: 'rgba(15,23,42,0.45)' } }}
          />
        </Box>
          {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth
          PaperProps={{ sx: { bgcolor: '#ffffff', color: '#0f172a', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3 } }}
        >
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
                    ['Submitted', new Date(selectedVal.createdAt).toLocaleString()],
                    ['Status', <Chip key="s" label={STATUS_COLORS[selectedVal.status]?.label} size="small" sx={{ bgcolor: STATUS_COLORS[selectedVal.status]?.bg, color: STATUS_COLORS[selectedVal.status]?.color }} />],
                    ['Valuation Price', selectedVal.valuationPrice ? `Rs. ${parseFloat(selectedVal.valuationPrice).toLocaleString()}` : 'Pending'],
                  ].map(([label, value]) => (
                    <Box key={label} mb={1}>
                      <Typography variant="caption" color="rgba(15,23,42,0.55)">{label}</Typography>
                      {typeof value === 'string' ? <Typography variant="body2" color="#0f172a" fontWeight={500}>{value}</Typography> : value}
                    </Box>
                  ))}
                  {selectedVal.managerNotes && (
                    <Box mt={2}>
                      <Typography variant="caption" color="rgba(15,23,42,0.55)">Inspector Notes</Typography>
                      <Typography variant="body2" color="rgba(15,23,42,0.75)" sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: 1, mt: 0.5 }}>
                        {selectedVal.managerNotes}
                      </Typography>
                    </Box>
                  )}
                </Grid>
  
                {/* Images */}
                {(() => {
                  const imgs = normalizeImages(selectedVal?.vehicle?.images);
                  if (imgs.length === 0) return null;
                  const activeImage = galleryImg || toImageUrl(imgs[0]);
                  return (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="rgba(15,23,42,0.55)" gutterBottom>VEHICLE IMAGES</Typography>
                      <Box
                        component="img"
                        src={activeImage}
                        alt="Vehicle preview"
                        onClick={() => setGalleryImg(activeImage)}
                        sx={{ width: '100%', maxHeight: 360, objectFit: 'contain', borderRadius: 2, cursor: 'zoom-in', border: '1px solid rgba(15,23,42,0.08)', bgcolor: '#f8fafc', mb: 2 }}
                      />
                      <Grid container spacing={1.5}>
                        {imgs.map((img, i) => (
                          <Grid item xs={6} sm={4} key={`${img}-${i}`}>
                            <Box
                              component="img"
                              src={toImageUrl(img)}
                              alt={`Vehicle ${i + 1}`}
                              onClick={() => setGalleryImg(toImageUrl(img))}
                              sx={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 2, cursor: 'pointer', border: activeImage === toImageUrl(img) ? '2px solid #990000' : '1px solid rgba(15,23,42,0.08)', '&:hover': { border: '1px solid #990000' }, transition: 'all 0.2s' }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  );
                })()}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid rgba(15,23,42,0.06)', px: 3, py: 2 }}>
            {selectedVal?.status === 'ADMIN_APPROVED' && selectedVal?.report && (
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => handleDownload(selectedVal.report.id)}
                sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' } }}
              >
                Download Report
              </Button>
            )}
            <Button onClick={() => setViewDialogOpen(false)} sx={{ color: 'rgba(15,23,42,0.6)' }}>Close</Button>
          </DialogActions>
        </Dialog>
  
        {/* Fullscreen Image Viewer */}
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

export default ValuationHistory;