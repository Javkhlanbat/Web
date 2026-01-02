require('dotenv').config();
const { pool } = require('./src/config/database');
const bcrypt = require('bcrypt');

async function makeAdmin() {
  try {
    const phone = '95556339';
    const password = '95556339';

    // Check if user exists
    const checkUser = await pool.query(
      'SELECT id FROM users WHERE phone = $1',
      [phone]
    );

    if (checkUser.rows.length > 0) {
      // User exists, just update to admin
      const result = await pool.query(
        `UPDATE users
         SET is_admin = true
         WHERE phone = $1
         RETURNING id, email, first_name, last_name, phone, is_admin`,
        [phone]
      );
      console.log('✅ Одоо байгаа хэрэглэгчид admin эрх олгогдлоо:');
      console.log(result.rows[0]);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name, phone, is_admin)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, first_name, last_name, phone, is_admin`,
        ['admin95556339@omnicredit.mn', hashedPassword, 'Admin', 'User', phone, true]
      );
      console.log('✅ Шинэ admin хэрэглэгч үүсгэгдлээ:');
      console.log(result.rows[0]);
    }

    await pool.end();
  } catch (error) {
    console.error('❌ Алдаа гарлаа:', error.message);
    await pool.end();
    process.exit(1);
  }
}

makeAdmin();
