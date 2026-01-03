const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',  
    TIMEOUT: 10000 
};

const TokenManager = {
    setToken(token) {
        localStorage.setItem('authToken', token);
    },
    getToken() {
        return localStorage.getItem('authToken'); },

    removeToken() {
        localStorage.removeItem('authToken'); },


    isTokenExpired() {
        const token = this.getToken();
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            if (payload.exp) {
                return payload.exp * 1000 < Date.now();}
            return false;
        } catch (error) {
            console.error('Token шалгахад алдаа гарлаа:', error);
            return true; 
        }
    },

 
    isAuthenticated() {
        return !!this.getToken();
    }
};

const UserManager = {
    setUser(user) {
        localStorage.setItem('userData', JSON.stringify(user));
    },

    getUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },

    removeUser() {
        localStorage.removeItem('userData');
    },

    logout() {
        TokenManager.removeToken();
        this.removeUser();
        LastPageManager.removeLastPage(); 
        window.location.hash = '/login';
    }
};

const LastPageManager = {

    setLastPage(path) {
        const excludedPaths = ['/login', '/register', '/'];
        if (!excludedPaths.includes(path)) {
            localStorage.setItem('lastVisitedPage', path);
        }
    },

    getLastPage() {
        return localStorage.getItem('lastVisitedPage');
    },

    removeLastPage() {
        localStorage.removeItem('lastVisitedPage');
    },

    getRedirectPath() {
        const lastPage = this.getLastPage();
        const user = UserManager.getUser();

        if (lastPage) {
            return lastPage;
        }

        if (user && user.is_admin) {
            return '/admin';
        }
        return '/dashboard';
    }
};


class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = TokenManager.getToken();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }), 
                ...options.headers
            },
            ...options
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
            if (!response.ok) {
               
                if (response.status === 401 || response.status === 403) {
                    TokenManager.removeToken();
                    UserManager.removeUser();
                    LastPageManager.removeLastPage();

                    setTimeout(() => {
                        window.location.hash = '/login';
                    }, 2000);

                    throw new Error('Нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.');
                }

                throw new Error(data.message || data.error || 'Алдаа гарлаа');
            }

            return data;

        } catch (error) {
    
            if (error.name === 'AbortError') {
                throw new Error('Серверт холбогдох хугацаа хэтэрсэн байна. Дахин оролдоно уу.');
            }

            if (!navigator.onLine) {
                throw new Error('Интернэт холболт алга байна');
            }

            if (error.message && error.message.includes('Failed to fetch')) {
                throw new Error('Серверт холбогдож чадсангүй. Render сервер асаагдах хүртэл хэдэн секунд хүлээнэ үү.');
            }

            throw error;
        }
    }

    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;

        return this.request(url, {
            method: 'GET'
        });
    }

    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}


const api = new APIClient(API_CONFIG.BASE_URL);


const AuthAPI = {
    async register(userData) {
        const backendData = {
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            register_number: userData.registerId,
            id_front: userData.idFront,
            id_back: userData.idBack
        };
        const response = await api.post('/auth/register', backendData);
        if (response.token) {
            TokenManager.setToken(response.token);
            UserManager.setUser(response.user);
        }
        return response;
    },

    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.token) {
            TokenManager.setToken(response.token);
            UserManager.setUser(response.user);
        }
        return response;
    },

    async getProfile() {
        const response = await api.get('/auth/profile');
        return response.user;
    },

    async updateProfile(profileData) {
        return await api.put('/auth/profile', profileData);
    },

    async uploadProfileImage(imageBase64) {
        return await api.post('/auth/profile/image', { profile_image: imageBase64 });
    },

    async getAdminUserDetails(userId) {
        return await api.get(`/auth/admin/users/${userId}`);
    },

    async verifyToken() {
        try {
            return await api.get('/auth/verify');
        } catch (error) {
            TokenManager.removeToken();
            UserManager.removeUser();
            return null;
        }
    },

    logout() {
        UserManager.logout();
    }
};


