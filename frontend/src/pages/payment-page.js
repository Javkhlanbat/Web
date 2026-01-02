/**
 * Payment Page Web Component
 * Make loan payments from wallet
 */

import { PaymentsAPI, LoansAPI, WalletAPI } from '../services/api.js';
import router from '../router.js';

class PaymentPage extends HTMLElement {
    constructor() {
        super();
        this.loanId = null;
        this.loan = null;
        this.loans = [];
        this.wallet = null;
        this.paymentAmount = '';
        this.isLoading = true;
        this.isSubmitting = false;
    }

    async connectedCallback() {
        // Get loan ID from URL params
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        this.loanId = urlParams.get('loanId');

        this.render();
        await this.loadData();
    }

    /**
     * Load loan and wallet data
     */
    async loadData() {
        try {
            this.isLoading = true;
            this.updateLoadingState();

            if (this.loanId) {
                const loanResponse = await LoansAPI.getLoanById(this.loanId);
                this.loan = loanResponse.loan;
            } else {
                // Load all active loans if no specific loan selected
                const loansResponse = await LoansAPI.getMyLoans();
                this.loans = (loansResponse.loans || []).filter(loan =>
                    loan.status === 'disbursed' || loan.status === 'approved'
                );
            }

            const walletResponse = await WalletAPI.getMyWallet();
            this.wallet = walletResponse.wallet;

            this.isLoading = false;
            this.render();
        } catch (error) {
            console.error('Load data error:', error);
            this.isLoading = false;
            this.showError(error.message || 'Мэдээлэл ачааллахад алдаа гарлаа');
            this.render();
        }
    }

    updateLoadingState() {
        const container = this.querySelector('.payment-container');
        if (container && this.isLoading) {
            container.innerHTML = '<div class="loading-spinner">Уншиж байна...</div>';
        }
    }

    formatNumber(num) {
        return new Intl.NumberFormat('mn-MN').format(num || 0);
    }

    handleAmountChange(e) {
        this.paymentAmount = e.target.value;
        this.updatePaymentSummary();
    }

    updatePaymentSummary() {
        const amount = parseFloat(this.paymentAmount) || 0;
        const summaryEl = this.querySelector('.payment-summary-amount');
        if (summaryEl) {
            summaryEl.textContent = this.formatNumber(amount);
        }

        if (this.loan && this.wallet) {
            const newWalletBalance = this.wallet.balance - amount;
            const newLoanBalance = (this.loan.remaining_amount || this.loan.total_amount) - amount;

            const newWalletEl = this.querySelector('.new-wallet-balance');
            const newLoanEl = this.querySelector('.new-loan-balance');

            if (newWalletEl) {
                newWalletEl.textContent = this.formatNumber(newWalletBalance);
                newWalletEl.style.color = newWalletBalance < 0 ? 'var(--danger)' : 'var(--text)';
            }

            if (newLoanEl) {
                newLoanEl.textContent = this.formatNumber(Math.max(0, newLoanBalance));
            }
        }
    }

    validatePayment() {
        const errors = [];
        const amount = parseFloat(this.paymentAmount);

        if (!amount || amount <= 0) {
            errors.push('Төлбөрийн дүн оруулна уу');
        }

        if (this.wallet && amount > this.wallet.balance) {
            errors.push('Түрийвчний үлдэгдэл хүрэлцэхгүй байна');
        }

        if (this.loan) {
            const remaining = this.loan.remaining_amount || this.loan.total_amount;
            if (amount > remaining) {
                errors.push(`Төлбөрийн дүн зээлийн үлдэгдлээс их байна (${this.formatNumber(remaining)}₮)`);
            }
        }

        return errors;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        const errors = this.validatePayment();
        if (errors.length > 0) {
            this.showError(errors.join(', '));
            return;
        }

        try {
            this.isSubmitting = true;
            this.updateButtonState();

            const paymentData = {
                loan_id: parseInt(this.loanId),
                amount: parseFloat(this.paymentAmount)
            };

            const response = await PaymentsAPI.makePayment(paymentData);

            if (response && response.payment) {
                this.showSuccess('Төлбөр амжилттай төлөгдлөө!');

                setTimeout(() => {
                    router.navigate('/my-loans');
                }, 2000);
            } else {
                throw new Error('Төлбөр төлөхөд алдаа гарлаа');
            }
        } catch (error) {
            console.error('Payment error:', error);
            this.showError(error.message || 'Төлбөр төлөхөд алдаа гарлаа');
        } finally {
            this.isSubmitting = false;
            this.updateButtonState();
        }
    }

