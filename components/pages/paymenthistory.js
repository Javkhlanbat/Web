// pages/payment-history.page.js
import { PaymentsAPI, TokenManager } from '../mock-api.component.js';
import { Utils } from '../utils.component.js';
import { navigate } from '../router.js';

export function renderPaymentHistory(app) {
  app.innerHTML = `
    <div class="container">
      <div class="page-header">
        <h1>Төлбөрийн түүх</h1>
        <p style="color: var(--text-muted);">Таны бүх төлбөрийн мэдээлэл</p>
      </div>

      <div class="summary-card">
        <h3 style="margin-bottom: 4px;">Нийт статистик</h3>
        <p style="opacity: 0.9; margin-bottom: 24px;">
          <span id="currentYear"></span> оны нэгдсэн тайлан
        </p>

        <div class="summary-grid">
          <div class="summary-item">
            <h4 id="totalPaid">₮0</h4>
            <p>Нийт төлсөн</p>
          </div>
          <div class="summary-item">
            <h4 id="paymentsCount">0</h4>
            <p>Гүйлгээний тоо</p>
          </div>
          <div class="summary-item">
            <h4 id="thisMonth">₮0</h4>
            <p>Энэ сар</p>
          </div>
        </div>
      </div>

      <div class="filters">
        <select class="filter-select" id="statusFilter">
          <option value="all">Бүх гүйлгээ</option>
          <option value="completed">Амжилттай</option>
          <option value="pending">Хүлээгдэж буй</option>
          <option value="failed">Амжилтгүй</option>
        </select>

        <select class="filter-select" id="rangeFilter">
          <option value="this_month">Энэ сар</option>
          <option value="last_month">Өнгөрсөн сар</option>
          <option value="3m">3 сар</option>
          <option value="6m">6 сар</option>
          <option value="this_year">Энэ жил</option>
          <option value="all" selected>Бүгд</option>
        </select>

        <button class="btn btn-secondary btn-sm" style="margin-left:auto;" type="button" id="downloadBtn">
          Татаж авах
        </button>
      </div>

      <div class="payment-list" id="paymentList">
        <div style="text-align:center; padding:48px;">
          <p style="color: var(--text-muted);">Төлбөрийн түүх уншиж байна...</p>
        </div>
      </div>

      <div id="noPaymentsMessage" style="display:none;">
        <div class="card" style="text-align:center; padding:48px;">
          <div style="font-size:64px; margin-bottom:16px;"></div>
          <h3>Төлбөрийн түүх байхгүй</h3>
          <p style="color: var(--text-muted); margin: 16px 0;">
            Та одоогоор ямар ч төлбөр төлөөгүй байна
          </p>
        </div>
      </div>

      <div style="margin: 48px 0 80px;">
        <div class="card" style="padding:48px; text-align:center;">
          <h3 style="margin-bottom:16px;">Баримт хэрэгтэй юу?</h3>
          <p style="color: var(--text-muted); margin-bottom:24px;">
            Төлбөрийн түүхийг PDF эсвэл Excel форматаар татаж авна уу
          </p>
          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-primary" type="button" id="pdfBtn">PDF татах</button>
            <button class="btn btn-secondary" type="button" id="xlsBtn">Excel татах</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function afterRenderPaymentHistory() {
  if (!TokenManager.isAuthenticated()) {
    navigate('#/login?redirect=%2Fpayment-history', { replace: true });
    return;
  }

  // listener давхардахгүй
  if (window.__payHistAbort) window.__payHistAbort.abort();
  const ac = new AbortController();
  window.__payHistAbort = ac;
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn, { signal: ac.signal });

  const paymentList = document.getElementById('paymentList');
  const noPaymentsMessage = document.getElementById('noPaymentsMessage');
  const statusFilter = document.getElementById('statusFilter');
  const rangeFilter = document.getElementById('rangeFilter');

  const currentYearEl = document.getElementById('currentYear');
  const totalPaidEl = document.getElementById('totalPaid');
  const paymentsCountEl = document.getElementById('paymentsCount');
  const thisMonthEl = document.getElementById('thisMonth');

  currentYearEl.textContent = new Date().getFullYear();

  let allPayments = [];

  function formatDate(d) {
    return d.toLocaleString('mn-MN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function inRange(paymentDate, rangeKey) {
    const d = new Date(paymentDate);
    const now = new Date();

    if (rangeKey === 'all') return true;

    if (rangeKey === 'this_year') {
      return d.getFullYear() === now.getFullYear();
    }

    if (rangeKey === 'this_month') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }

    if (rangeKey === 'last_month') {
      const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getFullYear() === last.getFullYear() && d.getMonth() === last.getMonth();
    }

    if (rangeKey === '3m' || rangeKey === '6m') {
      const months = rangeKey === '3m' ? 3 : 6;
      const from = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
      return d >= from;
    }

    return true;
  }

  function computeSummary(payments) {
    const totalPaid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    totalPaidEl.textContent = `₮${totalPaid.toLocaleString()}`;
    paymentsCountEl.textContent = String(payments.length);

    const now = new Date();
    const thisMonthPayments = payments.filter(p => {
      const pd = new Date(p.payment_date || p.created_at);
      return pd.getMonth() === now.getMonth() && pd.getFullYear() === now.getFullYear();
    });
    const thisMonthTotal = thisMonthPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    thisMonthEl.textContent = `₮${thisMonthTotal.toLocaleString()}`;
  }

  function renderList(payments) {
    if (!payments || payments.length === 0) {
      paymentList.style.display = 'none';
      noPaymentsMessage.style.display = 'block';
      return;
    }
    paymentList.style.display = 'block';
    noPaymentsMessage.style.display = 'none';

    const statusMap = {
      completed: { label: 'АМЖИЛТТАЙ', class: 'status-success', icon: '' },
      pending: { label: 'ХҮЛЭЭГДЭЖ БУЙ', class: 'status-pending', icon: '' },
      failed: { label: 'АМЖИЛТГҮЙ', class: 'status-failed', icon: '' },
    };

    paymentList.innerHTML = payments.map((payment) => {
      const date = new Date(payment.created_at);
      const status = statusMap[payment.status] || statusMap.pending;
      const iconClass =
        payment.status === 'completed' ? 'success' :
        payment.status === 'failed' ? 'failed' : 'pending';

      return `
        <div class="payment-item">
          <div class="payment-info">
            <div class="payment-icon ${iconClass}">${status.icon}</div>
            <div class="payment-details">
              <h4>Төлбөр #${payment.id} - Зээл #${payment.loan_id}</h4>
              <div class="payment-date">${formatDate(date)}</div>
            </div>
          </div>
          <div class="payment-amount">
            <div class="amount ${iconClass}">-₮${(parseFloat(payment.amount) || 0).toLocaleString()}</div>
            <span class="payment-status ${status.class}">${status.label}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function applyFilters() {
    const st = statusFilter.value;
    const rg = rangeFilter.value;

    const filtered = allPayments.filter(p => {
      const okStatus = (st === 'all') ? true : p.status === st;
      const d = p.payment_date || p.created_at;
      const okRange = inRange(d, rg);
      return okStatus && okRange;
    });

    renderList(filtered);
    computeSummary(filtered);
  }

  async function loadPayments() {
    try {
      const payments = await PaymentsAPI.getMyPayments();
      allPayments = Array.isArray(payments) ? payments : (payments?.payments || []);

      if (!allPayments.length) {
        renderList([]);
        computeSummary([]);
        return;
      }

      applyFilters();
    } catch (err) {
      console.error('Load payments error:', err);
      paymentList.innerHTML = `
        <div style="text-align:center; padding:48px;">
          <p style="color: var(--text-muted);">Төлбөрийн түүх уншихад алдаа гарлаа</p>
        </div>
      `;
    }
  }

  on(statusFilter, 'change', applyFilters);
  on(rangeFilter, 'change', applyFilters);

  // download buttons (demo)
  on(document.getElementById('downloadBtn'), 'click', () => {
    Utils.showToast('Татаж авах функц түр demo байна', 'info');
  });
  on(document.getElementById('pdfBtn'), 'click', () => {
    Utils.showToast('PDF export түр demo байна', 'info');
  });
  on(document.getElementById('xlsBtn'), 'click', () => {
    Utils.showToast('Excel export түр demo байна', 'info');
  });

  loadPayments();
}
