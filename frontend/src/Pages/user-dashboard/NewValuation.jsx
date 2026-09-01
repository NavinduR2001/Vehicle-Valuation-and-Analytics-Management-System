import React, { useState } from 'react';
import {
  Box, Grid, TextField, Button, MenuItem, Typography, LinearProgress,
  Alert, Chip, IconButton, Card, CardMedia,
} from '@mui/material';
import { CloudUpload, Close, CheckCircle } from '@mui/icons-material';
import { valuationService } from '../../services/services';
import toast from 'react-hot-toast';

const ASSET_TYPES = ['Car', 'Van', 'Bus', 'Lorry', 'Motorcycle', 'Three-Wheeler', 'Truck', 'SUV', 'Pickup', 'Other'];

const IMAGE_SLOTS = [
  { key: 'frontView', title: 'Front View', badge: 'Main Image', required: true },
  { key: 'rearView', title: 'Rear View', badge: 'Required', required: true },
  { key: 'innerSide', title: 'Inner Side', badge: 'Required', required: true },
  { key: 'chassisNo', title: 'Chassis Number', badge: 'Required', required: true },
  { key: 'additional', title: 'Additional Image', badge: 'Optional', required: false },
];

const initialImagesState = {
  frontView: null,
  rearView: null,
  innerSide: null,
  chassisNo: null,
  additional: null,
};

const inputSx = {
  '& .MuiInputLabel-root': { color: 'rgba(15,23,42,0.55)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#990000' },
  '& .MuiOutlinedInput-root': {
    color: '#0f172a',
    '& fieldset': { borderColor: 'rgba(15,23,42,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(153,0,0,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#990000' },
    bgcolor: '#ffffff',
  },
  '& .MuiSelect-icon': { color: 'rgba(15,23,42,0.45)' },
};

const menuPaperSx = { PaperProps: { sx: { bgcolor: '#ffffff', color: '#0f172a' } } };

const cardSx = {
  bgcolor: '#ffffff',
  border: '1px solid rgba(15,23,42,0.08)',
  borderRadius: 3,
  p: 3,
};

