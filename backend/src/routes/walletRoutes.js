const express = require('express');
const router = express.Router();
const {
  getMyWallet,
  getMyTransactions,
  depositToWallet,
  withdrawToBankAccount,
  payLoanFromWallet
} = require('../controllers/walletController');
const { authenticateToken } = require('../middleware/authMiddleware');
router.get('/', authenticateToken, getMyWallet);
router.get('/transactions', authenticateToken, getMyTransactions);
router.post('/deposit', authenticateToken, depositToWallet);
router.post('/withdraw', authenticateToken, withdrawToBankAccount);
router.post('/pay-loan', authenticateToken, payLoanFromWallet);

module.exports = router;
