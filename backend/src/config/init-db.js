const { pool } = require('./database');
const initDatabase = async () => {
  try {
    console.log('Database tables үүсгэж байна');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        register_number VARCHAR(20) UNIQUE,
        id_front TEXT,
        id_back TEXT,
        profile_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Users table үүсгэсэн');
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'id_front'
        ) THEN
          ALTER TABLE users ADD COLUMN id_front TEXT;
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'id_back'
        ) THEN
          ALTER TABLE users ADD COLUMN id_back TEXT;
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'profile_image'
        ) THEN
          ALTER TABLE users ADD COLUMN profile_image TEXT;
        END IF;
      END $$;
    `);
    console.log('Users table-д id_front, id_back, profile_image columns нэмэгдлээ');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        loan_type VARCHAR(50) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        interest_rate DECIMAL(5, 2) NOT NULL,
        term_months INTEGER NOT NULL,
        monthly_payment DECIMAL(12, 2) NOT NULL,
        total_amount DECIMAL(12, 2),
        purpose TEXT,
        monthly_income DECIMAL(12, 2),
        occupation VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP,
        disbursed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Loans table үүсгэсэн');
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'disbursed_at'
        ) THEN
          ALTER TABLE loans ADD COLUMN disbursed_at TIMESTAMP;
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'total_amount'
        ) THEN
          ALTER TABLE loans ADD COLUMN total_amount DECIMAL(12, 2);
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'purpose'
        ) THEN
          ALTER TABLE loans ADD COLUMN purpose TEXT;
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'monthly_income'
        ) THEN
          ALTER TABLE loans ADD COLUMN monthly_income DECIMAL(12, 2);
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'occupation'
        ) THEN
          ALTER TABLE loans ADD COLUMN occupation VARCHAR(255);
        END IF;
        -- Rename duration_months or duration to term_months if needed
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'duration_months'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'term_months'
        ) THEN
          ALTER TABLE loans RENAME COLUMN duration_months TO term_months;
        ELSIF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'duration'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'term_months'
        ) THEN
          ALTER TABLE loans RENAME COLUMN duration TO term_months;
        ELSIF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'term_months'
        ) THEN
          ALTER TABLE loans ADD COLUMN term_months INTEGER NOT NULL DEFAULT 12;
        END IF;

        -- Drop old duration column if it still exists alongside term_months
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'duration'
        ) AND EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'term_months'
        ) THEN
          ALTER TABLE loans DROP COLUMN duration;
        END IF;
      END $$;
    `);
    console.log('Loans table-д дутуу column-ууд нэмэгдлээ');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        loan_id INTEGER REFERENCES loans(id) ON DELETE CASCADE,
        amount DECIMAL(12, 2) NOT NULL,
        principal_amount DECIMAL(12, 2) DEFAULT 0,
        interest_amount DECIMAL(12, 2) DEFAULT 0,
        payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payment_method VARCHAR(50),
        status VARCHAR(50) DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Payments table үүсгэсэн');
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'payments' AND column_name = 'principal_amount'
        ) THEN
          ALTER TABLE payments ADD COLUMN principal_amount DECIMAL(12, 2) DEFAULT 0;
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'payments' AND column_name = 'interest_amount'
        ) THEN
          ALTER TABLE payments ADD COLUMN interest_amount DECIMAL(12, 2) DEFAULT 0;
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'payments' AND column_name = 'payment_date'
        ) THEN
          ALTER TABLE payments ADD COLUMN payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        END IF;
      END $$;
    `);
    console.log('Payments table-д principal_amount, interest_amount, payment_date columns нэмэгдлээ');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        balance DECIMAL(12, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Wallets table үүсгэсэн');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wallet_transactions (
        id SERIAL PRIMARY KEY,
        wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        loan_id INTEGER REFERENCES loans(id) ON DELETE SET NULL,
        transaction_type VARCHAR(50) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Wallet transactions table үүсгэсэн');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        contact_email VARCHAR(255),
        contact_phone VARCHAR(50),
        address TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Companies table үүсгэсэн');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id SERIAL PRIMARY KEY,
        company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_percent DECIMAL(5, 2) DEFAULT 0,
        interest_rate_override DECIMAL(5, 2),
        max_loan_amount DECIMAL(12, 2),
        max_uses INTEGER,
        used_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMP,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Promo codes table үүсгэсэн');
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'promo_code_id'
        ) THEN
          ALTER TABLE loans ADD COLUMN promo_code_id INTEGER REFERENCES promo_codes(id);
        END IF;
      END $$;
    `);
    console.log('Loans table-д promo_code_id column нэмэгдлээ');
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'loans' AND column_name = 'invoice_code'
        ) THEN
          ALTER TABLE loans ADD COLUMN invoice_code VARCHAR(100);
        END IF;
      END $$;
    `);
    console.log('Loans table-д invoice_code column нэмэгдлээ');
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = 'is_admin'
        ) THEN
          ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT false;
        END IF;
      END $$;
    `);
    console.log('Users table-д is_admin column нэмэгдлээ');

    console.log('Бүх tables амжилттай үүсгэгдлээ!');

  } catch (error) {
    console.error('Database үүсгэх алдаа:', error);
    throw error;
  }
}; 

module.exports = { initDatabase };