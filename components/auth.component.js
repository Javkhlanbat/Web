/**
 * Auth Component - SPA (Hash router) хувилбар
 * - window.location.href ашиглахгүй
 * - #/route дээр ажиллана
 */

import { TokenManager, UserManager, AuthAPI } from './api.component.js';
import { navigate } from './router.js'; // ✅ SPA navigate

// Нийтэд нээлттэй SPA routes
const PUBLIC_ROUTES = [
  '/',            // home
  '/login',
  '/register',
  '/about',
  '/faq',
  '/calculator',
  '/purchase-loan',
];

// admin шаарддаг routes
const ADMIN_ROUTES = ['/admin'];

export class AuthGuard {
  constructor() {
    const { path } = this.getHash();
    this.currentRoute = path;
    this.isPublicRoute = PUBLIC_ROUTES.includes(path);
  }

  init() {
    // эхлэхэд шалгана
    if (!this.checkAuthentication()) return;

    this.updateAuthUI();
    this.verifyTokenIfNeeded();

    // route солигдох бүрт дахин шалгана
    window.addEventListener('hashchange', () => {
      const { path } = this.getHash();
      this.currentRoute = path;
      this.isPublicRoute = PUBLIC_ROUTES.includes(path);

      this.checkAuthentication();
      this.updateAuthUI();
    });
  }

  // Hash-оос route авах (#/x?y=1)
  getHash() {
    const raw = location.hash || '#/';
    const h = raw.replace(/^#/, '');
    const [p, qs] = h.split('?');
    const path = this.norm(p || '/');
    const query = new URLSearchParams(qs || '');
    return { path, query };
  }

  norm(p) {
    let s = String(p || '').trim();
    if (!s.startsWith('/')) s = '/' + s;
    if (s.length > 1) s = s.replace(/\/+$/, '');
    return s;
  }

  // Нэвтэрсэн эсэх
  checkAuthentication() {
    // private route + token байхгүй => login
    if (!this.isPublicRoute && !TokenManager.isAuthenticated()) {
      const redirect = encodeURIComponent(this.currentRoute);
      navigate(`#/login?redirect=${redirect}`, { replace: true });
      return false;
    }

    // admin route дээр admin биш бол => dashboard
    if (ADMIN_ROUTES.includes(this.currentRoute)) {
      const user = UserManager.getUser();
      const isAdmin = !!(user && (user.is_admin || user.isAdmin));
      if (!isAdmin) {
        navigate('#/dashboard', { replace: true });
        return false;
      }
    }

    return true;
  }

  updateAuthUI() {
    const authButtonsContainer = document.querySelector('.auth-buttons');
    if (!authButtonsContainer) return;

    const isAuth = TokenManager.isAuthenticated();
    if (!isAuth) {
      // login/register харуулахыг Navigation чинь өөрөө хийдэг бол энд хоосон үлдээж болно
      return;
    }

    const user = UserManager.getUser();
    if (!user) return;

    // Admin user dashboard дээр байвал admin руу (хүсвэл)
    if ((user.is_admin || user.isAdmin) && this.currentRoute === '/dashboard') {
      navigate('#/admin', { replace: true });
      return;
    }

    const firstName =
      user.first_name || user.firstName || user.email?.split('@')[0] || 'Хэрэглэгч';

    authButtonsContainer.innerHTML = `
      <a href="#/profile" data-link class="btn btn-ghost btn-sm" style="margin-right: 8px;">👤 ${firstName}</a>
      <button class="btn btn-primary btn-sm" type="button" id="btnSpaLogout">Гарах</button>
    `;

    authButtonsContainer.querySelector('#btnSpaLogout')?.addEventListener('click', () => {
      this.logout();
    });
  }

  async verifyTokenIfNeeded() {
    // public дээр шалгахгүй
    if (this.isPublicRoute || !TokenManager.isAuthenticated()) return;

    try {
      const result = await AuthAPI.verifyToken();
      if (!result) {
        const redirect = encodeURIComponent(this.currentRoute);
        navigate(`#/login?redirect=${redirect}`, { replace: true });
      }
    } catch (err) {
      console.error('Token verification error:', err);
      this.logout(true);
    }
  }

  logout(force = false) {
    if (!force && !confirm('Гарахдаа итгэлтэй байна уу?')) return;

    // SPA дээр main.js-д __spaLogout байгаа бол тэрийг ашиглая
    if (typeof window.__spaLogout === 'function') {
      window.__spaLogout();
      return;
    }

    // fallback
    TokenManager.removeToken();
    UserManager.removeUser();
    navigate('#/login', { replace: true });
  }
}

// Автоматаар эхлүүлэх
export function initAuth() {
  const authGuard = new AuthGuard();
  authGuard.init();
  window.authGuard = authGuard;
}
