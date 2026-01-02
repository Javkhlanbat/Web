const express = require('express');
const router = express.Router();
const {
  applyForLoan,
  getUserLoans,
  getLoan,
  adminGetAllLoans,
  adminUpdateLoanStatus,
  adminDisburseLoan,
  getUserLoanStats
} = require('../controllers/loanController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Admin routes (must be before /:loanId)
router.get('/', authMiddleware, adminMiddleware, adminGetAllLoans);

// User routes (specific routes before dynamic params)
router.post('/apply', authMiddleware, applyForLoan);
router.get('/my-loans', authMiddleware, getUserLoans);
router.get('/stats', authMiddleware, getUserLoanStats);
router.get('/:loanId', authMiddleware, getLoan);
router.patch('/:loanId/status', authMiddleware, adminMiddleware, adminUpdateLoanStatus);
router.post('/:loanId/disburse', authMiddleware, adminMiddleware, adminDisburseLoan);

module.exports = router;
