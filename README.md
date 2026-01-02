# OmniCredit - Зээлийн Удирдлагын Систем

## 📋 Товч танилцуулга

OmniCredit нь орчин үеийн технологи ашигласан зээлийн удирдлагын веб систем юм. Энэхүү систем нь зээл хүсэгчид болон зээл олгогчдод хялбар, найдвартай үйлчилгээ үзүүлэхэд зориулагдсан.

### Үндсэн боломжууд:
- 🏦 Зээлийн өргөдөл илгээх (Хэрэглээний болон Худалдан авалтын зээл)
- 💰 Түрийвчний удирдлага (мөнгө орлого, зарлага)
- 💳 Зээлийн төлбөр төлөх
- 📊 Дэлгэрэнгүй статистик мэдээлэл
- 👤 Хэрэглэгчийн профайл удирдлага
- 🔐 Найдвартай нэвтрэх систем (JWT Token)
- 👨‍💼 Админы хяналтын самбар

---

## 🏗️ Системийн архитектур

```
OmniCredit/
├── backend/              # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── config/      # Тохиргооны файлууд
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # Database models
│   │   ├── routes/      # API endpoints
│   │   └── middleware/  # Authentication, error handling
│   └── server.js        # Server entry point
│
└── frontend/            # Vanilla JavaScript + Web Components
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── styles/      # CSS styles
    │   └── main.js      # Application entry point
    └── index.html       # HTML entry point
```

---

## 🔧 Технологи

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: PostgreSQL 12+
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **CORS**: Enabled for frontend communication

### Frontend
- **Architecture**: Web Components (Custom Elements)
- **Module System**: ES6 Modules
- **Build Tool**: Vite
- **Styling**: CSS Variables + Custom CSS
- **Router**: Custom hash-based router
- **State Management**: Component-level state

---

## 📦 Суулгах заавар

### 1. Шаардлагатай програмууд
```bash
# Node.js (v18 буюу түүнээс дээш)
node --version

# PostgreSQL (v12 буюу түүнээс дээш)
psql --version

# npm (Node.js-тай хамт суусан байдаг)
npm --version
```

### 2. Database тохиргоо

PostgreSQL үүсгэх:
```sql
-- Нэвтрэх
psql -U postgres

-- Database үүсгэх
CREATE DATABASE omnicredit;

-- Холбогдох
\c omnicredit

-- Хэрэглэгч үүсгэх (жишээ)
CREATE USER omnicredit_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE omnicredit TO omnicredit_user;
```

Database schema автоматаар үүснэ (server эхлэхэд).

### 3. Backend суулгах

```bash
# Backend хавтас руу орох
cd OmniCredit/backend

# Dependencies суулгах
npm install

# .env файл үүсгэх
cp .env.example .env  # эсвэл шинээр үүсгэх

# .env файлыг засах
nano .env
```

**.env файлын загвар:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=omnicredit
DB_USER=omnicredit_user
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

```bash
# Server эхлүүлэх
npm start

# Эсвэл development горимд (hot reload)
npm run dev
```

Server ажиллаж эхлэхэд:
- ✅ Database холболт шалгана
- ✅ Tables автоматаар үүснэ
- ✅ http://localhost:5000 дээр асна

### 4. Frontend суулгах

```bash
# Frontend хавтас руу орох
cd OmniCredit/frontend

# Dependencies суулгах
npm install

# Development server эхлүүлэх
npm run dev
```

Frontend ажиллаж эхлэхэд:
- ✅ http://localhost:5173 дээр нээгдэнэ
- ✅ Backend руу API дуудлага хийнэ

---

## 🗄️ Database бүтэц

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Loans Table
```sql
CREATE TABLE loans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  loan_type VARCHAR(50) NOT NULL, -- 'consumer' or 'purchase'
  amount DECIMAL(12,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  term_months INTEGER NOT NULL,
  monthly_payment DECIMAL(12,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  purpose TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  invoice_code VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  disbursed_at TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER REFERENCES loans(id),
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'wallet',
  transaction_id VARCHAR(100) UNIQUE,
  status VARCHAR(50) DEFAULT 'completed',
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Wallets Table
```sql
CREATE TABLE wallets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id),
  balance DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Wallet Transactions Table
```sql
CREATE TABLE wallet_transactions (
  id SERIAL PRIMARY KEY,
  wallet_id INTEGER REFERENCES wallets(id),
  amount DECIMAL(12,2) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'deposit', 'withdrawal', 'payment', 'loan_disbursement'
  description TEXT,
  reference_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 Backend API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
Шинэ хэрэглэгч бүртгэх
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "Иван",
  "last_name": "Дорж",
  "phone": "99887766"
}

Response:
{
  "message": "Бүртгэл амжилттай",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "email": "user@example.com", ... }
}
```

#### POST `/api/auth/login`
Нэвтрэх
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Амжилттай нэвтэрлээ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "email": "user@example.com", "is_admin": false }
}
```

#### GET `/api/auth/profile`
Хэрэглэгчийн мэдээлэл авах (Token шаардлагатай)
```
Headers: Authorization: Bearer <token>

