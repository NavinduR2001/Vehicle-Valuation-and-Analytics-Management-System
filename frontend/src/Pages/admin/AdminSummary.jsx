import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, CircularProgress, Paper,
} from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area,
} from 'recharts';
import { Assessment, People, Business, AttachMoney } from '@mui/icons-material';
import { adminService } from '../../services/services';

const COLORS = ['#990000', '#cc3300', '#ff6600', '#ff9900', '#ffcc00'];

const chartCardSx = {
  bgcolor: '#ffffff',
  border: '1px solid rgba(15,23,42,0.08)',
  borderRadius: 3,
  p: 3,
  height: '100%',
  width: '100%',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
};

const StatCard = ({ icon, title, value, color, sub }) => (
  <Box sx={{
    bgcolor: '#ffffff',
    border: '1px solid rgba(15,23,42,0.08)',
    borderRadius: 3, py: 3, px:8,
    display: 'flex', alignItems: 'center', gap: 2,
    transition: 'all 0.3s ease',
    '&:hover': { border: `1px solid ${color}33`, boxShadow: `0 4px 20px rgba(15,23,42,0.08)`, transform: 'translateY(-2px)' },
  }}>
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}12`, color }}>
      {icon}
    </Box>
    <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      <Typography variant="caption" color="rgba(15,23,42,0.55)" fontWeight={600} letterSpacing={1}>{title}</Typography>
      <Typography variant="h4" fontWeight={800} color="#0f172a">{value}</Typography>
      {sub && <Typography variant="caption" color={color}>{sub}</Typography>}
    </Box>
  </Box>
);

const AdminSummary = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((res) => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: '#990000' }} /></Box>;
  if (!stats) return <Typography color="rgba(15,23,42,0.55)">Failed to load stats.</Typography>;

  const topAssetData = (stats.topAssetTypes || []).map((t) => ({ name: t.assetType, value: parseInt(t.count) }));
  const valuationsOverTime = (stats.valuationsOverTime || []).map((d) => ({ month: d.month, count: parseInt(d.count) }));
  const revenueOverTime = (stats.revenueOverTime || []).map((d) => ({ month: d.month, revenue: parseFloat(d.revenue || 0) }));

  return (
    <Box>
      {/* Stat Cards */}
      <Grid container spacing={2} mb={4} sx={{justifyContent : 'space-between'}}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard icon={<Assessment />} title="TOTAL VALUATIONS" value={stats.totalValuations || 0} color="#990000" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard icon={<AttachMoney />} title="TOTAL REVENUE" value={`Rs. ${(stats.totalRevenue || 0).toLocaleString()}`} color="#cc6600" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard icon={<People />} title="REGISTERED USERS" value={stats.totalUsers || 0} color="#0066cc" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard icon={<Business />} title="COMPANIES" value={stats.totalCompanies || 0} color="#006600" />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 3, width: '100%', mb: 3 }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={chartCardSx}>
            <Typography variant="h6" fontWeight={700} color="#0f172a" mb={3}>Valuations Over Time</Typography>
            <Box sx={{ width: '100%', minWidth: 0, minHeight: 280, flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={valuationsOverTime} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#990000" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#990000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                <XAxis dataKey="month" stroke="rgba(15,23,42,0.5)" fontSize={12} tickMargin={8} />
                <YAxis stroke="rgba(15,23,42,0.5)" fontSize={12} width={42} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(153,0,0,0.2)', borderRadius: 8, color: '#0f172a' }} />
                <Area type="monotone" dataKey="count" stroke="#990000" strokeWidth={2} fill="url(#valGrad)" name="Valuations" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={chartCardSx}>
            <Typography variant="h6" fontWeight={700} color="#0f172a" mb={3}>Top Asset Types</Typography>
            {topAssetData.length > 0 ? (
              <Box sx={{ width: '100%', minWidth: 0, minHeight: 240, flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 6, right: 6, bottom: 6, left: 6 }}>
                    <Pie data={topAssetData} cx="50%" cy="50%" innerRadius={45} outerRadius={78} paddingAngle={3} dataKey="value" labelLine={false}>
                    {topAssetData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Legend verticalAlign="bottom" height={30} formatter={(value) => <span style={{ color: '#0f172a' }}>{value}</span>} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(153,0,0,0.2)', borderRadius: 8, color: '#0f172a' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box textAlign="center" py={6}><Typography color="rgba(15,23,42,0.55)">No data yet</Typography></Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Charts Row 2 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 3, width: '100%', mb: 3 }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={chartCardSx}>
            <Typography variant="h6" fontWeight={700} color="#0f172a" mb={3}>Revenue Over Time (Rs)</Typography>
            <Box sx={{ width: '100%', minWidth: 0, minHeight: 280, flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueOverTime} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cc6600" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#cc6600" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                <XAxis dataKey="month" stroke="rgba(15,23,42,0.5)" fontSize={12} tickMargin={8} />
                <YAxis stroke="rgba(15,23,42,0.5)" fontSize={12} width={48} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(153,0,0,0.2)', borderRadius: 8, color: '#0f172a' }} formatter={(v) => [`Rs. ${parseFloat(v).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#cc6600" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={chartCardSx}>
            <Typography variant="h6" fontWeight={700} color="#0f172a" mb={3}>Top 3 Users</Typography>
            {(stats.topUsers || []).map((item, i) => (
              <Box key={i} display="flex" alignItems="center" gap={2} mb={2} sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid rgba(15,23,42,0.06)' }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>
                  {i + 1}
                </Box>
                <Box flex={1} minWidth={0}>
                  <Typography variant="body2" color="#0f172a" fontWeight={600} noWrap>
                    {item.user ? `${item.user.firstName} ${item.user.lastName}` : 'Unknown'}
                  </Typography>
                  <Typography variant="caption" color="rgba(15,23,42,0.55)">{item.user?.company?.name || item.user?.email}</Typography>
                </Box>
                <Typography variant="body2" color="#990000" fontWeight={700}>TOTAL VALUATIONS : {item.submissionCount}</Typography>
              </Box>
            ))}
            {!stats.topUsers?.length && <Typography color="rgba(15,23,42,0.55)" textAlign="center" mt={3}>No submissions yet</Typography>}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSummary;
