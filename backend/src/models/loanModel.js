const { query } = require('../config/database');
const { addToWallet } = require('./walletModel');
const createLoan = async (loanData) => {
  const {
    user_id,
    loan_type = 'personal',
    amount,
    interest_rate,
    term_months,
    monthly_payment,
    total_amount,
    purpose,
    monthly_income,
    occupation,
    promo_code_id = null
  } = loanData;

  const result = await query(
    `INSERT INTO loans (
      user_id, loan_type, amount, interest_rate, term_months,
      monthly_payment, total_amount, purpose, monthly_income, occupation, status, promo_code_id
    )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', $11)
     RETURNING *`,
    [user_id, loan_type, amount, interest_rate, term_months, monthly_payment, total_amount, purpose, monthly_income, occupation, promo_code_id]
  );

  return result.rows[0];
};
const getLoansByUserId = async (userId) => {
  const result = await query(
    'SELECT * FROM loans WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

const getLoanById = async (id) => {
  const result = await query(
    'SELECT * FROM loans WHERE id = $1',
    [id]
  );
  return result.rows[0];
};
const getAllLoans = async () => {
  const result = await query(
    `SELECT l.*, u.email, u.first_name, u.last_name
     FROM loans l
     JOIN users u ON l.user_id = u.id
     ORDER BY l.created_at DESC`
  );
  return result.rows;
};
const updateLoanStatus = async (id, status) => {
  const result = await query(
    `UPDATE loans
     SET status = $1,
         approved_at = CASE WHEN $2 = 'approved' THEN CURRENT_TIMESTAMP ELSE approved_at END
     WHERE id = $3
     RETURNING *`,
    [status, status, id]
  );
  return result.rows[0];
};

const disburseLoan = async (id) => {
  const result = await query(
    `UPDATE loans
     SET status = 'disbursed',
         disbursed_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND status = 'approved'
     RETURNING *`,
    [id]
  );

  const loan = result.rows[0];

  if (loan) {
    const description = `Зээл #${loan.id} олгогдсон`;
    await addToWallet(loan.user_id, loan.amount, description, loan.id, 'loan_disbursement');
  }

  return loan;
};
const deleteLoan = async (id) => {
  await query('DELETE FROM loans WHERE id = $1', [id]);
};
const getLoanStats = async (userId) => {
  const result = await query(
    `SELECT
       COUNT(*) as total_loans,
       SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END) as total_approved,
       SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as total_pending,
       SUM(CASE WHEN status = 'rejected' THEN amount ELSE 0 END) as total_rejected
     FROM loans
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};
const createPurchaseLoan = async (purchaseData) => {
  const { user_id, invoice_code, amount, duration_months, monthly_payment } = purchaseData;
  const result = await query(
    `INSERT INTO purchase_loans (user_id, invoice_code, amount, duration_months, monthly_payment, status)
     VALUES ($1, $2, $3, $4, $5, 'pending')
     RETURNING *`,
    [user_id, invoice_code, amount, duration_months, monthly_payment]
  );
  return result.rows[0];
};
const getPurchaseLoansByUserId = async (userId) => {
  const result = await query(
    'SELECT * FROM purchase_loans WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};
const getPurchaseLoanByInvoice = async (invoiceCode) => {
  const result = await query(
    'SELECT * FROM purchase_loans WHERE invoice_code = $1',
    [invoiceCode]
  );
  return result.rows[0];
};
module.exports = {
  createLoan,
  getLoansByUserId,
  getLoanById,
  getAllLoans,
  updateLoanStatus,
  disburseLoan,
  deleteLoan,
  getLoanStats,
  createPurchaseLoan,
  getPurchaseLoansByUserId,
  getPurchaseLoanByInvoice
};