Response:
{
  "user": { "id": 1, "email": "user@example.com", ... }
}
```

### Loans (`/api/loans`)

#### POST `/api/loans/apply`
Зээлийн өргөдөл илгээх
```json
Request:
{
  "loan_type": "consumer",  // or "purchase"
  "amount": 1000000,
  "duration_months": 12,
  "interest_rate": 2.0,
  "purpose": "Гэр ахуйн зардал",
  "invoice_code": "INV-2024-001" // purchase loan-д л шаардлагатай
}

Response:
{
  "message": "Зээлийн хүсэлт амжилттай илгээгдлээ",
  "loan": { "id": 1, "status": "pending", ... }
}
```

#### GET `/api/loans/my-loans`
Миний зээлүүд
```
Response:
{
  "loans": [
    {
      "id": 1,
      "amount": 1000000,
      "term_months": 12,
      "status": "approved",
      ...
    }
  ]
}
```

#### GET `/api/loans/:loanId`
Зээлийн дэлгэрэнгүй
```
Response:
{
  "loan": { "id": 1, "amount": 1000000, ... }
}
```

### Payments (`/api/payments`)

#### POST `/api/payments`
Төлбөр төлөх
```json
Request:
{
  "loan_id": 1,
  "amount": 100000
}

Response:
{
  "message": "Төлбөр амжилттай хийгдлээ",
  "payment": { "id": 1, "amount": 100000, ... }
}
```

#### GET `/api/payments/my-payments`
Миний төлбөрүүд
```
Response:
{
  "payments": [
    { "id": 1, "loan_id": 1, "amount": 100000, ... }
  ]
}
```

### Wallet (`/api/wallet`)

#### GET `/api/wallet`
Түрийвчний мэдээлэл
```
Response:
{
  "wallet": { "id": 1, "balance": 500000, ... }
}
```

#### POST `/api/wallet/deposit`
Мөнгө оруулах
```json
Request:
{
  "amount": 100000
}

Response:
{
  "message": "Амжилттай орууллаа",
  "wallet": { "balance": 600000 }
}
```

#### POST `/api/wallet/withdraw`
Мөнгө гаргах
```json
Request:
{
  "amount": 50000,
  "bank_account": "1234567890"
}

Response:
{
  "message": "Амжилттай гарууллаа",
  "wallet": { "balance": 550000 }
}
```

### Admin (`/api/admin`)

#### GET `/api/admin/loans`
Бүх зээлүүд (Admin only)

#### PUT `/api/admin/loans/:loanId/status`
Зээлийн статус өөрчлөх
```json
Request:
{
  "status": "approved"  // 'pending', 'approved', 'rejected', 'disbursed', 'completed'
}
```

---

## 🎨 Frontend бүтэц

### Web Components Architecture

Frontend нь Custom Elements (Web Components) ашигладаг:

```javascript
// Жишээ: Custom Element үүсгэх
class DashboardPage extends HTMLElement {
    constructor() {
        super();
        this.data = null;
    }

    connectedCallback() {
        this.render();
        this.loadData();
    }

    render() {
        this.innerHTML = `
            <div class="dashboard">
                <h1>Dashboard</h1>
            </div>
        `;
    }
}

customElements.define('dashboard-page', DashboardPage);
```

### Router System

Hash-based router ашигладаг:

```javascript
// router.js
router.addRoute('/dashboard', {
    component: 'dashboard-page',
    meta: { requiresAuth: true }
});

// Навигаци хийх
router.navigate('/dashboard');
```

### API Service

Бүх API дуудлага нэгтгэгдсэн:

```javascript
// services/api.js
const AuthAPI = {
    async login(credentials) {
        return await api.post('/auth/login', credentials);
    }
};

// Ашиглалт
const response = await AuthAPI.login({ email, password });
```

### Folder бүтэц тайлбар

#### `/components` - Дахин ашиглагдах компонентууд
- `app-nav.js` - Навигаци цэс
- `app-footer.js` - Footer
- `loan-card.js` - Зээлийн карт
- `theme-toggle.js` - Theme солих товч

#### `/pages` - Хуудасны компонентууд
- `home-page.js` - Нүүр хуудас
- `login-page.js` - Нэвтрэх хуудас
- `register-page.js` - Бүртгүүлэх хуудас
- `dashboard-page.js` - Хяналтын самбар
- `loan-application-page.js` - Зээл хүсэх хуудас
- `loans-page.js` - Миний зээлүүд
- `payment-page.js` - Төлбөр төлөх
- `wallet-history-page.js` - Түрийвчний түүх
- `admin-page.js` - Админы хяналтын самбар

#### `/services` - API үйлчилгээ
- `api.js` - REST API дуудлагууд, Token удирдлага

#### `/styles` - CSS файлууд
- `variables.css` - CSS хувьсагчид (өнгө, хэмжээ)
- `base.css` - Үндсэн стайл
- `components.css` - Компонентын стайлууд
- `theme.css` - Theme тохиргоо

---

## 🎨 CSS Variables систем

### Өнгөний палитр
```css
:root {
  /* Primary Colors */
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #e0e7ff;

  /* UI Colors */
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;

  /* Neutral Colors */
  --text: #1f2937;
  --text-muted: #6b7280;
  --bg: #f9fafb;
  --card: #ffffff;
}

