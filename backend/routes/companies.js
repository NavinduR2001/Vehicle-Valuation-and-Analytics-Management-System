const express = require('express');
const router = express.Router();
const { getCompanies, getAllCompanies, createCompany, updateCompany, deleteCompany } = require('../controllers/companyController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

// Public: get active companies (for registration dropdown)
router.get('/', getCompanies);

// Admin: all companies with management
router.get('/all', authenticate, authorizeRoles('ADMIN'), getAllCompanies);
router.post('/', authenticate, authorizeRoles('ADMIN'), createCompany);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), updateCompany);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteCompany);

module.exports = router;
