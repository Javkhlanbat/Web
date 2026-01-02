/**
 * Profile Page Web Component
 * User profile management
 */

import { AuthAPI } from '../services/api.js';
import router from '../router.js';

class ProfilePage extends HTMLElement {
    constructor() {
        super();
        this.user = null;
        this.isEditing = false;
        this.formData = {};
    }

    async connectedCallback() {
        this.user = AuthAPI.getCurrentUser();
        if (!this.user) {
            router.navigate('/login');
            return;
        }

        this.formData = { ...this.user };
        this.render();
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('mn-MN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    handleEdit() {
        this.isEditing = true;
        this.render();
    }

    handleCancel() {
        this.isEditing = false;
        this.formData = { ...this.user };
        this.render();
    }

    handleInputChange(field, value) {
        this.formData[field] = value;
    }

    async handleSave(e) {
        e.preventDefault();

        try {
            const updateData = {
                name: this.formData.name,
                phone: this.formData.phone,
                address: this.formData.address
            };

            const response = await AuthAPI.updateProfile(updateData);

            if (response.user) {
                this.user = response.user;
                this.formData = { ...response.user };
                this.isEditing = false;
                this.showSuccess('Профайл амжилттай шинэчлэгдлээ');
                this.render();
            }
        } catch (error) {
            console.error('Update profile error:', error);
            this.showError(error.message || 'Профайл шинэчлэхэд алдаа гарлаа');
        }
    }

    handleLogout() {
        if (confirm('Та системээс гарах уу?')) {
            AuthAPI.logout();
            router.navigate('/login');
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
            setTimeout(() => {
                successEl.style.display = 'none';
            }, 3000);
        }
    }

    attachEventListeners() {
        const editBtn = this.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.handleEdit());
        }

        const cancelBtn = this.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.handleCancel());
        }

        const form = this.querySelector('.profile-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSave(e));
        }

        const inputs = this.querySelectorAll('.profile-input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleInputChange(e.target.name, e.target.value);
            });
        });

        const logoutBtn = this.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    render() {
        this.innerHTML = `
            <div class="profile-page">
                <app-nav></app-nav>

                <div class="profile-container container">
                    <div class="page-header">
                        <h1 class="page-title">Миний профайл</h1>
                        <p class="page-subtitle">Хувийн мэдээлэл</p>
                    </div>

                    <div class="error-message alert alert-danger" style="display: none;"></div>
                    <div class="success-message alert alert-success" style="display: none;"></div>

                    <div class="profile-content">
                        <div class="profile-card card">
                            <div class="profile-header">
                                <div class="profile-avatar">
                                    ${this.user.name ? this.user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div class="profile-info">
                                    <h2 class="profile-name">${this.user.name || 'Нэргүй хэрэглэгч'}</h2>
                                    <p class="profile-email">${this.user.email}</p>
                                    ${this.user.is_admin ? '<span class="badge badge-primary">Admin</span>' : ''}
                                </div>
                            </div>

                            ${!this.isEditing ? `
                                <div class="profile-details">
                                    <div class="detail-row">
                                        <div class="detail-label">Утас:</div>
                                        <div class="detail-value">${this.user.phone || '-'}</div>
                                    </div>
                                    <div class="detail-row">
                                        <div class="detail-label">Хаяг:</div>
                                        <div class="detail-value">${this.user.address || '-'}</div>
                                    </div>
                                    <div class="detail-row">
                                        <div class="detail-label">Бүртгүүлсэн:</div>
                                        <div class="detail-value">${this.formatDate(this.user.created_at)}</div>
                                    </div>
                                </div>

                                <div class="profile-actions">
                                    <button class="btn btn-primary edit-btn">Засах</button>
                                    <button class="btn btn-danger logout-btn">Гарах</button>
                                </div>
                            ` : `
                                <form class="profile-form">
                                    <div class="form-group">
                                        <label class="form-label">Нэр</label>
                                        <input
                                            type="text"
                                            name="name"
                                            class="form-input profile-input"
                                            value="${this.formData.name || ''}"
                                            required
                                        />
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">Утас</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            class="form-input profile-input"
                                            value="${this.formData.phone || ''}"
                                            placeholder="99999999"
                                        />
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">Хаяг</label>
                                        <textarea
                                            name="address"
                                            class="form-input profile-input"
                                            rows="3"
                                            placeholder="Хаягаа оруулна уу"
                                        >${this.formData.address || ''}</textarea>
                                    </div>

                                    <div class="form-actions">
                                        <button type="button" class="btn btn-outline cancel-btn">Цуцлах</button>
                                        <button type="submit" class="btn btn-primary">Хадгалах</button>
                                    </div>
                                </form>
                            `}
                        </div>

                        <div class="info-cards">
                            <div class="info-card card">
                                <h3 class="info-title">Хэрэглэгчийн ID</h3>
                                <p class="info-value">#${this.user.id}</p>
                            </div>
                            <div class="info-card card">
                                <h3 class="info-title">Статус</h3>
                                <p class="info-value">
                                    <span class="badge badge-success">Идэвхтэй</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                .profile-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .profile-container {
                    padding: 2rem 1rem;
                    max-width: 900px;
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

                .profile-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 2rem;
                }

                .profile-card {
                    padding: 2rem;
                }

                .profile-header {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid var(--line);
                    margin-bottom: 2rem;
                }

                .profile-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: var(--gradient-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                }

                .profile-name {
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                    margin-bottom: 0.25rem;
                }

                .profile-email {
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                }

                .profile-details {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                }

                .detail-label {
                    font-weight: var(--font-medium);
                    color: var(--text-muted);
                }

                .detail-value {
                    font-weight: var(--font-semibold);
                }

                .profile-actions,
                .form-actions {
                    display: flex;
                    gap: 1rem;
                }

                .profile-actions .btn,
                .form-actions .btn {
                    flex: 1;
                }

                .info-cards {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .info-card {
                    padding: 1.5rem;
                    text-align: center;
                }

                .info-title {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                    margin-bottom: 0.5rem;
                }

                .info-value {
                    font-size: var(--font-xl);
                    font-weight: var(--font-bold);
                    margin: 0;
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

                @media (max-width: 768px) {
                    .profile-content {
                        grid-template-columns: 1fr;
                    }

                    .profile-header {
                        flex-direction: column;
                        text-align: center;
                    }

                    .profile-actions,
                    .form-actions {
                        flex-direction: column;
                    }
                }
            </style>
        `;

        this.attachEventListeners();
    }
}

customElements.define("profile-page", ProfilePage);
export default ProfilePage;