const ImageSlotCard = ({ slot, file, onFileSelect, onRemove }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(slot.key, e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <Card
      sx={{
        bgcolor: '#ffffff',
        border: file ? '1px solid rgba(15,23,42,0.12)' : `2px dashed ${isDragOver ? '#990000' : 'rgba(15,23,42,0.15)'}`,
        borderRadius: 2.5,
        p: 2,
        position: 'relative',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#990000',
          boxShadow: file ? '0 4px 12px rgba(15,23,42,0.06)' : 'none',
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
        <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
          {slot.title}
        </Typography>
        <Chip
          label={slot.badge}
          size="small"
          sx={{
            fontSize: 11,
            fontWeight: 600,
            bgcolor: slot.key === 'frontView'
              ? '#990000'
              : slot.required
              ? 'rgba(153,0,0,0.1)'
              : 'rgba(15,23,42,0.06)',
            color: slot.key === 'frontView'
              ? '#ffffff'
              : slot.required
              ? '#990000'
              : 'rgba(15,23,42,0.6)',
          }}
        />
      </Box>

      {file ? (
        <Box sx={{ position: 'relative', borderRadius: 1.5, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={file.preview}
            alt={slot.title}
            sx={{ height: 130, objectFit: 'cover', width: '100%' }}
          />
          <IconButton
            onClick={() => onRemove(slot.key)}
            size="small"
            sx={{
              position: 'absolute', top: 6, right: 6,
              bgcolor: 'rgba(15,23,42,0.75)', color: '#fff',
              '&:hover': { bgcolor: '#990000' },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box
          component="label"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 130,
            cursor: 'pointer',
            bgcolor: isDragOver ? 'rgba(153,0,0,0.04)' : 'rgba(15,23,42,0.015)',
            borderRadius: 1.5,
            textAlign: 'center',
            p: 1.5,
            transition: 'all 0.2s ease',
          }}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileSelect(slot.key, e.target.files[0]);
              }
            }}
          />
          <CloudUpload sx={{ fontSize: 32, color: isDragOver ? '#990000' : 'rgba(15,23,42,0.35)', mb: 0.5 }} />
          <Typography variant="caption" fontWeight={600} color="rgba(15,23,42,0.7)">
            Upload {slot.title}
          </Typography>
          <Typography variant="caption" color="rgba(15,23,42,0.4)" sx={{ fontSize: 10, mt: 0.2 }}>
            Drag & drop or click to browse
          </Typography>
        </Box>
      )}
    </Card>
  );
};

const NewValuation = () => {
  const [form, setForm] = useState({
    registrationNo: '', assetType: '', make: '', model: '',
    engineNo: '', chassisNo: '',
    yearOfManufacture: '', engineCC: '', fuelType: '',
  });
  const [images, setImages] = useState(initialImagesState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSlotFileSelect = (slotKey, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }
    const fileWithPreview = Object.assign(file, { preview: URL.createObjectURL(file) });
    setImages((prev) => ({ ...prev, [slotKey]: fileWithPreview }));
  };

  const handleSlotFileRemove = (slotKey) => {
    setImages((prev) => ({ ...prev, [slotKey]: null }));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!images.frontView || !images.rearView || !images.innerSide || !images.chassisNo) {
      return setError('Please upload all required vehicle images: Front View (Main), Rear View, Inner Side, and Chassis Number.');
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      IMAGE_SLOTS.forEach((slot) => {
        if (images[slot.key]) {
          fd.append('images', images[slot.key]);
        }
      });

      await valuationService.create(fd);
      setSuccess(true);
      toast.success('Valuation request submitted successfully!');
      setForm({
        registrationNo: '', assetType: '', make: '', model: '',
        engineNo: '', chassisNo: '',
        yearOfManufacture: '', engineCC: '', fuelType: '',
      });
      setImages(initialImagesState);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
      toast.error('Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const uploadedCount = Object.values(images).filter(Boolean).length;

  return (
    <Box>
      {success && (
        <Alert
          icon={<CheckCircle />}
          severity="success"
          sx={{ mb: 3, bgcolor: 'rgba(0,200,0,0.08)', color: '#008a33', border: '1px solid rgba(0,200,0,0.2)' }}
          onClose={() => setSuccess(false)}
        >
          Valuation request submitted! It will appear in your history as <strong>PENDING</strong>.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(153,0,0,0.08)', color: '#b91c1c', border: '1px solid rgba(153,0,0,0.25)' }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading && <LinearProgress sx={{ mb: 2, bgcolor: 'rgba(153,0,0,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#990000' } }} />}

      <form onSubmit={handleSubmit}>
        {/* Vehicle Details Card */}
        <Box sx={cardSx}>
          <Typography variant="h6" fontWeight={700} color="#0f172a" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 20, bgcolor: '#990000', borderRadius: 1 }} />
            Vehicle Details
          </Typography>

          <Grid container spacing={2.5} sx={{ width: '100%', justifyContent: 'space-between' }}>
            <Grid item xs={12} sm={6} sx={{ flexGrow: 1 }}>
              <TextField fullWidth name="registrationNo" label="Registration Number *" value={form.registrationNo} onChange={handleChange} required sx={inputSx} placeholder="e.g. ABC-1234" />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ flexGrow: 1, minWidth: 200 }}>
              <TextField fullWidth select name="assetType" label="Asset Type *" value={form.assetType} onChange={handleChange} required sx={inputSx} SelectProps={menuPaperSx}>
                {ASSET_TYPES.map((t) => <MenuItem key={t} value={t} sx={{ color: '#0f172a', bgcolor: '#ffffff', '&:hover': { bgcolor: 'rgba(15,23,42,0.04)' } }}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ flexGrow: 1 }}>
              <TextField fullWidth name="make" label="Make *" value={form.make} onChange={handleChange} required sx={inputSx} placeholder="e.g. Toyota" />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ flexGrow: 1 }}>
              <TextField fullWidth name="model" label="Model *" value={form.model} onChange={handleChange} required sx={inputSx} placeholder="e.g. Corolla" />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ flexGrow: 1 }}>
              <TextField fullWidth name="engineNo" label="Engine Number *" value={form.engineNo} onChange={handleChange} required sx={inputSx} />
            </Grid>
          </Grid>

          <Grid container spacing={2.5} mt={1} sx={{ width: '100%', justifyContent: 'space-between' }}>
            <Grid item xs={12} sm={6} sx={{ flexGrow: 1 }}>
              <TextField fullWidth name="chassisNo" label="Chassis Number *" value={form.chassisNo} onChange={handleChange} required sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ flexGrow: 1 }}>
              <TextField fullWidth name="yearOfManufacture" label="Year of Manufacture *" type="number" value={form.yearOfManufacture} onChange={handleChange} required sx={inputSx} inputProps={{ min: 1950, max: new Date().getFullYear() }} />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ flexGrow: 1 }}>
              <TextField fullWidth name="engineCC" label="Engine CC" type="number" value={form.engineCC} onChange={handleChange} sx={inputSx} placeholder="e.g. 1500" />
            </Grid>
            <Grid item xs={12} sm={4} sx={{ flexGrow: 1 }}>
              <TextField fullWidth name="fuelType" label="Fuel Type *" value={form.fuelType} onChange={handleChange} required sx={inputSx} placeholder="e.g. Petrol, Diesel, Hybrid" />
            </Grid>
          </Grid>
        </Box>

        {/* Image Upload */}
        <Box sx={{ ...cardSx, mt: 3 }}>
          <Typography variant="h6" fontWeight={700} color="#0f172a" mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 20, bgcolor: '#99000', borderRadius: 1 }} />
            Vehicle Images
            <Chip
              label={`${uploadedCount}/5 Uploaded`}
              size="small"
              sx={{
                bgcolor: uploadedCount >= 4 ? 'rgba(0,200,0,0.15)' : 'rgba(153,0,0,0.15)',
                color: uploadedCount >= 4 ? '#00cc44' : '#ff4444',
                fontWeight: 600,
                ml: 1,
              }}
            />
          </Typography>
          <Typography variant="caption" color="rgba(15,23,42,0.55)" mb={2.5} display="block">
            Upload images for each required angle. Front View will be set as the main display image. (JPEG, PNG, WEBP — max 10MB each)
          </Typography>

          <Grid container spacing={2}>
            {IMAGE_SLOTS.map((slot) => (
              <Grid item xs={12} sm={6} md={4} key={slot.key}>
                <ImageSlotCard
                  slot={slot}
                  file={images[slot.key]}
                  onFileSelect={handleSlotFileSelect}
                  onRemove={handleSlotFileRemove}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mt={4} display="flex" gap={2}>
          <Button
            type="submit" variant="contained" size="large" disabled={loading}
            sx={{
              px: 5, py: 1.5, fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(135deg, #990000 0%, #cc0000 100%)',
              borderRadius: 2, boxShadow: '0 4px 20px rgba(153,0,0,0.4)',
              '&:hover': { background: 'linear-gradient(135deg, #770000 0%, #aa0000 100%)', transform: 'translateY(-1px)' },
              transition: 'all 0.2s ease',
            }}
          >
            Submit Valuation Request
          </Button>
          <Button
            type="button" variant="outlined" size="large"
            onClick={() => {
              setForm({
                registrationNo: '', assetType: '', make: '', model: '',
                engineNo: '', chassisNo: '', yearOfManufacture: '',
                engineCC: '', fuelType: '',
              });
              setImages(initialImagesState);
            }}
            sx={{ px: 4, py: 1.5, borderColor: 'rgba(15,23,42,0.15)', color: 'rgba(15,23,42,0.7)', '&:hover': { borderColor: '#990000', color: '#0f172a' } }}
          >
            Clear Form
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default NewValuation;
