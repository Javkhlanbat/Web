const { query, pool } = require('../config/database');

const getWalletByUserId = async (userId) => {
  let result = await query(
    'SELECT * FROM wallets WHERE user_id = $1',
    [userId]
  );

  if (result.rows.length === 0) {
    result = await query(
      'INSERT INTO wallets (user_id, balance) VALUES ($1, 0) RETURNING *',
      [userId]
    );
  }

  return result.rows[0];
};

const addToWallet = async (userId, amount, description, loanId = null, transactionType = 'loan_disbursement') => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const walletResult = await client.query(
      'SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE',
      [userId]
    );

    let wallet;
    if (walletResult.rows.length === 0) {
      const newWalletResult = await client.query(
        'INSERT INTO wallets (user_id, balance) VALUES ($1, $2) RETURNING *',
        [userId, amount]
      );
      wallet = newWalletResult.rows[0];
    } else {
      wallet = walletResult.rows[0];
      const updateResult = await client.query(
        'UPDATE wallets SET balance = balance + $1 WHERE user_id = $2 RETURNING *',
        [amount, userId]
      );
      wallet = updateResult.rows[0];
    }

    await client.query(
      `INSERT INTO wallet_transactions (wallet_id, loan_id, amount, transaction_type, description)
       VALUES ($1, $2, $3, $4, $5)`,
      [wallet.id, loanId, amount, transactionType, description]
    );

    await client.query('COMMIT');
    return wallet;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deductFromWallet = async (userId, amount, description, loanId = null, transactionType = 'payment') => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const walletResult = await client.query(
      'SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE',
      [userId]
    );

    if (walletResult.rows.length === 0) {
      throw new Error('Хэтэвч олдсонгүй');
    }

    const wallet = walletResult.rows[0];

    if (wallet.balance < amount) {
      throw new Error('Хэтэвчний үлдэгдэл хүрэлцэхгүй байна');
    }

    const updateResult = await client.query(
      'UPDATE wallets SET balance = balance - $1 WHERE user_id = $2 RETURNING *',
      [amount, userId]
    );

    await client.query(
      `INSERT INTO wallet_transactions (wallet_id, loan_id, amount, transaction_type, description)
       VALUES ($1, $2, $3, $4, $5)`,
      [wallet.id, loanId, -amount, transactionType, description]
    );

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getWalletTransactions = async (userId, limit = 50) => {
  const walletResult = await query(
    'SELECT id FROM wallets WHERE user_id = $1',
    [userId]
  );

  if (walletResult.rows.length === 0) {
    return [];
  }

  const walletId = walletResult.rows[0].id;

  const result = await query(
    `SELECT * FROM wallet_transactions
     WHERE wallet_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [walletId, limit]
  );

  return result.rows;
};

module.exports = {
  getWalletByUserId,
  addToWallet,
  deductFromWallet,
  getWalletTransactions
};
