const jwt = require('jsonwebtoken');
const { User, Company } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, companyId, idCardNumber, password } = req.body;

    // Check email uniqueness
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    // Check NIC uniqueness
    const existingNIC = await User.findOne({ where: { idCardNumber } });
    if (existingNIC) {
      return res.status(409).json({ success: false, message: 'ID Card Number already registered.' });
    }

    // Validate company exists and is active
    const company = await Company.findOne({ where: { id: companyId, isActive: true } });
    if (!company) {
      return res.status(400).json({ success: false, message: 'Invalid or inactive company selected.' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      companyId,
      idCardNumber,
      password,
      role: 'USER',
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact admin.' });
    }

    // Need to get user with password
    const userWithPassword = await User.findOne({ where: { email }, attributes: { include: ['password'] } });
    const isPasswordValid = await userWithPassword.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        companyId: user.companyId,
        company: user.company,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
      attributes: { exclude: ['password'] },
    });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
