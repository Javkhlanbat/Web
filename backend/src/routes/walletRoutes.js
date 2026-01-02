const express = require('express');
const router = express.Router();
const {
  getWallet,
  getTransactions,
  adminAddToWallet
} = require('../controllers/walletController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// User routes
router.get('/', authMiddleware, getWallet);
router.get('/transactions', authMiddleware, getTransactions);

// Admin routes
router.post('/:userId/add', authMiddleware, adminMiddleware, adminAddToWallet);

module.exports = router;