const LoansAPI = {
    async applyForLoan(loanData) {
        return await api.post('/loans/apply', loanData);
    },

    async getMyLoans() {
        return await api.get('/loans/my-loans');
    },

    async getLoanById(loanId) {
        return await api.get(`/loans/${loanId}`);
    },

    async getMyLoanStats() {
        return await api.get('/loans/stats');
    },

    async applyForPurchaseLoan(purchaseData) {
        return await api.post('/loans/purchase', purchaseData);
    },

    async getMyPurchaseLoans() {
        return await api.get('/loans/purchase/my');
    },

    async getAllLoans() {
        return await api.get('/loans/admin/all');
    },

    async updateLoanStatus(loanId, status) {
        return await api.put(`/loans/admin/${loanId}/status`, { status });
    },

    async disburseLoan(loanId) {
        return await api.post(`/loans/admin/${loanId}/disburse`);
    }
};

const PaymentsAPI = {
    async makePayment(paymentData) {
        return await api.post('/payments', paymentData);
    },

    async getMyPayments() {
        return await api.get('/payments/my-payments');
    },

    async getLoanPayments(loanId) {
        return await api.get(`/payments/loan/${loanId}`);
    },

    async getPaymentById(paymentId) {
        return await api.get(`/payments/${paymentId}`);
    },
    async getMyPaymentStats() {
        return await api.get('/payments/stats');
    },

    async checkLoanBalance(loanId) {
        return await api.get(`/payments/loan/${loanId}/balance`);
    },

    async getAllPayments() {
        return await api.get('/payments/all');
    }
};

const WalletAPI = {
    async getMyWallet() {
        return await api.get('/wallet');
    },

    async getTransactions(limit = 20) {
        return await api.get('/wallet/transactions', { limit });
    },

    async depositToWallet(depositData) {
        return await api.post('/wallet/deposit', depositData);
    },
    async withdrawToBank(withdrawData) {
        return await api.post('/wallet/withdraw', withdrawData);
    },

    async payLoanFromWallet(paymentData) {
        return await api.post('/wallet/pay-loan', paymentData);
    }
};

const PromoCodeAPI = {
    async checkCode(code) {
        return await api.get(`/promo-codes/check/${code}`);
    },

    async verifyCode(code) {
        return await api.post('/promo/verify', { code });
    },

    async createCompany(companyData) {
        return await api.post('/promo/admin/companies', companyData);
    },
    async getAllCompanies() {
        return await api.get('/promo/admin/companies');
    },
    async getCompanyDetails(companyId) {
        return await api.get(`/promo/admin/companies/${companyId}`);
    },

    async updateCompany(companyId, companyData) {
        return await api.put(`/promo/admin/companies/${companyId}`, companyData);
    },

    async deleteCompany(companyId) {
        return await api.delete(`/promo/admin/companies/${companyId}`);
    },
    async createPromoCode(promoData) {
        return await api.post('/promo/admin/codes', promoData);
    },
    async getAllPromoCodes() {
        return await api.get('/promo/admin/codes');
    },
    async getPromoCodeDetails(codeId) {
        return await api.get(`/promo/admin/codes/${codeId}`);
    },

    async updatePromoCode(codeId, promoData) {
        return await api.put(`/promo/admin/codes/${codeId}`, promoData);
    },

    async deletePromoCode(codeId) {
        return await api.delete(`/promo/admin/codes/${codeId}`);
    }
};

const AdminAPI = {
    async getAllLoans() {
        const response = await api.get('/loans');
        return response;
    },

    async getAllUsers() {
        const response = await api.get('/auth/users');
        return response;
    },

    async updateLoanStatus(loanId, status) {
        return await api.request(`/loans/${loanId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    },

    async deleteUser(userId) {
        return await api.delete(`/auth/users/${userId}`);
    },

    async getAllPromoCodes() {
        return await api.get('/promo-codes');
    },

    async createPromoCode(promoData) {
        return await api.post('/promo-codes', promoData);
    },

    async deletePromoCode(promoId) {
        return await api.delete(`/promo-codes/${promoId}`);
    },

    getCurrentUser() {
        return UserManager.getUser();
    }
};

export { API_CONFIG, TokenManager, UserManager, LastPageManager, api, AuthAPI, LoansAPI, PaymentsAPI, WalletAPI, PromoCodeAPI, AdminAPI };
