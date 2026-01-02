const {
  createLoan,
  getLoansByUserId,
  getLoanById,
  getAllLoans,
  updateLoanStatus,
  disburseLoan,
  getLoanStats,
  createPurchaseLoan,
  getPurchaseLoansByUserId,
  getPurchaseLoanByInvoice
} = require('../models/loanModel');

const {
  validatePromoCode,
  getPromoCodeByCode,
  incrementPromoCodeUsage
} = require('../models/promoCodeModel');

const calculateInterestRate = (loanType, amount, duration) => {
  const rates = {
    'consumer': 2.0,       'purchase': 2.0      };

  return rates[loanType] || 2.0;
};

const calculateMonthlyPayment = (amount, interestRate, durationMonths) => {
  if (interestRate === 0) {
    return amount / durationMonths;
  }
  const monthlyRate = interestRate / 100 / 12;
  const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
                  (Math.pow(1 + monthlyRate, durationMonths) - 1);

  return Math.round(payment * 100) / 100;
};
const applyForLoan = async (req, res) => {
  try {
    const {
      loan_type = 'consumer',
      amount,
      duration_months,
      purpose,
      interest_rate,
      monthly_income,
      occupation,
      promo_code
    } = req.body;
    const userId = req.user.id;
    console.log('Received loan application:', req.body);

        const validLoanTypes = ['consumer', 'purchase'];
    if (!validLoanTypes.includes(loan_type)) {
      return res.status(400).json({
        error: 'Буруу зээлийн төрөл',
        message: 'Зээлийн төрөл "consumer" эсвэл "purchase" байх ёстой'
      });
    }

        if (loan_type === 'purchase') {
      if (!amount || isNaN(amount) || amount < 10000 || amount > 3000000) {
        return res.status(400).json({
          error: 'Буруу дүн',
          message: 'Худалдан авалтын зээлийн дүн 10,000-3,000,000₮ хооронд байх ёстой'
        });
      }
    } else {
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          error: 'Буруу дүн',
          message: 'Зээлийн дүн оруулна уу'
        });
      }
    }

        if (loan_type === 'consumer') {
      if (!duration_months || isNaN(duration_months) || duration_months < 2 || duration_months > 24) {
        return res.status(400).json({
          error: 'Буруу хугацаа',
          message: 'Хэрэглээний зээлийн хугацаа 2-24 сар хооронд байх ёстой'
        });
      }
    } else if (loan_type === 'purchase') {
      if (duration_months !== 6) {
        return res.status(400).json({
          error: 'Буруу хугацаа',
          message: 'Худалдан авалтын зээлийн хугацаа 6 сар (тогтмол) байна'
        });
      }
    }

        if (!purpose || purpose.trim() === '' || purpose.trim().length < 10) {
      return res.status(400).json({
        error: 'Буруу мэдээлэл',
        message: 'Зээлийн зориулалтыг дор хаяж 10 тэмдэгтээр бичнэ үү'
      });
    }

    let promoCodeId = null;
    let appliedInterestRate = null;

    if (promo_code && promo_code.trim() !== '') {
      const promoValidation = await validatePromoCode(promo_code.trim());

      if (!promoValidation.valid) {
        return res.status(400).json({
          error: 'Буруу нэхэмжлийн код',
          message: promoValidation.error
        });
      }

      promoCodeId = promoValidation.promo.id;
      if (promoValidation.promo.interest_rate_override !== null) {
        appliedInterestRate = parseFloat(promoValidation.promo.interest_rate_override);
      }
      await incrementPromoCodeUsage(promoCodeId);
    }

        const finalInterestRate = appliedInterestRate !== null
      ? appliedInterestRate
      : (interest_rate !== undefined ? interest_rate : calculateInterestRate(loan_type, amount, duration_months));

    const monthlyPayment = calculateMonthlyPayment(amount, finalInterestRate, duration_months);
    const totalAmount = monthlyPayment * duration_months;

    const loan = await createLoan({
      user_id: userId,
      loan_type,
      amount,
      interest_rate: finalInterestRate,
      term_months: duration_months,
      monthly_payment: monthlyPayment,
      total_amount: totalAmount,
      purpose,
      monthly_income: monthly_income || null,
      occupation: occupation || null,
      promo_code_id: promoCodeId
    });

    res.status(201).json({
      message: 'Зээлийн хүсэлт амжилттай илгээгдлээ',
      loan: {
        id: loan.id,
        loan_type: loan.loan_type,
        amount: loan.amount,
        interest_rate: loan.interest_rate,
        term_months: loan.term_months,
        monthly_payment: loan.monthly_payment,
        total_amount: loan.total_amount,
        status: loan.status,
        created_at: loan.created_at,
        promo_code_id: loan.promo_code_id
      }
    });

  } catch (error) {
    console.error('Apply for loan алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const getMyLoans = async (req, res) => {
  try {
    const userId = req.user.id;
    const loans = await getLoansByUserId(userId);

    res.json({
      count: loans.length,
      loans
    });

  } catch (error) {
    console.error('Get my loans алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const getLoanDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const loan = await getLoanById(parseInt(id));

    if (!loan) {
      return res.status(404).json({
        error: 'Зээл олдсонгүй',
        message: 'Тухайн ID-тай зээл олдсонгүй'
      });
    }
    if (loan.user_id !== userId) {
      return res.status(403).json({
        error: 'Хандах эрхгүй',
        message: 'Та энэ зээлийн мэдээллийг харах эрхгүй'
      });
    }

    res.json({ loan });

  } catch (error) {
    console.error('Get loan details алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const getMyLoanStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await getLoanStats(userId);

    res.json({ stats });

  } catch (error) {
    console.error('Get loan stats алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const applyForPurchaseLoan = async (req, res) => {
  try {
    const { invoice_code, amount, duration_months } = req.body;
    const userId = req.user.id;
    const existingLoan = await getPurchaseLoanByInvoice(invoice_code);
    if (existingLoan) {
      return res.status(400).json({
        error: 'Invoice давхцаж байна',
        message: 'Энэ invoice код-оор аль хэдийн зээл авсан байна'
      });
    }
    const monthlyPayment = calculateMonthlyPayment(amount, 0, duration_months);

    const purchaseLoan = await createPurchaseLoan({
      user_id: userId,
      invoice_code,
      amount,
      duration_months,
      monthly_payment: monthlyPayment
    });

    res.status(201).json({
      message: 'Худалдан авалтын зээл амжилттай үүсгэгдлээ',
      loan: purchaseLoan
    });

  } catch (error) {
    console.error('Apply for purchase loan алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const getMyPurchaseLoans = async (req, res) => {
  try {
    const userId = req.user.id;
    const loans = await getPurchaseLoansByUserId(userId);

    res.json({
      count: loans.length,
      loans
    });

  } catch (error) {
    console.error('Get my purchase loans алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const adminGetAllLoans = async (req, res) => {
  try {
    const loans = await getAllLoans();

    res.json({
      count: loans.length,
      loans
    });

  } catch (error) {
    console.error('Admin get all loans алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const adminUpdateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Буруу статус',
        message: `Статус нь ${validStatuses.join(', ')}-ийн аль нэг байх ёстой`
      });
    }
    if (status === 'approved') {
      const existingLoan = await getLoanById(parseInt(id));
      if (!existingLoan) {
        return res.status(404).json({
          error: 'Зээл олдсонгүй'
        });
      }

      if (existingLoan.status !== 'pending') {
        return res.status(400).json({
          error: 'Зөвхөн хүлээгдэж буй зээлийг зөвшөөрөх боломжтой'
        });
      }  
      const loan = await disburseLoan(parseInt(id));
      if (!loan) {
        await updateLoanStatus(parseInt(id), 'approved');
        const disbursedLoan = await disburseLoan(parseInt(id));

        return res.json({
          message: 'Зээл зөвшөөрөгдөж, хэрэглэгчийн wallet-д шилжүүлэгдлээ',
          loan: disbursedLoan,
          disbursement: {
            amount: disbursedLoan.amount,
            recipient_user_id: disbursedLoan.user_id
          }
        });
      }

      return res.json({
        message: 'Зээл зөвшөөрөгдөж, хэрэглэгчийн wallet-д шилжүүлэгдлээ',
        loan,
        disbursement: {
          amount: loan.amount,
          recipient_user_id: loan.user_id
        }
      });
    }
    const loan = await updateLoanStatus(parseInt(id), status);

    if (!loan) {
      return res.status(404).json({
        error: 'Зээл олдсонгүй'
      });
    }

    res.json({
      message: 'Зээлийн статус амжилттай өөрчлөгдлөө',
      loan
    });

  } catch (error) {
    console.error('Admin update loan status алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};
const adminDisburseLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const existingLoan = await getLoanById(parseInt(id));

    if (!existingLoan) {
      return res.status(404).json({
        error: 'Зээл олдсонгүй',
        message: 'Тухайн ID-тай зээл олдсонгүй'
      });
    }

    if (existingLoan.status !== 'approved') {
      return res.status(400).json({
        error: 'Зээл олгох боломжгүй',
        message: 'Зөвхөн "approved" статустай зээлийг олгох боломжтой'
      });
    }

    const loan = await disburseLoan(parseInt(id));

    if (!loan) {
      return res.status(500).json({
        error: 'Зээл олгоход алдаа гарлаа'
      });
    }

    res.json({
      message: 'Зээл амжилттай олгогдлоо! Хэрэглэгчийн дансанд шилжүүлэгдлээ.',
      loan,
      disbursement: {
        loan_id: loan.id,
        amount: loan.amount,
        disbursed_at: loan.disbursed_at,
        recipient_user_id: loan.user_id
      }
    });

  } catch (error) {
    console.error('Admin disburse loan алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

module.exports = {
  applyForLoan,
  getMyLoans,
  getLoanDetails,
  getMyLoanStats,
  applyForPurchaseLoan,
  getMyPurchaseLoans,
  adminGetAllLoans,
  adminUpdateLoanStatus,
  adminDisburseLoan
};
