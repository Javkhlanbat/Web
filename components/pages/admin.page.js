
import { UserManager } from '../mock-api.component.js';

export function renderAdmin(app) {
  const u = UserManager.getUser();
  app.innerHTML = `
    <div class="container" style="padding: 32px 0;">
      <div class="card" style="padding: 24px;">
        <h1>Admin</h1>
        <p style="color:var(--text-muted);">Admin user: <b>${u?.email || '—'}</b></p>
        <div style="margin-top:16px; display:flex; gap:12px; flex-wrap:wrap;">
          <a href="#/dashboard" data-link class="btn btn-secondary">Dashboard</a>
          <button class="btn btn-primary" id="btnLogout">Гарах</button>
        </div>
      </div>
    </div>
  `;
  app.querySelector('#btnLogout').addEventListener('click', () => window.__spaLogout?.());
}
