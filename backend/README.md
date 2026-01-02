# OmniCredit Backend - API Documentation

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # PostgreSQL холболтын тохиргоо
│   ├── controllers/             # Business logic
│   │   ├── authController.js    # Нэвтрэх, бүртгэл
│   │   ├── loanController.js    # Зээлийн үйлдлүүд
│   │   ├── paymentController.js # Төлбөрийн үйлдлүүд
│   │   └── walletController.js  # Түрийвчний үйлдлүүд
│   ├── models/                  # Database models
│   │   ├── userModel.js         # User CRUD
│   │   ├── loanModel.js         # Loan CRUD
│   │   ├── paymentModel.js      # Payment CRUD
│   │   └── walletModel.js       # Wallet CRUD
│   ├── routes/                  # API endpoints
│   │   ├── authRoutes.js        # /api/auth/*
│   │   ├── loanRoutes.js        # /api/loans/*
│   │   ├── paymentRoutes.js     # /api/payments/*
│   │   └── walletRoutes.js      # /api/wallet/*
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Global error handler
│   └── utils/
│       └── validators.js        # Input validation
└── server.js                     # Entry point
```

## 🔧 Core Files Explanation

### 1. `server.js` - Application Entry Point

```javascript
// Express app үүсгэх
const app = express();

// Middleware тохируулга
app.use(cors());              // Cross-Origin requests зөвшөөрөх
app.use(express.json());      // JSON body parser
app.use(express.urlencoded()) // URL-encoded data

// Routes холбох
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallet', walletRoutes);

// Error handling
app.use(errorHandler);

// Server эхлүүлэх
app.listen(PORT);
```

**Үүрэг:**
- Express application тохируулах
- Middleware-үүд нэмэх
- Routes бүртгэх
- Database холбох
- Server эхлүүлэх

### 2. `config/database.js` - Database Connection

```javascript
const { Pool } = require('pg');

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Query wrapper function
const query = (text, params) => pool.query(text, params);

module.exports = { query, pool };
```

**Үүрэг:**
- PostgreSQL database-тэй холбогдох
- Connection pool удирдах
- Query хийх функц экспортлох
- Connection error шийдвэрлэх

### 3. `middleware/auth.js` - Authentication Middleware

```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Header-с token авах
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token шаардлагатай' });
  }

  try {
    // Token verify хийх
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;  // Request-д user мэдээлэл нэмэх
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token буруу эсвэл хугацаа дууссан' });
  }
};
```

**Үүрэг:**
- JWT token шалгах
- Token-с хэрэглэгчийн мэдээлэл задлах
- Protected routes хамгаалах
- `req.user` дээр мэдээлэл нэмэх

### 4. `controllers/authController.js` - Authentication Logic

```javascript
const register = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  // 1. Email давхцаж байгаа эсэх шалгах
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email бүртгэгдсэн байна' });
  }

  // 2. Password hash хийх (bcrypt)
  const password_hash = await bcrypt.hash(password, 10);

  // 3. User үүсгэх
  const user = await createUser({
    email,
    password_hash,
    first_name,
    last_name
  });

  // 4. Wallet үүсгэх
  await createWallet(user.id);

  // 5. JWT token үүсгэх
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // 6. Response буцаах
  res.status(201).json({ message: 'Бүртгэл амжилттай', token, user });
};
```

**Үүрэг:**
- Хэрэглэгч бүртгэх
- Нэвтрэх
- Token үүсгэх
- Password hash/verify

### 5. `controllers/loanController.js` - Loan Management

```javascript
const applyForLoan = async (req, res) => {
  const { loan_type, amount, duration_months, purpose, interest_rate } = req.body;
  const userId = req.user.id;  // middleware-с ирнэ

  // 1. Validation
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Буруу дүн' });
  }

  if (loan_type === 'consumer' && (duration_months < 2 || duration_months > 24)) {
    return res.status(400).json({ error: 'Хугацаа 2-24 сарын хооронд байх ёстой' });
  }

  // 2. Сарын төлбөр тооцоолох (PMT formula)
  const monthlyRate = interest_rate / 100 / 12;
  const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, duration_months)) /
                         (Math.pow(1 + monthlyRate, duration_months) - 1);
  const totalAmount = monthlyPayment * duration_months;

  // 3. Database-д хадгалах
  const loan = await createLoan({
    user_id: userId,
    loan_type,
    amount,
    interest_rate,
    term_months: duration_months,
    monthly_payment: monthlyPayment,
    total_amount: totalAmount,
    purpose,
    status: 'pending'
  });

  res.status(201).json({ message: 'Зээлийн хүсэлт илгээгдлээ', loan });
};
```

**PMT Formula:**
```
Monthly Payment = P × [r × (1 + r)^n] / [(1 + r)^n - 1]

Where:
  P = Principal (зээлийн дүн)
  r = Monthly interest rate (жилийн хүү / 12)
  n = Number of months (сарын тоо)
