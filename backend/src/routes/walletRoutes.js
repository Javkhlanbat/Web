const express = require('express');
const router = express.Router();
const {
  getWallet,
  getTransactions,
  depositToWallet,
  withdrawToBank,
  payLoanFromWallet,
  adminAddToWallet
} = require('../controllers/walletController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// User routes
router.get('/', authMiddleware, getWallet);
router.get('/transactions', authMiddleware, getTransactions);
router.post('/deposit', authMiddleware, depositToWallet);
router.post('/withdraw', authMiddleware, withdrawToBank);
router.post('/pay-loan', authMiddleware, payLoanFromWallet);

// Admin routes
router.post('/:userId/add', authMiddleware, adminMiddleware, adminAddToWallet);

module.exports = router;
