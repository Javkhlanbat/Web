const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  createPromoCode,
  getAllPromoCodes,
  getPromoCodesByCompany,
  getPromoCodeByCode,
  validatePromoCode,
  incrementPromoCodeUsage,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode
} = require('../models/promoCodeModel');
const adminCreateCompany = async (req, res) => {
  try {
    const { name, description, contact_email, contact_phone, address } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        error: 'Компанийн нэр шаардлагатай',
        message: 'Компанийн нэр заавал бөглөнө үү'
      });
    }

    const company = await createCompany({
      name: name.trim(),
      description,
      contact_email,
      contact_phone,
      address
    });

    res.status(201).json({
      message: 'Компани амжилттай үүсгэгдлээ',
      company
    });

  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const adminGetAllCompanies = async (req, res) => {
  try {
    const companies = await getAllCompanies();
    res.json({
      count: companies.length,
      companies
    });
  } catch (error) {
    console.error('Get all companies error:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const adminGetCompanyDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await getCompanyById(parseInt(id));

    if (!company) {
      return res.status(404).json({
        error: 'Компани олдсонгүй'
      });
    }
    const promoCodes = await getPromoCodesByCompany(parseInt(id));

    res.json({
      company,
      promoCodes
    });
  } catch (error) {
    console.error('Get company details error:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const adminUpdateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await updateCompany(parseInt(id), req.body);

    if (!company) {
      return res.status(404).json({
        error: 'Компани олдсонгүй'
      });
    }

    res.json({
      message: 'Компани амжилттай шинэчлэгдлээ',
      company
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const adminDeleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await getCompanyById(parseInt(id));
    if (!company) {
      return res.status(404).json({
        error: 'Компани олдсонгүй'
      });
    }

    await deleteCompany(parseInt(id));

    res.json({
      message: 'Компани амжилттай устгагдлаа'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const adminCreatePromoCode = async (req, res) => {
  try {
    const {
      company_id,
      code,
      discount_percent,
      interest_rate_override,
      max_loan_amount,
      max_uses,
      expires_at,
      description
    } = req.body;

    if (!company_id) {
      return res.status(400).json({
        error: 'Компани сонгоно уу',
        message: 'Компани заавал сонгох шаардлагатай'
      });
    }
    const company = await getCompanyById(parseInt(company_id));
    if (!company) {
      return res.status(404).json({
        error: 'Компани олдсонгүй'
      });
    }

    const promoCode = await createPromoCode({
      company_id: parseInt(company_id),
      code,
      discount_percent: discount_percent || 0,
      interest_rate_override,
      max_loan_amount,
      max_uses,
      expires_at,
      description
    });

    res.status(201).json({
      message: 'promo код амжилттай үүсгэгдлээ',
      promoCode
    });

  } catch (error) {
    console.error('Create promo code error:', error);

    // Duplicate code error
    if (error.code === '23505') {
      return res.status(400).json({
        error: 'Код давхцаж байна',
        message: 'Энэ код аль хэдийн бүртгэгдсэн байна'
      });
    }

    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const adminGetAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await getAllPromoCodes();
    res.json({
      count: promoCodes.length,
      promoCodes
    });
  } catch (error) {
    console.error('Get all promo codes error:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const adminGetPromoCodeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const promoCode = await getPromoCodeById(parseInt(id));

    if (!promoCode) {
      return res.status(404).json({
        error: 'Код олдсонгүй'
      });
    }

    res.json({ promoCode });
  } catch (error) {
    console.error('Get promo code details error:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const adminUpdatePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const promoCode = await updatePromoCode(parseInt(id), req.body);

    if (!promoCode) {
      return res.status(404).json({
        error: 'Код олдсонгүй'
      });
    }

    res.json({
      message: 'Код амжилттай шинэчлэгдлээ',
      promoCode
    });
  } catch (error) {
    console.error('Update promo code error:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const adminDeletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;

    const promoCode = await getPromoCodeById(parseInt(id));
    if (!promoCode) {
      return res.status(404).json({
        error: 'Код олдсонгүй'
      });
    }

    await deletePromoCode(parseInt(id));

    res.json({
      message: 'Код амжилттай устгагдлаа'
    });
  } catch (error) {
    console.error('Delete promo code error:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const verifyPromoCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({
        error: 'Код оруулна уу',
        message: 'promo код заавал оруулах шаардлагатай'
      });
    }

    const result = await validatePromoCode(code.trim());

    if (!result.valid) {
      return res.status(400).json({
        valid: false,
        error: result.error
      });
    }

    const promo = result.promo;

    res.json({
      valid: true,
      promoCode: {
        id: promo.id,
        code: promo.code,
        company_name: promo.company_name,
        discount_percent: promo.discount_percent,
        interest_rate_override: promo.interest_rate_override,
        max_loan_amount: promo.max_loan_amount,
        description: promo.description
      }
    });

  } catch (error) {
    console.error('Verify promo code error:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

module.exports = {
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
};
