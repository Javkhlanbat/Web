const express = require('express');
const router = express.Router();
const {
  adminGetAllPromoCodes,
  adminCreatePromoCode,
  checkPromoCode,
  adminDeletePromoCode
} = require('../controllers/promoCodeController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes (for checking promo code validity)
router.get('/check/:code', checkPromoCode);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, adminGetAllPromoCodes);
router.post('/', authMiddleware, adminMiddleware, adminCreatePromoCode);
router.delete('/:id', authMiddleware, adminMiddleware, adminDeletePromoCode);

module.exports = router;
