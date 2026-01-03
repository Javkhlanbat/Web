const {
  getWalletByUserId,
  getWalletTransactions,
  addToWallet,
  deductFromWallet
} = require('../models/walletModel');

const getWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    const wallet = await getWalletByUserId(userId);

    res.json(wallet);

  } catch (error) {
    console.error('Хэтэвч унших алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    const transactions = await getWalletTransactions(userId, limit);

    res.json({ transactions });

  } catch (error) {
    console.error('Гүйлгээ унших алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const depositToWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Буруу дүн',
        message: 'Дүн 0-ээс их байх ёстой'
      });
    }

    const wallet = await addToWallet(userId, amount, 'Орлого оруулах', null, 'deposit');

    res.json({
      message: 'Хэтэвчинд амжилттай нэмэгдлээ',
      wallet
    });

  } catch (error) {
    console.error('Орлого оруулах алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const withdrawToBank = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, bank_account } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Буруу дүн',
        message: 'Дүн 0-ээс их байх ёстой'
      });
    }

    if (!bank_account) {
      return res.status(400).json({
        error: 'Дансны дугаар шаардлагатай',
        message: 'Дансны дугаар оруулна уу'
      });
    }

    const wallet = await deductFromWallet(
      userId,
      amount,
      `Банк руу шилжүүлэх (${bank_account})`,
      null,
      'withdrawal'
    );

    res.json({
      message: 'Амжилттай гарууллаа',
      wallet
    });

  } catch (error) {
    console.error('Зарлага гаргах алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const payLoanFromWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    const { loan_id, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Буруу дүн',
        message: 'Дүн 0-ээс их байх ёстой'
      });
    }

    if (!loan_id) {
      return res.status(400).json({
        error: 'Зээлийн ID шаардлагатай'
      });
    }

    const wallet = await deductFromWallet(
      userId,
      amount,
      `Зээлийн төлбөр #${loan_id}`,
      loan_id,
      'payment'
    );

    res.json({
      message: 'Төлбөр амжилттай төлөгдлөө',
      wallet
    });

  } catch (error) {
    console.error('Зээлийн төлбөр төлөх алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

const adminAddToWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'Буруу дүн',
        message: 'Дүн 0-ээс их байх ёстой'
      });
    }

    const wallet = await addToWallet(userId, amount, description || 'Админ нэмсэн', null, 'admin_add');

    res.json({
      message: 'Хэтэвчинд амжилттай нэмэгдлээ',
      wallet
    });

  } catch (error) {
    console.error('Хэтэвчинд нэмэх алдаа:', error);
    res.status(500).json({
      error: 'Серверт алдаа гарлаа',
      message: error.message
    });
  }
};

module.exports = {
  getWallet,
  getTransactions,
  depositToWallet,
  withdrawToBank,
  payLoanFromWallet,
  adminAddToWallet
};
