const {
  createPayment,
  getPaymentsByLoanId,
  getPaymentsByUserId,
  getAllPayments,
  getPaymentStats
} = require('../models/paymentModel');
const { getLoanById } = require('../models/loanModel');
const { deductFromWallet } = require('../models/walletModel');

const makePayment = async (req, res) => {
  try {
    const { loan_id, amount, payment_method = 'wallet' } = req.body;
    const userId = req.user.id;

    if (!loan_id || !amount) {
      return res.status(400).json({
        error: 'Шаардлагатай талбар дутуу',
        message: 'Зээлийн ID болон төлбөрийн дүн шаардлагатай'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        error: 'Буруу дүн',
        message: 'Төлбөрийн дүн 0-ээс их байх ёстой'
      });
    }

    const loan = await getLoanById(loan_id);

    if (!loan) {
      return res.status(404).json({
        error: 'Зээл олдсонгүй',
        message: 'Зээлийн мэдээлэл олдсонгүй'
      });
    }

    if (loan.user_id !== userId) {
      return res.status(403).json({
        error: 'Эрх хүрэхгүй',
        message: 'Та энэ зээлд төлбөр хийх эрхгүй байна'
      });
    }

    if (loan.status !== 'disbursed' && loan.status !== 'approved') {
      return res.status(400).json({
        error: 'Зээл төлбөр хийх боломжгүй',
        message: 'Зөвхөн олгогдсон зээлд төлбөр хийж болно'
      });
    }

    // Deduct from wallet
    await deductFromWallet(
      userId,
      amount,
      `Зээл #${loan_id} төлбөр`,
      loan_id,
      'payment'
    );

    // Create payment record
    const payment = await createPayment({
      loan_id,
      user_id: userId,
      amount,
      payment_method,
      transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    res.status(201).json({
      message: 'Төлбөр амжилттай хийгдлээ',
      payment
    });

  } catch (error) {
    console.error('Төлбөр хийх алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const getLoanPayments = async (req, res) => {
  try {
    const { loanId } = req.params;
    const userId = req.user.id;

    const loan = await getLoanById(loanId);

    if (!loan) {
      return res.status(404).json({
        error: 'Зээл олдсонгүй',
        message: 'Зээлийн мэдээлэл олдсонгүй'
      });
    }

    if (loan.user_id !== userId && !req.user.is_admin) {
      return res.status(403).json({
        error: 'Эрх хүрэхгүй',
        message: 'Та энэ зээлийн төлбөрүүдийг үзэх эрхгүй байна'
      });
    }

    const payments = await getPaymentsByLoanId(loanId);

    res.json({ payments });

  } catch (error) {
    console.error('Төлбөрүүд унших алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await getPaymentsByUserId(userId);

    res.json({ payments });

  } catch (error) {
    console.error('Төлбөрүүд унших алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const adminGetAllPayments = async (req, res) => {
  try {
    const payments = await getAllPayments();
    res.json({ payments });

  } catch (error) {
    console.error('Төлбөрүүд унших алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const getUserPaymentStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await getPaymentStats(userId);

    res.json({ stats });

  } catch (error) {
    console.error('Төлбөрийн статистик унших алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

module.exports = {
  makePayment,
  getLoanPayments,
  getUserPayments,
  adminGetAllPayments,
  getUserPaymentStats
};
