const express = require('express');
const router = express.Router();
const {
  applyForLoan,
  getMyLoans,
  getLoanDetails,
  adminGetAllLoans,
  adminUpdateLoanStatus,
  adminDisburseLoan,
  getMyLoanStats
} = require('../controllers/loanController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
router.get('/', authMiddleware, adminMiddleware, adminGetAllLoans);
router.post('/apply', authMiddleware, applyForLoan);
router.get('/my-loans', authMiddleware, getMyLoans);
router.get('/stats', authMiddleware, getMyLoanStats);
router.patch('/:loanId/status', authMiddleware, adminMiddleware, adminUpdateLoanStatus);
router.post('/:loanId/disburse', authMiddleware, adminMiddleware, adminDisburseLoan);
router.get('/:loanId', authMiddleware, getLoanDetails);

module.exports = router;
