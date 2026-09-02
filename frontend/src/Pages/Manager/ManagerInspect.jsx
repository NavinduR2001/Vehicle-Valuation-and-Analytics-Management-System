import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, TextField, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { valuationService, imageUrl } from '../../services/services';
import toast from 'react-hot-toast';

const inputSx = {
  '& .MuiInputLabel-root': { color: 'rgba(15,23,42,0.55)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#0066cc' },
  '& .MuiOutlinedInput-root': {
    color: '#0f172a',
    bgcolor: '#ffffff',
    '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' },
    '&.Mui-focused fieldset': { borderColor: '#0066cc' },
  },
};

const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const digitsOnly = String(value).replace(/[^\d]/g, '');
  if (!digitsOnly) return '';
  return Number(digitsOnly).toLocaleString('en-US');
};

const sanitizePrice = (value) => String(value || '').replace(/[^\d]/g, '');

const ManagerInspect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [val, setVal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [openImageIndex, setOpenImageIndex] = useState(null);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setErrorMsg('');
        const res = await valuationService.getById(id);
        const payload = res.data.valuation || res.data.data || res.data;
        setVal(payload);
        setPrice(formatPrice(payload?.valuationPrice || ''));
        setNotes(payload?.managerNotes || '');
      } catch (e) {
        console.error(e);
        const msg = e.response?.data?.message || e.message || 'Failed to load valuation';
        setErrorMsg(msg);
        toast.error(msg);
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleAction = async (action) => {
    const rawPrice = sanitizePrice(price);

    if (action === 'approve' && (!rawPrice || parseFloat(rawPrice) <= 0)) {
      return toast.error('Please enter a valid valuation price.');
    }
    setActionLoading(true);
    try {
      await valuationService.inspect(id, { action, valuationPrice: rawPrice, managerNotes: notes });
      toast.success(`Valuation ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      navigate('/manager');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Action failed.');
    } finally { setActionLoading(false); }
  };

  if (loading) return <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: '#0066cc' }} /></Box>;

  if (errorMsg) return (
    <Box sx={{ bgcolor: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, p: { xs: 2, md: 4 } }}>
      <Typography variant="h6" color="#0f172a" mb={2}>Unable to load inspection</Typography>
      <Typography color="rgba(15,23,42,0.65)" mb={2}>{errorMsg}</Typography>
      <Button onClick={() => navigate('/manager')} sx={{ color: 'rgba(15,23,42,0.65)' }}>Back to Manager</Button>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#ffffff', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 3, p: { xs: 2, md: 4 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" color="#0f172a" fontWeight={800}>Inspection - {val?.vehicle?.registrationNo || ''}</Typography>
          <Typography variant="body2" color="rgba(15,23,42,0.55)">Review vehicle details, add notes, then approve or reject.</Typography>
        </Box>
        <Button onClick={() => navigate('/manager')} sx={{ color: 'rgba(15,23,42,0.65)' }}>Back</Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="rgba(15,23,42,0.55)" mb={2} fontWeight={700} letterSpacing={1}>VEHICLE DETAILS</Typography>
          {[
            ['Registration No', val.vehicle?.registrationNo],
            ['Asset Type', val.vehicle?.assetType],
            ['Make', val.vehicle?.make],
            ['Model', val.vehicle?.model],
            ['Year', val.vehicle?.yearOfManufacture],
            ['Engine No', val.vehicle?.engineNo],
            ['Chassis No', val.vehicle?.chassisNo],
          ].map(([l, v]) => (
            <Box key={l} mb={1}>
              <Typography variant="caption" color="rgba(15,23,42,0.45)" display="block">{l}</Typography>
              <Typography variant="body2" color="#0f172a" fontWeight={500}>{v || '—'}</Typography>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="rgba(15,23,42,0.55)" mb={2} fontWeight={700} letterSpacing={1}>INSPECTION ACTIONS</Typography>
          <TextField
            fullWidth
            label="Valuation Price (Rs)"
            type="text"
            value={price}
            onChange={(e) => setPrice(formatPrice(e.target.value))}
            sx={{ ...inputSx, mb: 2 }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9,]*' }}
          />
          <TextField fullWidth label="Notes / Remarks" multiline rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} sx={inputSx} />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2}>
            <Button variant="contained" onClick={() => handleAction('approve')} disabled={actionLoading}
              sx={{ bgcolor: '#006600', '&:hover': { bgcolor: '#005500' } }}>{actionLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Approve'}</Button>
            <Button variant="contained" onClick={() => handleAction('reject')} disabled={actionLoading}
              sx={{ bgcolor: '#990000', '&:hover': { bgcolor: '#770000' } }}>{actionLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Reject'}</Button>
            <Button onClick={() => navigate('/manager')} sx={{ color: 'rgba(15,23,42,0.65)' }}>Cancel</Button>
          </Box>
        </Grid>

        {(() => {
          const rawImages = val?.vehicle?.images;
          let imgs = [];

          try {
            if (Array.isArray(rawImages)) imgs = rawImages;
            else if (typeof rawImages === 'string' && rawImages.trim()) {
              const parsed = JSON.parse(rawImages);
              imgs = Array.isArray(parsed) ? parsed : [parsed];
            } else if (rawImages) {
              imgs = [rawImages];
            }
          } catch (e) {
            imgs = rawImages ? [rawImages] : [];
          }

          imgs = imgs
            .filter(Boolean)
            .map((img) => (typeof img === 'string' ? img : String(img)))
            .filter(Boolean);

          if (imgs.length === 0) return null;
          return (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="rgba(15,23,42,0.55)" mb={2} fontWeight={700} letterSpacing={1}>VEHICLE IMAGES</Typography>
              <Grid container spacing={1.5}>
                {imgs.map((img, i) => (
                  <Grid item xs={6} sm={3} key={i}>
                    <Box
                      component="img"
                      src={img.startsWith('http://') || img.startsWith('https://') ? img : imageUrl(img)}
                      alt={`img-${i}`}
                      onClick={() => setOpenImageIndex(i)}
                      sx={{
                        width: '100%',
                        height: 140,
                        objectFit: 'cover',
                        borderRadius: 1.5,
                        border: '1px solid rgba(15,23,42,0.08)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': { transform: 'scale(1.01)', boxShadow: '0 10px 24px rgba(15,23,42,0.12)' },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          );
        })()}
      </Grid>
      <Dialog open={openImageIndex !== null} onClose={() => setOpenImageIndex(null)} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ p: 1, pr: 2, borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" color="#0f172a" fontWeight={700}>
              Vehicle Image {openImageIndex !== null ? openImageIndex + 1 : ''}
            </Typography>
            <IconButton onClick={() => setOpenImageIndex(null)} size="small" sx={{ color: 'rgba(15,23,42,0.6)' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#f8fafc', p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {openImageIndex !== null && (() => {
            const rawImages = val?.vehicle?.images;
            let imgs = [];
            try {
              if (Array.isArray(rawImages)) imgs = rawImages;
              else if (typeof rawImages === 'string' && rawImages.trim()) {
                const parsed = JSON.parse(rawImages);
                imgs = Array.isArray(parsed) ? parsed : [parsed];
              } else if (rawImages) {
                imgs = [rawImages];
              }
            } catch (e) {
              imgs = rawImages ? [rawImages] : [];
            }

            const normalized = imgs
              .filter(Boolean)
              .map((img) => (typeof img === 'string' ? img : String(img)))
              .filter(Boolean);

            const currentImage = normalized[openImageIndex];
            if (!currentImage) return null;

            return (
              <Box
                component="img"
                src={currentImage.startsWith('http://') || currentImage.startsWith('https://') ? currentImage : imageUrl(currentImage)}
                alt={`full-${openImageIndex}`}
                sx={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 2 }}
              />
            );
          })()}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManagerInspect;