```

**Үүрэг:**
- Зээлийн өргөдөл хүлээн авах
- Сарын төлбөр тооцоолох
- Database-д хадгалах
- Статус удирдах (pending → approved → disbursed)

### 6. `controllers/paymentController.js` - Payment Processing

```javascript
const makePayment = async (req, res) => {
  const { loan_id, amount } = req.body;
  const userId = req.user.id;

  // 1. Loan байгаа эсэх шалгах
  const loan = await getLoanById(loan_id);
  if (!loan || loan.user_id !== userId) {
    return res.status(404).json({ error: 'Зээл олдсонгүй' });
  }

  // 2. Wallet-с мөнгө хасах
  await deductFromWallet(
    userId,
    amount,
    `Зээл #${loan_id} төлбөр`,
    loan_id,
    'payment'
  );

  // 3. Payment record үүсгэх
  const payment = await createPayment({
    loan_id,
    user_id: userId,
    amount,
    payment_method: 'wallet',
    transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  });

  res.status(201).json({ message: 'Төлбөр амжилттай', payment });
};
```

**Үүрэг:**
- Төлбөр хүлээн авах
- Wallet balance шалгах
- Transaction үүсгэх
- Payment history хадгалах

### 7. `controllers/walletController.js` - Wallet Operations

```javascript
const depositToWallet = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  // 1. Wallet байгаа эсэх шалгах, байхгүй бол үүсгэх
  let wallet = await getWalletByUserId(userId);
  if (!wallet) {
    wallet = await createWallet(userId);
  }

  // 2. Мөнгө нэмэх
  await addToWallet(
    userId,
    amount,
    'Орлого',
    null,
    'deposit'
  );

  // 3. Шинэчилсэн wallet буцаах
  wallet = await getWalletByUserId(userId);
  res.json({ message: 'Амжилттай орууллаа', wallet });
};

const withdrawToBank = async (req, res) => {
  const { amount, bank_account } = req.body;
  const userId = req.user.id;

  // 1. Wallet balance шалгах
  const wallet = await getWalletByUserId(userId);
  if (wallet.balance < amount) {
    return res.status(400).json({ error: 'Үлдэгдэл хүрэлцэхгүй' });
  }

  // 2. Мөнгө хасах
  await deductFromWallet(
    userId,
    amount,
    `Банк руу шилжүүлэг: ${bank_account}`,
    null,
    'withdrawal'
  );

  res.json({ message: 'Амжилттай гарууллаа' });
};
```

**Үүрэг:**
- Орлого оруулах
- Мөнгө гаргах
- Balance шалгах
- Transaction түүх хадгалах

### 8. `models/` - Database Operations

Models нь CRUD үйлдлүүдийг гүйцэтгэдэг:

```javascript
// userModel.js
const createUser = async (userData) => {
  const result = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name, phone)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userData.email, userData.password_hash, userData.first_name, userData.last_name, userData.phone]
  );
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};
```

**SQL Queries:**
- Parameterized queries ашиглах (SQL injection хамгаалалт)
- `$1, $2, $3` - parameters
- `RETURNING *` - insert хийсний дараа бүх талбар буцаах

---

## 🔄 Request Flow

### 1. Хэрэглэгч нэвтрэх
```
POST /api/auth/login
  ↓
authRoutes.js → authController.login()
  ↓
userModel.getUserByEmail() - Database query
  ↓
bcrypt.compare() - Password шалгах
  ↓
jwt.sign() - Token үүсгэх
  ↓
Response: { token, user }
```

### 2. Protected endpoint дуудах
```
GET /api/loans/my-loans
Headers: Authorization: Bearer <token>
  ↓
auth middleware → jwt.verify()
  ↓
req.user = { id, email } нэмэх
  ↓
loanController.getUserLoans()
  ↓
loanModel.getLoansByUserId(req.user.id)
  ↓
Response: { loans: [...] }
```

### 3. Зээл олгох процесс (Admin)
```
PUT /api/admin/loans/:loanId/status
Body: { status: 'approved' }
  ↓
auth middleware + admin check
  ↓
loanController.adminUpdateLoanStatus()
  ↓
  1. loanModel.updateLoanStatus() - approved
  2. loanModel.disburseLoan() - disbursed болгох
  3. walletModel.addToWallet() - мөнгө нэмэх
  ↓
