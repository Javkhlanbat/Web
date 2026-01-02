const bcrypt = require('bcrypt');
const { query } = require('../config/database');

const createUser = async (userData) => {
  const { email, password, first_name, last_name, phone, register_number, id_front, id_back, is_admin } = userData;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await query(
    `INSERT INTO users (email, password, first_name, last_name, phone, register_number, id_front, id_back, is_admin)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, email, first_name, last_name, phone, register_number, is_admin, created_at`,
    [email, hashedPassword, first_name, last_name, phone, register_number, id_front || null, id_back || null, is_admin || false]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findUserByPhone = async (phone) => {
  const result = await query(
    'SELECT * FROM users WHERE phone = $1',
    [phone]
  );
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await query(
    'SELECT id, email, first_name, last_name, phone, register_number, id_front, id_back, is_admin, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await query(
    'SELECT id, email, first_name, last_name, phone, register_number, is_admin, created_at FROM users ORDER BY created_at DESC'
  );
  return result.rows;
};

const updateUserProfile = async (userId, updates) => {
  const { first_name, last_name, phone, id_front, id_back } = updates;
  const result = await query(
    `UPDATE users
     SET first_name = COALESCE($1, first_name),
         last_name = COALESCE($2, last_name),
         phone = COALESCE($3, phone),
         id_front = COALESCE($4, id_front),
         id_back = COALESCE($5, id_back)
     WHERE id = $6
     RETURNING id, email, first_name, last_name, phone, register_number, id_front, id_back, is_admin, created_at`,
    [first_name, last_name, phone, id_front, id_back, userId]
  );
  return result.rows[0];
};

const deleteUser = async (userId) => {
  const result = await query(
    'DELETE FROM users WHERE id = $1 RETURNING id',
    [userId]
  );
  return result.rows[0];
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByPhone,
  findUserById,
  getAllUsers,
  updateUserProfile,
  deleteUser,
  comparePassword
};
