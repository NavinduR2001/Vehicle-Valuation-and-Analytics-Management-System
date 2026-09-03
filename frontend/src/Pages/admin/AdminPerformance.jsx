import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, CircularProgress, TablePagination, TextField, InputAdornment,
  LinearProgress, Avatar, Chip,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { adminService, imageUrl } from '../../services/services';

const AdminPerformance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const maxRevenue = Math.max(...data.map(d => d.totalRevenue || 0), 1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await adminService.getPerformance({ page: page + 1, limit: rowsPerPage, search });
        setData(res.data.data || []);
        setTotal(res.data.pagination?.total || 0);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [page, rowsPerPage, search]);

  return (
    <Box>
      <Box mb={3}>
        <TextField placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: 'rgba(15,23,42,0.35)' }} /></InputAdornment> }}
          sx={{ width: { xs: '100%', sm: 350 }, '& .MuiOutlinedInput-root': { color: '#0f172a', bgcolor: '#ffffff', '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' } } }}
        />
      </Box>

      <Box sx={{ bgcolor: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: '#990000' }} /></Box>
          : data.length === 0 ? <Box textAlign="center" py={8}><Typography color="rgba(15,23,42,0.55)">No users found</Typography></Box>
          : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(153,0,0,0.05)' }}>
                    {['User', 'Company', 'Total Submissions', 'Approved', 'Pending', 'Revenue Generated', 'Revenue Share'].map((h) => (
                      <TableCell key={h} sx={{ color: 'rgba(15,23,42,0.7)', fontWeight: 700, fontSize: 11, letterSpacing: 1, borderBottom: '1px solid rgba(15,23,42,0.06)' }}>{h.toUpperCase()}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((u) => (
                    <TableRow key={u.id} sx={{ '&:hover': { bgcolor: 'rgba(153,0,0,0.03)' }, borderBottom: '1px solid rgba(15,23,42,0.04)' }}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar src={u.profileImage ? imageUrl(u.profileImage) : undefined} sx={{ width: 34, height: 34, bgcolor: '#990000', fontSize: 12, fontWeight: 700 }}>
                            {`${(u.firstName || '')[0]}${(u.lastName || '')[0]}`}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="#0f172a" fontWeight={600}>{`${u.firstName} ${u.lastName}`}</Typography>
                            <Typography variant="caption" color="rgba(15,23,42,0.55)">{u.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(15,23,42,0.6)', fontSize: 12 }}>{u.company?.name || '—'}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#0f172a" fontWeight={700} textAlign="center">{u.totalValuations || 0}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={u.approvedValuations || 0} size="small" sx={{ bgcolor: 'rgba(0,204,68,0.1)', color: '#00cc44', fontWeight: 700 }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={u.pendingValuations || 0} size="small" sx={{ bgcolor: 'rgba(255,153,0,0.1)', color: '#ff9900', fontWeight: 700 }} />
                      </TableCell>
                      <TableCell sx={{ color: '#00cc44', fontWeight: 700 }}>Rs. {(u.totalRevenue || 0).toLocaleString()}</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <Box>
                          <LinearProgress variant="determinate" value={Math.min(((u.totalRevenue || 0) / maxRevenue) * 100, 100)}
                            sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#990000', borderRadius: 3 } }} />
                          <Typography variant="caption" color="rgba(15,23,42,0.45)" mt={0.5} display="block">
                            {(((u.totalRevenue || 0) / maxRevenue) * 100).toFixed(0)}%
                          </Typography>
                        </Box>
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

export default AdminPerformance;