    updateButtonState() {
        const btn = this.querySelector('.submit-btn');
        if (btn) {
            btn.disabled = this.isSubmitting;
            btn.textContent = this.isSubmitting ? 'Төлж байна...' : 'Төлбөр төлөх';
        }
    }

    showError(message) {
        const errorEl = this.querySelector('.error-message');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';

            setTimeout(() => {
                errorEl.style.display = 'none';
            }, 5000);
        }
    }

    showSuccess(message) {
        const successEl = this.querySelector('.success-message');
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';
        }
    }

    setQuickAmount(amount) {
        const amountInput = this.querySelector('#payment-amount');
        if (amountInput) {
            amountInput.value = amount;
            this.paymentAmount = amount.toString();
            this.updatePaymentSummary();
        }
    }

    attachEventListeners() {
        const form = this.querySelector('.payment-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        const amountInput = this.querySelector('#payment-amount');
        if (amountInput) {
            amountInput.addEventListener('input', (e) => this.handleAmountChange(e));
        }

        this.querySelectorAll('.quick-amount-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = btn.dataset.amount;
                this.setQuickAmount(parseFloat(amount));
            });
        });

        const cancelBtn = this.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => router.back());
        }
    }

    getQuickAmounts() {
        if (!this.loan) return [];

        const remaining = this.loan.remaining_amount || this.loan.total_amount;
        const monthly = this.loan.monthly_payment;

        return [
            { label: 'Сарын төлбөр', amount: monthly },
            { label: '50% үлдэгдэл', amount: Math.round(remaining * 0.5) },
            { label: 'Бүгдийг төлөх', amount: remaining }
        ].filter(item => item.amount <= (this.wallet?.balance || 0));
    }

    render() {
        const quickAmounts = this.getQuickAmounts();

        this.innerHTML = `
            <div class="payment-page">
                <app-nav></app-nav>

                <div class="payment-container container">
                    <div class="page-header">
                        <h1 class="page-title">Зээлийн төлбөр төлөх</h1>
                        <p class="page-subtitle">Түрийвчнээсээ зээлийн төлбөр төлөх</p>
                    </div>

                    <div class="error-message alert alert-danger" style="display: none;"></div>
                    <div class="success-message alert alert-success" style="display: none;"></div>

                    ${this.isLoading ? `
                        <div class="loading-spinner">Уншиж байна...</div>
                    ` : !this.loanId && this.loans.length > 0 && this.wallet ? `
                        <div class="card loan-select-card">
                            <h3 class="card-title">Төлбөр төлөх зээлээ сонгоно уу</h3>
                            <p class="card-subtitle">Идэвхтэй зээлүүдийн жагсаалт</p>

                            <div class="wallet-info-small">
                                <span>Түрийвчний үлдэгдэл:</span>
                                <strong>${this.formatNumber(this.wallet.balance)}₮</strong>
                            </div>

                            <div class="loans-list">
                                ${this.loans.map(loan => `
                                    <div class="loan-item card" onclick="router.navigate('/payment?loanId=${loan.id}')">
                                        <div class="loan-item-header">
                                            <span class="loan-id">#${loan.id}</span>
                                            <span class="loan-type">${loan.loan_type === 'consumer' ? 'Хэрэглээний' : 'Худалдан авалтын'}</span>
                                        </div>
                                        <div class="loan-item-body">
                                            <div class="loan-detail">
                                                <span class="detail-label">Зээлийн дүн:</span>
                                                <span class="detail-value">${this.formatNumber(loan.amount)}₮</span>
                                            </div>
                                            <div class="loan-detail">
                                                <span class="detail-label">Сарын төлбөр:</span>
                                                <span class="detail-value primary">${this.formatNumber(loan.monthly_payment)}₮</span>
                                            </div>
                                            <div class="loan-detail highlight">
                                                <span class="detail-label">Үлдэгдэл:</span>
                                                <span class="detail-value danger">${this.formatNumber(loan.remaining_amount || loan.total_amount)}₮</span>
                                            </div>
                                        </div>
                                        <div class="loan-item-footer">
                                            <button class="btn btn-primary btn-sm">Төлбөр төлөх →</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : this.loan && this.wallet ? `
                        <div class="payment-grid">
                            <div class="card loan-info-card">
                                <h3 class="card-title">Зээлийн мэдээлэл</h3>
                                <div class="info-group">
                                    <div class="info-row">
                                        <span class="info-label">Зээлийн дугаар:</span>
                                        <span class="info-value">#${this.loan.id}</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Зээлийн дүн:</span>
                                        <span class="info-value">${this.formatNumber(this.loan.amount)}₮</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Сарын төлбөр:</span>
                                        <span class="info-value primary">${this.formatNumber(this.loan.monthly_payment)}₮</span>
                                    </div>
                                    <div class="info-row highlight">
                                        <span class="info-label">Үлдэгдэл:</span>
                                        <span class="info-value danger">${this.formatNumber(this.loan.remaining_amount || this.loan.total_amount)}₮</span>
                                    </div>
                                </div>

                                <div class="wallet-info">
                                    <div class="wallet-label">Түрийвчний үлдэгдэл</div>
                                    <div class="wallet-balance">${this.formatNumber(this.wallet.balance)}₮</div>
                                </div>
                            </div>

                            <div class="card payment-form-card">
                                <h3 class="card-title">Төлбөрийн дүн</h3>

                                <form class="payment-form">
                                    <div class="form-group">
                                        <label for="payment-amount" class="form-label">Төлбөрийн дүн (₮)</label>
                                        <input
                                            type="number"
                                            id="payment-amount"
                                            class="form-input"
                                            placeholder="Дүнгээ оруулна уу"
                                            min="1"
                                            max="${this.loan.remaining_amount || this.loan.total_amount}"
                                            step="1000"
                                            required
                                        />
                                    </div>

                                    ${quickAmounts.length > 0 ? `
                                        <div class="quick-amounts">
                                            <div class="quick-amounts-label">Түргэн сонголт:</div>
                                            <div class="quick-amounts-grid">
                                                ${quickAmounts.map(item => `
                                                    <button
                                                        type="button"
                                                        class="btn btn-outline quick-amount-btn"
                                                        data-amount="${item.amount}"
                                                    >
                                                        ${item.label}
                                                        <small>${this.formatNumber(item.amount)}₮</small>
                                                    </button>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}

                                    <div class="payment-summary card">
                                        <h4 class="summary-title">Төлбөрийн дэлгэрэнгүй</h4>
                                        <div class="summary-row">
                                            <span>Төлөх дүн:</span>
                                            <span class="payment-summary-amount">0</span>₮
                                        </div>
                                        <div class="summary-row">
                                            <span>Шинэ түрийвчний үлдэгдэл:</span>
                                            <span class="new-wallet-balance">${this.formatNumber(this.wallet.balance)}</span>₮
                                        </div>
                                        <div class="summary-row">
                                            <span>Зээлийн шинэ үлдэгдэл:</span>
                                            <span class="new-loan-balance">${this.formatNumber(this.loan.remaining_amount || this.loan.total_amount)}</span>₮
                                        </div>
                                    </div>

                                    <div class="form-actions">
                                        <button type="button" class="btn btn-outline cancel-btn">Цуцлах</button>
                                        <button type="submit" class="btn btn-primary submit-btn">Төлбөр төлөх</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ` : `
                        <div class="empty-state card">
                            <h3>Мэдээлэл олдсонгүй</h3>
                            <p>Зээлийн эсвэл түрийвчний мэдээлэл олдсонгүй.</p>
                            <a href="#/my-loans" class="btn btn-primary">Миний зээлүүд руу буцах</a>
                        </div>
                    `}
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                .payment-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .payment-container {
                    padding: 2rem 1rem;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .page-title {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                }

                .page-subtitle {
                    font-size: var(--font-base);
                    color: var(--text-muted);
                    margin: 0;
                }

                .payment-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }

                .loan-info-card,
                .payment-form-card {
                    padding: 2rem;
                }

                .card-title {
                    font-size: var(--font-xl);
                    font-weight: var(--font-semibold);
                    margin-bottom: 1.5rem;
                    color: var(--text);
                }

                .info-group {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem;
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                }

                .info-row.highlight {
                    background: var(--danger-light);
                }

                .info-label {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                }

                .info-value {
                    font-size: var(--font-base);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                }

                .info-value.primary {
                    color: var(--primary);
                }

                .info-value.danger {
                    color: var(--danger);
                }

                .wallet-info {
                    padding: 1.5rem;
                    background: var(--gradient-primary);
                    border-radius: var(--radius-lg);
                    text-align: center;
                    color: white;
                }

                .wallet-label {
                    font-size: var(--font-sm);
                    opacity: 0.9;
                    margin-bottom: 0.5rem;
                }

                .wallet-balance {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                }

                .quick-amounts {
                    margin: 1.5rem 0;
                }

                .quick-amounts-label {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                }

                .quick-amounts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 0.75rem;
                }

                .quick-amount-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.75rem;
                }

                .quick-amount-btn small {
                    font-size: var(--font-xs);
                    opacity: 0.8;
                }

                .payment-summary {
                    padding: 1.5rem;
                    background: var(--bg-secondary);
                    margin: 1.5rem 0;
                }

                .summary-title {
                    font-size: var(--font-base);
                    font-weight: var(--font-semibold);
                    margin-bottom: 1rem;
                    color: var(--text);
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    font-size: var(--font-sm);
                }

                .summary-row:not(:last-child) {
                    border-bottom: 1px solid var(--line);
                }

                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                }

                .form-actions .btn {
                    flex: 1;
                }

                .empty-state {
                    padding: 4rem 2rem;
                    text-align: center;
                }

                .loading-spinner {
                    padding: 4rem 2rem;
                    text-align: center;
                    font-size: var(--font-lg);
                    color: var(--text-muted);
                }

                .loan-select-card {
                    padding: 2rem;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .card-subtitle {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                    margin: -1rem 0 1.5rem 0;
                }

                .wallet-info-small {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem;
                    background: var(--primary-light);
                    border-radius: var(--radius);
                    margin-bottom: 1.5rem;
                    font-size: var(--font-sm);
                }

                .wallet-info-small strong {
                    color: var(--primary);
                    font-size: var(--font-lg);
                }

                .loans-list {
                    display: grid;
                    gap: 1rem;
                }

                .loan-item {
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all var(--transition);
                    border: 2px solid var(--card-border);
                }

                .loan-item:hover {
                    border-color: var(--primary);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }

                .loan-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid var(--line);
                }

                .loan-id {
                    font-size: var(--font-lg);
                    font-weight: var(--font-bold);
                    color: var(--primary);
                }

                .loan-type {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                }

                .loan-item-body {
                    display: grid;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }

                .loan-detail {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem;
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                }

                .loan-detail.highlight {
                    background: var(--danger-light);
                }

                .detail-label {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                }

                .detail-value {
                    font-weight: var(--font-semibold);
                }

                .detail-value.primary {
                    color: var(--primary);
                }

                .detail-value.danger {
                    color: var(--danger);
                }

                .loan-item-footer {
                    display: flex;
                    justify-content: flex-end;
                }

                @media (max-width: 768px) {
                    .payment-grid {
                        grid-template-columns: 1fr;
                    }

                    .quick-amounts-grid {
                        grid-template-columns: 1fr;
                    }

                    .form-actions {
                        flex-direction: column;
                    }
                }
            </style>
        `;

        this.attachEventListeners();
    }
}

customElements.define('payment-page', PaymentPage);
export default PaymentPage;