Response: { loan }
```

---

## 🗄️ Database Schema Details

### Users Table
```sql
-- Бүх хэрэглэгчийн үндсэн мэдээлэл
id SERIAL PRIMARY KEY         -- Автомат дугаар
email VARCHAR(255) UNIQUE     -- Email (давхардахгүй)
password_hash VARCHAR(255)    -- bcrypt hash
first_name VARCHAR(100)       -- Нэр
last_name VARCHAR(100)        -- Овог
phone VARCHAR(20)             -- Утас
is_admin BOOLEAN DEFAULT FALSE -- Admin эрх
created_at TIMESTAMP          -- Үүсгэсэн огноо
```

### Loans Table
```sql
-- Бүх зээлийн мэдээлэл
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id)  -- Хэн зээл хүссэн
loan_type VARCHAR(50)                 -- 'consumer' or 'purchase'
amount DECIMAL(12,2)                  -- Зээлийн дүн
interest_rate DECIMAL(5,2)            -- Жилийн хүү (%)
term_months INTEGER                   -- Хугацаа (сар)
monthly_payment DECIMAL(12,2)         -- Сарын төлбөр
total_amount DECIMAL(12,2)            -- Нийт төлөх дүн
remaining_amount DECIMAL(12,2)        -- Үлдсэн дүн
purpose TEXT                          -- Зориулалт
status VARCHAR(50)                    -- 'pending', 'approved', 'rejected', 'disbursed'
invoice_code VARCHAR(100)             -- Purchase loan-д л байна
created_at TIMESTAMP
approved_at TIMESTAMP                 -- Хэзээ зөвшөөрсөн
disbursed_at TIMESTAMP                -- Хэзээ олгосон
```

**Loan Status Flow:**
```
pending → approved → disbursed → (payments made) → completed
   ↓
rejected
```

### Payments Table
```sql
-- Бүх төлбөрийн түүх
id SERIAL PRIMARY KEY
loan_id INTEGER REFERENCES loans(id)  -- Ямар зээлийн төлбөр
user_id INTEGER REFERENCES users(id)
amount DECIMAL(12,2)                  -- Төлбөрийн дүн
payment_method VARCHAR(50)            -- 'wallet', 'bank', etc
transaction_id VARCHAR(100) UNIQUE    -- Гүйлгээний ID
status VARCHAR(50)                    -- 'completed', 'failed'
payment_date TIMESTAMP
created_at TIMESTAMP
```

### Wallets Table
```sql
-- Хэрэглэгч бүрийн түрийвч
id SERIAL PRIMARY KEY
user_id INTEGER UNIQUE                -- Нэг хэрэглэгч - нэг түрийвч
balance DECIMAL(12,2) DEFAULT 0       -- Одоогийн үлдэгдэл
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Wallet Transactions Table
```sql
-- Түрийвчний гүйлгээний түүх
id SERIAL PRIMARY KEY
wallet_id INTEGER REFERENCES wallets(id)
amount DECIMAL(12,2)                  -- Дүн (+ эсвэл -)
type VARCHAR(50)                      -- 'deposit', 'withdrawal', 'payment', 'loan_disbursement'
description TEXT                      -- Тайлбар
reference_id INTEGER                  -- Холбогдох loan/payment ID
created_at TIMESTAMP
```

---

## 🔒 Security Features

### 1. Password Security
```javascript
// Registration - Hash хийх
const password_hash = await bcrypt.hash(password, 10);
// 10 = salt rounds (өндөр = илүү аюулгүй, гэхдээ удаан)

// Login - Шалгах
const isValid = await bcrypt.compare(password, user.password_hash);
```

### 2. JWT Tokens
```javascript
// Token үүсгэх
const token = jwt.sign(
  { id: user.id, email: user.email },     // Payload
  process.env.JWT_SECRET,                  // Secret key
  { expiresIn: '7d' }                      // Хугацаа
);

// Token verify хийх
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 3. SQL Injection Protection
```javascript
// ❌ МУУ - SQL injection-д өртөмтгий
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ ЗӨВ - Parameterized query
const query = 'SELECT * FROM users WHERE email = $1';
const result = await pool.query(query, [email]);
```

### 4. CORS Configuration
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,  // http://localhost:5173
  credentials: true
}));
```

---

## 📊 API Response Format

### Success Response
```json
{
  "message": "Амжилттай",
  "data": { ... },
  "token": "..." // Шаардлагатай бол
}
```

### Error Response
```json
{
  "error": "Error title",
  "message": "Detailed error message"
}
```

### HTTP Status Codes
- `200` - OK (Амжилттай)
- `201` - Created (Шинээр үүсгэгдсэн)
- `400` - Bad Request (Буруу хүсэлт)
- `401` - Unauthorized (Token байхгүй)
- `403` - Forbidden (Эрх хүрэхгүй)
- `404` - Not Found (Олдсонгүй)
- `500` - Server Error (Серверийн алдаа)

---

## 🧪 Testing

### Manual Testing with curl
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","first_name":"Test","last_name":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Get Profile (with token)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
DB_NAME=omnicredit_prod
JWT_SECRET=very-long-random-secret-key-minimum-32-characters
CORS_ORIGIN=https://yourdomain.com
```

### Security Checklist
- ✅ Strong JWT_SECRET (32+ characters)
- ✅ HTTPS only
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection protection
- ✅ Error logging
- ✅ Regular backups

---

## 📝 Development Tips

1. **Database migrations**: Schema өөрчлөгдсөн бол migration script бичих
2. **Logging**: Production дээр winston эсвэл bunyan ашиглах
3. **Validation**: express-validator ашиглах (одоогоор гараар хийсэн)
4. **Testing**: Jest + Supertest ашиглах
5. **Documentation**: Swagger/OpenAPI нэмэх

---

Асуулт байвал GitHub Issues дээр асууна уу!
