// pages/my-loans.page.js
import { LoansAPI } from '../mock-api.component.js';
import { navigate } from '../router.js';

export function renderMyLoans(app) {
  app.innerHTML = `
    <div class="container">
      <div class="page-header">
        <h1>Миний зээл</h1>
        <p style="color: var(--text-muted);">Таны бүх зээлийн мэдээлэл</p>
      </div>

      <div class="loan-filters">
        <button class="filter-btn active" data-filter="all" type="button">Бүгд</button>
        <button class="filter-btn" data-filter="disbursed" type="button">Олгогдсон</button>
        <button class="filter-btn" data-filter="active" type="button">Идэвхтэй</button>
        <button class="filter-btn" data-filter="pending" type="button">Хүлээгдэж буй</button>
        <button class="filter-btn" data-filter="paid" type="button">Төлсөн</button>
      </div>

      <div id="loanList"></div>

      <div id="noLoansMessage" style="display:none; text-align:center; padding: 64px 20px;">
        <div style="font-size: 64px; margin-bottom: 16px;"></div>
        <h3>Зээл байхгүй байна</h3>
        <p style="color: var(--text-muted); margin: 16px 0 24px;">
          Та одоогоор ямар ч зээл аваагүй байна
        </p>
        <a href="#/application" data-link class="btn btn-primary btn-lg">Зээл авах</a>
      </div>

      <div id="loadingMessage" style="text-align:center; padding: 64px 20px;">
        <p style="color: var(--text-muted);">Ачаалж байна...</p>
      </div>

      <div class="card card-peachy" style="margin-top: 48px; margin-bottom: 80px; padding: 48px; text-align: center;">
        <h3 style="color: white; margin-bottom: 16px;">Шинэ зээл авах уу?</h3>
        <p style="color: white; opacity: 0.95; margin-bottom: 24px;">
          Зээлийн түүх сайн байгаа тул та илүү их дүн, илүү хямд хүүтэй зээл авах боломжтой
        </p>
        <a href="#/application" data-link class="btn btn-secondary btn-lg" style="background: white; color: var(--primary);">
          Шинэ зээл авах
        </a>
      </div>
    </div>
  `;
}

