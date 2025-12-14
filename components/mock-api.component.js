
// LocalStorage-д хадгалах түлхүүрнүүд
const STORAGE_KEYS = {
    USERS: 'omnicredit_users',
    LOANS: 'omnicredit_loans',
    PAYMENTS: 'omnicredit_payments',
    CURRENT_USER: 'omnicredit_current_user',
    WALLET: 'omnicredit_wallet',
    

};

// Анхны өгөгдөл үүсгэх
function initMockData() {
    // Хэрэв өгөгдөл байхгүй бол шинээр үүсгэх
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const mockUsers = [
            {
                id: 1,
                firstName: 'Бат',
                lastName: 'Болд',
                email: 'bat@test.com',
                password: '123456',
                phone: '99001122',
                registerId: 'УБ12345678',
                isAdmin: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@test.com',
                password: 'admin123',
                phone: '99887766',
                registerId: 'УБ87654321',
                isAdmin: true,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
    }

    if (!localStorage.getItem(STORAGE_KEYS.LOANS)) {
        localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
    }
     if (!localStorage.getItem(STORAGE_KEYS.WALLET)) {
    localStorage.setItem(
      STORAGE_KEYS.WALLET,
      JSON.stringify({ balance: 0, currency: 'MNT' })
    );
}
}
// Token Manager (LocalStorage ашиглана)
export const TokenManager = {
    setToken(token) {
        localStorage.setItem('authToken', token);
    },

    getToken() {
        return localStorage.getItem('authToken');
    },

    removeToken() {
        localStorage.removeItem('authToken');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

// User Manager
export const UserManager = {
    setUser(user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    },

    getUser() {
        const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return userData ? JSON.parse(userData) : null;
    },

    removeUser() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },

    logout() {
    TokenManager.removeToken();
      this.removeUser();

       // SPA руу
      location.hash = '#/login';
}

};

// Mock Auth API
export const AuthAPI = {
    // Бүртгүүлэх
    async register(userData) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Жинхэнэ API шиг саатуулах

        initMockData();
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

        // И-мэйл давхардсан эсэхийг шалгах
        if (users.find(u => u.email === userData.email)) {
            throw new Error('Энэ и-мэйл хаяг бүртгэлтэй байна');
        }

        // Шинэ хэрэглэгч үүсгэх
        const newUser = {
            id: users.length + 1,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            registerId: userData.registerId,
            isAdmin: false,
            createdAt: new Date().toISOString()
        };
        

        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

        // Fake token үүсгэх
        const token = 'mock_token_' + newUser.id + '_' + Date.now();
        TokenManager.setToken(token);

        // Хэрэглэгчийн мэдээллийг хадгалах (нууц үг хасах)
        const { password, ...userWithoutPassword } = newUser;
        UserManager.setUser(userWithoutPassword);

        return {
            success: true,
            message: 'Амжилттай бүртгэгдлээ',
            token,
            user: userWithoutPassword
        };
    },
    

    // Нэвтрэх
    async login(credentials) {
        await new Promise(resolve => setTimeout(resolve, 500));

        initMockData();
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

        const user = users.find(u =>
            u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
            throw new Error('И-мэйл эсвэл нууц үг буруу байна');
        }

        // Fake token үүсгэх
        const token = 'mock_token_' + user.id + '_' + Date.now();
        TokenManager.setToken(token);

        // Хэрэглэгчийн мэдээллийг хадгалах
        const { password, ...userWithoutPassword } = user;
        UserManager.setUser(userWithoutPassword);

        return {
            success: true,
            message: 'Амжилттай нэвтэрлээ',
            token,
            user: userWithoutPassword
        };
    },

    // Профайл авах
    async getProfile() {
        await new Promise(resolve => setTimeout(resolve, 300));

        const user = UserManager.getUser();
        if (!user) {
            throw new Error('Нэвтрэх шаардлагатай');
        }

        return { user };
    },

    // Token баталгаажуулах
    async verifyToken() {
        await new Promise(resolve => setTimeout(resolve, 200));

        if (!TokenManager.isAuthenticated()) {
            return null;
        }

        const user = UserManager.getUser();
        return user ? { valid: true, user } : null;
    },
        // Admin-бүх хэрэглэгч авах
async getAdminUsers() {
  await new Promise(resolve => setTimeout(resolve, 200));

  const user = UserManager.getUser();
  if (!user || !user.isAdmin) throw new Error('Admin эрх шаардлагатай');

  initMockData();
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

  // password-гүйгээр буцаах
  const safe = users.map(({ password, ...rest }) => rest);

  return { success: true, users: safe };
},

// Admin - хэрэглэгч устгах
async deleteUserAsAdmin(userId) {
  await new Promise(resolve => setTimeout(resolve, 200));

  const user = UserManager.getUser();
  if (!user || !user.isAdmin) throw new Error('Admin эрх шаардлагатай');

  initMockData();
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

  const id = Number(userId);
  const next = users.filter(u => u.id !== id);

  if (next.length === users.length) throw new Error('Хэрэглэгч олдсонгүй');

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(next));
  return { success: true };
},


    // Гарах
    logout() {
        UserManager.logout();
    }
};

