
import { LoansAPI, PromoCodeAPI, AuthAPI } from '../mock-api.component.js';
import { Utils } from '../utils.component.js';
import { navigate } from '../router.js';

export function renderAdmin(app, ctx = {}) {
  app.innerHTML = `
    <div class="container">
      <nav class="nav">
        <div class="brand">OmniCredit Admin</div>
        <div class="nav-links">
          <a href="#/home">Нүүр</a>
          <a href="#/dashboard">Dashboard</a>
          <a href="#/admin" class="active">Admin</a>
        </div>
        <div class="auth-buttons">
          <a href="#/profile" class="btn btn-ghost btn-sm">Профайл</a>
          <button class="btn btn-primary btn-sm" data-action="logout">Гарах</button>
        </div>
        <button class="mobile-menu-toggle">☰</button>
      </nav>

      <div class="admin-header">
        <h1>Admin Dashboard</h1>
        <p class="admin-subtitle">Системийн удирдлагын самбар</p>
      </div>

      <div class="stats-grid">
        <div class="admin-stats-card"><p>Нийт хэрэглэгч</p><h3 id="totalUsers">0</h3></div>
        <div class="admin-stats-card"><p>Хүлээгдэж буй хүсэлт</p><h3 id="pendingLoans">0</h3></div>
        <div class="admin-stats-card"><p>Идэвхтэй зээл</p><h3 id="activeLoans">0</h3></div>
        <div class="admin-stats-card"><p>Нийт зээлийн дүн</p><h3 id="totalLoanAmount">₮0</h3></div>
      </div>

      <div class="admin-tabs" id="adminTabs">
        <button class="admin-tab active" data-tab="loans">Зээлийн хүсэлт</button>
        <button class="admin-tab" data-tab="users">Хэрэглэгчид</button>
        <button class="admin-tab" data-tab="promo">Компани & Код</button>
        <button class="admin-tab" data-tab="payments">Төлбөр</button>
        <button class="admin-tab" data-tab="settings">Тохиргоо</button>
      </div>

      <!-- Loans -->
      <section id="loans-tab" class="tab-content active">
        <div class="search-box">
          <input type="text" placeholder="Хайх (ID, нэр, дүн)..." id="loanSearch">
          <select class="btn btn-secondary" id="loanStatusFilter">
            <option value="all">Бүх төлөв</option>
            <option value="pending">Хүлээгдэж буй</option>
            <option value="approved">Зөвшөөрөгдсөн</option>
            <option value="disbursed">Олгогдсон</option>
            <option value="rejected">Татгалзсан</option>
            <option value="active">Идэвхтэй</option>
          </select>
        </div>

        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Хэрэглэгч</th><th>Дүн</th><th>Хугацаа</th><th>Төлөв</th><th>Огноо</th><th>Үйлдэл</th>
              </tr>
            </thead>
            <tbody id="loansTableBody">
              <tr><td colspan="7" class="table-loading">Ачааллаж байна...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Users -->
      <section id="users-tab" class="tab-content">
        <div class="search-box">
          <input type="text" placeholder="Нэр, и-мэйл, утас, регистрээр хайх..." id="userSearch">
        </div>

        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Нэр</th><th>И-мэйл</th><th>Утас</th><th>Регистр</th><th>Бүртгэсэн огноо</th><th>Үйлдэл</th>
              </tr>
            </thead>
            <tbody id="usersTableBody">
              <tr><td colspan="7" class="table-loading">Ачааллаж байна...</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Promo -->
      <section id="promo-tab" class="tab-content">
        <div class="promo-grid">
          <div>
            <div class="promo-header">
              <h3>Компаниуд</h3>
              <button class="btn btn-primary btn-sm" data-action="openCreateCompany">+ Компани нэмэх</button>
            </div>
            <div class="data-table">
              <table>
                <thead><tr><th>ID</th><th>Нэр</th><th>Төлөв</th><th>Үйлдэл</th></tr></thead>
                <tbody id="companiesTableBody">
                  <tr><td colspan="4" class="table-loading">Ачааллаж байна...</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div class="promo-header">
              <h3>Нэмэгдлийн кодууд</h3>
              <button class="btn btn-primary btn-sm" data-action="openCreatePromoCode">+ Код үүсгэх</button>
            </div>
            <div class="data-table">
              <table>
                <thead><tr><th>Код</th><th>Компани</th><th>Хүү</th><th>Ашигласан</th><th>Үйлдэл</th></tr></thead>
                <tbody id="promoCodesTableBody">
                  <tr><td colspan="5" class="table-loading">Ачааллаж байна...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Payments -->
      <section id="payments-tab" class="tab-content">
        <div class="search-box">
          <input type="text" placeholder="Төлбөр хайх..." id="paymentSearch">
        </div>
        <div class="data-table">
          <table>
            <thead><tr><th>ID</th><th>Зээлийн ID</th><th>Хэрэглэгч</th><th>Дүн</th><th>Огноо</th><th>Төлөв</th></tr></thead>
            <tbody id="paymentsTableBody">
              <tr><td colspan="6" class="table-loading">Төлбөрийн түүх одоогоор байхгүй байна</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Settings -->
      <section id="settings-tab" class="tab-content">
        <div class="card">
          <div class="card-body">
            <h3>Системийн тохиргоо</h3>
            <p class="settings-hint">Зээлийн үндсэн тохиргоо</p>

            <div class="settings-field">
              <label>Хүүгийн хувь (%)</label>
              <input id="settingInterest" type="number" class="btn btn-secondary" placeholder="1.5" value="1.5">
            </div>

            <div class="settings-field">
              <label>Хамгийн их зээлийн дүн (₮)</label>
              <input id="settingMaxAmount" type="number" class="btn btn-secondary" placeholder="10000000" value="10000000">
            </div>

            <div class="settings-field">
              <label>Хамгийн бага зээлийн дүн (₮)</label>
              <input id="settingMinAmount" type="number" class="btn btn-secondary" placeholder="100000" value="100000">
            </div>

            <button class="btn btn-primary btn-lg" data-action="saveSettings">Хадгалах</button>
          </div>
        </div>
      </section>
    </div>

    <!-- User Profile Modal -->
    <div id="userProfileModal" class="modal-overlay" data-action="closeUserModal">
      <div class="modal-content" data-stop>
        <div class="modal-header">
          <h2>Хэрэглэгчийн мэдээлэл</h2>
          <button class="modal-close" data-action="closeUserModal">&times;</button>
        </div>
        <div class="modal-body" id="userProfileModalBody"></div>
      </div>
    </div>

    <!-- Create Company Modal -->
    <div id="createCompanyModal" class="modal-overlay" data-action="closeCompanyModal">
      <div class="modal-content" data-stop style="max-width: 500px;">
        <div class="modal-header">
          <h2>Шинэ компани нэмэх</h2>
          <button class="modal-close" data-action="closeCompanyModal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="createCompanyForm">
            <div class="form-field">
              <label>Компанийн нэр *</label>
              <input type="text" id="companyName" required>
            </div>
            <div class="form-field">
              <label>Тайлбар</label>
              <textarea id="companyDescription" rows="3"></textarea>
            </div>
            <div class="form-field">
              <label>И-мэйл</label>
              <input type="email" id="companyEmail">
            </div>
            <div class="form-field">
              <label>Утас</label>
              <input type="text" id="companyPhone">
            </div>
            <button type="submit" class="btn btn-primary btn-lg w-100">Компани үүсгэх</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Create Promo Code Modal -->
    <div id="createPromoCodeModal" class="modal-overlay" data-action="closePromoCodeModal">
      <div class="modal-content" data-stop style="max-width: 500px;">
        <div class="modal-header">
          <h2>Шинэ нэмэгдлийн код үүсгэх</h2>
          <button class="modal-close" data-action="closePromoCodeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form id="createPromoCodeForm">
            <div class="form-field">
              <label>Компани *</label>
              <select id="promoCompanyId" required>
                <option value="">-- Компани сонгох --</option>
              </select>
            </div>
            <div class="form-field">
              <label>Код (хоосон үлдээвэл автоматаар үүснэ)</label>
              <input type="text" id="promoCode" placeholder="жнь: OMNI-ABC123" style="text-transform: uppercase;">
            </div>
            <div class="form-field">
              <label>Хүү (%)</label>
              <input type="number" id="promoInterestRate" step="0.1" min="0" max="10" value="2">
            </div>
            <div class="form-field">
              <label>Дээд зээлийн дүн (₮)</label>
              <input type="number" id="promoMaxAmount" min="0" placeholder="Хязгааргүй">
            </div>
            <div class="form-field">
              <label>Ашиглах дээд тоо</label>
              <input type="number" id="promoMaxUses" min="0" placeholder="Хязгааргүй">
            </div>
            <div class="form-field">
              <label>Хүчинтэй огноо</label>
              <input type="date" id="promoExpiresAt">
            </div>
            <div class="form-field">
              <label>Тайлбар</label>
              <textarea id="promoDescription" rows="2"></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-lg w-100">Код үүсгэх</button>
          </form>
        </div>
      </div>
    </div>
  `;

  window.__adminCtx = ctx;
}

