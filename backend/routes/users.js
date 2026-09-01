const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, uploadProfileImage } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { uploadProfileImage: upload } = require('../middleware/upload');

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.post('/upload-profile-image', authenticate, upload.single('profileImage'), uploadProfileImage);

module.exports = router;
