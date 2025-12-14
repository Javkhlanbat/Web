// componenents/main.js (SPA - Hash router)

import { Navigation } from './navigation.component.js';
import { registerRoutes, initRouter, navigate, rerender } from './router.js';
import { TokenManager, UserManager } from './mock-api.component.js';

import { Footer } from './footer.component.js';

import { renderHome } from './pages/home.page.js';

import { renderLogin } from './pages/login.page.js';
import { renderRegister, afterRenderRegister } from './pages/register.js';

import { renderDashboard, afterRenderDashboard } from './pages/dashboard.page.js';
import { renderCalculator, afterRenderCalculator } from './pages/calculator.page.js';
import { renderFaq } from './pages/faq.page.js';

import { renderMyLoans, afterRenderMyLoans } from './pages/myloans.js';
import { renderPayment, afterRenderPayment } from './pages/payment.js';
import { renderPaymentHistory, afterRenderPaymentHistory } from './pages/paymenthistory.js';

import { renderPurchaseLoan } from './pages/purchaseloan.js';
import { renderApplication, afterRenderApplication } from './pages/zeeliinhuselt.js';

import { renderAbout, afterRenderAbout } from './pages/about.page.js';
import { renderAdmin } from './pages/admin.page.js';

/* --------------------
   NAV shell
--------------------- */
const navMount = document.getElementById('navMount');
if (navMount) navMount.innerHTML = Navigation.render();
const footerMount = document.getElementById('footerMount');
if (footerMount) footerMount.innerHTML = Footer.render();


const nav = new Navigation();
nav.init();

function refreshNav() {
  try {
    nav.updateNavLinks?.();
    nav.updateAuthButtons?.();
  } catch (_) {}
}

/* --------------------
   helpers
--------------------- */
function withAfter(renderFn, afterFn) {
  return (mountEl, ctx) => {
    renderFn(mountEl, ctx);
    if (typeof afterFn === 'function') requestAnimationFrame(() => afterFn(ctx));
  };
}

function renderReturnsString(renderFn, afterFn) {
  return (mountEl, ctx) => {
    mountEl.innerHTML = renderFn(ctx);
    if (typeof afterFn === 'function') requestAnimationFrame(() => afterFn(ctx));
  };
}

/* --------------------
   routes
--------------------- */
registerRoutes({
  '/': { render: (app, ctx) => renderHome(app, ctx), auth: false },

  '/about': { render: renderReturnsString(renderAbout, afterRenderAbout), auth: false },
  '/faq': { render: withAfter(renderFaq), auth: false },
  '/calculator': { render: withAfter(renderCalculator, afterRenderCalculator), auth: false },

  '/purchase-loan': { render: withAfter(renderPurchaseLoan), auth: false },
  '/application': { render: withAfter(renderApplication, afterRenderApplication), auth: true },

  '/login': { render: withAfter(renderLogin), auth: false },
  '/register': { render: withAfter(renderRegister, afterRenderRegister), auth: false },

  '/dashboard': { render: withAfter(renderDashboard, afterRenderDashboard), auth: true },
  '/my-loans': { render: withAfter(renderMyLoans, afterRenderMyLoans), auth: true },
  '/payment': { render: withAfter(renderPayment, afterRenderPayment), auth: true },
  '/payment-history': { render: withAfter(renderPaymentHistory, afterRenderPaymentHistory), auth: true },

  '/admin': { render: withAfter(renderAdmin), auth: true, admin: true },
});


initRouter({ mount: '#app' });


window.__spaLogout = () => {
  if (!confirm('Гарахдаа итгэлтэй байна уу?')) return;

  TokenManager.removeToken();
  UserManager.removeUser();

  refreshNav();
  rerender();
  navigate('#/login', { replace: true });
};

window.addEventListener('hashchange', refreshNav);