export function afterRenderAdmin() {
  // listener давхардахгүй
  if (window.__adminAbort) window.__adminAbort.abort();
  const ac = new AbortController();
  window.__adminAbort = ac;
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn, { signal: ac.signal });

  // ---- state ----
  const state = {
    allLoans: [],
    allUsers: [],
    allCompanies: [],
    allPromoCodes: [],
    allPayments: [],
    currentTab: 'loans',
  };

  // ---- dom ----
  const tabs = document.getElementById('adminTabs');
  const loanSearch = document.getElementById('loanSearch');
  const loanStatusFilter = document.getElementById('loanStatusFilter');
  const userSearch = document.getElementById('userSearch');
  const paymentSearch = document.getElementById('paymentSearch');

  const loansTableBody = document.getElementById('loansTableBody');
  const usersTableBody = document.getElementById('usersTableBody');
  const companiesTableBody = document.getElementById('companiesTableBody');
  const promoCodesTableBody = document.getElementById('promoCodesTableBody');
  const paymentsTableBody = document.getElementById('paymentsTableBody');

  const userProfileModal = document.getElementById('userProfileModal');
  const createCompanyModal = document.getElementById('createCompanyModal');
  const createPromoCodeModal = document.getElementById('createPromoCodeModal');

  const createCompanyForm = document.getElementById('createCompanyForm');
  const createPromoCodeForm = document.getElementById('createPromoCodeForm');

  if (!tabs || !loansTableBody) return;

  // ---- helpers ----
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const setBodyScrollLocked = (locked) => (document.body.style.overflow = locked ? 'hidden' : '');

  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('active');
    setBodyScrollLocked(true);
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('active');
    setBodyScrollLocked(false);
  }

  function fmtMoney(n) {
    const v = Number(n || 0);
    return `₮${v.toLocaleString()}`;
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function statusTextOf(status) {
    return ({
      pending: 'Хүлээгдэж буй',
      approved: 'Зөвшөөрөгдсөн',
      rejected: 'Татгалзсан',
      active: 'Идэвхтэй',
      disbursed: 'Олгогдсон'
    }[status] || status);
  }

  function switchTab(tabName) {
    state.currentTab = tabName;
    $$('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    $$('.tab-content').forEach(c => c.classList.toggle('active', c.id === `${tabName}-tab`));

    if (tabName === 'loans') loadLoans();
    else if (tabName === 'users') loadUsers();
    else if (tabName === 'promo') loadPromoData();
    else if (tabName === 'payments') loadPayments();
  }

  // ---- statistics ----
  async function loadStatistics() {
    try {
      const loansData = await LoansAPI.getAllLoans();
      const loans = loansData.loans || [];

      const usersRes = await AuthAPI.getAdminUsers()
      const users = usersRes.users || [];

      const pending = loans.filter(l => l.status === 'pending').length;
      const active = loans.filter(l => l.status === 'active' || l.status === 'approved').length;
      const totalAmount = loans.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

      document.getElementById('totalUsers').textContent = users.length;
      document.getElementById('pendingLoans').textContent = pending;
      document.getElementById('activeLoans').textContent = active;
      document.getElementById('totalLoanAmount').textContent = fmtMoney(totalAmount);
    } catch (e) {
      console.error(e);
    }
  }

  // ---- loans ----
  async function loadLoans() {
    try {
      const data = await LoansAPI.getAllLoans();
      state.allLoans = data.loans || [];
      displayLoans(state.allLoans);
      filterLoans(); // current filter-ээ хадгалж харуулна
    } catch (e) {
      console.error(e);
      loansTableBody.innerHTML = `<tr><td colspan="7" class="table-loading" style="color:#EF4444;">Алдаа: ${escapeHtml(e.message)}</td></tr>`;
    }
  }

  function displayLoans(loans) {
    if (!loans || loans.length === 0) {
      loansTableBody.innerHTML = `<tr><td colspan="7" class="table-loading">Зээлийн хүсэлт байхгүй байна</td></tr>`;
      return;
    }

    loansTableBody.innerHTML = loans.map(loan => {
      const date = loan.created_at ? new Date(loan.created_at).toLocaleDateString('mn-MN') : '-';
      const amount = parseFloat(loan.amount) || 0;

      const actions = (loan.status === 'pending')
        ? `
          <button class="btn btn-primary btn-icon" data-action="approveLoan" data-loan-id="${loan.id}">Зөвшөөрөх</button>
          <button class="btn btn-secondary btn-icon" data-action="rejectLoan" data-loan-id="${loan.id}">Татгалзах</button>
        `
        : `<button class="btn btn-secondary btn-icon" data-action="viewLoan" data-loan-id="${loan.id}">Харах</button>`;

      return `
        <tr>
          <td>#${loan.id}</td>
          <td>${escapeHtml(`${loan.first_name || ''} ${loan.last_name || ''}`.trim())} (${escapeHtml(loan.email || loan.user_id)})</td>
          <td style="font-weight:700;">${fmtMoney(amount)}</td>
          <td>${escapeHtml(loan.term_months)} сар</td>
          <td><span class="status-badge status-${escapeHtml(loan.status)}">${escapeHtml(statusTextOf(loan.status))}</span></td>
          <td>${escapeHtml(date)}</td>
          <td><div class="action-buttons">${actions}</div></td>
        </tr>
      `;
    }).join('');
  }

  function filterLoans() {
    const term = (loanSearch?.value || '').toLowerCase().trim();
    const status = loanStatusFilter?.value || 'all';

    let filtered = [...state.allLoans];
    if (status !== 'all') filtered = filtered.filter(l => l.status === status);

    if (term) {
      filtered = filtered.filter(l => {
        const hay = [
          l.id,
          l.user_id,
          l.email,
          l.first_name,
          l.last_name,
          l.amount,
          l.term_months,
          l.status
        ].map(x => String(x ?? '').toLowerCase()).join(' ');
        return hay.includes(term);
      });
    }

    displayLoans(filtered);
  }

  async function approveLoan(loanId) {
    if (!confirm('Энэ зээлийг зөвшөөрөх үү?\n\nЗөвшөөрсний дараа хэрэглэгчийн wallet-д шууд мөнгө орно.')) return;
    try {
      const result = await LoansAPI.updateLoanStatus(loanId, 'approved');
      Utils?.showToast
        ? Utils.showToast('Зээл зөвшөөрөгдлөө', 'success')
        : alert('Зээл зөвшөөрөгдлөө');
      console.log('approve result:', result);
      await loadLoans();
      await loadStatistics();
    } catch (e) {
      console.error(e);
      Utils?.showToast ? Utils.showToast('Алдаа: ' + e.message, 'error') : alert('Алдаа: ' + e.message);
    }
  }

  async function rejectLoan(loanId) {
    if (!confirm('Энэ зээлийг татгалзах уу?')) return;
    try {
      await LoansAPI.updateLoanStatus(loanId, 'rejected');
      Utils?.showToast ? Utils.showToast('Зээл татгалзагдлаа', 'success') : alert('Зээл татгалзагдлаа');
      await loadLoans();
      await loadStatistics();
    } catch (e) {
      console.error(e);
      Utils?.showToast ? Utils.showToast('Алдаа: ' + e.message, 'error') : alert('Алдаа: ' + e.message);
    }
  }

  function viewLoan(loanId) {
    alert(`Зээлийн дэлгэрэнгүй #${loanId}\n\n(Энд modal эсвэл route нэмж болно)`);
  }

  // ---- users ----
  async function loadUsers() {
    try {
      const data = await api.get('/auth/admin/users');
      state.allUsers = data.users || [];
      displayUsers(state.allUsers);
      filterUsers();
    } catch (e) {
      console.error(e);
      usersTableBody.innerHTML = `<tr><td colspan="7" class="table-loading" style="color:#EF4444;">Алдаа: ${escapeHtml(e.message)}</td></tr>`;
    }
  }

  function displayUsers(users) {
    if (!users || users.length === 0) {
      usersTableBody.innerHTML = `<tr><td colspan="7" class="table-loading">Хэрэглэгч байхгүй байна</td></tr>`;
      return;
    }

    usersTableBody.innerHTML = users.map(u => {
      const date = u.created_at ? new Date(u.created_at).toLocaleDateString('mn-MN') : '-';
      const fullName = `${u.last_name || ''} ${u.first_name || ''}`.trim() || '-';
      const badge = u.is_admin ? `<span style="background:#667eea;color:#fff;padding:2px 8px;border-radius:4px;font-size:10px;margin-left:8px;">ADMIN</span>` : '';

      return `
        <tr>
          <td>#${u.id}</td>
          <td style="font-weight:600;">${escapeHtml(fullName)} ${badge}</td>
          <td>${escapeHtml(u.email)}</td>
          <td>${escapeHtml(u.phone || '-')}</td>
          <td>${escapeHtml(u.register_number || '-')}</td>
          <td>${escapeHtml(date)}</td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-secondary btn-icon" data-action="viewUser" data-user-id="${u.id}">Profile</button>
              <button class="btn btn-secondary btn-icon" style="background:#EF4444;border-color:#EF4444;" data-action="deleteUser" data-user-id="${u.id}" data-user-name="${escapeHtml(fullName)}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function filterUsers() {
    const term = (userSearch?.value || '').toLowerCase().trim();
    if (!term) return displayUsers(state.allUsers);

    const filtered = state.allUsers.filter(u => {
      const hay = [
        u.id, u.email, u.phone, u.register_number, u.first_name, u.last_name
      ].map(x => String(x ?? '').toLowerCase()).join(' ');
      return hay.includes(term);
    });

    displayUsers(filtered);
  }

  async function viewUser(userId) {
    const modalBody = document.getElementById('userProfileModalBody');
    modalBody.innerHTML = `<p style="text-align:center;padding:40px;">Ачааллаж байна...</p>`;
    openModal('userProfileModal');

    try {
      const res = await AuthAPI.getAdminUserDetails(userId);
      const u = res.user;

      if (!u) {
        modalBody.innerHTML = `<p style="text-align:center;padding:40px;color:#EF4444;">Хэрэглэгч олдсонгүй</p>`;
        return;
      }

      const fullName = `${u.last_name || ''} ${u.first_name || ''}`.trim() || '-';
      const created = u.created_at ? new Date(u.created_at).toLocaleString('mn-MN') : '-';

      modalBody.innerHTML = `
        <div class="user-info-grid">
          <div class="user-info-item"><label>Бүтэн нэр</label><span>${escapeHtml(fullName)}</span></div>
          <div class="user-info-item"><label>И-мэйл</label><span>${escapeHtml(u.email || '-')}</span></div>
          <div class="user-info-item"><label>Утас</label><span>${escapeHtml(u.phone || '-')}</span></div>
          <div class="user-info-item"><label>Регистр</label><span>${escapeHtml(u.register_number || '-')}</span></div>
          <div class="user-info-item"><label>Бүртгүүлсэн огноо</label><span>${escapeHtml(created)}</span></div>
          <div class="user-info-item"><label>Админ эрх</label><span>${u.is_admin ? 'Тийм' : 'Үгүй'}</span></div>
        </div>

        <div class="id-images-section">
          <h3>Иргэний үнэмлэхний зурагнууд</h3>
          <div class="id-images-grid">
            <div class="id-image-card">
              <h4>Урд тал</h4>
              ${u.id_front
                ? `<img src="${escapeHtml(u.id_front)}" alt="ID Front" data-action="openImage" data-src="${escapeHtml(u.id_front)}" style="cursor:pointer;" title="Томруулахын тулд дарна уу">`
                : `<div class="no-image">Зураг байхгүй</div>`}
            </div>
            <div class="id-image-card">
              <h4>Ард тал</h4>
              ${u.id_back
                ? `<img src="${escapeHtml(u.id_back)}" alt="ID Back" data-action="openImage" data-src="${escapeHtml(u.id_back)}" style="cursor:pointer;" title="Томруулахын тулд дарна уу">`
                : `<div class="no-image">Зураг байхгүй</div>`}
            </div>
          </div>
        </div>
      `;
    } catch (e) {
      console.error(e);
      modalBody.innerHTML = `<p style="text-align:center;padding:40px;color:#EF4444;">Алдаа: ${escapeHtml(e.message)}</p>`;
    }
  }

  async function deleteUser(userId, userName) {
    if (!confirm(`Та "${userName}" хэрэглэгчийг устгахдаа итгэлтэй байна уу?\n\nЭнэ үйлдлийг буцаах боломжгүй!`)) return;

    try {
      await api.delete(`/auth/admin/users/${userId}`);
      Utils?.showToast ? Utils.showToast('Хэрэглэгч устгагдлаа', 'success') : alert('Хэрэглэгч устгагдлаа');
      await loadUsers();
      await loadStatistics();
    } catch (e) {
      console.error(e);
      Utils?.showToast ? Utils.showToast('Алдаа: ' + e.message, 'error') : alert('Алдаа: ' + e.message);
    }
  }

  // ---- promo (companies + codes) ----
  async function loadCompanies() {
    try {
      const data = await PromoCodeAPI.getAllCompanies();
      state.allCompanies = data.companies || [];
      displayCompanies(state.allCompanies);
      updateCompanySelect();
    } catch (e) {
      console.error(e);
      companiesTableBody.innerHTML = `<tr><td colspan="4" class="table-loading" style="color:#EF4444;">Алдаа: ${escapeHtml(e.message)}</td></tr>`;
    }
  }

  function displayCompanies(companies) {
    if (!companies || companies.length === 0) {
      companiesTableBody.innerHTML = `<tr><td colspan="4" class="table-loading">Компани байхгүй байна</td></tr>`;
      return;
    }

    companiesTableBody.innerHTML = companies.map(c => `
      <tr>
        <td>#${c.id}</td>
        <td style="font-weight:600;">${escapeHtml(c.name)}</td>
        <td>
          <span class="status-badge ${c.is_active ? 'status-approved' : 'status-rejected'}">
            ${c.is_active ? 'Идэвхтэй' : 'Идэвхгүй'}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-secondary btn-icon"
              data-action="toggleCompany"
              data-company-id="${c.id}"
              data-new-status="${c.is_active ? '0' : '1'}">
              ${c.is_active ? 'Идэвхгүй' : 'Идэвхжүүлэх'}
            </button>
            <button class="btn btn-secondary btn-icon" style="background:#EF4444;border-color:#EF4444;"
              data-action="deleteCompany"
              data-company-id="${c.id}">
              Устгах
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function updateCompanySelect() {
    const select = document.getElementById('promoCompanyId');
    if (!select) return;
    const options = state.allCompanies
      .filter(c => c.is_active)
      .map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`)
      .join('');
    select.innerHTML = `<option value="">-- Компани сонгох --</option>${options}`;
  }

  async function loadPromoCodes() {
    try {
      const data = await PromoCodeAPI.getAllPromoCodes();
      state.allPromoCodes = data.promoCodes || [];
      displayPromoCodes(state.allPromoCodes);
    } catch (e) {
      console.error(e);
      promoCodesTableBody.innerHTML = `<tr><td colspan="5" class="table-loading" style="color:#EF4444;">Алдаа: ${escapeHtml(e.message)}</td></tr>`;
    }
  }

  function displayPromoCodes(codes) {
    if (!codes || codes.length === 0) {
      promoCodesTableBody.innerHTML = `<tr><td colspan="5" class="table-loading">Нэмэгдлийн код байхгүй байна</td></tr>`;
      return;
    }

    promoCodesTableBody.innerHTML = codes.map(code => `
      <tr>
        <td style="font-weight:700;font-family:monospace;color:#0ea5e9;">${escapeHtml(code.code)}</td>
        <td>${escapeHtml(code.company_name || '-')}</td>
        <td>${code.interest_rate_override !== null ? escapeHtml(code.interest_rate_override) + '%' : '-'}</td>
        <td>${escapeHtml(code.used_count || 0)}${code.max_uses ? '/' + escapeHtml(code.max_uses) : ''}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-secondary btn-icon" data-action="copyCode" data-code="${escapeHtml(code.code)}">Copy</button>
            <button class="btn btn-secondary btn-icon" style="background:#EF4444;border-color:#EF4444;"
              data-action="deletePromoCode" data-code-id="${code.id}">
              Устгах
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  async function createCompany() {
    const payload = {
      name: document.getElementById('companyName')?.value || '',
      description: document.getElementById('companyDescription')?.value || '',
      contact_email: document.getElementById('companyEmail')?.value || '',
      contact_phone: document.getElementById('companyPhone')?.value || '',
    };

    if (!payload.name.trim()) {
      Utils?.showToast ? Utils.showToast('Компанийн нэр шаардлагатай', 'error') : alert('Компанийн нэр шаардлагатай');
      return;
    }

    try {
      await PromoCodeAPI.createCompany(payload);
      Utils?.showToast ? Utils.showToast('Компани үүсгэгдлээ', 'success') : alert('Компани үүсгэгдлээ');
      closeModal('createCompanyModal');
      createCompanyForm?.reset();
      await loadCompanies();
    } catch (e) {
      console.error(e);
      Utils?.showToast ? Utils.showToast('Алдаа: ' + e.message, 'error') : alert('Алдаа: ' + e.message);
    }
  }

  async function toggleCompany(companyId, newStatus) {
    try {
      await PromoCodeAPI.updateCompany(companyId, { is_active: !!newStatus });
      Utils?.showToast ? Utils.showToast('Компанийн төлөв шинэчлэгдлээ', 'success') : alert('Компанийн төлөв шинэчлэгдлээ');
      await loadCompanies();
      await loadPromoCodes();
    } catch (e) {
      console.error(e);
      Utils?.showToast ? Utils.showToast('Алдаа: ' + e.message, 'error') : alert('Алдаа: ' + e.message);
    }
  }

  async function deleteCompany(companyId) {
    if (!confirm('Компанийг устгах уу? Түүнтэй холбоотой бүх код устана!')) return;
    try {
      await PromoCodeAPI.deleteCompany(companyId);
      Utils?.showToast ? Utils.showToast('Компани устгагдлаа', 'success') : alert('Компани устгагдлаа');
      await loadCompanies();
      await loadPromoCodes();
    } catch (e) {
      console.error(e);
      Utils?.showToast ? Utils.showToast('Алдаа: ' + e.message, 'error') : alert('Алдаа: ' + e.message);
    }
  }

  async function createPromoCode() {
    const expiresAt = document.getElementById('promoExpiresAt')?.value;

    const payload = {
      company_id: document.getElementById('promoCompanyId')?.value,
      code: (document.getElementById('promoCode')?.value || '').trim() || undefined,
      interest_rate_override: parseFloat(document.getElementById('promoInterestRate')?.value) || null,
      max_loan_amount: parseInt(document.getElementById('promoMaxAmount')?.value) || null,
      max_uses: parseInt(document.getElementById('promoMaxUses')?.value) || null,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      description: document.getElementById('promoDescription')?.value || ''
    };

    if (!payload.company_id) {
      Utils?.showToast ? Utils.showToast('Компани сонгоно уу', 'error') : alert('Компани сонгоно уу');
      return;
    }

    try {
      const res = await PromoCodeAPI.createPromoCode(payload);
      Utils?.showToast ? Utils.showToast(`Код үүсгэгдлээ: ${res?.promoCode?.code || ''}`, 'success') : alert('Код үүсгэгдлээ');
      closeModal('createPromoCodeModal');
      createPromoCodeForm?.reset();
      await loadPromoCodes();
    } catch (e) {
      console.error(e);
      Utils?.showToast ? Utils.showToast('Алдаа: ' + e.message, 'error') : alert('Алдаа: ' + e.message);
    }
  }

  async function deletePromoCode(codeId) {
    if (!confirm('Энэ кодыг устгах уу?')) return;
    try {
      await PromoCodeAPI.deletePromoCode(codeId);
      Utils?.showToast ? Utils.showToast('Код устгагдлаа', 'success') : alert('Код устгагдлаа');
      await loadPromoCodes();
    } catch (e) {
      console.error(e);
      Utils?.showToast ? Utils.showToast('Алдаа: ' + e.message, 'error') : alert('Алдаа: ' + e.message);
    }
  }

  function copyCode(code) {
    navigator.clipboard.writeText(code)
      .then(() => Utils?.showToast ? Utils.showToast(`"${code}" хуулагдлаа`, 'success') : alert('Хуулагдлаа'))
      .catch(() => Utils?.showToast ? Utils.showToast('Хуулахад алдаа гарлаа', 'error') : alert('Хуулахад алдаа'));
  }

  async function loadPromoData() {
    await loadCompanies();
    await loadPromoCodes();
  }

  // ---- payments (placeholder) ----
  function loadPayments() {
    paymentsTableBody.innerHTML = `<tr><td colspan="6" class="table-loading">Төлбөрийн түүх одоогоор байхгүй байна</td></tr>`;
  }
  function filterPayments() {
    // одоогоор API байхгүй тул placeholder
    loadPayments();
  }

  // ---- settings (placeholder) ----
  function saveSettings() {
    // хүсвэл localStorage эсвэл API руу хийж болно
    Utils?.showToast ? Utils.showToast('Тохиргоо хадгалагдлаа (placeholder)', 'success') : alert('Тохиргоо хадгалагдлаа');
  }

  // ---- events ----
  on(tabs, 'click', (e) => {
    const btn = e.target.closest('.admin-tab');
    if (!btn) return;
    switchTab(btn.dataset.tab);
  });

  on(loanSearch, 'input', filterLoans);
  on(loanStatusFilter, 'change', filterLoans);

  on(userSearch, 'input', filterUsers);

  on(paymentSearch, 'input', filterPayments);

  // modal overlay close (click outside)
  function modalOverlayHandler(e) {
    const overlay = e.target.closest('.modal-overlay');
    if (!overlay) return;
    if (e.target.closest('[data-stop]')) return; // modal-content дээр дарсан бол хаахгүй
    const action = overlay.dataset.action;
    if (action === 'closeUserModal') closeModal('userProfileModal');
    if (action === 'closeCompanyModal') closeModal('createCompanyModal');
    if (action === 'closePromoCodeModal') closeModal('createPromoCodeModal');
  }
  on(document, 'click', modalOverlayHandler);

  // global delegated actions
  on(document, 'click', async (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;

    const action = el.dataset.action;

    if (action === 'logout') {
      if (confirm('Гарахдаа итгэлтэй байна уу?')) {
        AuthAPI.logout();
        return;
      }
    }

    if (action === 'approveLoan') return approveLoan(Number(el.dataset.loanId));
    if (action === 'rejectLoan') return rejectLoan(Number(el.dataset.loanId));
    if (action === 'viewLoan') return viewLoan(Number(el.dataset.loanId));

    if (action === 'viewUser') return viewUser(Number(el.dataset.userId));
    if (action === 'deleteUser') return deleteUser(Number(el.dataset.userId), el.dataset.userName || '');

    if (action === 'openCreateCompany') return openModal('createCompanyModal');
    if (action === 'closeCompanyModal') return closeModal('createCompanyModal');

    if (action === 'openCreatePromoCode') {
      const activeCompanies = state.allCompanies.filter(c => c.is_active);
      if (activeCompanies.length === 0) return alert('Эхлээд нэг идэвхтэй компани үүсгэнэ үү!');
      return openModal('createPromoCodeModal');
    }
    if (action === 'closePromoCodeModal') return closeModal('createPromoCodeModal');

    if (action === 'closeUserModal') return closeModal('userProfileModal');

    if (action === 'toggleCompany') {
      const companyId = Number(el.dataset.companyId);
      const newStatus = el.dataset.newStatus === '1';
      return toggleCompany(companyId, newStatus);
    }
    if (action === 'deleteCompany') return deleteCompany(Number(el.dataset.companyId));

    if (action === 'copyCode') return copyCode(el.dataset.code || '');
    if (action === 'deletePromoCode') return deletePromoCode(Number(el.dataset.codeId));

    if (action === 'saveSettings') return saveSettings();

    if (action === 'openImage') {
      const src = el.dataset.src;
      if (!src) return;
      const w = window.open();
      if (w) w.document.write(`<img src="${src}" style="max-width:100%;height:auto;">`);
      return;
    }
  });

  // forms
  on(createCompanyForm, 'submit', (e) => {
    e.preventDefault();
    createCompany();
  });
  on(createPromoCodeForm, 'submit', (e) => {
    e.preventDefault();
    createPromoCode();
  });

  // ---- init ----
  loadStatistics();
  loadLoans();
}
