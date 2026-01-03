
import { LoansAPI } from '../services/api.js';
import router from '../router.js';

class LoansPage extends HTMLElement {
    constructor() {
        super();
        this.loans = [];
        this.isLoading = true;
    }

    async connectedCallback() {
        this.render();
        await this.loadLoans();
    }

        async loadLoans() {
        try {
            this.isLoading = true;
            this.updateLoadingState();

            const response = await LoansAPI.getMyLoans();
            this.loans = response.loans || [];

            this.isLoading = false;
            this.render();
        } catch (error) {
            console.error('Load loans error:', error);
            this.isLoading = false;
            this.showError(error.message || 'Зээлүүдийг ачааллахад алдаа гарлаа');
            this.render();
        }
    }

        updateLoadingState() {
        const container = this.querySelector('.loans-container');
        if (container && this.isLoading) {
            container.innerHTML = '<div class="loading-spinner">Уншиж байна...</div>';
        }
    }

        showError(message) {
        const errorEl = this.querySelector('.error-message');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
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
            day: '2-digit'
        });
    }

        getStatusBadge(status) {
        const statusMap = {
            'pending': { label: 'Хүлээгдэж байна', class: 'warning' },
            'approved': { label: 'Зөвшөөрөгдсөн', class: 'success' },
            'active': { label: 'Идэвхтэй', class: 'primary' },
            'rejected': { label: 'Татгалзсан', class: 'danger' },
            'completed': { label: 'Дууссан', class: 'secondary' }
        };

        const statusInfo = statusMap[status] || { label: status, class: 'secondary' };
        return `<span class="badge badge-${statusInfo.class}">${statusInfo.label}</span>`;
    }

        getLoanTypeLabel(type) {
        const typeMap = {
            'consumer': 'Хэрэглээний зээл',
            'purchase': 'Худалдан авалтын зээл',
            'personal': 'Хувийн зээл'
        };
        return typeMap[type] || type;
    }

        handleViewLoan(loanId) {
        router.navigate(`/loan-details/${loanId}`);
    }

        handleMakePayment(loanId) {
        router.navigate(`/payment?loanId=${loanId}`);
    }

        attachEventListeners() {
        // View loan buttons
        this.querySelectorAll('.view-loan-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const loanId = e.target.dataset.loanId;
                this.handleViewLoan(loanId);
            });
        });
        this.querySelectorAll('.pay-loan-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const loanId = e.target.dataset.loanId;
                this.handleMakePayment(loanId);
            });
        });
        const refreshBtn = this.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadLoans());
        }
    }
        getLoansListHTML() {
        if (this.isLoading) {
            return '<div class="loading-spinner">Уншиж байна...</div>';
        }

        if (this.loans.length === 0) {
            return `
                <div class="empty-state card">
                    <div class="empty-icon">📋</div>
                    <h3 class="empty-title">Зээл олдсонгүй</h3>
                    <p class="empty-text">Та одоогоор ямар ч зээл аваагүй байна.</p>
                    <a href="#/application" class="btn btn-primary">Зээл хүсэх</a>
                </div>
            `;
        }

        return this.loans.map(loan => `
            <div class="loan-card card">
                <div class="loan-header">
                    <div class="loan-title-section">
                        <h3 class="loan-title">${this.getLoanTypeLabel(loan.loan_type)}</h3>
                        <div class="loan-id">ID: #${loan.id}</div>
                    </div>
                    ${this.getStatusBadge(loan.status)}
                </div>

                <div class="loan-details">
                    <div class="loan-detail-row">
                        <div class="detail-item">
                            <div class="detail-label">Зээлийн дүн</div>
                            <div class="detail-value primary">${this.formatNumber(loan.amount)}₮</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Хугацаа</div>
                            <div class="detail-value">${loan.term_months} сар</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Жилийн хүү</div>
                            <div class="detail-value">${loan.interest_rate}%</div>
                        </div>
                    </div>

                    <div class="loan-detail-row">
                        <div class="detail-item">
                            <div class="detail-label">Сарын төлбөр</div>
                            <div class="detail-value">${this.formatNumber(loan.monthly_payment)}₮</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Нийт төлөх</div>
                            <div class="detail-value">${this.formatNumber(loan.total_amount)}₮</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Үлдэгдэл</div>
                            <div class="detail-value danger">${this.formatNumber(loan.remaining_amount || loan.total_amount)}₮</div>
                        </div>
                    </div>

                    <div class="loan-detail-row">
                        <div class="detail-item">
                            <div class="detail-label">Огноо</div>
                            <div class="detail-value">${this.formatDate(loan.created_at)}</div>
                        </div>
                        ${loan.disbursed_at ? `
                            <div class="detail-item">
                                <div class="detail-label">Олгосон огноо</div>
                                <div class="detail-value">${this.formatDate(loan.disbursed_at)}</div>
                            </div>
                        ` : ''}
                    </div>

                    ${loan.purpose ? `
                        <div class="loan-purpose">
                            <div class="detail-label">Зориулалт:</div>
                            <div class="purpose-text">${loan.purpose}</div>
                        </div>
                    ` : ''}
                </div>

                <div class="loan-actions">
                    ${loan.status === 'approved' || loan.status === 'active' ? `
                        <button class="btn btn-primary pay-loan-btn" data-loan-id="${loan.id}">
                            Төлбөр төлөх
                        </button>
                    ` : ''}
                    <button class="btn btn-outline view-loan-btn" data-loan-id="${loan.id}">
                        Дэлгэрэнгүй
                    </button>
                </div>
            </div>
        `).join('');
    }

        render() {
        this.innerHTML = `
            <div class="loans-page">
                <app-nav></app-nav>

                <div class="loans-container container">
                    <div class="page-header">
                        <div>
                            <h1 class="page-title">Миний зээлүүд</h1>
                            <p class="page-subtitle">Таны авсан бүх зээлийн мэдээлэл</p>
                        </div>
                        <button class="btn btn-outline refresh-btn">Шинэчлэх</button>
                    </div>

                    <div class="error-message alert alert-danger" style="display: none;"></div>

                    <div class="loans-stats">
                        <div class="stat-card card">
                            <div class="stat-label">Нийт зээл</div>
                            <div class="stat-value">${this.loans.length}</div>
                        </div>
                        <div class="stat-card card">
                            <div class="stat-label">Идэвхтэй</div>
                            <div class="stat-value primary">${this.loans.filter(l => l.status === 'active' || l.status === 'approved').length}</div>
                        </div>
                        <div class="stat-card card">
                            <div class="stat-label">Хүлээгдэж буй</div>
                            <div class="stat-value warning">${this.loans.filter(l => l.status === 'pending').length}</div>
                        </div>
                        <div class="stat-card card">
                            <div class="stat-label">Дууссан</div>
                            <div class="stat-value success">${this.loans.filter(l => l.status === 'completed').length}</div>
                        </div>
                    </div>

                    <div class="loans-list">
                        ${this.getLoansListHTML()}
                    </div>
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                .loans-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .loans-container {
                    padding: 2rem 1rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    gap: 1rem;
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

                                .loans-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    padding: 1.5rem;
                    text-align: center;
                }

                .stat-label {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                }

                .stat-value {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    color: var(--text);
                }

                .stat-value.primary {
                    color: var(--primary);
                }

                .stat-value.warning {
                    color: var(--warning);
                }

                .stat-value.success {
                    color: var(--success);
                }

                                .loans-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .loan-card {
                    padding: 2rem;
                }

                .loan-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--line);
                }

                .loan-title {
                    font-size: var(--font-xl);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                    margin: 0 0 0.25rem 0;
                }

                .loan-id {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                }

                .badge {
                    padding: 0.375rem 0.75rem;
                    border-radius: var(--radius);
                    font-size: var(--font-sm);
                    font-weight: var(--font-medium);
                }

                .badge-primary {
                    background: var(--primary-light);
                    color: var(--primary);
                }

                .badge-success {
                    background: var(--success-light);
                    color: var(--success);
                }

                .badge-warning {
                    background: var(--warning-light);
                    color: var(--warning);
                }

                .badge-danger {
                    background: var(--danger-light);
                    color: var(--danger);
                }

                .badge-secondary {
                    background: var(--bg-secondary);
                    color: var(--text-secondary);
                }

                                .loan-details {
                    margin-bottom: 1.5rem;
                }

                .loan-detail-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 1rem;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                }

                .detail-label {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                    margin-bottom: 0.25rem;
                }

                .detail-value {
                    font-size: var(--font-lg);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                }

                .detail-value.primary {
                    color: var(--primary);
                }

                .detail-value.danger {
                    color: var(--danger);
                }

                .loan-purpose {
                    margin-top: 1rem;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                }

                .purpose-text {
                    font-size: var(--font-sm);
                    color: var(--text-secondary);
                    margin-top: 0.5rem;
                    line-height: var(--leading-relaxed);
                }

                                .loan-actions {
                    display: flex;
                    gap: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--line);
                }

                                .empty-state {
                    padding: 4rem 2rem;
                    text-align: center;
                }

                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }

                .empty-title {
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                    color: var(--text);
                    margin-bottom: 0.5rem;
                }

                .empty-text {
                    font-size: var(--font-base);
                    color: var(--text-muted);
                    margin-bottom: 2rem;
                }

                                .loading-spinner {
                    padding: 4rem 2rem;
                    text-align: center;
                    font-size: var(--font-lg);
                    color: var(--text-muted);
                }

                                @media (max-width: 1024px) {
                    .loans-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .loans-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .loan-detail-row {
                        grid-template-columns: 1fr;
                        gap: 0.75rem;
                    }

                    .loan-actions {
                        flex-direction: column;
                    }

                    .loan-actions .btn {
                        width: 100%;
                    }
                }

                @media (max-width: 640px) {
                    .page-title {
                        font-size: var(--font-2xl);
                    }

                    .loan-card {
                        padding: 1.5rem;
                    }

                    .stat-value {
                        font-size: var(--font-2xl);
                    }
                }
            </style>
        `;

        // Re-attach event listeners after re-render
        this.attachEventListeners();
    }
}

// Register the custom element
customElements.define('loans-page', LoansPage);

export default LoansPage;
