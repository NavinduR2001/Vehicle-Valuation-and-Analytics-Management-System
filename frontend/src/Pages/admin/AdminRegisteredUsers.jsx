import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, CircularProgress, TablePagination, TextField, InputAdornment,
  MenuItem, Avatar, Chip,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { adminService, companyService, imageUrl } from '../../services/services';

const AdminRegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      setCompanyLoading(true);
      try {
        const res = await companyService.getCompanies();
        setCompanies(res.data.companies || []);
      } catch (error) {
        console.error(error);
      } finally {
        setCompanyLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await adminService.getUsers({
          page: page + 1,
          limit: rowsPerPage,
          companyId: companyId || undefined,
        });
        setUsers(res.data.users || []);
        setTotal(res.data.pagination?.total || 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, rowsPerPage, companyId]);

  return (
    <Box>
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          select
          label="Filter by Company"
          value={companyId}
          onChange={(e) => { setCompanyId(e.target.value); setPage(0); }}
          disabled={companyLoading}
          sx={{
            minWidth: 260,
            '& .MuiInputLabel-root': { color: 'rgba(15,23,42,0.55)' },
            '& .MuiOutlinedInput-root': {
              color: '#0f172a',
              bgcolor: '#ffffff',
              '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' },
            },
          }}
        >
          <MenuItem value="">All Companies</MenuItem>
          {companies.map((company) => (
            <MenuItem key={company.id} value={company.id}>
              {company.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ bgcolor: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress sx={{ color: '#990000' }} />
          </Box>
        ) : users.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography color="rgba(15,23,42,0.55)">No users found</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(153,0,0,0.05)' }}>
                  {['User', 'Email', 'Phone', 'Company', 'Total Valuations'].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        color: 'rgba(15,23,42,0.7)',
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: 1,
                        borderBottom: '1px solid rgba(15,23,42,0.06)',
                      }}
                    >
                      {heading.toUpperCase()}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ '&:hover': { bgcolor: 'rgba(153,0,0,0.03)' }, borderBottom: '1px solid rgba(15,23,42,0.04)' }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar
                          src={user.profileImage ? imageUrl(user.profileImage) : undefined}
                          sx={{ width: 36, height: 36, bgcolor: '#990000', fontSize: 12, fontWeight: 700 }}
                        >
                          {`${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="#0f172a" fontWeight={600} noWrap>
                            {`${user.firstName} ${user.lastName}`}
                          </Typography>
                          {/* <Typography variant="caption" color="rgba(15,23,42,0.55)">
                            {user.role || 'USER'}
                          </Typography> */}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(15,23,42,0.65)', fontSize: 13 }}>{user.email}</TableCell>
                    <TableCell sx={{ color: 'rgba(15,23,42,0.65)', fontSize: 13 }}>{user.phone || '—'}</TableCell>
                    <TableCell sx={{ color: 'rgba(15,23,42,0.65)', fontSize: 13 }}>{user.company?.name || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.totalValuations || 0}
                        size="small"
                        sx={{ bgcolor: 'rgba(0,204,68,0.1)', color: '#00cc44', fontWeight: 700 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
          }}
          sx={{
            color: 'rgba(15,23,42,0.55)',
            borderTop: '1px solid rgba(15,23,42,0.06)',
            '& .MuiSelect-icon': { color: 'rgba(15,23,42,0.45)' },
          }}
        />
      </Box>
    </Box>
  );
};

export default AdminRegisteredUsers;
