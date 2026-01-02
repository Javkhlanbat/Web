const {
  getAllPromoCodes,
  getPromoCodeByCode,
  createPromoCode,
  validatePromoCode,
  deletePromoCode
} = require('../models/promoCodeModel');

const adminGetAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await getAllPromoCodes();
    res.json({ promoCodes });

  } catch (error) {
    console.error('Промо кодууд унших алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const adminCreatePromoCode = async (req, res) => {
  try {
    const { code, discount_percentage, max_uses, valid_until } = req.body;

    if (!code || !discount_percentage || !max_uses || !valid_until) {
      return res.status(400).json({
        error: 'Шаардлагатай талбар дутуу',
        message: 'Код, хөнгөлөлт, лимит, хугацаа шаардлагатай'
      });
    }

    const existingCode = await getPromoCodeByCode(code);
    if (existingCode) {
      return res.status(400).json({
        error: 'Промо код давхцаж байна',
        message: 'Энэ код аль хэдийн бүртгэгдсэн байна'
      });
    }

    const promoCode = await createPromoCode({
      code,
      discount_percentage,
      max_uses,
      valid_until
    });

    res.status(201).json({
      message: 'Промо код амжилттай үүсгэгдлээ',
      promoCode
    });

  } catch (error) {
    console.error('Промо код үүсгэх алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const checkPromoCode = async (req, res) => {
  try {
    const { code } = req.params;

    const result = await validatePromoCode(code);

    if (!result.valid) {
      return res.status(400).json({
        error: 'Промо код хүчингүй',
        message: result.message
      });
    }

    res.json({
      valid: true,
      promoCode: result.promoCode
    });

  } catch (error) {
    console.error('Промо код шалгах алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const adminDeletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCode = await deletePromoCode(id);

    if (!deletedCode) {
      return res.status(404).json({
        error: 'Промо код олдсонгүй',
        message: 'Устгах промо код олдсонгүй'
      });
    }

    res.json({
      message: 'Промо код амжилттай устгагдлаа',
      promoCode: deletedCode
    });

  } catch (error) {
    console.error('Промо код устгах алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

module.exports = {
  adminGetAllPromoCodes,
  adminCreatePromoCode,
  checkPromoCode,
  adminDeletePromoCode
};
