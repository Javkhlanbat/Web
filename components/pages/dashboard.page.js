// componenents/pages/dashboard.page.js

import { UserManager, LoansAPI, PaymentsAPI, WalletAPI } from '../mock-api.component.js';
import { Utils } from '../utils.component.js';

export function renderDashboard(app) {
  app.innerHTML = `
    <div class="container dashboard-page">
      <div class="dashboard-header" style="margin: 48px 0 32px;">
        <h1 id="welcomeMessage">Сайн байна уу!</h1>
        <p style="color: var(--text-muted);">Таны санхүүгийн тойм</p>
      </div>

      <div class="dashboard-grid">
        <div class="stats-card">
          <div class="stats-card-value" id="activeLoansCount">0</div>
          <div class="stats-card-label">Идэвхтэй зээл</div>
        </div>
        <div class="stats-card">
          <div class="stats-card-value" id="totalBalance">₮0</div>
          <div class="stats-card-label">Үлдэгдэл</div>
        </div>
        <div class="stats-card">
          <div class="stats-card-value" id="nextPayment">₮0</div>
          <div class="stats-card-label">Дараагийн төлбөр</div>
        </div>
        <div class="stats-card">
          <div class="stats-card-value" id="daysUntilPayment">-</div>
          <div class="stats-card-label">Төлбөрийн хугацаа</div>
        </div>
      </div>

      <!-- Wallet -->
      <div class="card wallet-card">
        <div class="card-body wallet-card-body">
          <div class="wallet-row">
            <div>
              <p class="wallet-label">Миний Wallet</p>
              <h2 id="walletBalance" class="wallet-balance">₮0</h2>
            </div>
            <div class="wallet-actions">
              <button class="btn btn-secondary wallet-btn" id="openDepositBtn" type="button">Мөнгө нэмэх</button>
              <button class="btn btn-secondary wallet-btn" id="openWithdrawBtn" type="button">QPay шилжүүлэг</button>
              <!-- Энэ route байхгүй бол линкийг түр ав -->
              <!-- <a href="#/wallet-history" data-link class="btn btn-secondary wallet-btn">Түүх харах</a> -->
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <a href="#/payment" data-link class="action-card">
          <div class="action-icon"></div>
          <h4>Төлбөр төлөх</h4>
          <p class="action-sub">Сарын төлбөр төлөх</p>
        </a>

        <a href="#/application" data-link class="action-card">
          <div class="action-icon"></div>
          <h4>Зээл авах</h4>
          <p class="action-sub">Шинэ зээл хүсэх</p>
        </a>

        <a href="#/payment-history" data-link class="action-card">
          <div class="action-icon"></div>
          <h4>Түүх</h4>
          <p class="action-sub">Төлбөрийн түүх харах</p>
        </a>
      </div>

      <!-- Deposit Modal -->
      <div id="depositModal" class="modal-backdrop" aria-hidden="true" style="display:none;">
        <div class="card modal-card">
          <div class="card-header modal-header">
            <h3>Wallet руу мөнгө нэмэх</h3>
            <button class="modal-close" id="closeDepositBtn" aria-label="close" type="button">&times;</button>
          </div>
          <div class="card-body">
            <div class="modal-balance-box">
              <p class="modal-balance-label">Одоогийн үлдэгдэл</p>
              <h2 id="depositCurrentBalance" class="modal-balance-value">₮0</h2>
            </div>

            <form id="depositForm">
              <div class="form-group">
                <label class="form-label">Нэмэх дүн</label>
                <input type="number" id="depositAmount" class="form-control" placeholder="10000" min="1000" required>
                <p class="hint">Доод дүн: ₮1,000</p>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" id="depositSubmitBtn">
                QPay-ээр төлөх
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Withdraw Modal -->
      <div id="withdrawModal" class="modal-backdrop" aria-hidden="true" style="display:none;">
        <div class="card modal-card">
          <div class="card-header modal-header">
            <h3>QPay шилжүүлэг</h3>
            <button class="modal-close" id="closeWithdrawBtn" aria-label="close" type="button">&times;</button>
          </div>
          <div class="card-body">
            <div class="modal-balance-box">
              <p class="modal-balance-label">Боломжит үлдэгдэл</p>
              <h2 id="availableBalance" class="modal-balance-value">₮0</h2>
            </div>

            <form id="withdrawForm">
              <div class="form-group">
                <label class="form-label">Шилжүүлэх дүн</label>
                <input type="number" id="withdrawAmount" class="form-control" placeholder="10000" min="1000" required>
                <p class="hint">Доод дүн: ₮1,000</p>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" id="withdrawSubmitBtn">
                QPay-ээр шилжүүлэх
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="recent-section" id="activeLoansSection" style="display:none;">
        <h2 style="margin-bottom:24px;">Идэвхтэй зээл</h2>
        <div id="activeLoansContainer"></div>
      </div>

      <div class="recent-section" id="noLoansSection" style="display:none;">
        <div class="card" style="text-align:center; padding:48px;">
          <h3>Зээл байхгүй байна</h3>
          <p style="color: var(--text-muted); margin: 16px 0 24px;">
            Та одоогоор ямар ч зээл аваагүй байна
          </p>
          <a href="#/application" data-link class="btn btn-primary btn-lg">Зээл авах</a>
        </div>
      </div>

      <div class="recent-section">
        <h2 style="margin-bottom: 24px;">Сүүлийн гүйлгээ</h2>
        <div class="card">
          <div class="card-body" id="recentTransactions">
            <div style="text-align:center; padding:40px; color: var(--text-muted);">
              <p>Төлбөрийн түүх байхгүй байна</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function afterRenderDashboard() {
  // listener давхардахгүй
  if (window.__dashAbort) window.__dashAbort.abort();
  const ac = new AbortController();
  window.__dashAbort = ac;
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn, { signal: ac.signal });

  let currentWalletBalance = 0;

  const depositModal = document.getElementById('depositModal');
  const withdrawModal = document.getElementById('withdrawModal');

  const openModal = (m) => {
    m.style.display = 'flex';
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = (m) => {
    m.style.display = 'none';
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  on(document.getElementById('openDepositBtn'), 'click', () => openModal(depositModal));
  on(document.getElementById('openWithdrawBtn'), 'click', () => openModal(withdrawModal));
  on(document.getElementById('closeDepositBtn'), 'click', () => closeModal(depositModal));
  on(document.getElementById('closeWithdrawBtn'), 'click', () => closeModal(withdrawModal));
  on(depositModal, 'click', (e) => { if (e.target === depositModal) closeModal(depositModal); });
  on(withdrawModal, 'click', (e) => { if (e.target === withdrawModal) closeModal(withdrawModal); });

  async function loadWallet() {
    const resp = await WalletAPI.getMyWallet();
    const wallet = resp?.wallet || { balance: 0 };
    currentWalletBalance = Number(wallet.balance) || 0;

    document.getElementById('walletBalance').textContent = `₮${currentWalletBalance.toLocaleString()}`;
    document.getElementById('availableBalance').textContent = `₮${currentWalletBalance.toLocaleString()}`;
    document.getElementById('depositCurrentBalance').textContent = `₮${currentWalletBalance.toLocaleString()}`;
  }

  async function loadRecentPayments() {
    const res = await PaymentsAPI.getMyPayments();
    const payments = Array.isArray(res) ? res : (res?.payments || []);
    const container = document.getElementById('recentTransactions');

    if (!payments.length) return;

    const recent = payments.slice(0, 3);
    container.innerHTML = recent.map((p, idx) => {
      const date = new Date(p.payment_date || p.created_at || p.createdAt);
      const formatted = date.toLocaleDateString('mn-MN', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const border = idx < recent.length - 1 ? 'border-bottom: 1px solid var(--line);' : '';

      const methodRaw = p.payment_method || p.paymentMethod || 'bank';
      const method =
        methodRaw === 'card' ? 'Картаар' :
        methodRaw === 'qpay' ? 'QPay' :
        methodRaw === 'social' ? 'SocialPay' : 'Шилжүүлэг';

      return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:16px 0; ${border}">
          <div>
            <div style="font-weight:700; margin-bottom:4px;">${method}</div>
            <div style="font-size:13px; color: var(--text-muted);">${formatted}</div>
          </div>
          <div style="font-weight:800; font-size:1.125rem; color:#10b981;">
            -₮${Number(p.amount || 0).toLocaleString()}
          </div>
        </div>
      `;
    }).join('') + `
      <a href="#/payment-history" data-link class="btn btn-secondary btn-block" style="margin-top:16px;">
        Бүх түүх харах
      </a>
    `;
  }

  async function loadDashboard() {
    const user = UserManager.getUser();
    if (user) {
      const firstName = user.first_name || user.firstName || 'Хэрэглэгч';
      document.getElementById('welcomeMessage').textContent = `Сайн байна уу, ${firstName}!`;
    }

    const res = await LoansAPI.getMyLoans();
    const loans = Array.isArray(res) ? res : (res?.loans || []);
    const active = loans.filter(l => ['disbursed', 'active', 'approved'].includes(l.status));

    document.getElementById('activeLoansCount').textContent = String(active.length);

    if (!active.length) {
      document.getElementById('activeLoansSection').style.display = 'none';
      document.getElementById('noLoansSection').style.display = 'block';
      document.getElementById('totalBalance').textContent = '₮0';
      document.getElementById('nextPayment').textContent = '₮0';
      return;
    }

    let totalBalance = 0;
    let nextPayment = 0;

    active.forEach(loan => {
      const paid = loan.paid_amount || 0;
      const remaining = (loan.amount || 0) - paid;
      totalBalance += remaining;

      const term = loan.term_months || loan.term || 12;
      const monthly = loan.monthly_payment || ((loan.amount || 0) / term);
      nextPayment = Math.max(nextPayment, monthly);
    });

    document.getElementById('totalBalance').textContent = `₮${Math.round(totalBalance).toLocaleString()}`;
    document.getElementById('nextPayment').textContent = `₮${Math.round(nextPayment).toLocaleString()}`;

    document.getElementById('activeLoansSection').style.display = 'block';
    document.getElementById('noLoansSection').style.display = 'none';
  }

  // Deposit
  on(document.getElementById('depositForm'), 'submit', async (e) => {
    e.preventDefault();
    const amount = Number(document.getElementById('depositAmount').value || 0);
    if (amount < 1000) return Utils.showToast('Хамгийн багадаа ₮1,000 нэмэх боломжтой', 'error');

    const btn = document.getElementById('depositSubmitBtn');
    btn.disabled = true;
    const old = btn.textContent;
    btn.textContent = 'QPay боловсруулж байна...';

    try {
      await WalletAPI.depositToWallet({ amount, payment_method: 'qpay' });
      Utils.showToast('Wallet руу амжилттай нэмэгдлээ!', 'success');
      closeModal(depositModal);
      e.target.reset();
      await loadWallet();
    } catch (err) {
      Utils.showToast(err?.message || 'Мөнгө нэмэхэд алдаа гарлаа', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = old;
    }
  });

  // Withdraw
  on(document.getElementById('withdrawForm'), 'submit', async (e) => {
    e.preventDefault();
    const amount = Number(document.getElementById('withdrawAmount').value || 0);
    if (amount < 1000) return Utils.showToast('Хамгийн багадаа ₮1,000 шилжүүлэх боломжтой', 'error');
    if (amount > currentWalletBalance) return Utils.showToast('Үлдэгдэл хүрэлцэхгүй байна', 'error');

    const btn = document.getElementById('withdrawSubmitBtn');
    btn.disabled = true;
    const old = btn.textContent;
    btn.textContent = 'QPay боловсруулж байна...';

    try {
      await WalletAPI.withdrawToBank({ amount, payment_method: 'qpay' });
      Utils.showToast('QPay шилжүүлэг амжилттай!', 'success');
      closeModal(withdrawModal);
      e.target.reset();
      await loadWallet();
    } catch (err) {
      Utils.showToast(err?.message || 'Шилжүүлэхэд алдаа гарлаа', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = old;
    }
  });

  // init
  Promise.allSettled([loadDashboard(), loadWallet(), loadRecentPayments()]);
}
