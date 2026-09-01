const { Company, User } = require('../models');

// GET /api/companies
const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']],
    });
    res.json({ success: true, companies });
  } catch (error) {
    next(error);
  }
};

// GET /api/companies/all (admin only)
const getAllCompanies = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Company.findAndCountAll({
      include: [{ model: User, as: 'employees', attributes: ['id', 'firstName', 'lastName', 'email', 'role'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      companies: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/companies
const createCompany = async (req, res, next) => {
  try {
    const { name, contactNo, address, valuationFee } = req.body;
    if (!valuationFee && valuationFee !== 0) {
      return res.status(400).json({ success: false, message: 'Valuation fee is required.' });
    }
    const fee = parseFloat(valuationFee);
    if (isNaN(fee) || fee < 0) {
      return res.status(400).json({ success: false, message: 'Valuation fee must be a non-negative number.' });
    }
    const company = await Company.create({ name, contactNo, address, valuationFee: fee });
    res.status(201).json({ success: true, message: 'Company created.', company });
  } catch (error) {
    next(error);
  }
};

// PUT /api/companies/:id
const updateCompany = async (req, res, next) => {
  try {
    const { name, contactNo, address, isActive, valuationFee } = req.body;
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });

    const updates = { name, contactNo, address, isActive };
    if (valuationFee !== undefined) {
      const fee = parseFloat(valuationFee);
      if (isNaN(fee) || fee < 0) {
        return res.status(400).json({ success: false, message: 'Valuation fee must be a non-negative number.' });
      }
      updates.valuationFee = fee;
    }

    await company.update(updates);
    res.json({ success: true, message: 'Company updated.', company });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/companies/:id
const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found.' });

    const userCount = await User.count({ where: { companyId: req.params.id } });
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete company with ${userCount} registered employees.`,
      });
    }

    await company.destroy();
    res.json({ success: true, message: 'Company deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCompanies, getAllCompanies, createCompany, updateCompany, deleteCompany };
