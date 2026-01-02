
import { TokenManager, UserManager } from '../services/api.js';
import router from '../router.js';

class AppNav extends HTMLElement {
    constructor() {
        super();
        this.isAuthenticated = false;
        this.user = null;
        this.mobileMenuOpen = false;
        this.profileMenuOpen = false;
    }

    connectedCallback() {
        this.checkAuth();
        this.render();
        this.attachEventListeners();
        window.addEventListener('route-changed', () => {
            this.checkAuth();
            this.render();
            this.attachEventListeners();
        });
    }

    checkAuth() {
        this.isAuthenticated = TokenManager.isAuthenticated();
        this.user = UserManager.getUser();
    }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        const mobileMenu = this.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('show', this.mobileMenuOpen);
        }
    }

    toggleProfileMenu() {
        this.profileMenuOpen = !this.profileMenuOpen;
        const profileMenu = this.querySelector('.profile-dropdown');
        if (profileMenu) {
            profileMenu.classList.toggle('show', this.profileMenuOpen);
        }
    }

    handleLogout() {
        TokenManager.removeToken();
        UserManager.removeUser();
        router.navigate('/login');
    }

    attachEventListeners() {
        const mobileToggle = this.querySelector('.mobile-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        const profileToggle = this.querySelector('.profile-toggle');
        if (profileToggle) {
            profileToggle.addEventListener('click', () => this.toggleProfileMenu());
        }
        const logoutBtn = this.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                this.mobileMenuOpen = false;
                this.profileMenuOpen = false;
                const mobileMenu = this.querySelector('.mobile-menu');
                const profileMenu = this.querySelector('.profile-dropdown');
                if (mobileMenu) mobileMenu.classList.remove('show');
                if (profileMenu) profileMenu.classList.remove('show');
            }
        });

        this.querySelectorAll('a[href^="#/"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.getAttribute('href').substring(1);
                router.navigate(path);
                this.mobileMenuOpen = false;
                const mobileMenu = this.querySelector('.mobile-menu');
                if (mobileMenu) mobileMenu.classList.remove('show');
            });
        });
    }

    render() {
        const currentPath = router.getCurrentPath();

        this.innerHTML = `
            <nav class="navbar">
                <div class="container">
                    <div class="nav-wrapper">
                        <!-- Logo -->
                        <a href="#/" class="logo">
                            <span class="logo-text">OmniCredit</span>
                        </a>

                        <!-- Desktop Navigation -->
                        <div class="nav-links hide-mobile">
                            <a href="#/" class="nav-link ${currentPath === '/' ? 'active' : ''}">Нүүр</a>
                            <a href="#/zeelhuudas" class="nav-link ${currentPath === '/zeelhuudas' ? 'active' : ''}">Зээлийн тооцоолуур</a>
                            <a href="#/aboutus" class="nav-link ${currentPath === '/aboutus' ? 'active' : ''}">Бидний тухай</a>
                            <a href="#/faq" class="nav-link ${currentPath === '/faq' ? 'active' : ''}">Түгээмэл асуулт</a>
                        </div>

                        <!-- Right Side -->
                        <div class="nav-right">
                            <!-- Theme Toggle -->
                            <theme-toggle></theme-toggle>

                            ${this.isAuthenticated ? `
                                <!-- Authenticated User -->
                                <div class="profile-menu hide-mobile">
                                    <button class="profile-toggle">
                                        <span class="profile-name">${this.user?.phone || 'User'}</span>
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                    <div class="profile-dropdown">
                                        <a href="#/dashboard" class="dropdown-item">Dashboard</a>
                                        <a href="#/profile" class="dropdown-item">Профайл</a>
                                        <a href="#/my-loans" class="dropdown-item">Миний зээл</a>
                                        <a href="#/wallet-history" class="dropdown-item">Түрийвч</a>
                                        ${this.user?.role === 'admin' ? `
                                            <div class="dropdown-divider"></div>
                                            <a href="#/admin" class="dropdown-item">Админ самбар</a>
                                        ` : ''}
                                        <div class="dropdown-divider"></div>
                                        <a href="#" class="dropdown-item logout-btn text-danger">Гарах</a>
                                    </div>
                                </div>
                            ` : `
                                <!-- Guest User -->
                                <div class="auth-buttons hide-mobile">
                                    <a href="#/login" class="btn btn-ghost btn-sm">Нэвтрэх</a>
                                    <a href="#/register" class="btn btn-primary btn-sm">Бүртгүүлэх</a>
                                </div>
                            `}

                            <!-- Mobile Menu Toggle -->
                            <button class="mobile-toggle show-mobile" aria-label="Toggle mobile menu">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div class="mobile-menu">
                    <div class="mobile-menu-links">
                        <a href="#/" class="mobile-link">Нүүр</a>
                        <a href="#/zeelhuudas" class="mobile-link">Зээлийн тооцоолуур</a>
                        <a href="#/aboutus" class="mobile-link">Бидний тухай</a>
                        <a href="#/faq" class="mobile-link">Түгээмэл асуулт</a>
                        ${this.isAuthenticated ? `
                            <div class="mobile-divider"></div>
                            <a href="#/dashboard" class="mobile-link">Dashboard</a>
                            <a href="#/profile" class="mobile-link">Профайл</a>
                            <a href="#/my-loans" class="mobile-link">Миний зээл</a>
                            ${this.user?.role === 'admin' ? `
                                <a href="#/admin" class="mobile-link">Админ самбар</a>
                            ` : ''}
                            <a href="#" class="mobile-link logout-btn text-danger">Гарах</a>
                        ` : `
                            <div class="mobile-divider"></div>
                            <a href="#/login" class="mobile-link">Нэвтрэх</a>
                            <a href="#/register" class="mobile-link">Бүртгүүлэх</a>
                        `}
                    </div>
                </div>
            </nav>

            <style>
                .navbar {
                    background: var(--bg);
                    border-bottom: 1px solid var(--line);
                    padding: 1rem 0;
                    position: sticky;
                    top: 0;
                    z-index: var(--z-sticky);
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.95);
                    transition: all var(--transition);
                }

                [data-theme="dark"] .navbar {
                    background: rgba(15, 23, 42, 0.95);
                }

                .nav-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                }

                .logo {
                    font-size: 1.5rem;
                    font-weight: var(--font-bold);
                    color: var(--primary);
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .logo-text {
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    flex: 1;
                }

                .nav-link {
                    color: var(--text-secondary);
                    text-decoration: none;
                    font-weight: var(--font-medium);
                    transition: color var(--transition);
                    position: relative;
                }

                .nav-link:hover {
                    color: var(--primary);
                }

                .nav-link.active {
                    color: var(--primary);
                }

                .nav-link.active::after {
                    content: '';
                    position: absolute;
                    bottom: -0.5rem;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: var(--gradient-primary);
                    border-radius: var(--radius-full);
                }

                .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .auth-buttons {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .profile-menu {
                    position: relative;
                }

                .profile-toggle {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: transparent;
                    border: 2px solid var(--line);
                    border-radius: var(--radius-full);
                    cursor: pointer;
                    transition: all var(--transition);
                    color: var(--text);
                    font-weight: var(--font-medium);
                }

                .profile-toggle:hover {
                    border-color: var(--primary);
                    background: var(--bg-secondary);
                }

                .profile-dropdown {
                    position: absolute;
                    top: calc(100% + 0.5rem);
                    right: 0;
                    min-width: 200px;
                    background: var(--card);
                    border: 1px solid var(--line);
                    border-radius: var(--radius-xl);
                    box-shadow: var(--shadow-xl);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all var(--transition);
                    overflow: hidden;
                }

                .profile-dropdown.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .dropdown-item {
                    display: block;
                    padding: 0.75rem 1rem;
                    color: var(--text);
                    text-decoration: none;
                    transition: all var(--transition);
                }

                .dropdown-item:hover {
                    background: var(--bg-secondary);
                    color: var(--primary);
                }

                .dropdown-divider {
                    height: 1px;
                    background: var(--line);
                    margin: 0.5rem 0;
                }

                .mobile-toggle {
                    display: none;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: var(--text);
                    padding: 0.5rem;
                }

                .mobile-menu {
                    display: none;
                    position: fixed;
                    top: calc(100% + 1px);
                    left: 0;
                    right: 0;
                    background: var(--bg);
                    border-bottom: 1px solid var(--line);
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height var(--transition);
                    box-shadow: var(--shadow-lg);
                }

                .mobile-menu.show {
                    max-height: 500px;
                }

                .mobile-menu-links {
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .mobile-link {
                    padding: 0.75rem 1rem;
                    color: var(--text);
                    text-decoration: none;
                    border-radius: var(--radius-lg);
                    transition: all var(--transition);
                }

                .mobile-link:hover {
                    background: var(--bg-secondary);
                    color: var(--primary);
                }

                .mobile-divider {
                    height: 1px;
                    background: var(--line);
                    margin: 0.5rem 0;
                }

                @media (max-width: 768px) {
                    .navbar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                    }

                    .mobile-toggle {
                        display: flex;
                    }

                    .mobile-menu {
                        display: block;
                    }
                }
            </style>
        `;
    }
}
customElements.define('app-nav', AppNav);

export default AppNav;
