import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Chip, CircularProgress, TablePagination, TextField, InputAdornment, MenuItem,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { valuationService } from '../../services/services';

const STATUS_COLORS = {
  PENDING: { label: 'Pending', color: '#ff9900', bg: 'rgba(255,153,0,0.1)' },
  MANAGER_APPROVED: { label: 'Approved', color: '#00cc44', bg: 'rgba(0,204,68,0.1)' },
  ADMIN_APPROVED: { label: 'Final Approved', color: '#00aaff', bg: 'rgba(0,170,255,0.1)' },
  REJECTED: { label: 'Rejected', color: '#ff3333', bg: 'rgba(255,51,51,0.1)' },
};

const inputSx = {
  '& .MuiInputLabel-root': { color: 'rgba(15,23,42,0.55)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#0066cc' },
  '& .MuiOutlinedInput-root': {
    color: '#0f172a',
    '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(0,102,204,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#0066cc' },
    bgcolor: '#ffffff',
  },
  '& .MuiSelect-icon': { color: 'rgba(15,23,42,0.45)' },
};

const menuPaperSx = { MenuProps: { PaperProps: { sx: { bgcolor: '#ffffff', color: '#0f172a' } } } };

const ManagerHistory = () => {
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
        <TextField
          placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(15,23,42,0.35)' }} /></InputAdornment> }}
          sx={{ width: 300, ...inputSx }}
        />
        <TextField
          select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Filter Status"
          SelectProps={menuPaperSx}
          sx={{ width: 180, ...inputSx }}
        >
          <MenuItem value="" sx={{ color: '#0f172a', bgcolor: '#ffffff', '&:hover': { bgcolor: 'rgba(15,23,42,0.04)' } }}>All</MenuItem>
          <MenuItem value="MANAGER_APPROVED" sx={{ color: '#0f172a', bgcolor: '#ffffff', '&:hover': { bgcolor: 'rgba(15,23,42,0.04)' } }}>Approved by Me</MenuItem>
          <MenuItem value="ADMIN_APPROVED" sx={{ color: '#0f172a', bgcolor: '#ffffff', '&:hover': { bgcolor: 'rgba(15,23,42,0.04)' } }}>Admin Approved</MenuItem>
          <MenuItem value="REJECTED" sx={{ color: '#0f172a', bgcolor: '#ffffff', '&:hover': { bgcolor: 'rgba(15,23,42,0.04)' } }}>Rejected</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ bgcolor: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: '#0066cc' }} /></Box>
        ) : valuations.length === 0 ? (
          <Box textAlign="center" py={8}><Typography color="rgba(15,23,42,0.45)">No records found</Typography></Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(0,102,204,0.08)' }}>
                  {['Registration No', 'Asset Type', 'User', 'Company', 'Valuation Price', 'Inspected', 'Status'].map((h) => (
                    <TableCell key={h} sx={{ color: 'rgba(15,23,42,0.7)', fontWeight: 700, fontSize: 12, letterSpacing: 1, borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
                      {h.toUpperCase()}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {valuations.map((val) => {
                  const status = STATUS_COLORS[val.status] || STATUS_COLORS.PENDING;
                  return (
                    <TableRow key={val.id} sx={{ '&:hover': { bgcolor: 'rgba(15,23,42,0.04)' }, borderBottom: '1px solid rgba(15,23,42,0.04)' }}>
                      <TableCell sx={{ color: '#0f172a', fontWeight: 600 }}>{val.vehicle?.registrationNo || '—'}</TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.6)' }}>{val.vehicle?.assetType || '—'}</TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.7)' }}>{val.submittedBy ? `${val.submittedBy.firstName} ${val.submittedBy.lastName}` : '—'}</TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.5)', fontSize: 13 }}>{val.submittedBy?.company?.name || '—'}</TableCell>
                      <TableCell sx={{ color: val.valuationPrice ? '#00cc44' : 'rgba(15,23,42,0.3)', fontWeight: 600 }}>
                        {val.valuationPrice ? `Rs. ${parseFloat(val.valuationPrice).toLocaleString()}` : '—'}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.4)', fontSize: 13 }}>
                        {val.managerInspectedAt ? new Date(val.managerInspectedAt).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell>
                        <Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: 11, border: `1px solid ${status.color}33` }} />
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
    </Box>
  );
};

export default ManagerHistory;
