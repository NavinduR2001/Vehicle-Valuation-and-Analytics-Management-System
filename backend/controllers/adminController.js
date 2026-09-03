const { User, Company, Valuation, Vehicle, Report } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// GET /api/admin/stats
const getDashboardStats = async (req, res, next) => {
  try {
    // Only count final approved valuations for dashboard totals
    const totalValuations = await Valuation.count({ where: { status: 'ADMIN_APPROVED' } });
    const totalUsers = await User.count({ where: { role: 'USER' } });
    const totalCompanies = await Company.count();

    // Total revenue = SUM of revenueFee on all ADMIN_APPROVED valuations
    const totalRevenue = await Valuation.sum('revenueFee', {
      where: { status: 'ADMIN_APPROVED' },
    });

    // Valuations by status
    const byStatus = await Valuation.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    // Top asset types (based only on ADMIN_APPROVED valuations)
    const topAssetTypes = await Valuation.findAll({
      attributes: [[col('vehicle.assetType'), 'assetType'], [fn('COUNT', col('Valuation.id')), 'count']],
      include: [{ model: Vehicle, as: 'vehicle', attributes: [] }],
      where: { status: 'ADMIN_APPROVED' },
      group: [col('vehicle.assetType')],
      order: [[fn('COUNT', col('Valuation.id')), 'DESC']],
      limit: 5,
      raw: true,
    });

    // Valuations over time (last 12 months) — only approved valuations
    const valuationsOverTime = await Valuation.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'month'],
        [fn('COUNT', col('id')), 'count'],
      ],
      where: {
        status: 'ADMIN_APPROVED',
        createdAt: { [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
      },
      group: [literal('month')],
      order: [[literal('month'), 'ASC']],
      raw: true,
    });

    // Revenue over time — use revenueFee, not valuationPrice
    const revenueOverTime = await Valuation.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'month'],
        [fn('SUM', col('revenueFee')), 'revenue'],
      ],
      where: {
        status: 'ADMIN_APPROVED',
        createdAt: { [Op.gte]: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
      },
      group: [literal('month')],
      order: [[literal('month'), 'ASC']],
      raw: true,
    });

    // Revenue by company — each company's fee × count of their approved valuations
    const revenueByCompany = await Company.findAll({
      attributes: [
        'id', 'name', 'valuationFee',
        [fn('COUNT', col('employees.submittedValuations.id')), 'approvedCount'],
      ],
      include: [{
        model: User,
        as: 'employees',
        attributes: [],
        include: [{
          model: Valuation,
          as: 'submittedValuations',
          attributes: [],
          where: { status: 'ADMIN_APPROVED' },
          required: false,
        }],
        required: false,
      }],
      group: ['Company.id'],
      raw: true,
    });

    // Top 3 users by approved submissions
    const topUsers = await Valuation.findAll({
      attributes: ['userId', [fn('COUNT', col('Valuation.id')), 'submissionCount']],
      include: [{
        model: User,
        as: 'submittedBy',
        attributes: ['id', 'firstName', 'lastName', 'email', 'profileImage'],
        include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
      }],
      where: { status: 'ADMIN_APPROVED' },
      group: ['userId', 'submittedBy.id'],
      order: [[fn('COUNT', col('Valuation.id')), 'DESC']],
      limit: 3,
      raw: false,
    });

    res.json({
      success: true,
      stats: {
        totalValuations,
        totalUsers,
        totalCompanies,
        totalRevenue: totalRevenue || 0,
        byStatus,
        topAssetTypes,
        valuationsOverTime,
        revenueOverTime,
        revenueByCompany: revenueByCompany.map((c) => ({
          name: c.name,
          valuationFee: parseFloat(c.valuationFee || 0),
          approvedCount: parseInt(c.approvedCount || 0),
          totalRevenue: parseFloat(c.valuationFee || 0) * parseInt(c.approvedCount || 0),
        })),
        topUsers: topUsers.map((u) => ({
          user: u.submittedBy,
          submissionCount: u.get('submissionCount'),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/managers
const getManagers = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await User.findAndCountAll({
      where: { role: 'MANAGER' },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({
      success: true,
      managers: rows,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/managers
const createManager = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, idCardNumber, password, branch, canFinalApprove } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ success: false, message: 'Email already exists.' });

    const manager = await User.create({
      firstName, lastName, email, phone, idCardNumber, password, branch,
      canFinalApprove: !!canFinalApprove,
      role: 'MANAGER',
    });

    res.status(201).json({ success: true, message: 'Manager created.', manager: manager.toJSON() });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/managers/:id
const updateManager = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, isActive, branch, canFinalApprove } = req.body;
    const manager = await User.findOne({ where: { id: req.params.id, role: 'MANAGER' } });
    if (!manager) return res.status(404).json({ success: false, message: 'Manager not found.' });

    const updateFields = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (phone !== undefined) updateFields.phone = phone;
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (branch !== undefined) updateFields.branch = branch;
    if (canFinalApprove !== undefined) updateFields.canFinalApprove = canFinalApprove;

    await manager.update(updateFields);
    res.json({ success: true, message: 'Manager updated.', manager: manager.toJSON() });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/managers/:id
const deleteManager = async (req, res, next) => {
  try {
    const manager = await User.findOne({ where: { id: req.params.id, role: 'MANAGER' } });
    if (!manager) return res.status(404).json({ success: false, message: 'Manager not found.' });

    await manager.destroy();
    res.json({ success: true, message: 'Manager deleted.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/performance — per-user performance with revenue via revenueFee
const getPerformance = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let userWhere = { role: 'USER', isActive: true };
    if (search) {
      userWhere = {
        ...userWhere,
        [Op.or]: [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const { count, rows } = await User.findAndCountAll({
      where: userWhere,
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'valuationFee'],
        },
        {
          model: Valuation,
          as: 'submittedValuations',
          attributes: ['id', 'status', 'revenueFee'],
          required: false,
        },
      ],
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    const data = rows.map((user) => {
      const valuations = user.submittedValuations || [];
      const companyFee = parseFloat(user.company?.valuationFee || 0);
      const approvedValuations = valuations.filter((v) => v.status === 'ADMIN_APPROVED');

      // Revenue = sum of captured revenueFee (authoritative, since fee may change later)
      const totalRevenue = approvedValuations.reduce(
        (sum, v) => sum + parseFloat(v.revenueFee || companyFee || 0),
        0
      );

      return {
        ...user.toJSON(),
        // Report totals based on final admin-approved valuations only
        totalValuations: approvedValuations.length,
        approvedValuations: approvedValuations.length,
        pendingValuations: valuations.filter((v) => v.status === 'PENDING').length,
        rejectedValuations: valuations.filter((v) => v.status === 'REJECTED').length,
        companyFee,
        totalRevenue,
      };
    });

    res.json({
      success: true,
      data,
      pagination: { total: count, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(count / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/company-revenue — company-level revenue breakdown
const getCompanyRevenue = async (req, res, next) => {
  try {
    const companies = await Company.findAll({
      attributes: ['id', 'name', 'valuationFee', 'isActive'],
      include: [{
        model: User,
        as: 'employees',
        attributes: ['id'],
        required: false,
        where: { role: 'USER' },
        include: [{
          model: Valuation,
          as: 'submittedValuations',
          attributes: ['id', 'status', 'revenueFee'],
          required: false,
        }],
      }],
    });

    const data = companies.map((company) => {
      const allValuations = company.employees?.flatMap((u) => u.submittedValuations || []) || [];
      const approved = allValuations.filter((v) => v.status === 'ADMIN_APPROVED');
      const totalRevenue = approved.reduce((sum, v) => sum + parseFloat(v.revenueFee || company.valuationFee || 0), 0);

      return {
        id: company.id,
        name: company.name,
        valuationFee: parseFloat(company.valuationFee || 0),
        isActive: company.isActive,
        totalUsers: company.employees?.length || 0,
        // Expose counts based on approved valuations for dashboard reporting
        totalValuations: approved.length,
        approvedValuations: approved.length,
        totalRevenue,
      };
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users — paginated registered users with company filter
const getRegisteredUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, companyId } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = { role: 'USER' };
    if (companyId) {
      where.companyId = companyId;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

    const userIds = rows.map((user) => user.id);
    const valuationCounts = userIds.length ? await Valuation.findAll({
      attributes: ['userId', [fn('COUNT', col('id')), 'count']],
      where: { userId: { [Op.in]: userIds } },
      group: ['userId'],
      raw: true,
    }) : [];

    const countMap = valuationCounts.reduce((acc, row) => {
      acc[row.userId] = parseInt(row.count, 10);
      return acc;
    }, {});

    const users = rows.map((user) => ({
      ...user.toJSON(),
      totalValuations: countMap[user.id] || 0,
    }));

    res.json({
      success: true,
      users,
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

module.exports = { getDashboardStats, getManagers, createManager, updateManager, deleteManager, getPerformance, getCompanyRevenue, getRegisteredUsers };
