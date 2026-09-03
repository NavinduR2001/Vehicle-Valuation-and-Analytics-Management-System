const path = require('path');
const fs = require('fs');
const { User, Company } = require('../models');

// GET /api/users/profile
const getProfile = async (req, res, next) => {
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

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findByPk(req.user.id);
    
    await user.update({ firstName, lastName, phone });
    res.json({ success: true, message: 'Profile updated.', user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: { include: ['password'] },
    });

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    await user.update({ password: newPassword });
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/upload-profile-image
const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }

    const user = await User.findByPk(req.user.id);

    // Delete old profile image if exists
    if (user.profileImage) {
      const oldPath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    await user.update({ profileImage: imageUrl });

    res.json({ success: true, message: 'Profile image updated.', profileImage: imageUrl });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword, uploadProfileImage };