/* Dark mode */
[data-theme="dark"] {
  --text: #f9fafb;
  --bg: #111827;
  --card: #1f2937;
}
```

### Responsive дизайн
```css
/* Mobile first approach */
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## 🔐 Authentication Flow

### 1. Хэрэглэгч нэвтрэх
```
User → Frontend → POST /api/auth/login → Backend
                                           ↓
                                        Validate
                                           ↓
                                      Generate JWT
                                           ↓
Frontend ← Response with Token ← Backend
   ↓
Save token to localStorage
```

### 2. Protected API дуудах
```
Frontend → GET /api/loans/my-loans
           Header: Authorization: Bearer <token>
              ↓
          Backend middleware
              ↓
         Verify JWT
              ↓
      Execute request
              ↓
  Frontend ← Response
```

### 3. Token шалгалт (Frontend)
```javascript
// Router guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = TokenManager.isAuthenticated();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});
```

---

## 🚀 Performance Optimization

### 1. Lazy Loading
Хуудсууд шаардлагатай үед л ачаална:
```javascript
// router.js - dynamic import
if (!customElements.get(route.component)) {
  await import(`./pages/${route.component}.js`);
}
```

### 2. Code Splitting
Vite автоматаар код хуваана:
```javascript
// vite.config.js
manualChunks: {
  'vendor': ['./src/services/api.js'],
  'pages-auth': ['./src/pages/login-page.js', ...],
  'pages-main': ['./src/pages/dashboard-page.js', ...]
}
```

### 3. CSS Optimization
- Critical CSS inline
- Non-critical CSS async ачаалах
```html
<link rel="preload" href="/src/styles/components.css" as="style"
      onload="this.onload=null;this.rel='stylesheet'">
```

### 4. Service Worker
Offline дэмжлэг болон cache:
```javascript
// sw.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

---

## 📱 Хэрэглэх заавар

### Хэрэглэгчийн үүрэг

1. **Бүртгүүлэх**: Email, password, нэр бүртгэнэ
2. **Зээл хүсэх**:
   - Хэрэглээний зээл (2-24 сар)
   - Худалдан авалтын зээл (6 сар, invoice code шаардлагатай)
3. **Түрийвч удирдах**: Мөнгө оруулах, гаргах
4. **Төлбөр төлөх**: Зээлийн төлбөр түрийвчнээс төлөх
5. **Түүх харах**: Зээл, төлбөр, гүйлгээний түүх

### Админы үүрэг

1. **Зээл шалгах**: Бүх зээлийн хүсэлт харах
2. **Зээл зөвшөөрөх/татгалзах**: Статус өөрчлөх
3. **Зээл олгох**: Approved зээл disbursed болгох (wallet-д мөнгө нэмэгдэнэ)
4. **Статистик харах**: Dashboard дээр ерөнхий мэдээлэл

---

## 🐛 Debugging заавар

### Backend logs
```bash
# Server logs харах
npm start

# Database холболт шалгах
psql -U omnicredit_user -d omnicredit -c "SELECT NOW();"
```

### Frontend debugging
```javascript
// Browser Console (F12)
// Token шалгах
console.log(localStorage.getItem('authToken'));

// API response харах
const response = await AuthAPI.getProfile();
console.log(response);
```

### Common Issues

**Backend эхлэхгүй байна:**
- PostgreSQL ажиллаж байгаа эсэхийг шалгах: `pg_isready`
- .env файл зөв эсэхийг шалгах
- Port 5000 эзэмдсэн эсэхийг шалгах: `netstat -an | grep 5000`

**Frontend backend-тэй холбогдохгүй байна:**
- Backend ажиллаж байгаа эсэх: http://localhost:5000
- CORS тохиргоо зөв эсэх (.env дээр CORS_ORIGIN)
- Network tab дээр API дуудлага харах (F12)

**Token expired:**
- localStorage-с token устгах: `localStorage.removeItem('authToken')`
- Дахин нэвтрэх

---

## 📄 License

MIT License - Хувийн болон арилжааны зориулалтаар чөлөөтэй ашиглаж болно.

---

## 👥 Хөгжүүлэгчид

OmniCredit бүтээгдэхүүн

## 🤝 Дэмжлэг

Асуулт, санал байвал:
- Email: support@omnicredit.mn
- GitHub Issues: [Create Issue](https://github.com/yourrepo/omnicredit/issues)

---

**Анхаар**: Production горимд deploy хийхдээ:
1. ✅ JWT_SECRET солих (урт, санамсаргүй мөр ашиглах)
2. ✅ Database password secure байлгах
3. ✅ HTTPS ашиглах
4. ✅ Rate limiting нэмэх
5. ✅ Input validation сайжруулах
6. ✅ Error logging системтэй болгох
7. ✅ Regular backup хийх
