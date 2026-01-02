/**
 * Wallet History Page Web Component
 * Display wallet transaction history
 */

import { WalletAPI } from '../services/api.js';
import router from '../router.js';

class WalletHistoryPage extends HTMLElement {
    constructor() {
        super();
        this.wallet = null;
        this.transactions = [];
        this.isLoading = true;
    }

    async connectedCallback() {
        this.render();
        await this.loadData();
    }

    async loadData() {
        try {
            this.isLoading = true;
            this.updateLoadingState();

            const [walletResponse, transactionsResponse] = await Promise.all([
                WalletAPI.getMyWallet(),
                WalletAPI.getTransactions(50)
            ]);

            this.wallet = walletResponse.wallet;
            this.transactions = transactionsResponse.transactions || [];

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
        const container = this.querySelector('.history-content');
        if (container && this.isLoading) {
            container.innerHTML = '<div class="loading-spinner">Уншиж байна...</div>';
        }
    }

    formatNumber(num) {
        return new Intl.NumberFormat('mn-MN').format(num || 0);
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('mn-MN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getTransactionTypeLabel(type) {
        const typeMap = {
            'loan_disbursement': 'Зээл олголт',
            'loan_payment': 'Зээлийн төлбөр',
            'deposit': 'Орлого',
            'withdrawal': 'Зарлага',
            'transfer': 'Шилжүүлэг'
        };
        return typeMap[type] || type;
    }

    getTransactionTypeClass(type) {
        if (type === 'loan_disbursement' || type === 'deposit') {
            return 'credit';
        }
        return 'debit';
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

    attachEventListeners() {
        const refreshBtn = this.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadData());
        }
    }

    render() {
        this.innerHTML = `
            <div class="wallet-history-page">
                <app-nav></app-nav>

                <div class="history-container container">
                    <div class="page-header">
                        <div>
                            <h1 class="page-title">Түрийвчний түүх</h1>
                            <p class="page-subtitle">Гүйлгээний түүх</p>
                        </div>
                        <button class="btn btn-outline refresh-btn">Шинэчлэх</button>
                    </div>

                    <div class="error-message alert alert-danger" style="display: none;"></div>

                    ${!this.isLoading && this.wallet ? `
                        <div class="wallet-summary card">
                            <div class="summary-item">
                                <div class="summary-label">Одоогийн үлдэгдэл</div>
                                <div class="summary-value">${this.formatNumber(this.wallet.balance)}₮</div>
                            </div>
                        </div>
                    ` : ''}

                    <div class="history-content">
                        ${this.isLoading ? `
                            <div class="loading-spinner">Уншиж байна...</div>
                        ` : this.transactions.length === 0 ? `
                            <div class="empty-state card">
                                <h3>Гүйлгээ олдсонгүй</h3>
                                <p>Одоогоор түрийвчний гүйлгээ байхгүй байна.</p>
                                <a href="#/dashboard" class="btn btn-primary">Дашбоард руу буцах</a>
                            </div>
                        ` : `
                            <div class="transactions-list">
                                ${this.transactions.map(tx => `
                                    <div class="transaction-card card">
                                        <div class="transaction-main">
                                            <div class="transaction-icon ${this.getTransactionTypeClass(tx.transaction_type)}">
                                                ${this.getTransactionTypeClass(tx.transaction_type) === 'credit' ? '+' : '-'}
                                            </div>
                                            <div class="transaction-info">
                                                <div class="transaction-type">${this.getTransactionTypeLabel(tx.transaction_type)}</div>
                                                <div class="transaction-date">${this.formatDate(tx.created_at)}</div>
                                                ${tx.description ? `
                                                    <div class="transaction-description">${tx.description}</div>
                                                ` : ''}
                                            </div>
                                            <div class="transaction-amount ${this.getTransactionTypeClass(tx.transaction_type)}">
                                                ${this.getTransactionTypeClass(tx.transaction_type) === 'credit' ? '+' : '-'}${this.formatNumber(tx.amount)}₮
                                            </div>
                                        </div>
                                        <div class="transaction-footer">
                                            <div class="transaction-detail">
                                                <span class="detail-label">Үлдэгдэл:</span>
                                                <span class="detail-value">${this.formatNumber(tx.balance_after || this.wallet.balance)}₮</span>
                                            </div>
                                            ${tx.reference_id ? `
                                                <div class="transaction-detail">
                                                    <span class="detail-label">Лавлагаа:</span>
                                                    <span class="detail-value">#${tx.reference_id}</span>
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                .wallet-history-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .history-container {
                    padding: 2rem 1rem;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
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

                .wallet-summary {
                    padding: 2rem;
                    margin-bottom: 2rem;
                    background: var(--gradient-primary);
                    color: white;
                    text-align: center;
                }

                .summary-label {
                    font-size: var(--font-sm);
                    opacity: 0.9;
                    margin-bottom: 0.5rem;
                }

                .summary-value {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                }

                .transactions-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .transaction-card {
                    padding: 1.5rem;
                    transition: transform 0.2s;
                }

                .transaction-card:hover {
                    transform: translateY(-2px);
                }

                .transaction-main {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--line);
                }

                .transaction-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                    flex-shrink: 0;
                }

                .transaction-icon.credit {
                    background: var(--success-light);
                    color: var(--success);
                }

                .transaction-icon.debit {
                    background: var(--danger-light);
                    color: var(--danger);
                }

                .transaction-info {
                    flex: 1;
                }

                .transaction-type {
                    font-size: var(--font-base);
                    font-weight: var(--font-semibold);
                    margin-bottom: 0.25rem;
                }

                .transaction-date {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                }

                .transaction-description {
                    font-size: var(--font-sm);
                    color: var(--text-secondary);
                    margin-top: 0.25rem;
                }

                .transaction-amount {
                    font-size: var(--font-xl);
                    font-weight: var(--font-bold);
                    flex-shrink: 0;
                }

                .transaction-amount.credit {
                    color: var(--success);
                }

                .transaction-amount.debit {
                    color: var(--danger);
                }

                .transaction-footer {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                }

                .transaction-detail {
                    display: flex;
                    gap: 0.5rem;
                    font-size: var(--font-sm);
                }

                .detail-label {
                    color: var(--text-muted);
                }

                .detail-value {
                    font-weight: var(--font-semibold);
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

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }

                    .transaction-main {
                        flex-wrap: wrap;
                    }

                    .transaction-amount {
                        width: 100%;
                        text-align: right;
                    }

                    .transaction-footer {
                        flex-direction: column;
                    }
                }
            </style>
        `;

        this.attachEventListeners();
    }
}

customElements.define('wallet-history-page', WalletHistoryPage);
export default WalletHistoryPage;
