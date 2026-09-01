const { Vehicle, Valuation, User, Company, Report } = require('../models');
const { Op } = require('sequelize');

const userInclude = {
  model: User,
  as: 'submittedBy',
  attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
  include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
};

const managerInclude = {
  model: User,
  as: 'manager',
  attributes: ['id', 'firstName', 'lastName', 'email'],
};

const vehicleInclude = {
  model: Vehicle,
  as: 'vehicle',
};

// POST /api/valuations — USER submits new valuation
const createValuation = async (req, res, next) => {
  try {
    const {
      registrationNo, assetType, make, model, engineNo, chassisNo,
      inspectionDate, inspectionPlace, firstRegistrationDate,
      yearOfManufacture, engineCC, fuelType,
    } = req.body;

    // Check if registration already exists
    const existingVehicle = await Vehicle.findOne({ where: { registrationNo } });
    if (existingVehicle) {
      // Check if there's a pending valuation for this vehicle
      const existingVal = await Valuation.findOne({
        where: { vehicleId: existingVehicle.id, status: 'PENDING' },
      });
      if (existingVal) {
        return res.status(409).json({
          success: false,
          message: 'A pending valuation already exists for this vehicle.',
        });
      }
    }

    // Handle images
    const images = req.files ? req.files.map((f) => `/uploads/vehicles/${f.filename}`) : [];

    if (images.length < 3) {
      return res.status(400).json({ success: false, message: 'Minimum 3 vehicle images required.' });
    }

    // Create vehicle
    const vehicle = await Vehicle.create({
      registrationNo, assetType, make, model, engineNo, chassisNo,
      inspectionDate: (inspectionDate && String(inspectionDate).trim()) ? inspectionDate : new Date().toISOString().split('T')[0],
      inspectionPlace: (inspectionPlace && String(inspectionPlace).trim()) ? inspectionPlace : 'N/A',
      firstRegistrationDate: (firstRegistrationDate && String(firstRegistrationDate).trim()) ? firstRegistrationDate : null,
      yearOfManufacture: parseInt(yearOfManufacture),
      engineCC: parseFloat(engineCC) || null,
      fuelType, images,
      userId: req.user.id,
    });

    // Create valuation
    const valuation = await Valuation.create({
      vehicleId: vehicle.id,
      userId: req.user.id,
      status: 'PENDING',
    });

    const result = await Valuation.findByPk(valuation.id, {
      include: [vehicleInclude, userInclude],
    });

    res.status(201).json({ success: true, message: 'Valuation request submitted successfully.', valuation: result });
  } catch (error) {
    next(error);
  }
};

