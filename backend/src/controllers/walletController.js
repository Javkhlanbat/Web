const {
  getWalletByUserId,
  getWalletTransactions,
  addToWallet
} = require('../models/walletModel');

const getWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    const wallet = await getWalletByUserId(userId);

    res.json({ wallet });

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
  adminAddToWallet
};