// Mock Loans API
export const LoansAPI = {
    // Зээлийн хүсэлт илгээх
    async applyForLoan(loanData) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = UserManager.getUser();
        if (!user) {
            throw new Error('Нэвтрэх шаардлагатай');
        }

        initMockData();
        const loans = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOANS) || '[]');

        const newLoan = {
            id: loans.length + 1,
            userId: user.id,
            amount: loanData.amount,
            purpose: loanData.purpose,
            duration: loanData.duration,
            monthlyIncome: loanData.monthlyIncome,
            status: 'pending', // pending, approved, rejected, disbursed
            interestRate: 2.5, // 2.5% сарын хүү
            createdAt: new Date().toISOString(),
            approvedAt: null,
            disbursedAt: null
        };

        loans.push(newLoan);
        localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));

        return {
            success: true,
            message: 'Зээлийн хүсэлт амжилттай илгээгдлээ',
            loan: newLoan
        };
    },

    // Миний зээлүүд
    async getMyLoans() {
        await new Promise(resolve => setTimeout(resolve, 300));

        const user = UserManager.getUser();
        if (!user) {
            throw new Error('Нэвтрэх шаардлагатай');
        }

        initMockData();
        const allLoans = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOANS) || '[]');
        const myLoans = allLoans.filter(loan => loan.userId === user.id);

        return {
            success: true,
            loans: myLoans
        };
    },

    // ID-аар зээл авах
    async getLoanById(loanId) {
        await new Promise(resolve => setTimeout(resolve, 300));

        initMockData();
        const loans = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOANS) || '[]');
        const loan = loans.find(l => l.id === parseInt(loanId));

        if (!loan) {
            throw new Error('Зээл олдсонгүй');
        }

        return {
            success: true,
            loan
        };
    },

    // Бүх зээлүүд (Admin)
    async getAllLoans() {
        await new Promise(resolve => setTimeout(resolve, 300));

        const user = UserManager.getUser();
        if (!user || !user.isAdmin) {
            throw new Error('Admin эрх шаардлагатай');
        }

        initMockData();
        const loans = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOANS) || '[]');

        return {
            success: true,
            loans
        };
    },

    // Зээлийн төлөв өөрчлөх (Admin)
    async updateLoanStatus(loanId, status) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = UserManager.getUser();
        if (!user || !user.isAdmin) {
            throw new Error('Admin эрх шаардлагатай');
        }

        initMockData();
        const loans = JSON.parse(localStorage.getItem(STORAGE_KEYS.LOANS) || '[]');
        const loanIndex = loans.findIndex(l => l.id === parseInt(loanId));

        if (loanIndex === -1) {
            throw new Error('Зээл олдсонгүй');
        }

        loans[loanIndex].status = status;
        if (status === 'approved') {
            loans[loanIndex].approvedAt = new Date().toISOString();
        }

        localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));

        return {
            success: true,
            message: 'Зээлийн төлөв шинэчлэгдлээ',
            loan: loans[loanIndex]
        };
    }
};

// Mock Payments API
export const PaymentsAPI = {
    // Төлбөр төлөх
    async makePayment(paymentData) {
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = UserManager.getUser();
        if (!user) {
            throw new Error('Нэвтрэх шаардлагатай');
        }

        initMockData();
        const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');

        const newPayment = {
            id: payments.length + 1,
            userId: user.id,
            loanId: paymentData.loanId,
            amount: paymentData.amount,
            paymentMethod: paymentData.paymentMethod || 'bank',
            status: 'completed',
            createdAt: new Date().toISOString()
        };

        payments.push(newPayment);
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

        return {
            success: true,
            message: 'Төлбөр амжилттай төлөгдлөө',
            payment: newPayment
        };
    },

    // Миний төлбөрүүд
    async getMyPayments() {
        await new Promise(resolve => setTimeout(resolve, 300));

        const user = UserManager.getUser();
        if (!user) {
            throw new Error('Нэвтрэх шаардлагатай');
        }

        initMockData();
        const allPayments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
        const myPayments = allPayments.filter(payment => payment.userId === user.id);

        return {
            success: true,
            payments: myPayments
        };
    },

    // Бүх төлбөрүүд (Admin)
    async getAllPayments() {
        await new Promise(resolve => setTimeout(resolve, 300));

        const user = UserManager.getUser();
        if (!user || !user.isAdmin) {
            throw new Error('Admin эрх шаардлагатай');
        }

        initMockData();
        const payments = JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');

        return {
            success: true,
            payments
        };
    }
};
export const WalletAPI = {
  async getMyWallet() {
    await new Promise(r => setTimeout(r, 200));
    return {
      success: true,
      wallet: { balance: 0, currency: 'MNT' }
    };
  },

  async depositToWallet() {
    await new Promise(r => setTimeout(r, 200));
    return { success: true };
  },

  async withdrawToBank() {
    await new Promise(r => setTimeout(r, 200));
    return { success: true };
  }
};

// Promo Code API (Энгийн хувилбар)
export const PromoCodeAPI = {
    async verifyCode(code) {
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            success: false,
            message: 'Promo код олдсонгүй'
        };
    }
};

// Анхны өгөгдөл эхлүүлэх
initMockData();

console.log('Mock API initialized (LocalStorage mode)');
console.log('Test accounts:');
console.log('  Email: bat@test.com, Password: 123456');
console.log('  Email: admin@test.com, Password: admin123 (Admin)');