// GET /api/valuations — Get valuations (role-filtered)
const getValuations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = {};
    let vehicleWhere = {};

    // Role-based filtering
    if (req.user.role === 'USER') {
      where.userId = req.user.id;
    } else if (req.user.role === 'MANAGER') {
      where.status = { [Op.in]: ['PENDING', 'MANAGER_APPROVED', 'REJECTED'] };
    } else if (req.user.role === 'ADMIN') {
      // Admin sees all
    }

    if (status) where.status = status;

    if (search) {
      vehicleWhere = {
        [Op.or]: [
          { registrationNo: { [Op.like]: `%${search}%` } },
          { make: { [Op.like]: `%${search}%` } },
          { model: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const { count, rows } = await Valuation.findAndCountAll({
      where,
      include: [
        { ...vehicleInclude, where: Object.keys(vehicleWhere).length ? vehicleWhere : undefined },
        userInclude,
        managerInclude,
        { model: Report, as: 'report', attributes: ['id', 'reportId', 'filePath', 'generatedDate'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/valuations/:id — Get single valuation
const getValuationById = async (req, res, next) => {
  try {
    const valuation = await Valuation.findByPk(req.params.id, {
      include: [
        vehicleInclude,
        userInclude,
        managerInclude,
        { model: User, as: 'approvedByAdmin', attributes: ['id', 'firstName', 'lastName'] },
        { model: Report, as: 'report' },
      ],
    });

    if (!valuation) {
      return res.status(404).json({ success: false, message: 'Valuation not found.' });
    }

    // Access control
    if (req.user.role === 'USER' && valuation.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, valuation });
  } catch (error) {
    next(error);
  }
};

// MANAGER: GET /api/valuations/available — Pending valuations for manager
const getAvailableValuations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let vehicleWhere = {};
    if (search) {
      vehicleWhere = {
        [Op.or]: [
          { registrationNo: { [Op.like]: `%${search}%` } },
          { make: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const { count, rows } = await Valuation.findAndCountAll({
      where: { status: 'PENDING' },
      include: [
        { ...vehicleInclude, where: Object.keys(vehicleWhere).length ? vehicleWhere : undefined },
        userInclude,
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    res.json({
      success: true,
      data: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// MANAGER: PUT /api/valuations/:id/inspect
const inspectValuation = async (req, res, next) => {
  try {
    const { action, valuationPrice, managerNotes } = req.body;

    const valuation = await Valuation.findByPk(req.params.id);
    if (!valuation) return res.status(404).json({ success: false, message: 'Valuation not found.' });

    if (valuation.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Valuation is not in PENDING state.' });
    }

    if (action === 'approve') {
      if (!valuationPrice || parseFloat(valuationPrice) <= 0) {
        return res.status(400).json({ success: false, message: 'Valuation price is required for approval.' });
      }

      const manager = await User.findByPk(req.user.id);
      const isFinalApprove = manager && manager.canFinalApprove;

      if (isFinalApprove) {
        const companyFee = parseFloat(valuation.submittedBy?.company?.valuationFee || 0);
        await valuation.update({
          status: 'ADMIN_APPROVED',
          managerId: req.user.id,
          adminId: req.user.id,
          valuationPrice: parseFloat(valuationPrice),
          managerNotes,
          adminNotes: 'Final approved directly by Authorized Manager',
          managerInspectedAt: new Date(),
          finalApprovedAt: new Date(),
          revenueFee: companyFee,
        });

        const reportService = require('../services/reportService');
        await reportService.generateReport(valuation.id, req.user.id);
      } else {
        await valuation.update({
          status: 'MANAGER_APPROVED',
          managerId: req.user.id,
          valuationPrice: parseFloat(valuationPrice),
          managerNotes,
          managerInspectedAt: new Date(),
        });
      }
    } else if (action === 'reject') {
      await valuation.update({
        status: 'REJECTED',
        managerId: req.user.id,
        managerNotes,
        rejectedAt: new Date(),
        rejectionReason: managerNotes,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Use "approve" or "reject".' });
    }

    const updated = await Valuation.findByPk(valuation.id, {
      include: [vehicleInclude, userInclude, managerInclude],
    });

    res.json({ success: true, message: `Valuation ${action}d successfully.`, valuation: updated });
  } catch (error) {
    next(error);
  }
};

// ADMIN: PUT /api/valuations/:id/final-decision
const adminDecision = async (req, res, next) => {
  try {
    const { action, adminNotes } = req.body;

    const valuation = await Valuation.findByPk(req.params.id, {
      include: [
        vehicleInclude,
        userInclude,
        managerInclude,
        {
          model: User,
          as: 'submittedBy',
          attributes: ['id', 'firstName', 'lastName', 'email', 'companyId'],
          include: [{ model: Company, as: 'company', attributes: ['id', 'name', 'valuationFee'] }],
        },
      ],
    });

    if (!valuation) return res.status(404).json({ success: false, message: 'Valuation not found.' });

    if (valuation.status !== 'MANAGER_APPROVED') {
      return res.status(400).json({ success: false, message: 'Valuation must be Manager Approved first.' });
    }

    if (action === 'approve') {
      // Capture the company's valuationFee at the moment of approval
      const companyFee = parseFloat(valuation.submittedBy?.company?.valuationFee || 0);

      await valuation.update({
        status: 'ADMIN_APPROVED',
        adminId: req.user.id,
        adminNotes,
        adminApprovedAt: new Date(),
        revenueFee: companyFee,
      });

      // Generate PDF report
      const reportService = require('../services/reportService');
      const report = await reportService.generateReport(valuation.id, req.user.id);

      res.json({
        success: true,
        message: `Valuation approved. Revenue fee Rs. ${companyFee.toLocaleString()} recorded.`,
        report,
        revenueFee: companyFee,
      });
    } else if (action === 'reject') {
      await valuation.update({
        status: 'REJECTED',
        adminId: req.user.id,
        adminNotes,
        rejectedAt: new Date(),
        rejectionReason: adminNotes,
      });
      res.json({ success: true, message: 'Valuation rejected.' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createValuation,
  getValuations,
  getValuationById,
  getAvailableValuations,
  inspectValuation,
  adminDecision,
};
