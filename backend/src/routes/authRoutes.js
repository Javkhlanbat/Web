const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  uploadProfileImage,
  verifyToken,
  adminGetAllUsers,
  adminGetUserDetails,
  adminDeleteUser,
  createAdminUser
} = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/create-admin', createAdminUser);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.post('/upload-profile-image', authMiddleware, uploadProfileImage);
router.get('/verify', authMiddleware, verifyToken);

// Admin routes
router.get('/users', authMiddleware, adminMiddleware, adminGetAllUsers);
router.get('/users/:userId', authMiddleware, adminMiddleware, adminGetUserDetails);
router.delete('/users/:userId', authMiddleware, adminMiddleware, adminDeleteUser);

module.exports = router;
