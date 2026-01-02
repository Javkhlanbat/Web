
import { AuthAPI, TokenManager, UserManager } from '../services/api.js';
import router from '../router.js';

class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.isLoading = false;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

        async handleSubmit(e) {
        e.preventDefault();

        if (this.isLoading) return;

        const phone = this.querySelector('#phone').value;
        const password = this.querySelector('#password').value;

        // Validation
        if (!phone || !password) {
            this.showError('Утас болон нууц үгээ оруулна уу');
            return;
        }

        try {
            this.isLoading = true;
            this.updateButtonState();

            const response = await AuthAPI.login({ phone, password });

            if (response.token && response.user) {
                // Save auth data
                TokenManager.setToken(response.token);
                UserManager.setUser(response.user);

                // Success message
                this.showSuccess('Амжилттай нэвтэрлээ!');

                // Redirect based on user role
                setTimeout(() => {
                    if (response.user.is_admin) {
                        router.navigate('/admin');
                    } else {
                        router.navigate('/dashboard');
                    }
                }, 500);
            } else {
                throw new Error('Нэвтрэх мэдээлэл алдаатай байна');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError(error.message || 'Нэвтрэх явцад алдаа гарлаа');
        } finally {
            this.isLoading = false;
            this.updateButtonState();
        }
    }

        updateButtonState() {
        const btn = this.querySelector('.submit-btn');
        if (btn) {
            btn.disabled = this.isLoading;
            btn.textContent = this.isLoading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх';
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

        attachEventListeners() {
        const form = this.querySelector('.login-form');
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

        render() {
        this.innerHTML = `
            <div class="login-page">
                <app-nav></app-nav>

                <div class="login-container">
                    <div class="login-card card">
                        <div class="login-header">
                            <h1 class="login-title">Нэвтрэх</h1>
                            <p class="login-subtitle">Таны дансанд нэвтрэх</p>
                        </div>

                        <div class="error-message alert alert-danger" style="display: none;"></div>
                        <div class="success-message alert alert-success" style="display: none;"></div>

                        <form class="login-form">
                            <div class="form-group">
                                <label for="phone" class="form-label">Утасны дугаар</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    class="form-input"
                                    placeholder="99999999"
                                    required
                                    autocomplete="tel"
                                />
                            </div>

                            <div class="form-group">
                                <label for="password" class="form-label">Нууц үг</label>
                                <input
                                    type="password"
                                    id="password"
                                    class="form-input"
                                    placeholder="••••••••"
                                    required
                                    autocomplete="current-password"
                                />
                            </div>

                            <button type="submit" class="btn btn-primary btn-block submit-btn">
                                Нэвтрэх
                            </button>
                        </form>

                        <div class="login-footer">
                            <p class="text-center text-muted">
                                Бүртгэлгүй юу?
                                <a href="#/register" class="text-primary">Бүртгүүлэх</a>
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
                .login-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .login-container {
                    min-height: calc(100vh - 200px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                }

                .login-card {
                    width: 100%;
                    max-width: 450px;
                    padding: 2.5rem;
                    animation: slideInUp var(--transition);
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .login-title {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                }

                .login-subtitle {
                    font-size: var(--font-base);
                    color: var(--text-muted);
                    margin: 0;
                }

                .login-form {
                    margin-bottom: 1.5rem;
                }

                .login-footer {
                    margin-top: 1.5rem;
                }

                .login-footer a {
                    text-decoration: none;
                    font-weight: var(--font-medium);
                }

                .login-footer a:hover {
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
                    .login-card {
                        padding: 1.5rem;
                    }

                    .login-title {
                        font-size: var(--font-2xl);
                    }
                }
            </style>
        `;
    }
}

// Register the custom element
customElements.define('login-page', LoginPage);

export default LoginPage;
