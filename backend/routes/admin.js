const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getManagers, createManager,
  updateManager, deleteManager, getPerformance, getCompanyRevenue, getRegisteredUsers,
} = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const adminOnly = [authenticate, authorizeRoles('ADMIN')];

router.get('/stats', ...adminOnly, getDashboardStats);
router.get('/managers', ...adminOnly, getManagers);
router.post('/managers', ...adminOnly, createManager);
router.put('/managers/:id', ...adminOnly, updateManager);
router.delete('/managers/:id', ...adminOnly, deleteManager);
router.get('/performance', ...adminOnly, getPerformance);
router.get('/company-revenue', ...adminOnly, getCompanyRevenue);
router.get('/users', ...adminOnly, getRegisteredUsers);

module.exports = router;
