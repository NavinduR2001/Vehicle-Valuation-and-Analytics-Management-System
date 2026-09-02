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

 
};

export default ValuationHistory;