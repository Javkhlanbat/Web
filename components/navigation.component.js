/**
 * Navigation Component - Цэс удирдлага
 * Responsive navigation болон mobile menu
 */

import { TokenManager, UserManager } from './api.component.js';

export class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.navLinks = document.querySelector('.nav-links');
        this.authButtons = document.querySelector('.auth-buttons');
        this.toggle = document.querySelector('.mobile-menu-toggle');
    }

    // Эхлүүлэх
    init() {
        if (!this.nav) {
            console.error('Navigation elements not found');
            return;
        }

        this.updateNavLinks();
        this.setupActiveLinks();
        this.setupScrollEffect();
        this.updateAuthButtons();
        this.setupMobileMenu();
    }

    // Navigation links шинэчлэх
    updateNavLinks() {
        if (!this.navLinks) return;

        const isAuthenticated = typeof TokenManager !== 'undefined' && TokenManager.isAuthenticated();

        const baseLinks = `
            <a href="index.html">Нүүр</a>
            <a href="zeelhuudas.html">Зээлийн тооцоолуур</a>
            <a href="aboutus.html">Бидний тухай</a>
            <a href="FAQ.html">Түгээмэл асуулт</a>
        `;

        if (isAuthenticated) {
            this.navLinks.innerHTML = baseLinks + `
                <a href="my-loans.html">Миний зээл</a>
                <div class="auth-mobile">
                    <a href="profile.html" class="btn btn-ghost btn-sm">Профайл</a>
                    <a href="dashboard.html" class="btn btn-secondary btn-sm">Dashboard</a>
                    <button id="mobileLogoutBtn" class="btn btn-primary btn-sm">Гарах</button>
                </div>
            `;
        } else {
            this.navLinks.innerHTML = baseLinks + `
                <div class="auth-mobile">
                    <a href="login.html" class="btn btn-secondary btn-sm">Нэвтрэх</a>
                    <a href="register.html" class="btn btn-primary btn-sm">Бүртгүүлэх</a>
                </div>
            `;
        }
    }

    // Mobile menu тохируулах
    setupMobileMenu() {
        if (!this.toggle || !this.navLinks) {
            console.error('Mobile menu elements not found!');
            return;
        }

        // Toggle button click
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();

            const isActive = this.navLinks.classList.toggle('active');
            this.toggle.innerHTML = isActive ? '✕' : '☰';
            this.toggle.setAttribute('aria-expanded', isActive);

            // Body scroll lock
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close when clicking nav link
        this.navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                // Handle mobile logout
                if (e.target.id === 'mobileLogoutBtn') {
                    e.preventDefault();
                    this.handleLogout();
                    return;
                }

                this.closeMobileMenu();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.nav && !this.nav.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    // Mobile menu хаах
    closeMobileMenu() {
        if (!this.navLinks || !this.toggle) return;

        this.navLinks.classList.remove('active');
        this.toggle.innerHTML = '☰';
        this.toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Active link тохируулах
    setupActiveLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav-links a');

        links.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Scroll effect
    setupScrollEffect() {
        if (!this.nav) return;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Auth buttons шинэчлэх
    updateAuthButtons() {
        if (!this.authButtons) return;

        const isAuthenticated = typeof TokenManager !== 'undefined' && TokenManager.isAuthenticated();

        if (isAuthenticated) {
            const user = typeof UserManager !== 'undefined' ? UserManager.getUser() : null;
            const userName = user ? (user.first_name || user.firstName || 'Хэрэглэгч') : 'Хэрэглэгч';
            const userEmail = user ? (user.email || '') : '';
            const initials = userName.charAt(0).toUpperCase();

            this.authButtons.innerHTML = `
                <a href="dashboard.html" class="btn btn-dashboard">Dashboard</a>
                <div class="profile-dropdown" id="profileDropdown">
                    <button class="profile-trigger" id="profileTrigger">
                        <span class="profile-avatar">${initials}</span>
                        <span class="profile-name">${userName}</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="profile-menu">
                        <div class="profile-menu-header">
                            <div class="user-name">${userName}</div>
                            <div class="user-email">${userEmail}</div>
                        </div>
                        <div class="profile-menu-items">
                            <a href="profile.html" class="profile-menu-item">Профайл</a>
                            <a href="profile.html#wallet" class="profile-menu-item">Wallet</a>
                            <a href="profile.html#security" class="profile-menu-item">Нууцлал</a>
                            <a href="profile.html#preferences" class="profile-menu-item">Тохиргоо</a>
                            <div class="profile-menu-divider"></div>
                            <button class="profile-menu-item logout" id="logoutBtn">Гарах</button>
                        </div>
                    </div>
                </div>
            `;

            this.setupProfileDropdown();
        } else {
            this.authButtons.innerHTML = `
                <a href="login.html" class="btn btn-ghost btn-sm">Нэвтрэх</a>
                <a href="register.html" class="btn btn-primary btn-sm">Бүртгүүлэх</a>
            `;
        }
    }

    // Profile dropdown тохируулах
    setupProfileDropdown() {
        const profileDropdown = document.getElementById('profileDropdown');
        const profileTrigger = document.getElementById('profileTrigger');
        const logoutBtn = document.getElementById('logoutBtn');

        if (profileTrigger && profileDropdown) {
            profileTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!profileDropdown.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    // Logout handler
    handleLogout() {
        if (confirm('Гарахдаа итгэлтэй байна уу?')) {
            if (typeof UserManager !== 'undefined') {
                UserManager.logout();
            } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                window.location.href = 'login.html';
            }
        }
    }

    // Static HTML render method
    static render() {
        return `
            <nav class="nav">
                <div class="brand">OmniCredit</div>
                <div class="nav-links">
                    <a href="index.html">Нүүр</a>
                    <a href="zeelhuudas.html">Зээлийн тооцоолуур</a>
                    <a href="aboutus.html">Бидний тухай</a>
                    <a href="FAQ.html">Түгээмэл асуулт</a>
                    <a href="my-loans.html">Миний зээл</a>
                </div>
                <div class="auth-buttons">
                    <a href="login.html" class="btn btn-ghost btn-sm">Нэвтрэх</a>
                    <a href="register.html" class="btn btn-primary btn-sm">Бүртгүүлэх</a>
                </div>
                <button class="mobile-menu-toggle" aria-label="Toggle menu">☰</button>
            </nav>
        `;
    }
}

// Автоматаар эхлүүлэх
export function initNavigation() {
    const nav = new Navigation();
    nav.init();
}
