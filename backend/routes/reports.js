const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { Report, Valuation } = require('../models');
const { authenticate } = require('../middleware/auth');
const reportService = require('../services/reportService');

const getAndRegenerate = async (req, res, next, disposition) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [{ model: Valuation, as: 'valuation' }],
    });

    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    // Users can only access their own reports
    if (req.user.role === 'USER' && report.valuation.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Always regenerate PDF to apply latest layout
    await reportService.generateReport(report.valuationId, report.adminId || req.user.id);

    // Reload report to get updated filePath
    await report.reload();

    const filePath = path.join(__dirname, '..', report.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Report file could not be generated.' });
    }

    const reportName = report.reportId || `report-${report.id}`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `${disposition}; filename="${reportName}.pdf"`);
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

// GET /api/reports/:id/download
router.get('/:id/download', authenticate, (req, res, next) =>
  getAndRegenerate(req, res, next, 'attachment')
);

// GET /api/reports/:id/view
router.get('/:id/view', authenticate, (req, res, next) =>
  getAndRegenerate(req, res, next, 'inline')
);

module.exports = router;
