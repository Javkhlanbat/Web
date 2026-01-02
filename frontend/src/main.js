
import router from './router.js';
import { TokenManager, UserManager } from './services/api.js';

import './components/app-nav.js';
import './components/app-footer.js';
import './components/loan-card.js';
import './components/theme-toggle.js';

import './pages/home-page.js';
import './pages/login-page.js';
import './pages/register-page.js';
import './pages/dashboard-page.js';
import './pages/profile-page.js';
import './pages/loans-page.js';
import './pages/payment-page.js';
import './pages/payment-history-page.js';
import './pages/loan-calculator-page.js';
import './pages/loan-application-page.js';
import './pages/wallet-history-page.js';
import './pages/admin-page.js';
import './pages/faq-page.js';
import './pages/about-page.js';
import './pages/not-found-page.js';

const routes = [
        { path: '/', component: 'home-page', meta: { public: true } },
    { path: '/login', component: 'login-page', meta: { public: true, guest: true } },
    { path: '/register', component: 'register-page', meta: { public: true, guest: true } },
    { path: '/faq', component: 'faq-page', meta: { public: true } },
    { path: '/aboutus', component: 'about-page', meta: { public: true } },
    { path: '/zeelhuudas', component: 'loan-calculator-page', meta: { public: true } },

        { path: '/dashboard', component: 'dashboard-page', meta: { requiresAuth: true } },
    { path: '/profile', component: 'profile-page', meta: { requiresAuth: true } },
    { path: '/my-loans', component: 'loans-page', meta: { requiresAuth: true } },
    { path: '/payment', component: 'payment-page', meta: { requiresAuth: true } },
    { path: '/paymenthistory', component: 'payment-history-page', meta: { requiresAuth: true } },
    { path: '/application', component: 'loan-application-page', meta: { requiresAuth: true } },
    { path: '/application-new', component: 'loan-application-page', meta: { requiresAuth: true } },
    { path: '/wallet-history', component: 'wallet-history-page', meta: { requiresAuth: true } },

        { path: '/admin', component: 'admin-page', meta: { requiresAuth: true, requiresAdmin: true } },

        { path: '/404', component: 'not-found-page', meta: { public: true } },
];

router.beforeEach((to, from, next) => {
    const isAuthenticated = TokenManager.isAuthenticated();
    const user = UserManager.getUser();

        if (to.meta.requiresAuth && !isAuthenticated) {
        console.log('Route requires authentication, redirecting to login');
        next('/login');
        return;
    }

        if (to.meta.requiresAdmin) {
        if (!user || user.role !== 'admin') {
            console.log('Route requires admin role, redirecting to dashboard');
            next('/dashboard');
            return;
        }
    }

        if (to.meta.guest && isAuthenticated) {
        console.log('User already authenticated, redirecting to dashboard');
        next('/dashboard');
        return;
    }

        next();
});

function initApp() {
    console.log('🚀 OmniCredit Web Components Application Started');

        router.addRoutes(routes);

        initTheme();

        removeLoadingScreen();
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function removeLoadingScreen() {
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
        setTimeout(() => {
            loadingContainer.style.opacity = '0';
            setTimeout(() => {
                loadingContainer.remove();
            }, 300);
        }, 500);
    }
}

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
