
import { AuthAPI, LoansAPI, PaymentsAPI, WalletAPI, TokenManager, UserManager } from '../services/api.js';
import router from '../router.js';

class DashboardPage extends HTMLElement {
    constructor() {
        super();
        this.isLoading = true;
        this.userData = null;
        this.loans = [];
        this.payments = [];
        this.wallet = null;
        this.stats = {
            totalLoansCount: 0,
            activeLoansAmount: 0,
            walletBalance: 0,
            totalPaymentsMade: 0
        };
        this.showDepositModal = false;
        this.showWithdrawModal = false;
    }

    connectedCallback() {
        this.render();
        this.loadDashboardData();
    }

        async loadDashboardData() {
        try {
            this.isLoading = true;
            this.updateLoadingState();

            // Fetch all data in parallel
            const [userData, loansResponse, paymentsResponse, walletResponse] = await Promise.all([
                AuthAPI.getProfile().catch(() => null),
                LoansAPI.getMyLoans().catch(() => ({ loans: [] })),
                PaymentsAPI.getMyPayments().catch(() => ({ payments: [] })),
                WalletAPI.getMyWallet().catch(() => null)
            ]);
            this.userData = userData || UserManager.getUser();
            this.loans = loansResponse.loans || [];
            this.payments = paymentsResponse.payments || [];
            this.wallet = walletResponse;
            this.calculateStats();
            this.isLoading = false;
            this.render();
        } catch (error) {
            console.error('Dashboard data loading error:', error);
            this.showError(error.message || 'Мэдээлэл татахад алдаа гарлаа');
            this.isLoading = false;
            this.render();
        }
    }

        calculateStats() {
        // Total loans count
        this.stats.totalLoansCount = this.loans.length;

        // Active loans amount (sum of all active/approved/disbursed loans)
        this.stats.activeLoansAmount = this.loans
            .filter(loan => ['active', 'approved', 'disbursed'].includes(loan.status))
            .reduce((sum, loan) => sum + parseFloat(loan.amount || 0), 0);

        // Wallet balance
        this.stats.walletBalance = this.wallet ? parseFloat(this.wallet.balance || 0) : 0;

        // Total payments made (count)
        this.stats.totalPaymentsMade = this.payments.length;
    }

        updateLoadingState() {
        const container = this.querySelector('.dashboard-content');
        if (container && this.isLoading) {
            container.innerHTML = this.getLoadingHTML();
        }
    }

        formatNumber(num) {
        return new Intl.NumberFormat('mn-MN').format(num || 0);
    }

        formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('mn-MN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    }

        getStatusBadge(status) {
        const statusMap = {
            'pending': { class: 'badge-warning', text: 'Хүлээгдэж буй' },
            'approved': { class: 'badge-success', text: 'Зөвшөөрөгдсөн' },
            'rejected': { class: 'badge-danger', text: 'Татгалзсан' },
            'active': { class: 'badge-info', text: 'Идэвхтэй' },
            'disbursed': { class: 'badge-info', text: 'Олгогдсон' },
            'completed': { class: 'badge-success', text: 'Дууссан' },
            'paid': { class: 'badge-success', text: 'Төлөгдсөн' },
            'failed': { class: 'badge-danger', text: 'Амжилтгүй' }
        };
        const badge = statusMap[status] || { class: 'badge-info', text: status };
        return `<span class="badge ${badge.class}">${badge.text}</span>`;
    }

        showError(message) {
        const errorEl = this.querySelector('.dashboard-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            setTimeout(() => {
                errorEl.style.display = 'none';
            }, 5000);
        }
    }

        showSuccess(message) {
        const successEl = this.querySelector('.dashboard-success');
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';
            setTimeout(() => {
                successEl.style.display = 'none';
            }, 3000);
        }
    }

        async handleDeposit(e) {
        e.preventDefault();
        const amount = this.querySelector('#deposit-amount').value;

        if (!amount || parseFloat(amount) <= 0) {
            this.showError('Дүн буруу байна');
            return;
        }

        try {
            const btn = this.querySelector('.deposit-submit-btn');
            btn.disabled = true;
            btn.textContent = 'Түр хүлээнэ үү...';

            await WalletAPI.depositToWallet({ amount: parseFloat(amount) });
            this.showSuccess('Амжилттай орууллаа!');
            this.showDepositModal = false;

            // Reload data
            await this.loadDashboardData();
        } catch (error) {
            this.showError(error.message || 'Алдаа гарлаа');
        }
    }

        async handleWithdraw(e) {
        e.preventDefault();
        const amount = this.querySelector('#withdraw-amount').value;
        const bankAccount = this.querySelector('#bank-account').value;

        if (!amount || parseFloat(amount) <= 0) {
            this.showError('Дүн буруу байна');
            return;
        }

        if (!bankAccount) {
            this.showError('Дансны дугаар оруулна уу');
            return;
        }

        try {
            const btn = this.querySelector('.withdraw-submit-btn');
            btn.disabled = true;
            btn.textContent = 'Түр хүлээнэ үү...';

            await WalletAPI.withdrawToBank({
                amount: parseFloat(amount),
                bank_account: bankAccount
            });
            this.showSuccess('Амжилттай гарууллаа!');
            this.showWithdrawModal = false;

            // Reload data
            await this.loadDashboardData();
        } catch (error) {
            this.showError(error.message || 'Алдаа гарлаа');
        }
    }

        attachEventListeners() {
        // Quick action buttons
        const applyLoanBtn = this.querySelector('.apply-loan-btn');
        if (applyLoanBtn) {
            applyLoanBtn.addEventListener('click', () => router.navigate('/application'));
        }

        const makePaymentBtn = this.querySelector('.make-payment-btn');
        if (makePaymentBtn) {
            makePaymentBtn.addEventListener('click', () => router.navigate('/payment'));
        }

        const viewLoansBtn = this.querySelector('.view-loans-btn');
        if (viewLoansBtn) {
            viewLoansBtn.addEventListener('click', () => router.navigate('/my-loans'));
        }

        // Wallet buttons
        const depositBtn = this.querySelector('.deposit-btn');
        if (depositBtn) {
            depositBtn.addEventListener('click', () => {
                this.showDepositModal = true;
                this.render();
            });
        }

        const withdrawBtn = this.querySelector('.withdraw-btn');
        if (withdrawBtn) {
            withdrawBtn.addEventListener('click', () => {
                this.showWithdrawModal = true;
                this.render();
            });
        }

        const walletHistoryBtn = this.querySelector('.wallet-history-btn');
        if (walletHistoryBtn) {
            walletHistoryBtn.addEventListener('click', () => router.navigate('/wallet-history'));
        }

        // View all links
        const viewAllLoansLink = this.querySelector('.view-all-loans');
        if (viewAllLoansLink) {
            viewAllLoansLink.addEventListener('click', (e) => {
                e.preventDefault();
                router.navigate('/my-loans');
            });
        }

        const viewAllPaymentsLink = this.querySelector('.view-all-payments');
        if (viewAllPaymentsLink) {
            viewAllPaymentsLink.addEventListener('click', (e) => {
                e.preventDefault();
                router.navigate('/paymenthistory');
            });
        }

        // Modal close buttons
        const modalCloses = this.querySelectorAll('.modal-close');
        modalCloses.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showDepositModal = false;
                this.showWithdrawModal = false;
                this.render();
            });
        });

        // Modal overlay close
        const modalOverlays = this.querySelectorAll('.modal-overlay');
        modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                // Only close if clicking directly on overlay, not its children
                if (e.target === overlay) {
                    this.showDepositModal = false;
                    this.showWithdrawModal = false;
                    this.render();
                }
            });
        });

        // Deposit form
        const depositForm = this.querySelector('.deposit-form');
        if (depositForm) {
            depositForm.addEventListener('submit', (e) => this.handleDeposit(e));
        }

        // Withdraw form
        const withdrawForm = this.querySelector('.withdraw-form');
        if (withdrawForm) {
            withdrawForm.addEventListener('submit', (e) => this.handleWithdraw(e));
        }
    }

        getLoadingHTML() {
        return `
            <div class="loading-container">
                <div class="spinner"></div>
                <p class="loading-text">Мэдээлэл уншиж байна...</p>
            </div>
        `;
    }

        getStatsCardsHTML() {
        return `
            <div class="stats-grid">
                <div class="stat-card card" style="animation-delay: 0.1s">
                    <div class="stat-icon stat-icon-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <p class="stat-label">Нийт зээл</p>
                        <p class="stat-value">${this.formatNumber(this.stats.totalLoansCount)}</p>
                    </div>
                </div>

                <div class="stat-card card" style="animation-delay: 0.2s">
                    <div class="stat-icon stat-icon-success">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <p class="stat-label">Идэвхтэй зээлийн дүн</p>
                        <p class="stat-value">${this.formatNumber(this.stats.activeLoansAmount)}₮</p>
                    </div>
                </div>

                <div class="stat-card card" style="animation-delay: 0.3s">
                    <div class="stat-icon stat-icon-info">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <p class="stat-label">Түрийвчний үлдэгдэл</p>
                        <p class="stat-value">${this.formatNumber(this.stats.walletBalance)}₮</p>
                    </div>
                </div>

                <div class="stat-card card" style="animation-delay: 0.4s">
                    <div class="stat-icon stat-icon-warning">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <p class="stat-label">Нийт төлбөр</p>
                        <p class="stat-value">${this.formatNumber(this.stats.totalPaymentsMade)}</p>
                    </div>
                </div>
            </div>
        `;
    }

        getWalletSectionHTML() {
        return `
            <div class="wallet-section card" style="animation-delay: 0.5s">
                <div class="card-header">
                    <h2 class="card-title">Миний түрийвч</h2>
                </div>
                <div class="wallet-content">
                    <div class="wallet-balance-display">
                        <p class="wallet-balance-label">Одоогийн үлдэгдэл</p>
                        <p class="wallet-balance-amount">${this.formatNumber(this.stats.walletBalance)}₮</p>
                    </div>
                    <div class="wallet-actions">
                        <button class="btn btn-success deposit-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Орлого оруулах
                        </button>
                        <button class="btn btn-outline withdraw-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 12H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Мөнгө гаргах
                        </button>
                    </div>
                    <div class="wallet-footer">
                        <a href="#" class="wallet-history-btn text-link">Гүйлгээний түүх →</a>
                    </div>
                </div>
            </div>
        `;
    }

        getQuickActionsHTML() {
        return `
            <div class="quick-actions-section card" style="animation-delay: 0.6s">
                <div class="card-header">
                    <h2 class="card-title">Түргэн үйлдлүүд</h2>
                </div>
                <div class="quick-actions-grid">
                    <button class="action-card apply-loan-btn">
                        <div class="action-icon action-icon-primary">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <p class="action-label">Зээл хүсэх</p>
                    </button>

                    <button class="action-card make-payment-btn">
                        <div class="action-icon action-icon-success">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <p class="action-label">Төлбөр төлөх</p>
                    </button>

                    <button class="action-card view-loans-btn">
                        <div class="action-icon action-icon-info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <p class="action-label">Миний зээлүүд</p>
                    </button>
                </div>
            </div>
        `;
    }

        getRecentLoansHTML() {
        const recentLoans = this.loans.slice(0, 5);

        return `
            <div class="recent-loans-section card" style="animation-delay: 0.7s">
                <div class="card-header">
                    <h2 class="card-title">Сүүлийн зээлүүд</h2>
                    <a href="#" class="view-all-loans text-link">Бүгдийг харах →</a>
                </div>
                <div class="recent-loans-content">
                    ${recentLoans.length === 0 ? `
                        <div class="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p>Зээл олдсонгүй</p>
                            <button class="btn btn-primary btn-sm apply-loan-btn">Зээл хүсэх</button>
                        </div>
                    ` : `
                        <div class="loans-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Дүн</th>
                                        <th>Төлөв</th>
                                        <th>Хугацаа</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${recentLoans.map(loan => `
                                        <tr>
                                            <td class="loan-id-cell">#${loan.id}</td>
                                            <td class="amount-cell">${this.formatNumber(loan.amount)}₮</td>
                                            <td>${this.getStatusBadge(loan.status)}</td>
                                            <td>${loan.duration_months || 0} сар</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

        getRecentPaymentsHTML() {
        const recentPayments = this.payments.slice(0, 5);

        return `
            <div class="recent-payments-section card" style="animation-delay: 0.8s">
                <div class="card-header">
                    <h2 class="card-title">Сүүлийн төлбөрүүд</h2>
                    <a href="#" class="view-all-payments text-link">Бүгдийг харах →</a>
                </div>
                <div class="recent-payments-content">
                    ${recentPayments.length === 0 ? `
                        <div class="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p>Төлбөр олдсонгүй</p>
                        </div>
                    ` : `
                        <div class="payments-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Огноо</th>
                                        <th>Дүн</th>
                                        <th>Зээлийн ID</th>
                                        <th>Төлөв</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${recentPayments.map(payment => `
                                        <tr>
                                            <td>${this.formatDate(payment.payment_date || payment.created_at)}</td>
                                            <td class="amount-cell">${this.formatNumber(payment.amount)}₮</td>
                                            <td class="loan-id-cell">#${payment.loan_id}</td>
                                            <td>${this.getStatusBadge(payment.status || 'paid')}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

        getDepositModalHTML() {
        if (!this.showDepositModal) return '';

        return `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Орлого оруулах</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form class="modal-body deposit-form">
                        <div class="form-group">
                            <label for="deposit-amount" class="form-label">Дүн (₮)</label>
                            <input
                                type="number"
                                id="deposit-amount"
                                class="form-input"
                                placeholder="100000"
                                min="1000"
                                step="1000"
                                required
                            />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline modal-close">Цуцлах</button>
                            <button type="submit" class="btn btn-success deposit-submit-btn">Оруулах</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

        getWithdrawModalHTML() {
        if (!this.showWithdrawModal) return '';

        return `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Мөнгө гаргах</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form class="modal-body withdraw-form">
                        <div class="form-group">
                            <label for="withdraw-amount" class="form-label">Дүн (₮)</label>
                            <input
                                type="number"
                                id="withdraw-amount"
                                class="form-input"
                                placeholder="50000"
                                min="1000"
                                step="1000"
                                max="${this.stats.walletBalance}"
                                required
                            />
                            <small class="form-help">Боломжит үлдэгдэл: ${this.formatNumber(this.stats.walletBalance)}₮</small>
                        </div>
                        <div class="form-group">
                            <label for="bank-account" class="form-label">Дансны дугаар</label>
                            <input
                                type="text"
                                id="bank-account"
                                class="form-input"
                                placeholder="1234567890"
                                required
                            />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline modal-close">Цуцлах</button>
                            <button type="submit" class="btn btn-primary withdraw-submit-btn">Гаргах</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

        render() {
        const userName = this.userData ? `${this.userData.first_name || ''} ${this.userData.last_name || ''}`.trim() : 'Хэрэглэгч';

        this.innerHTML = `
            <div class="dashboard-page">
                <app-nav></app-nav>

                <div class="dashboard-container container">
                    <div class="dashboard-header">
                        <div class="welcome-section">
                            <h1 class="welcome-title">Сайн байна уу, ${userName}!</h1>
                            <p class="welcome-subtitle">Таны санхүүгийн хяналтын самбар</p>
                        </div>
                    </div>

                    <div class="dashboard-error alert alert-danger" style="display: none;"></div>
                    <div class="dashboard-success alert alert-success" style="display: none;"></div>

                    <div class="dashboard-content">
                        ${this.isLoading ? this.getLoadingHTML() : `
                            ${this.getStatsCardsHTML()}

                            <div class="dashboard-grid">
                                <div class="dashboard-main">
                                    ${this.getWalletSectionHTML()}
                                    ${this.getRecentLoansHTML()}
                                    ${this.getRecentPaymentsHTML()}
                                </div>
                                <div class="dashboard-sidebar">
                                    ${this.getQuickActionsHTML()}
                                </div>
                            </div>
                        `}
                    </div>
                </div>

                ${this.getDepositModalHTML()}
                ${this.getWithdrawModalHTML()}

                <app-footer></app-footer>
            </div>

            <style>
                .dashboard-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .dashboard-container {
                    padding: 2rem 1rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .dashboard-header {
                    margin-bottom: 2rem;
                }

                .welcome-section {
                    animation: slideInDown 0.5s ease-out;
                }

                .welcome-title {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                }

                .welcome-subtitle {
                    font-size: var(--font-base);
                    color: var(--text-muted);
                    margin: 0;
                }

                                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 2rem;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid var(--line);
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .loading-text {
                    margin-top: 1rem;
                    color: var(--text-muted);
                }

                                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem;
                    animation: slideInUp 0.5s ease-out;
                    animation-fill-mode: both;
                    transition: transform var(--transition), box-shadow var(--transition);
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .stat-icon svg {
                    width: 24px;
                    height: 24px;
                }

                .stat-icon-primary {
                    background: var(--primary-light);
                    color: var(--primary);
                }

                .stat-icon-success {
                    background: #d1fae5;
                    color: #065f46;
                }

                .stat-icon-info {
                    background: #dbeafe;
                    color: #1e40af;
                }

                .stat-icon-warning {
                    background: #fef3c7;
                    color: #92400e;
                }

                .stat-content {
                    flex: 1;
                }

                .stat-label {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                    margin: 0 0 0.25rem 0;
                }

                .stat-value {
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                    color: var(--text);
                    margin: 0;
                }

                                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 1fr 350px;
                    gap: 1.5rem;
                }

                .dashboard-main {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .dashboard-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                                .card {
                    background: var(--card);
                    border: 1px solid var(--card-border);
                    border-radius: var(--radius-xl);
                    padding: 1.5rem;
                    box-shadow: var(--shadow);
                    animation: slideInUp 0.5s ease-out;
                    animation-fill-mode: both;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--line);
                }

                .card-title {
                    font-size: var(--font-xl);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                    margin: 0;
                }

                                .wallet-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .wallet-balance-display {
                    text-align: center;
                    padding: 2rem;
                    background: var(--gradient-primary);
                    border-radius: var(--radius-lg);
                    color: white;
                }

                .wallet-balance-label {
                    font-size: var(--font-sm);
                    opacity: 0.9;
                    margin: 0 0 0.5rem 0;
                }

                .wallet-balance-amount {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    margin: 0;
                }

                .wallet-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .wallet-actions .btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .wallet-actions .btn svg {
                    width: 20px;
                    height: 20px;
                }

                .wallet-footer {
                    text-align: center;
                }

                                .quick-actions-grid {
                    display: grid;
                    gap: 1rem;
                }

                .action-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--bg);
                    border: 2px solid var(--line);
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    transition: all var(--transition);
                }

                .action-card:hover {
                    border-color: var(--primary);
                    background: var(--primary-light);
                    transform: translateX(4px);
                }

                .action-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .action-icon svg {
                    width: 20px;
                    height: 20px;
                }

                .action-icon-primary {
                    background: var(--primary-light);
                    color: var(--primary);
                }

                .action-icon-success {
                    background: #d1fae5;
                    color: #065f46;
                }

                .action-icon-info {
                    background: #dbeafe;
                    color: #1e40af;
                }

                .action-label {
                    font-weight: var(--font-semibold);
                    color: var(--text);
                    margin: 0;
                }

                                .loans-table,
                .payments-table {
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                thead th {
                    padding: 0.75rem;
                    text-align: left;
                    font-size: var(--font-sm);
                    font-weight: var(--font-semibold);
                    color: var(--text-muted);
                    border-bottom: 2px solid var(--line);
                }

                tbody td {
                    padding: 1rem 0.75rem;
                    border-bottom: 1px solid var(--line);
                }

                tbody tr:hover {
                    background: var(--bg);
                }

                .loan-id-cell {
                    font-weight: var(--font-semibold);
                    color: var(--primary);
                }

                .amount-cell {
                    font-weight: var(--font-semibold);
                }

                                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: var(--font-xs);
                    font-weight: var(--font-semibold);
                }

                .badge-success {
                    background: #d1fae5;
                    color: #065f46;
                }

                .badge-warning {
                    background: #fef3c7;
                    color: #92400e;
                }

                .badge-danger {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .badge-info {
                    background: #dbeafe;
                    color: #1e40af;
                }

                                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1rem;
                    text-align: center;
                }

                .empty-state svg {
                    width: 64px;
                    height: 64px;
                    color: var(--text-muted);
                    opacity: 0.5;
                    margin-bottom: 1rem;
                    stroke-width: 1.5;
                }

                .empty-state p {
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                }

                                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease-out;
                }

                .modal {
                    background: var(--card);
                    border-radius: var(--radius-xl);
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: var(--shadow-xl);
                    animation: slideInUp 0.3s ease-out;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--line);
                }

                .modal-title {
                    font-size: var(--font-xl);
                    font-weight: var(--font-semibold);
                    margin: 0;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 2rem;
                    color: var(--text-muted);
                    cursor: pointer;
                    line-height: 1;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius);
                    transition: all var(--transition);
                }

                .modal-close:hover {
                    background: var(--bg);
                    color: var(--text);
                }

                .modal-body {
                    padding: 1.5rem;
                }

                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                                .text-link {
                    color: var(--primary);
                    text-decoration: none;
                    font-weight: var(--font-medium);
                    font-size: var(--font-sm);
                    transition: color var(--transition);
                }

                .text-link:hover {
                    color: var(--primary-dark);
                    text-decoration: underline;
                }

                                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                                @media (max-width: 1024px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }

                    .dashboard-sidebar {
                        order: -1;
                    }
                }

                @media (max-width: 768px) {
                    .dashboard-container {
                        padding: 1rem;
                    }

                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                    }

                    .welcome-title {
                        font-size: var(--font-2xl);
                    }

                    .stat-value {
                        font-size: var(--font-xl);
                    }

                    .wallet-actions {
                        grid-template-columns: 1fr;
                    }

                    .card {
                        padding: 1rem;
                    }

                    table {
                        font-size: var(--font-sm);
                    }

                    thead th,
                    tbody td {
                        padding: 0.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .welcome-title {
                        font-size: var(--font-xl);
                    }

                    .wallet-balance-amount {
                        font-size: var(--font-2xl);
                    }
                }
            </style>
        `;
        this.attachEventListeners();
    }
}
customElements.define('dashboard-page', DashboardPage);

export default DashboardPage;
