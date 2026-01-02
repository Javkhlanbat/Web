require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./src/config/init-db');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',                       
  'http://localhost:5174',                       
  'https://omnicredit-frontend.onrender.com'     
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'CORS policy: Origin not allowed';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


initDatabase().catch(console.error);

const authRoutes = require('./src/routes/authRoutes');
const loanRoutes = require('./src/routes/loanRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const walletRoutes = require('./src/routes/walletRoutes');
const promoCodeRoutes = require('./src/routes/promoCodeRoutes');

app.get('/', (req, res) => {
  res.json({
    message: 'ajilaj baina',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      loans: '/api/loans',
      payments: '/api/payments'
    }
  });
});
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/db-test', async (req, res) => {
  res.json({
    message: 'Database holbolt testleh',
    database_url: process.env.DATABASE_URL ? 'Configured' : 'Not configured'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/promo', promoCodeRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Серверт алдаа гарлаа!',
    message: err.message 
  });
});
app.listen(PORT, () => {
  console.log(`Server ажиллаж байна: http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
});
