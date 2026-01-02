const express = require('express');
const router = express.Router();
const {
  adminCreateCompany,
  adminGetAllCompanies,
  adminGetCompanyDetails,
  adminUpdateCompany,
  adminDeleteCompany,
  adminCreatePromoCode,
  adminGetAllPromoCodes,
  adminGetPromoCodeDetails,
  adminUpdatePromoCode,
  adminDeletePromoCode,
  verifyPromoCode
} = require('../controllers/promoCodeController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
router.post('/verify', authenticateToken, verifyPromoCode);
router.post('/admin/companies', authenticateToken, requireAdmin, adminCreateCompany);
router.get('/admin/companies', authenticateToken, requireAdmin, adminGetAllCompanies);
router.get('/admin/companies/:id', authenticateToken, requireAdmin, adminGetCompanyDetails);
router.put('/admin/companies/:id', authenticateToken, requireAdmin, adminUpdateCompany);
router.delete('/admin/companies/:id', authenticateToken, requireAdmin, adminDeleteCompany);
router.post('/admin/codes', authenticateToken, requireAdmin, adminCreatePromoCode);
router.get('/admin/codes', authenticateToken, requireAdmin, adminGetAllPromoCodes);
router.get('/admin/codes/:id', authenticateToken, requireAdmin, adminGetPromoCodeDetails);
router.put('/admin/codes/:id', authenticateToken, requireAdmin, adminUpdatePromoCode);
router.delete('/admin/codes/:id', authenticateToken, requireAdmin, adminDeletePromoCode);

module.exports = router;