export function afterRenderMyLoans() {
  // SPA дээр дахин ороход listener давхардахгүй
  if (window.__myLoansAbort) window.__myLoansAbort.abort();
  const ac = new AbortController();
  window.__myLoansAbort = ac;
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn, { signal: ac.signal });

  let allLoans = [];
  let currentFilter = 'all';

  const loanListEl = document.getElementById('loanList');
  const loadingEl = document.getElementById('loadingMessage');
  const emptyEl = document.getElementById('noLoansMessage');

  if (!loanListEl || !loadingEl || !emptyEl) return;

  function getStatusInfo(status) {
    const statusMap = {
      pending:   { label: 'Хүлээгдэж буй', class: 'status-pending' },
      approved:  { label: 'Баталгаажсан', class: 'status-active' },
      disbursed: { label: 'Олгогдсон', class: 'status-disbursed' },
      active:    { label: 'Идэвхтэй', class: 'status-active' },
      paid:      { label: 'Төлөгдсөн', class: 'status-paid' },
      rejected:  { label: 'Татгалзсан', class: 'status-rejected' },
      cancelled: { label: 'Цуцлагдсан', class: 'status-cancelled' },
    };
    return statusMap[status] || { label: String(status || 'pending'), class: 'status-pending' };
  }

  function displayLoans(loans) {
    loanListEl.innerHTML = loans.map((loan) => {
      const statusInfo = getStatusInfo(loan.status);
      const paidAmount = loan.paid_amount || 0;

      // ⚠️ Чиний хуучин код remaining = loan.amount - paid_amount гэж байсан.
      // Зарим үед total_amount ашигласан байж магадгүй (payment.page дээр тэгж байсан).
      // Энд safe: total_amount байвал тэрийг ашиглая.
      const totalAmount = loan.total_amount || loan.amount || 0;
      const principal = loan.amount || 0;
      const remaining = Math.max(0, totalAmount - paidAmount);

      const progress = totalAmount > 0 ? Math.min(100, Math.round((paidAmount / totalAmount) * 100)) : 0;
      const termMonths = loan.term_months || loan.term || 12;
      const monthlyPayment = loan.monthly_payment || Math.round(principal / termMonths);
      const createdDate = new Date(loan.created_at || loan.createdAt || Date.now()).toLocaleDateString('mn-MN');

      // Pending
      if (loan.status === 'pending') {
        return `
          <div class="loan-card" data-status="${loan.status}">
            <div class="loan-info">
              <div style="display:flex; justify-content:space-between; align-items:start;">
                <h4>Зээл #${loan.id}</h4>
                <span class="loan-status ${statusInfo.class}">${statusInfo.label}</span>
              </div>

              <div class="loan-meta">
                <div class="loan-meta-item">
                  <span class="loan-meta-label">Хүсэлтийн дүн</span>
                  <span class="loan-meta-value">₮${principal.toLocaleString()}</span>
                </div>
                <div class="loan-meta-item">
                  <span class="loan-meta-label">Хугацаа</span>
                  <span class="loan-meta-value">${termMonths} сар</span>
                </div>
                <div class="loan-meta-item">
                  <span class="loan-meta-label">Хүсэлтийн огноо</span>
                  <span class="loan-meta-value">${createdDate}</span>
                </div>
                <div class="loan-meta-item">
                  <span class="loan-meta-label">Зориулалт</span>
                  <span class="loan-meta-value">${loan.purpose || '-'}</span>
                </div>
              </div>

              <p style="margin-top:12px; color: var(--text-muted); font-size:14px;">
                Таны хүсэлтийг шалгаж байна. 24 цагийн дотор хариу өгнө.
              </p>
            </div>

            <div class="loan-actions">
              <button class="btn btn-secondary" type="button" disabled>Дэлгэрэнгүй</button>
            </div>
          </div>
        `;
      }

      // Paid
      if (loan.status === 'paid') {
        return `
          <div class="loan-card" data-status="${loan.status}">
            <div class="loan-info">
              <div style="display:flex; justify-content:space-between; align-items:start;">
                <h4>Зээл #${loan.id}</h4>
                <span class="loan-status ${statusInfo.class}">${statusInfo.label}</span>
              </div>

              <div class="loan-meta">
                <div class="loan-meta-item">
                  <span class="loan-meta-label">Зээлийн дүн</span>
                  <span class="loan-meta-value">₮${principal.toLocaleString()}</span>
                </div>
                <div class="loan-meta-item">
                  <span class="loan-meta-label">Төлсөн</span>
                  <span class="loan-meta-value">₮${paidAmount.toLocaleString()}</span>
                </div>
                <div class="loan-meta-item">
                  <span class="loan-meta-label">Эхэлсэн</span>
                  <span class="loan-meta-value">${createdDate}</span>
                </div>
                <div class="loan-meta-item">
                  <span class="loan-meta-label">Хугацаа</span>
                  <span class="loan-meta-value">${termMonths} сар</span>
                </div>
              </div>

              <div class="progress-bar"><div class="progress-fill" style="width:100%"></div></div>
              <p style="font-size:12px; color: var(--text-muted); margin-top:8px;">Бүрэн төлөгдсөн</p>
            </div>

            <div class="loan-actions">
              <button class="btn btn-secondary" type="button" disabled>Баримт харах</button>
            </div>
          </div>
        `;
      }

      // Disbursed / Active / Approved
      const payLink = `#/payment?loan=${encodeURIComponent(loan.id)}`;
      const extraMsg =
        loan.status === 'disbursed'
          ? `<p style="margin-top:12px; color:#059669; font-size:14px; font-weight:600;">Зээл таны дансанд шилжүүлэгдсэн байна!</p>`
          : ``;

      return `
        <div class="loan-card" data-status="${loan.status}">
          <div class="loan-info">
            <div style="display:flex; justify-content:space-between; align-items:start;">
              <h4>Зээл #${loan.id}</h4>
              <span class="loan-status ${statusInfo.class}">${statusInfo.label}</span>
            </div>

            <div class="loan-meta">
              <div class="loan-meta-item">
                <span class="loan-meta-label">Зээлийн дүн</span>
                <span class="loan-meta-value">₮${principal.toLocaleString()}</span>
              </div>
              <div class="loan-meta-item">
                <span class="loan-meta-label">Үлдэгдэл</span>
                <span class="loan-meta-value">₮${remaining.toLocaleString()}</span>
              </div>
              <div class="loan-meta-item">
                <span class="loan-meta-label">Сарын төлбөр</span>
                <span class="loan-meta-value">₮${monthlyPayment.toLocaleString()}</span>
              </div>
              <div class="loan-meta-item">
                <span class="loan-meta-label">Хугацаа</span>
                <span class="loan-meta-value">${termMonths} сар</span>
              </div>
            </div>

            ${extraMsg}

            <div class="progress-bar">
              <div class="progress-fill" style="width:${progress}%"></div>
            </div>
            <p style="font-size:12px; color: var(--text-muted); margin-top:8px;">
              ${progress}% төлөгдсөн
            </p>
          </div>

          <div class="loan-actions">
            <a href="${payLink}" data-link class="btn btn-primary">Төлбөр төлөх</a>
            <button class="btn btn-secondary" type="button" disabled>Дэлгэрэнгүй</button>
          </div>
        </div>
      `;
    }).join('');

    setupFilters();
    applyFilter(currentFilter);
  }

  function applyFilter(filter) {
    const cards = document.querySelectorAll('.loan-card');
    cards.forEach((card) => {
      const st = card.dataset.status;
      card.style.display = (filter === 'all' || st === filter) ? 'grid' : 'none';
    });
  }

  function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach((btn) => {
      on(btn, 'click', () => {
        currentFilter = btn.dataset.filter || 'all';
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(currentFilter);
      });
    });
  }

  async function loadLoans() {
    try {
      loadingEl.style.display = 'block';
      emptyEl.style.display = 'none';
      loanListEl.innerHTML = '';

      const response = await LoansAPI.getMyLoans();
      allLoans = Array.isArray(response) ? response : (response.loans || []);

      loadingEl.style.display = 'none';

      if (!allLoans.length) {
        emptyEl.style.display = 'block';
        return;
      }

      displayLoans(allLoans);
    } catch (err) {
      console.error('Load loans error:', err);
      loadingEl.innerHTML = `
        <p style="color:#EF4444;">Алдаа: ${String(err?.message || err)}</p>
        <button class="btn btn-primary" id="retryLoansBtn" style="margin-top:16px;" type="button">Дахин оролдох</button>
      `;
      const retry = document.getElementById('retryLoansBtn');
      on(retry, 'click', loadLoans);
    }
  }

  loadLoans();
}
