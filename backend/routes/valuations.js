const express = require('express');
const router = express.Router();
const {
  createValuation, getValuations, getValuationById,
  getAvailableValuations, inspectValuation, adminDecision,
} = require('../controllers/valuationController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { uploadVehicleImages } = require('../middleware/upload');

// User: submit valuation
router.post('/', authenticate, authorizeRoles('USER'), uploadVehicleImages.array('images', 5), createValuation);

// All: get list (filtered by role)
router.get('/', authenticate, getValuations);

// Manager: available (pending) valuations
router.get('/available', authenticate, authorizeRoles('MANAGER', 'ADMIN'), getAvailableValuations);

// All: single valuation
router.get('/:id', authenticate, getValuationById);

// Manager: inspect (approve/reject)
router.put('/:id/inspect', authenticate, authorizeRoles('MANAGER'), inspectValuation);

// Admin: final decision
router.put('/:id/final-decision', authenticate, authorizeRoles('ADMIN'), adminDecision);

module.exports = router;
