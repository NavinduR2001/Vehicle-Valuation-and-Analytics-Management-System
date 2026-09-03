import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Chip, Button, CircularProgress, IconButton, TextField,
  InputAdornment, TablePagination, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, Avatar,
} from '@mui/material';
import { Search, Visibility, Close, CheckCircle, Cancel, Image, Download } from '@mui/icons-material';
import { valuationService, reportService, imageUrl } from '../../services/services';
import toast from 'react-hot-toast';

const AdminAvailableValuations = ({ selectedCompany = 'All' }) => {
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [inspectOpen, setInspectOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [galleryImg, setGalleryImg] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await valuationService.getAll({ page: page + 1, limit: rowsPerPage, search, status: 'MANAGER_APPROVED' });
      setValuations(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page, rowsPerPage, search]);

  const displayedValuations = selectedCompany === 'All'
    ? valuations
    : valuations.filter((val) => (val.submittedBy?.company?.name || 'Other Company') === selectedCompany);

  const openInspect = (val) => { navigate(`/admin/review/${val.id}`); };

  const handleAction = async (action) => {
    setActionLoading(true);
    try {
      const res = await valuationService.finalDecision(selected.id, { action, adminNotes });
      toast.success(`Valuation ${action === 'approve' ? 'approved! Report generated.' : 'rejected.'}`);
      setInspectOpen(false);
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const inputSx = {
    '& .MuiInputLabel-root': { color: 'rgba(15,23,42,0.55)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#990000' },
    '& .MuiOutlinedInput-root': {
      color: '#0f172a', bgcolor: '#ffffff',
      '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' },
      '&.Mui-focused fieldset': { borderColor: '#990000' },
    },
  };

  return (
    <Box>
      <Box mb={3} display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <TextField
          placeholder="Search by registration number..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(15,23,42,0.35)' }} /></InputAdornment> }}
          sx={{ width: { xs: '100%', sm: 380 }, ...inputSx }}
        />
        {selectedCompany !== 'All' && (
          <Chip
            label={`Company: ${selectedCompany}`}
            sx={{ bgcolor: '#990000', color: '#ffffff', fontWeight: 700 }}
          />
        )}
      </Box>

      <Box sx={{ bgcolor: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: '#990000' }} /></Box>
        ) : displayedValuations.length === 0 ? (
          <Box textAlign="center" py={8}><Typography color="rgba(15,23,42,0.6)" variant="h6">No manager-approved valuations found {selectedCompany !== 'All' ? `for ${selectedCompany}` : ''}</Typography></Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(153,0,0,0.05)' }}>
                  {['User', 'Company', 'Registration', 'Asset Type', 'Valuation Price', 'Manager', 'Submitted', 'Action'].map((h) => (
                    <TableCell key={h} sx={{ color: 'rgba(15,23,42,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: 1, borderBottom: '1px solid rgba(15,23,42,0.06)' }}>{h.toUpperCase()}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedValuations.map((val) => (
                  <TableRow key={val.id} sx={{ '&:hover': { bgcolor: 'rgba(153,0,0,0.03)' }, borderBottom: '1px solid rgba(15,23,42,0.04)' }}>
                    <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>
                      {val.submittedBy ? `${val.submittedBy.firstName} ${val.submittedBy.lastName}` : '—'}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(15,23,42,0.6)', fontSize: 13 }}>{val.submittedBy?.company?.name || '—'}</TableCell>
                    <TableCell sx={{ color: '#0f172a', fontWeight: 700 }}>{val.vehicle?.registrationNo || '—'}</TableCell>
                    <TableCell sx={{ color: 'rgba(15,23,42,0.65)' }}>{val.vehicle?.assetType || '—'}</TableCell>
                    <TableCell sx={{ color: '#00cc44', fontWeight: 700 }}>Rs. {parseFloat(val.valuationPrice || 0).toLocaleString()}</TableCell>
                    <TableCell sx={{ color: 'rgba(15,23,42,0.55)', fontSize: 13 }}>
                      {val.manager ? `${val.manager.firstName} ${val.manager.lastName}` : '—'}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(15,23,42,0.5)', fontSize: 13 }}>{new Date(val.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="contained" size="small" startIcon={<Visibility fontSize="small" />}
                        onClick={() => openInspect(val)}
                        sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' }, fontSize: 11, fontWeight: 700 }}>
                        REVIEW
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination component="div" count={total} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          sx={{ color: 'rgba(15,23,42,0.55)', borderTop: '1px solid rgba(15,23,42,0.06)', '& .MuiSelect-icon': { color: 'rgba(15,23,42,0.45)' } }}
        />
      </Box>
    </Box>
  );
};

const inputSx = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#990000' },
  '& .MuiOutlinedInput-root': { color: '#fff', bgcolor: 'rgba(255,255,255,0.03)', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&.Mui-focused fieldset': { borderColor: '#990000' } },
};

export default AdminAvailableValuations;
