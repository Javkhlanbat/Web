// ==========================================
// API SERVICE - Backend холболт
// Файлын нэр: components/api.service.js
// ==========================================

class ApiService {
  constructor() {
    // ⚠️ Backend URL - Өөрийн backend хаягаа энд бичнэ үү!
    this.baseURL = 'http://localhost:5000/api';
    
    // Token localStorage-с авах
    this.token = localStorage.getItem('authToken');
  }

  // ==========================================
  // CORE METHODS
  // ==========================================

  /**
   * Headers бэлтгэх
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Token байвал Authorization header нэмэх
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  /**
   * Token хадгалах
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  /**
   * Token устгах
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Ерөнхий HTTP request хийх функц
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders()
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // HTTP error шалгах
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Алдаа гарлаа');
      }

      return data;

    } catch (error) {
      console.error('API Error:', error);
      
      // 401 Unauthorized - token дууссан эсвэл буруу
      if (error.status === 401) {
        this.clearToken();
        window.location.hash = '#/login';
      }
      
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // ==========================================
  // AUTH ENDPOINTS
  // ==========================================

  /**
   * Бүртгүүлэх
   * @param {Object} userData - { email, password, first_name, last_name, phone }
   */
  async register(userData) {
    const response = await this.post('/auth/register', userData);
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  /**
   * Нэвтрэх
   * @param {Object} credentials - { email, password } эсвэл { phone, password }
   */
  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  /**
   * Профайл авах
   */
  async getProfile() {
    const response = await this.get('/auth/profile');
    return response.user;
  }

  /**
   * Профайл зураг оруулах
   */
  async uploadProfileImage(imageBase64) {
    return this.post('/auth/profile/image', {
      profile_image: imageBase64
    });
  }

  /**
   * Token шалгах
   */
  async verifyToken() {
    try {
      const response = await this.get('/auth/verify');
      return response.valid;
    } catch (error) {
      return false;
    }
  }

  /**
   * Гарах
   */
  logout() {
    this.clearToken();
    window.location.hash = '#/login';
  }

  // ==========================================
  // LOAN ENDPOINTS
  // ==========================================

  /**
   * Миний зээлүүд авах
   */
  async getMyLoans() {
    return this.get('/loans/my');
  }

  /**
   * Зээл хүсэх
   * @param {Object} loanData - { amount, duration_months, purpose, monthly_income, occupation, promo_code? }
   */
  async applyLoan(loanData) {
    return this.post('/loans/apply', loanData);
  }

  /**
   * Зээлийн дэлгэрэнгүй мэдээлэл
   */
  async getLoanDetails(loanId) {
    const response = await this.get(`/loans/${loanId}`);
    return response.loan;
  }

  /**
   * Зээлийн статистик
   */
  async getLoanStats() {
    const response = await this.get('/loans/stats');
    return response.stats;
  }

  /**
   * Худалдан авалтын зээл (0% хүү)
   */
  async applyPurchaseLoan(purchaseData) {
    return this.post('/loans/purchase', purchaseData);
  }

  /**
   * Миний худалдан авалтын зээлүүд
   */
  async getMyPurchaseLoans() {
    return this.get('/loans/purchase/my');
  }

  // ==========================================
  // WALLET ENDPOINTS
  // ==========================================

  /**
   * Wallet мэдээлэл авах
   */
  async getWallet() {
    const response = await this.get('/wallet');
    return response.wallet;
  }

  /**
   * Wallet гүйлгээний түүх
   */
  async getTransactions(limit = 20) {
    const response = await this.get(`/wallet/transactions?limit=${limit}`);
    return response.transactions;
  }

  /**
   * Wallet руу мөнгө нэмэх (QPay)
   */
  async depositToWallet(amount, paymentMethod = 'qpay') {
    return this.post('/wallet/deposit', {
      amount,
      payment_method: paymentMethod
    });
  }

  /**
   * Банк руу шилжүүлэх
   */
  async withdrawToBank(amount, bankName, accountNumber, accountHolder) {
    return this.post('/wallet/withdraw', {
      amount,
      bank_name: bankName,
      account_number: accountNumber,
      account_holder: accountHolder
    });
  }

  /**
   * Wallet-ээс зээлийн төлбөр төлөх
   */
  async payLoanFromWallet(loanId, amount) {
    return this.post('/wallet/pay-loan', {
      loan_id: loanId,
      amount
    });
  }

  // ==========================================
  // PAYMENT ENDPOINTS
  // ==========================================

  /**
   * Төлбөр хийх
   */
  async makePayment(loanId, amount, paymentMethod = 'card') {
    return this.post('/payments', {
      loan_id: loanId,
      amount,
      payment_method: paymentMethod
    });
  }

  /**
   * Миний бүх төлбөрүүд
   */
  async getMyPayments() {
    const response = await this.get('/payments/my');
    return response.payments;
  }

  /**
   * Зээлийн төлбөрүүд
   */
  async getLoanPayments(loanId) {
    const response = await this.get(`/payments/loan/${loanId}`);
    return response.payments;
  }

  /**
   * Зээлийн үлдэгдэл шалгах
   */
  async checkLoanBalance(loanId) {
    const response = await this.get(`/payments/loan/${loanId}/balance`);
    return response.balance;
  }

  /**
   * Төлбөрийн статистик
   */
  async getPaymentStats() {
    const response = await this.get('/payments/stats');
    return response.stats;
  }

  // ==========================================
  // PROMO CODE ENDPOINTS
  // ==========================================

  /**
   * Урамшууллын код шалгах
   */
  async verifyPromoCode(code) {
    return this.post('/promo/verify', { code });
  }

  // ==========================================
  // ANALYTICS ENDPOINTS (Optional)
  // ==========================================

  /**
   * Analytics event илгээх
   */
  async sendAnalyticsEvent(eventData) {
    try {
      return this.post('/analytics/events', { events: [eventData] });
    } catch (error) {
      // Analytics алдаа гарсан ч app-ийг тасалдуулахгүй
      console.warn('Analytics error:', error);
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Нэвтэрсэн эсэхийг шалгах
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * API үйлдэл хийхийн өмнө auth шалгах
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.hash = '#/login';
      return false;
    }
    return true;
  }
}

// ==========================================
// EXPORT
// ==========================================

// Single instance export (singleton pattern)
const apiService = new ApiService();

// Default export
export default apiService;

// Named export (хэрэв хэрэгтэй бол)
export { ApiService };

// ==========================================
// USAGE EXAMPLES
// ==========================================

/*

// 1. Import хийх
import apiService from './components/api.service.js';

// 2. Login жишээ
async function handleLogin(email, password) {
  try {
    const response = await apiService.login({ email, password });
    console.log('Logged in:', response.user);
    // Success handling
  } catch (error) {
    console.error('Login failed:', error.message);
    // Error handling
  }
}

// 3. Зээлүүд авах жишээ
async function loadMyLoans() {
  if (!apiService.requireAuth()) return;
  
  try {
    const response = await apiService.getMyLoans();
    const loans = response.loans;
    // Display loans
  } catch (error) {
    console.error('Error:', error);
  }
}

// 4. Зээл хүсэх жишээ
async function applyForLoan() {
  const loanData = {
    amount: 1000000,
    duration_months: 12,
    purpose: 'Бизнес',
    monthly_income: 2000000,
    occupation: 'Инженер'
  };
  
  try {
    const response = await apiService.applyLoan(loanData);
    alert('Зээлийн хүсэлт илгээгдлээ!');
  } catch (error) {
    alert('Алдаа: ' + error.message);
  }
}

// 5. Logout жишээ
function handleLogout() {
  if (confirm('Гарахдаа итгэлтэй байна уу?')) {
    apiService.logout();
  }
}

*/