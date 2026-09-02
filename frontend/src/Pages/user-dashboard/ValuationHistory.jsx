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
  
        
      </Box>
    );
 
};

export default ValuationHistory;