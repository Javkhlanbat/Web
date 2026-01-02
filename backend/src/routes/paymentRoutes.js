const express = require('express');
const router = express.Router();
const {
  makePayment,
  getLoanPayments,
  getMyPayments,
  getPaymentDetails,
  getMyPaymentStats,
  checkLoanBalance,
  adminGetAllPayments
} = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validatePayment } = require('../middleware/validationMiddleware');

router.post('/', authenticateToken, validatePayment, makePayment);
router.get('/my', authenticateToken, getMyPayments);
router.get('/stats', authenticateToken, getMyPaymentStats);
router.get('/loan/:loanId', authenticateToken, getLoanPayments);
router.get('/loan/:loanId/balance', authenticateToken, checkLoanBalance);
router.get('/:id', authenticateToken, getPaymentDetails);
router.get('/admin/all', authenticateToken, adminGetAllPayments);

module.exports = router;
