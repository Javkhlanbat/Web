const express = require('express');
const router = express.Router();
const {
  makePayment,
  getLoanPayments,
  getUserPayments,
  adminGetAllPayments,
  getUserPaymentStats
} = require('../controllers/paymentController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
router.get('/all', authMiddleware, adminMiddleware, adminGetAllPayments);
router.post('/', authMiddleware, makePayment);
router.get('/my-payments', authMiddleware, getUserPayments);
router.get('/stats', authMiddleware, getUserPaymentStats);
router.get('/loan/:loanId', authMiddleware, getLoanPayments);

module.exports = router;
