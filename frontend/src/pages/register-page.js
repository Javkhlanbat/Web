/**
 * Register Page Web Component
 * User registration with validation
 */

import { AuthAPI } from '../services/api.js';
import router from '../router.js';

class RegisterPage extends HTMLElement {
    constructor() {
        super();
        this.isLoading = false;
        this.formData = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            registerId: ''
        };
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    /**
     * Validate form
     */
    validateForm() {
        const errors = [];

        // First Name
        if (!this.formData.firstName || this.formData.firstName.length < 2) {
            errors.push('Нэр 2-оос дээш тэмдэгттэй байх ёстой');
        }

        // Last Name
        if (!this.formData.lastName || this.formData.lastName.length < 2) {
            errors.push('Овог 2-оос дээш тэмдэгттэй байх ёстой');
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.formData.email || !emailRegex.test(this.formData.email)) {
            errors.push('И-мэйл хаяг буруу байна');
        }

        // Phone
        const phoneRegex = /^[0-9]{8}$/;
        if (!this.formData.phone || !phoneRegex.test(this.formData.phone)) {
            errors.push('Утасны дугаар 8 оронтой байх ёстой');
        }

        // Register ID
        if (!this.formData.registerId || this.formData.registerId.length < 10) {
            errors.push('Регистрийн дугаар буруу байна');
        }

        // Password
        if (!this.formData.password || this.formData.password.length < 6) {
            errors.push('Нууц үг 6-аас дээш тэмдэгттэй байх ёстой');
        }

        // Confirm Password
        if (this.formData.password !== this.formData.confirmPassword) {
            errors.push('Нууц үг таарахгүй байна');
        }

        return errors;
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();

        if (this.isLoading) return;

        // Get form values
        this.formData = {
            firstName: this.querySelector('#firstName').value.trim(),
            lastName: this.querySelector('#lastName').value.trim(),
            email: this.querySelector('#email').value.trim(),
            phone: this.querySelector('#phone').value.trim(),
            password: this.querySelector('#password').value,
            confirmPassword: this.querySelector('#confirmPassword').value,
            registerId: this.querySelector('#registerId').value.trim()
        };

        // Validate
        const errors = this.validateForm();
        if (errors.length > 0) {
            this.showError(errors.join(', '));
            return;
        }

        try {
            this.isLoading = true;
            this.updateButtonState();

            const response = await AuthAPI.register(this.formData);

            if (response.token && response.user) {
                this.showSuccess('Амжилттай бүртгэгдлээ! Та нэвтэрч байна...');

                // Redirect to dashboard
                setTimeout(() => {
                    router.navigate('/dashboard');
                }, 1000);
            } else {
                throw new Error('Бүртгэл амжилтгүй боллоо');
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showError(error.message || 'Бүртгэл амжилтгүй боллоо');
        } finally {
            this.isLoading = false;
            this.updateButtonState();
        }
    }

    /**
     * Update button state
     */
    updateButtonState() {
        const btn = this.querySelector('.submit-btn');
        if (btn) {
            btn.disabled = this.isLoading;
            btn.textContent = this.isLoading ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх';
        }
    }

    /**
     * Show error message
     */
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

    /**
     * Show success message
     */
    showSuccess(message) {
        const successEl = this.querySelector('.success-message');
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const form = this.querySelector('.register-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Handle links
        this.querySelectorAll('a[href^="#/"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.getAttribute('href').substring(1);
                router.navigate(path);
            });
        });
    }

    /**
     * Render component
     */
    render() {
        this.innerHTML = `
            <div class="register-page">
                <app-nav></app-nav>

                <div class="register-container">
                    <div class="register-card card">
                        <div class="register-header">
                            <h1 class="register-title">Бүртгүүлэх</h1>
                            <p class="register-subtitle">Шинэ данс үүсгэх</p>
                        </div>

                        <div class="error-message alert alert-danger" style="display: none;"></div>
                        <div class="success-message alert alert-success" style="display: none;"></div>

                        <form class="register-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="firstName" class="form-label">Нэр *</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        class="form-input"
                                        placeholder="Нэрээ оруулна уу"
                                        required
                                        autocomplete="given-name"
                                    />
                                </div>

                                <div class="form-group">
                                    <label for="lastName" class="form-label">Овог *</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        class="form-input"
                                        placeholder="Овогоо оруулна уу"
                                        required
                                        autocomplete="family-name"
                                    />
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="email" class="form-label">И-мэйл *</label>
                                <input
                                    type="email"
                                    id="email"
                                    class="form-input"
                                    placeholder="example@email.com"
                                    required
                                    autocomplete="email"
                                />
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="phone" class="form-label">Утасны дугаар *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        class="form-input"
                                        placeholder="99999999"
                                        required
                                        autocomplete="tel"
                                        maxlength="8"
                                    />
                                </div>

                                <div class="form-group">
                                    <label for="registerId" class="form-label">Регистр *</label>
                                    <input
                                        type="text"
                                        id="registerId"
                                        class="form-input"
                                        placeholder="АА12345678"
                                        required
                                        maxlength="10"
                                    />
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="password" class="form-label">Нууц үг *</label>
                                    <input
                                        type="password"
                                        id="password"
                                        class="form-input"
                                        placeholder="••••••••"
                                        required
                                        autocomplete="new-password"
                                        minlength="6"
                                    />
                                </div>

                                <div class="form-group">
                                    <label for="confirmPassword" class="form-label">Нууц үг давтах *</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        class="form-input"
                                        placeholder="••••••••"
                                        required
                                        autocomplete="new-password"
                                        minlength="6"
                                    />
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block submit-btn">
                                Бүртгүүлэх
                            </button>
                        </form>

                        <div class="register-footer">
                            <p class="text-center text-muted">
                                Аль хэдийн бүртгэлтэй юу?
                                <a href="#/login" class="text-primary">Нэвтрэх</a>
                            </p>
                            <p class="text-center text-muted mt-2">
                                <a href="#/" class="text-secondary">← Нүүр хуудас руу буцах</a>
                            </p>
                        </div>
                    </div>
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                .register-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .register-container {
                    min-height: calc(100vh - 200px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                }

                .register-card {
                    width: 100%;
                    max-width: 600px;
                    padding: 2.5rem;
                    animation: slideInUp var(--transition);
                }

                .register-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .register-title {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                }

                .register-subtitle {
                    font-size: var(--font-base);
                    color: var(--text-muted);
                    margin: 0;
                }

                .register-form {
                    margin-bottom: 1.5rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                .register-footer {
                    margin-top: 1.5rem;
                }

                .register-footer a {
                    text-decoration: none;
                    font-weight: var(--font-medium);
                }

                .register-footer a:hover {
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

                @media (max-width: 640px) {
                    .register-card {
                        padding: 1.5rem;
                    }

                    .register-title {
                        font-size: var(--font-2xl);
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
    }
}

// Register the custom element
customElements.define('register-page', RegisterPage);

export default RegisterPage;
