const express = require('express');
const router = express.Router();
const {
  applyForLoan,
  getMyLoans,
  getLoanDetails,
  getMyLoanStats,
  applyForPurchaseLoan,
  getMyPurchaseLoans,
  adminGetAllLoans,
  adminUpdateLoanStatus,
  adminDisburseLoan
} = require('../controllers/loanController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { validateLoanApplication } = require('../middleware/validationMiddleware');
router.post('/apply', authenticateToken, validateLoanApplication, applyForLoan);
router.get('/my', authenticateToken, getMyLoans);
router.get('/stats', authenticateToken, getMyLoanStats);
router.post('/purchase', authenticateToken, applyForPurchaseLoan);
router.get('/purchase/my', authenticateToken, getMyPurchaseLoans);
router.get('/admin/all', authenticateToken, requireAdmin, adminGetAllLoans);
router.put('/admin/:id/status', authenticateToken, requireAdmin, adminUpdateLoanStatus);
router.post('/admin/:id/disburse', authenticateToken, requireAdmin, adminDisburseLoan);
router.get('/:id', authenticateToken, getLoanDetails);

module.exports = router;
