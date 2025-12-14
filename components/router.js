
import { TokenManager, UserManager } from './mock-api.component.js'; 

const routes = new Map();
let mountEl = null;

export function addRoute(path, cfg) {
  const key = norm(path);
  if (!cfg || typeof cfg.render !== 'function') throw new Error(`Route ${key} render байх ёстой`);
  routes.set(key, {
    render: cfg.render,
    auth: !!cfg.auth,
    admin: !!cfg.admin,
  });
}

export function registerRoutes(obj) {
  Object.entries(obj).forEach(([path, cfg]) => addRoute(path, cfg));
}

export function initRouter({ mount = '#app' } = {}) {
  mountEl = document.querySelector(mount);
  if (!mountEl) throw new Error(`Mount олдсонгүй: ${mount}`);

  // <a href="#/x" data-link> click interception
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if (!a) return;

    const href = a.getAttribute('href') || '';
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    e.preventDefault();
    navigate(href);
  });

  window.addEventListener('hashchange', () => renderCurrent());
  renderCurrent();
}

export function navigate(to, { replace = false } = {}) {
  const hash = to.startsWith('#') ? to : `#${norm(to)}`;
  if (replace) {
    const base = location.href.split('#')[0];
    location.replace(base + hash);
  } else {
    location.hash = hash;
  }
}

export function rerender() {
  renderCurrent();
}

function renderCurrent() {
  const { path, query } = getHash();

  const route = routes.get(path);
  if (!route) {
    mountEl.innerHTML = notFound(path);
    return;
  }

  // Auth guard
  if (route.auth && !TokenManager.isAuthenticated()) {
    navigate(`#/login?redirect=${encodeURIComponent(path)}`, { replace: true });
    return;
  }

  // Admin guard
  if (route.admin) {
    const user = UserManager.getUser();
    const isAdmin = !!(user && (user.is_admin || user.isAdmin));
    if (!isAdmin) {
      navigate('#/dashboard', { replace: true });
      return;
    }
  }

  // Render
  try {
    const r = route.render(mountEl, { path, query });
    if (r && typeof r.then === 'function') r.catch(err => showErr(err));
  } catch (err) {
    showErr(err);
  }

  window.scrollTo({ top: 0, behavior: 'instant' });
}

function getHash() {
  const raw = location.hash || '#/';
  const h = raw.replace(/^#/, '');          
  const [p, qs] = h.split('?');
  const path = norm(p || '/');
  const query = new URLSearchParams(qs || '');
  return { path, query };
}

function norm(p) {
  let s = String(p || '').trim();
  if (!s.startsWith('/')) s = '/' + s;
  if (s.length > 1) s = s.replace(/\/+$/, '');
  return s;
}

function notFound(path) {
  return `
    <div class="container" style="padding:48px 0;">
      <div class="card" style="padding:32px; text-align:center;">
        <h2>404 — Олдсонгүй</h2>
        <p style="color:var(--text-muted);">Хуудас байхгүй: <b>${escapeHtml(path)}</b></p>
        <a href="#/" data-link class="btn btn-primary">Нүүр</a>
      </div>
    </div>
  `;
}

function showErr(err) {
  console.error(err);
  mountEl.innerHTML = `
    <div class="container" style="padding:48px 0;">
      <div class="card" style="padding:32px;">
        <h2>Алдаа</h2>
        <p style="color:var(--text-muted);">${escapeHtml(err?.message || String(err))}</p>
        <a href="#/" data-link class="btn btn-secondary">Нүүр</a>
      </div>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}
