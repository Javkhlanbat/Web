import { AdminAPI, AuthAPI } from '../services/api.js';
import router from '../router.js';

class AdminPage extends HTMLElement {
    constructor() {
        super();
        this.activeTab = 'loans';
        this.loans = [];
        this.users = [];
        this.stats = {
            totalLoans: 0,
            pendingLoans: 0,
            approvedLoans: 0,
            totalUsers: 0
        };
        this.searchQuery = '';
        this.isLoading = true;
        this.currentTime = '';
        this.clockInterval = null;
    }

    async connectedCallback() {
        const user = AuthAPI.getCurrentUser();
        if (!user || !user.is_admin) {
            router.navigate('/dashboard');
            return;
        }

        this.startClock();
        this.render();
        await this.loadData();
    }

    disconnectedCallback() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
        }
    }

    startClock() {
        this.updateClock();
        this.clockInterval = setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        this.currentTime = now.toLocaleString('mn-MN', options);

        const clockEl = this.querySelector('.current-time');
        if (clockEl) {
            clockEl.textContent = this.currentTime;
        }
    }

    async loadData() {
        try {
            this.isLoading = true;
            this.updateLoadingState();

            if (this.activeTab === 'loans') {
                const response = await AdminAPI.getAllLoans();
                this.loans = response.loans || [];
                this.calculateStats();
            } else if (this.activeTab === 'users') {
                const response = await AdminAPI.getAllUsers();
                this.users = response.users || [];
            }

            this.isLoading = false;
            this.render();
        } catch (error) {
            console.error('Load data error:', error);
            this.isLoading = false;
            this.showError(error.message || 'Мэдээлэл ачааллахад алдаа гарлаа');
            this.render();
        }
    }

    calculateStats() {
        this.stats.totalLoans = this.loans.length;
        this.stats.pendingLoans = this.loans.filter(l => l.status === 'pending').length;
        this.stats.approvedLoans = this.loans.filter(l => l.status === 'approved' || l.status === 'active').length;
    }

    updateLoadingState() {
        const container = this.querySelector('.admin-content');
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
            'purchase': 'Худалдан авалтын зээл'
        };
        return typeMap[type] || type;
    }

    async handleApproveLoan(loanId) {
        if (!confirm('Энэ зээлийг батлах уу? Мөнгө хэрэглэгчийн wallet-д шилжинэ.')) {
            return;
        }

        try {
            const response = await AdminAPI.updateLoanStatus(loanId, 'approved');
            this.showSuccess('Зээл амжилттай батлагдлаа!');
            await this.loadData();
        } catch (error) {
            console.error('Approve loan error:', error);
            this.showError(error.message || 'Зээл баталгаажуулахад алдаа гарлаа');
        }
    }

    async handleRejectLoan(loanId) {
        if (!confirm('Энэ зээлийг татгалзах уу?')) {
            return;
        }

        try {
            const response = await AdminAPI.updateLoanStatus(loanId, 'rejected');
            this.showSuccess('Зээл татгалзсан.');
            await this.loadData();
        } catch (error) {
            console.error('Reject loan error:', error);
            this.showError(error.message || 'Зээл татгалзахад алдаа гарлаа');
        }
    }

    async handleDeleteUser(userId) {
        if (!confirm('Энэ хэрэглэгчийг устгах уу?')) {
            return;
        }

        try {
            await AdminAPI.deleteUser(userId);
            this.showSuccess('Хэрэглэгч амжилттай устгагдлаа');
            await this.loadData();
        } catch (error) {
            console.error('Delete user error:', error);
            this.showError(error.message || 'Хэрэглэгч устгахад алдаа гарлаа');
        }
    }

    handleSearch(e) {
        this.searchQuery = e.target.value.toLowerCase();
        this.render();
    }

    switchTab(tab) {
        this.activeTab = tab;
        this.searchQuery = '';
        this.loadData();
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
            setTimeout(() => {
                successEl.style.display = 'none';
            }, 3000);
        }
    }

    getFilteredLoans() {
        if (!this.searchQuery) return this.loans;

        return this.loans.filter(loan => {
            const userId = loan.user_id?.toString() || '';
            const loanId = loan.id?.toString() || '';
            const email = loan.user_email?.toLowerCase() || '';
            const name = loan.user_name?.toLowerCase() || '';

            return userId.includes(this.searchQuery) ||
                   loanId.includes(this.searchQuery) ||
                   email.includes(this.searchQuery) ||
                   name.includes(this.searchQuery);
        });
    }

    getFilteredUsers() {
        if (!this.searchQuery) return this.users;

        return this.users.filter(user => {
            const id = user.id?.toString() || '';
            const email = user.email?.toLowerCase() || '';
            const name = user.name?.toLowerCase() || '';

            return id.includes(this.searchQuery) ||
                   email.includes(this.searchQuery) ||
                   name.includes(this.searchQuery);
        });
    }

    attachEventListeners() {
        // Tab switching
        this.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Search
        const searchInput = this.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Approve loan buttons
        this.querySelectorAll('.approve-loan-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const loanId = btn.dataset.loanId;
                this.handleApproveLoan(loanId);
            });
        });

        // Reject loan buttons
        this.querySelectorAll('.reject-loan-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const loanId = btn.dataset.loanId;
                this.handleRejectLoan(loanId);
            });
        });

        // Delete user buttons
        this.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = btn.dataset.userId;
                this.handleDeleteUser(userId);
            });
        });

        // Refresh button
        const refreshBtn = this.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadData());
        }
    }

    render() {
        const filteredLoans = this.getFilteredLoans();
        const filteredUsers = this.getFilteredUsers();

        this.innerHTML = `
            <div class="admin-page">
                <app-nav></app-nav>

                <div class="admin-container container">
                    <div class="page-header">
                        <div>
                            <h1 class="page-title">Admin Dashboard</h1>
                            <p class="page-subtitle">Системийн удирдлага</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="text-align: right;">
                                <div style="font-size: 0.875rem; color: #6c757d; margin-bottom: 0.25rem;">Одоогийн цаг</div>
                                <div class="current-time" style="font-size: 1.125rem; font-weight: 600; color: #2c5aa0;">${this.currentTime}</div>
                            </div>
                            <button class="btn btn-outline refresh-btn">Шинэчлэх</button>
                        </div>
                    </div>

                    <div class="error-message alert alert-danger" style="display: none;"></div>
                    <div class="success-message alert alert-success" style="display: none;"></div>

                    <!-- Stats -->
                    <div class="stats-grid">
                        <div class="stat-card card">
                            <div class="stat-label">Нийт зээл</div>
                            <div class="stat-value">${this.stats.totalLoans}</div>
                        </div>
                        <div class="stat-card card">
                            <div class="stat-label">Хүлээгдэж буй</div>
                            <div class="stat-value warning">${this.stats.pendingLoans}</div>
                        </div>
                        <div class="stat-card card">
                            <div class="stat-label">Батлагдсан</div>
                            <div class="stat-value success">${this.stats.approvedLoans}</div>
                        </div>
                        <div class="stat-card card">
                            <div class="stat-label">Нийт хэрэглэгч</div>
                            <div class="stat-value primary">${this.users.length}</div>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="tabs">
                        <button class="tab-btn ${this.activeTab === 'loans' ? 'active' : ''}" data-tab="loans">
                            Зээлийн хүсэлтүүд
                        </button>
                        <button class="tab-btn ${this.activeTab === 'users' ? 'active' : ''}" data-tab="users">
                            Хэрэглэгчид
                        </button>
                    </div>

                    <!-- Search -->
                    <div class="search-bar">
                        <input
                            type="text"
                            class="search-input form-input"
                            placeholder="${this.activeTab === 'loans' ? 'Зээл хайх (ID, имэйл)...' : 'Хэрэглэгч хайх (ID, нэр, имэйл)...'}"
                            value="${this.searchQuery}"
                        />
                    </div>

                    <!-- Content -->
                    <div class="admin-content">
                        ${this.isLoading ? `
                            <div class="loading-spinner">Уншиж байна...</div>
                        ` : this.activeTab === 'loans' ? `
                            ${filteredLoans.length === 0 ? `
                                <div class="empty-state card">
                                    <h3>Зээл олдсонгүй</h3>
                                    <p>Одоогоор зээлийн хүсэлт байхгүй байна.</p>
                                </div>
                            ` : `
                                <div class="loans-table">
                                    <table class="data-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Хэрэглэгч</th>
                                                <th>Төрөл</th>
                                                <th>Дүн</th>
                                                <th>Хугацаа</th>
                                                <th>Статус</th>
                                                <th>Огноо</th>
                                                <th>Үйлдэл</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${filteredLoans.map(loan => `
                                                <tr>
                                                    <td>#${loan.id}</td>
                                                    <td>
                                                        <div class="user-info">
                                                            <div class="user-name">${loan.user_name || 'User #' + loan.user_id}</div>
                                                            <div class="user-email">${loan.user_email || '-'}</div>
                                                        </div>
                                                    </td>
                                                    <td>${this.getLoanTypeLabel(loan.loan_type)}</td>
                                                    <td class="amount">${this.formatNumber(loan.amount)}₮</td>
                                                    <td>${loan.term_months} сар</td>
                                                    <td>${this.getStatusBadge(loan.status)}</td>
                                                    <td class="date">${this.formatDate(loan.created_at)}</td>
                                                    <td>
                                                        <div class="action-buttons">
                                                            ${loan.status === 'pending' ? `
                                                                <button class="btn btn-sm btn-success approve-loan-btn" data-loan-id="${loan.id}">
                                                                    Батлах
                                                                </button>
                                                                <button class="btn btn-sm btn-danger reject-loan-btn" data-loan-id="${loan.id}">
                                                                    Татгалзах
                                                                </button>
                                                            ` : `
                                                                <span class="text-muted">-</span>
                                                            `}
                                                        </div>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            `}
                        ` : `
                            ${filteredUsers.length === 0 ? `
                                <div class="empty-state card">
                                    <h3>Хэрэглэгч олдсонгүй</h3>
                                    <p>Хэрэглэгч байхгүй байна.</p>
                                </div>
                            ` : `
                                <div class="users-table">
                                    <table class="data-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Нэр</th>
                                                <th>Имэйл</th>
                                                <th>Утас</th>
                                                <th>Admin</th>
                                                <th>Огноо</th>
                                                <th>Үйлдэл</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${filteredUsers.map(user => `
                                                <tr>
                                                    <td>#${user.id}</td>
                                                    <td>${user.name || '-'}</td>
                                                    <td>${user.email}</td>
                                                    <td>${user.phone || '-'}</td>
                                                    <td>
                                                        ${user.is_admin ?
                                                            '<span class="badge badge-primary">Admin</span>' :
                                                            '<span class="badge badge-secondary">User</span>'
                                                        }
                                                    </td>
                                                    <td class="date">${this.formatDate(user.created_at)}</td>
                                                    <td>
                                                        ${!user.is_admin ? `
                                                            <button class="btn btn-sm btn-danger delete-user-btn" data-user-id="${user.id}">
                                                                Устгах
                                                            </button>
                                                        ` : `
                                                            <span class="text-muted">-</span>
                                                        `}
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            `}
                        `}
                    </div>
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                .admin-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .admin-container {
                    padding: 2rem 1rem;
                    max-width: 1400px;
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

                /* Stats */
                .stats-grid {
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

                .stat-value.primary { color: var(--primary); }
                .stat-value.warning { color: var(--warning); }
                .stat-value.success { color: var(--success); }

                /* Tabs */
                .tabs {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    border-bottom: 2px solid var(--line);
                }

                .tab-btn {
                    padding: 1rem 2rem;
                    background: none;
                    border: none;
                    border-bottom: 3px solid transparent;
                    color: var(--text-muted);
                    font-size: var(--font-base);
                    font-weight: var(--font-medium);
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: -2px;
                }

                .tab-btn:hover {
                    color: var(--primary);
                }

                .tab-btn.active {
                    color: var(--primary);
                    border-bottom-color: var(--primary);
                }

                /* Search */
                .search-bar {
                    margin-bottom: 1.5rem;
                }

                .search-input {
                    width: 100%;
                    max-width: 400px;
                }

                /* Table */
                .data-table {
                    width: 100%;
                    background: white;
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    box-shadow: var(--shadow-sm);
                }

                .data-table th,
                .data-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid var(--line);
                }

                .data-table th {
                    background: var(--bg-secondary);
                    font-weight: var(--font-semibold);
                    font-size: var(--font-sm);
                    color: var(--text-secondary);
                    text-transform: uppercase;
                }

                .data-table tbody tr:hover {
                    background: var(--bg-secondary);
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .user-name {
                    font-weight: var(--font-medium);
                }

                .user-email {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                }

                .amount {
                    font-weight: var(--font-semibold);
                    color: var(--primary);
                }

                .date {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                }

                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                }

                .btn-sm {
                    padding: 0.5rem 1rem;
                    font-size: var(--font-sm);
                }

                .badge {
                    padding: 0.375rem 0.75rem;
                    border-radius: var(--radius);
                    font-size: var(--font-sm);
                    font-weight: var(--font-medium);
                }

                .badge-primary { background: var(--primary-light); color: var(--primary); }
                .badge-success { background: var(--success-light); color: var(--success); }
                .badge-warning { background: var(--warning-light); color: var(--warning); }
                .badge-danger { background: var(--danger-light); color: var(--danger); }
                .badge-secondary { background: var(--bg-secondary); color: var(--text-secondary); }

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

                .text-muted {
                    color: var(--text-muted);
                }

                @media (max-width: 1024px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .data-table {
                        font-size: var(--font-sm);
                    }
                }

                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }

                    .tabs {
                        overflow-x: auto;
                    }

                    .data-table {
                        display: block;
                        overflow-x: auto;
                    }

                    .action-buttons {
                        flex-direction: column;
                    }
                }
            </style>
        `;

        this.attachEventListeners();
    }
}

customElements.define('admin-page', AdminPage);
export default AdminPage;
