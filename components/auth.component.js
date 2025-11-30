/**
 * Auth Component - Нэвтрэх эрх шалгалт
 * Хуудас хоорондын auth guard
 */

import { TokenManager, UserManager, AuthAPI } from './api.component.js';

// Нийтэд нээлттэй хуудсууд
const PUBLIC_PAGES = [
    'index.html',
    'login.html',
    'register.html',
    'aboutus.html',
    'FAQ.html',
    'zeelhuudas.html',
    'purchase-loan.html'
];

export class AuthGuard {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.isPublicPage = PUBLIC_PAGES.some(page => this.currentPage.includes(page));
    }

    // Эхлүүлэх
    init() {
        this.checkAuthentication();
        this.updateAuthUI();
        this.verifyTokenIfNeeded();
    }

    // Нэвтэрсэн эсэхийг шалгах
    checkAuthentication() {
        if (!this.isPublicPage && !TokenManager.isAuthenticated()) {
            console.log('Authentication required. Redirecting to login...');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Auth UI шинэчлэх
    updateAuthUI() {
        if (!TokenManager.isAuthenticated()) return;

        const user = UserManager.getUser();
        if (!user) return;

        // Admin хандалт шалгах
        this.checkAdminAccess(user);

        // Navigation дээрх auth button шинэчлэх
        this.updateAuthButtons(user);
    }

    // Admin хандалт шалгах
    checkAdminAccess(user) {
        // Admin user гэж dashboard хандах гэж байвал admin руу шилжүүлэх
        if (user.is_admin && this.currentPage.includes('dashboard.html')) {
            console.log('Admin user detected. Redirecting to admin dashboard...');
            window.location.href = 'admin.html';
            return;
        }

        // Энгийн user гэж admin хандах гэж байвал dashboard руу шилжүүлэх
        if (!user.is_admin && this.currentPage.includes('admin.html')) {
            console.log('Non-admin user detected. Redirecting to regular dashboard...');
            window.location.href = 'dashboard.html';
            return;
        }
    }

    // Auth buttons шинэчлэх
    updateAuthButtons(user) {
        const authButtonsContainer = document.querySelector('.auth-buttons');
        if (!authButtonsContainer) return;

        const firstName = user.first_name || user.firstName || user.email?.split('@')[0] || 'Хэрэглэгч';
        authButtonsContainer.innerHTML = `
            <a href="profile.html" class="btn btn-ghost btn-sm" style="margin-right: 8px;">👤 ${firstName}</a>
            <button class="btn btn-primary btn-sm" onclick="window.authGuard.logout()">Гарах</button>
        `;
    }

    // Token баталгаажуулах
    async verifyTokenIfNeeded() {
        if (this.isPublicPage || !TokenManager.isAuthenticated()) return;

        try {
            const result = await AuthAPI.verifyToken();
            if (!result) {
                console.log('Token invalid. Redirecting to login...');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Token verification error:', error);
            this.logout();
        }
    }

    // Гарах
    logout() {
        if (confirm('Гарахдаа итгэлтэй байна уу?')) {
            UserManager.logout();
        }
    }
}

// Автоматаар эхлүүлэх
export function initAuth() {
    if (typeof TokenManager === 'undefined') {
        console.error('TokenManager not found. Make sure api.component.js is loaded first.');
        return;
    }

    const authGuard = new AuthGuard();
    authGuard.init();

    // Global хувьсагч болгох (logout функц дуудахад)
    window.authGuard = authGuard;
}
