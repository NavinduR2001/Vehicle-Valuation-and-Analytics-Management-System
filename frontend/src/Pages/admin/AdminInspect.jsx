import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, CircularProgress, Grid, IconButton, TextField, Typography,
  Dialog, DialogContent, DialogTitle,
} from '@mui/material';
import { CheckCircle, Cancel, Close } from '@mui/icons-material';
import { valuationService, imageUrl } from '../../services/services';
import toast from 'react-hot-toast';

const inputSx = {
  '& .MuiInputLabel-root': { color: 'rgba(15,23,42,0.55)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#990000' },
  '& .MuiOutlinedInput-root': {
    color: '#0f172a',
    bgcolor: '#ffffff',
    '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' },
    '&.Mui-focused fieldset': { borderColor: '#990000' },
  },
};

const AdminInspect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [openImageIndex, setOpenImageIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await valuationService.getById(id);
        const payload = res.data.valuation || res.data.data || res.data;
        setValuation(payload);
        setAdminNotes(payload?.adminNotes || '');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load valuation');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleAction = async (action) => {
    if (!valuation) return;
    setActionLoading(true);
    try {
      await valuationService.finalDecision(valuation.id, { action, adminNotes });
      toast.success(action === 'approve' ? 'Valuation approved and report generated.' : 'Valuation rejected.');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress sx={{ color: '#990000' }} />
      </Box>
    );
  }

  if (!valuation) return null;

  // Normalize vehicle images: some DB drivers return JSON as string
  let images = [];
  try {
    const raw = valuation?.vehicle?.images;
    if (Array.isArray(raw)) images = raw;
    else if (typeof raw === 'string' && raw.trim()) {
      images = JSON.parse(raw);
      if (!Array.isArray(images)) images = [images];
    } else if (raw) images = [raw];
  } catch (e) {
    // Fallback: treat as single string
    images = valuation?.vehicle?.images ? [valuation.vehicle.images] : [];
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, p: { xs: 2, md: 3 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight={800} color="#0f172a">Final Review & Approval</Typography>
          <Typography variant="body2" color="rgba(15,23,42,0.55)">Registration No: {valuation.vehicle?.registrationNo || '—'}</Typography>
        </Box>
        <IconButton onClick={() => navigate('/admin')} sx={{ color: 'rgba(15,23,42,0.55)' }}>
          <Close />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" fontWeight={700} color="rgba(15,23,42,0.55)" mb={2} letterSpacing={1}>VEHICLE DETAILS</Typography>
          {[
            ['Reg. No', valuation.vehicle?.registrationNo],
            ['Asset Type', valuation.vehicle?.assetType],
            ['Make', valuation.vehicle?.make],
            ['Model', valuation.vehicle?.model],
            ['Year', valuation.vehicle?.yearOfManufacture],
            ['Engine No', valuation.vehicle?.engineNo],
            ['Chassis No', valuation.vehicle?.chassisNo],
            ['Engine CC', valuation.vehicle?.engineCC],
            ['Fuel Type', valuation.vehicle?.fuelType],
            ['Inspection Date', valuation.vehicle?.inspectionDate],
            ['Inspection Place', valuation.vehicle?.inspectionPlace],
          ].map(([label, value]) => (
            <Box key={label} mb={1.2}>
              <Typography variant="caption" color="rgba(15,23,42,0.45)">{label}</Typography>
              <Typography variant="body2" color="#0f172a" fontWeight={500}>{value || '—'}</Typography>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" fontWeight={700} color="rgba(15,23,42,0.55)" mb={2} letterSpacing={1}>USER & MANAGER</Typography>
          {[
            ['User', valuation.submittedBy ? `${valuation.submittedBy.firstName} ${valuation.submittedBy.lastName}` : '—'],
            ['Email', valuation.submittedBy?.email],
            ['Phone', valuation.submittedBy?.phone],
            ['Company', valuation.submittedBy?.company?.name],
            ['Manager', valuation.manager ? `${valuation.manager.firstName} ${valuation.manager.lastName}` : '—'],
            ['Manager Email', valuation.manager?.email],
            ['Inspected', valuation.managerInspectedAt ? new Date(valuation.managerInspectedAt).toLocaleString() : '—'],
          ].map(([label, value]) => (
            <Box key={label} mb={1.2}>
              <Typography variant="caption" color="rgba(15,23,42,0.45)">{label}</Typography>
              <Typography variant="body2" color="#0f172a" fontWeight={500}>{value || '—'}</Typography>
            </Box>
          ))}
          <Box mt={2} p={2} sx={{ bgcolor: 'rgba(0,204,68,0.08)', border: '1px solid rgba(0,204,68,0.2)', borderRadius: 2 }}>
            <Typography variant="caption" color="rgba(0,204,68,0.7)">ASSESSED VALUE</Typography>
            <Typography variant="h5" color="#00cc44" fontWeight={800}>Rs. {parseFloat(valuation.valuationPrice || 0).toLocaleString()}</Typography>
          </Box>
          {valuation.managerNotes && (
            <Box mt={2}>
              <Typography variant="caption" color="rgba(15,23,42,0.45)">Manager Notes</Typography>
              <Typography variant="body2" color="rgba(15,23,42,0.75)" sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: 1, mt: 0.5 }}>{valuation.managerNotes}</Typography>
            </Box>
          )}
          <Box mt={2}>
            <TextField
              fullWidth
              label="Admin Notes (optional)"
              multiline
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              sx={inputSx}
              placeholder="Add your approval notes..."
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography variant="subtitle2" fontWeight={700} color="rgba(15,23,42,0.55)" mb={2} letterSpacing={1}>
            IMAGES ({images.length})
          </Typography>
          {images.length > 0 ? (
            <Grid container spacing={1}>
              {images.map((img, index) => (
                  <Grid item xs={6} key={index}>
                    <Box
                      component="img"
                      src={img && img.startsWith('http') ? img : imageUrl(img)}
                      alt={`vehicle-${index}`}
                      onClick={() => setOpenImageIndex(index)}
                      sx={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 1.5, border: '1px solid rgba(15,23,42,0.08)', cursor: 'pointer' }}
                    />
                  </Grid>
                ))}
            </Grid>
          ) : (
            <Typography color="rgba(15,23,42,0.55)">No images available.</Typography>
          )}
        </Grid>
      </Grid>

      <Box display="flex" gap={2} mt={3} flexWrap="wrap">
        <Button
          variant="contained"
          startIcon={actionLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <CheckCircle />}
          onClick={() => handleAction('approve')}
          disabled={actionLoading}
          sx={{ bgcolor: '#006600', '&:hover': { bgcolor: '#005500' }, px: 3, py: 1.2, fontWeight: 700 }}
        >
          Final Approve & Generate PDF
        </Button>
        <Button
          variant="contained"
          startIcon={actionLoading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Cancel />}
          onClick={() => handleAction('reject')}
          disabled={actionLoading}
          sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' }, px: 3, py: 1.2, fontWeight: 700 }}
        >
          Reject
        </Button>
        <Button onClick={() => navigate('/admin')} sx={{ color: 'rgba(15,23,42,0.65)' }}>Cancel</Button>
      </Box>

      {/* Image viewer dialog */}
      
    </Box>
  );
};

export default AdminInspect;