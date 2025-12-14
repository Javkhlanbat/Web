/**
 * Navigation Component - Hash SPA хувилбар (fixed)
 * - Давхар init / event listener-ээс хамгаалсан
 * - querySelector-уудыг this.nav хүрээнд хийдэг
 * - logout дээр mobile menu + dropdown цэвэр хаана
 * - active link: бүх a[data-link][href^="#/"] дээр ажиллана
 */

import { TokenManager, UserManager } from './mock-api.component.js';

export class Navigation {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.navLinks = document.querySelector('.nav-links');
    this.authButtons = document.querySelector('.auth-buttons');
    this.toggle = document.querySelector('.mobile-menu-toggle');

    this._inited = false;

    // bind (remove/add хийхэд хэрэгтэй)
    this._onToggleClick = this._onToggleClick.bind(this);
    this._onNavLinksClick = this._onNavLinksClick.bind(this);
    this._onDocClick = this._onDocClick.bind(this);
    this._applyActiveLinks = this._applyActiveLinks.bind(this);
    this._onScroll = this._onScroll.bind(this);
  }

  init() {
    // nav mount хийгдэхээс өмнө init дуудвал дахин олж авна
    if (!this.nav) this.nav = document.querySelector('.nav');
    if (!this.nav) {
      console.error('Navigation elements not found');
      return;
    }

    // дотор элеменүүдээ refresh
    this.navLinks = this.nav.querySelector('.nav-links');
    this.authButtons = this.nav.querySelector('.auth-buttons');
    this.toggle = this.nav.querySelector('.mobile-menu-toggle');

    if (this._inited) {
      // init дахин дуудсан тохиолдолд UI-гаа л шинэчилнэ
      this.updateNavLinks();
      this.updateAuthButtons();
      this._applyActiveLinks();
      return;
    }
    this._inited = true;

    this.updateNavLinks();
    this.updateAuthButtons();

    this.setupActiveLinks();
    this.setupScrollEffect();
    this.setupMobileMenu();
  }

  /* --------------------
     LINKS
  --------------------- */

  updateNavLinks() {
    if (!this.navLinks) return;

    const isAuthenticated = TokenManager.isAuthenticated();

    const baseLinks = `
      <a href="#/" data-link>Нүүр</a>
      <a href="#/calculator" data-link>Зээлийн тооцоолуур</a>
      <a href="#/about" data-link>Бидний тухай</a>
      <a href="#/faq" data-link>Түгээмэл асуулт</a>
    `;

    if (isAuthenticated) {
      this.navLinks.innerHTML = baseLinks + `
        <a href="#/my-loans" data-link>Миний зээл</a>
        <div class="auth-mobile">
          <a href="#/profile" data-link class="btn btn-ghost btn-sm">Профайл</a>
          <a href="#/dashboard" data-link class="btn btn-secondary btn-sm">Dashboard</a>
          <button id="mobileLogoutBtn" class="btn btn-primary btn-sm" type="button">Гарах</button>
        </div>
      `;
    } else {
      this.navLinks.innerHTML = baseLinks + `
        <div class="auth-mobile">
          <a href="#/login" data-link class="btn btn-secondary btn-sm">Нэвтрэх</a>
          <a href="#/register" data-link class="btn btn-primary btn-sm">Бүртгүүлэх</a>
        </div>
      `;
    }
  }

  updateAuthButtons() {
    if (!this.authButtons) return;

    const isAuthenticated = TokenManager.isAuthenticated();

    if (!isAuthenticated) {
      this.authButtons.innerHTML = `
        <a href="#/login" data-link class="btn btn-ghost btn-sm">Нэвтрэх</a>
        <a href="#/register" data-link class="btn btn-primary btn-sm">Бүртгүүлэх</a>
      `;
      return;
    }

    const user = UserManager.getUser();
    const userName =
      user ? (user.first_name || user.firstName || user.email?.split('@')[0] || 'Хэрэглэгч') : 'Хэрэглэгч';
    const userEmail = user ? (user.email || '') : '';
    const initials = (userName || 'Х').charAt(0).toUpperCase();

    this.authButtons.innerHTML = `
      <a href="#/dashboard" data-link class="btn btn-dashboard">Dashboard</a>

      <div class="profile-dropdown" id="profileDropdown">
        <button class="profile-trigger" id="profileTrigger" type="button">
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
            <a href="#/profile" data-link class="profile-menu-item">Профайл</a>
            <a href="#/profile?tab=wallet" data-link class="profile-menu-item">Wallet</a>
            <a href="#/profile?tab=security" data-link class="profile-menu-item">Нууцлал</a>
            <a href="#/profile?tab=preferences" data-link class="profile-menu-item">Тохиргоо</a>

            <div class="profile-menu-divider"></div>

            <button class="profile-menu-item logout" id="logoutBtn" type="button">Гарах</button>
          </div>
        </div>
      </div>
    `;

    this.setupProfileDropdown();
  }

  /* --------------------
     MOBILE MENU
  --------------------- */

  setupMobileMenu() {
    if (!this.toggle || !this.navLinks) {
      console.error('Mobile menu elements not found!');
      return;
    }

    // safety: давхар add болохоос сэргийлж эхлээд remove
    this.toggle.removeEventListener('click', this._onToggleClick);
    this.toggle.addEventListener('click', this._onToggleClick);

    this.navLinks.removeEventListener('click', this._onNavLinksClick);
    this.navLinks.addEventListener('click', this._onNavLinksClick);

    document.removeEventListener('click', this._onDocClick);
    document.addEventListener('click', this._onDocClick);
  }

  _onToggleClick(e) {
    e.stopPropagation();

    const isActive = this.navLinks.classList.toggle('active');
    this.toggle.innerHTML = isActive ? '✕' : '☰';
    this.toggle.setAttribute('aria-expanded', String(isActive));
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  _onNavLinksClick(e) {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    // logout button in mobile area
    if (t.id === 'mobileLogoutBtn') {
      e.preventDefault();
      this.handleLogout();
      return;
    }

    // any link/button clicked => close
    if (t.closest('a') || t.closest('button')) {
      this.closeMobileMenu();
    }
  }

  _onDocClick(e) {
    const t = e.target;
    if (!(t instanceof Node)) return;

    // click outside nav closes mobile menu + dropdown
    if (this.nav && !this.nav.contains(t)) {
      this.closeMobileMenu();
      this.closeProfileDropdown();
    }
  }

  closeMobileMenu() {
    if (!this.navLinks || !this.toggle) return;
    this.navLinks.classList.remove('active');
    this.toggle.innerHTML = '☰';
    this.toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* --------------------
     ACTIVE LINKS
  --------------------- */

  setupActiveLinks() {
    this._applyActiveLinks();
    window.removeEventListener('hashchange', this._applyActiveLinks);
    window.addEventListener('hashchange', this._applyActiveLinks);
  }

  _applyActiveLinks() {
    const current = (location.hash || '#/').split('?')[0]; // "#/about"
    const links = document.querySelectorAll('a[data-link][href^="#/"]');

    links.forEach((a) => {
      const href = a.getAttribute('href');
      if (href === current) a.classList.add('active');
      else a.classList.remove('active');
    });
  }

  /* --------------------
     SCROLL EFFECT
  --------------------- */

  setupScrollEffect() {
    if (!this.nav) return;

    this._onScroll(); // initial
    window.removeEventListener('scroll', this._onScroll);
    window.addEventListener('scroll', this._onScroll, { passive: true });
  }

  _onScroll() {
    if (!this.nav) return;
    if (window.scrollY > 50) this.nav.classList.add('scrolled');
    else this.nav.classList.remove('scrolled');
  }

  /* --------------------
     PROFILE DROPDOWN
  --------------------- */

  setupProfileDropdown() {
    const profileDropdown = this.nav?.querySelector('#profileDropdown');
    const profileTrigger = this.nav?.querySelector('#profileTrigger');
    const logoutBtn = this.nav?.querySelector('#logoutBtn');

    if (!profileDropdown || !profileTrigger) return;

    // өмнөх listener-үүдийг цэвэрлэх (clone trick)
    const newTrigger = profileTrigger.cloneNode(true);
    profileTrigger.parentNode.replaceChild(newTrigger, profileTrigger);

    newTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });

    // logout
    if (logoutBtn) {
      const newLogout = logoutBtn.cloneNode(true);
      logoutBtn.parentNode.replaceChild(newLogout, logoutBtn);
      newLogout.addEventListener('click', () => this.handleLogout());
    }
  }

  closeProfileDropdown() {
    this.nav?.querySelector('#profileDropdown')?.classList.remove('active');
  }

  /* --------------------
     LOGOUT
  --------------------- */

  handleLogout() {
    if (!confirm('Гарахдаа итгэлтэй байна уу?')) return;

    // UI clean first
    this.closeMobileMenu();
    this.closeProfileDropdown();

    // SPA logout (main.js дээр __spaLogout байвал тэрийг ашиглана)
    if (typeof window.__spaLogout === 'function') {
      window.__spaLogout();
      return;
    }

    // fallback
    TokenManager.removeToken();
    UserManager.removeUser();
    location.hash = '#/login';
  }


  static render() {
    return `
      <nav class="nav">
        <div class="brand">OmniCredit</div>
        <div class="nav-links"></div>
        <div class="auth-buttons"></div>
        <button class="mobile-menu-toggle" aria-label="Toggle menu" type="button">☰</button>
      </nav>
    `;
  }
}

export function initNavigation() {
  const nav = new Navigation();
  nav.init();
}
