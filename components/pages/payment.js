// pages/payment.page.js
import { LoansAPI, WalletAPI, PaymentsAPI } from '../mock-api.component.js';
import { Utils } from '../utils.component.js';
import { navigate } from '../router.js';

export function renderPayment(app, ctx = {}) {
  app.innerHTML = `
    <div class="container">
      <div class="payment-container">
        <h1 style="margin-bottom: 8px;">Төлбөр төлөх</h1>
        <p id="pageSubtitle" style="color: var(--text-muted); margin-bottom: 32px;">
          Зээлээ сонгоод төлбөр төлөх боломжтой
        </p>

        <div class="payment-grid">
          <div>
            <div class="card">
              <div class="card-header">
                <h3>Төлбөрийн арга сонгох</h3>
              </div>
              <div class="card-body">
                <!-- Wallet Balance Info -->
                <div
                  id="walletInfo"
                  style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                         padding: 16px 20px; border-radius: var(--radius);
                         margin-bottom: 16px; color: white;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <p style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">Wallet үлдэгдэл</p>
                      <p id="walletBalanceDisplay" style="font-size: 1.5rem; font-weight: 800; margin: 0;">₮0</p>
                    </div>
                    <div style="font-size: 32px;"></div>
                  </div>
                </div>

                <div style="background: #f0fdf4; padding: 16px; border-radius: var(--radius); margin-bottom: 20px;">
                  <p style="font-size: 13px; color: #059669; margin: 0;">
                    <strong>Зээлийн төлбөр:</strong> Зээлийн төлбөр зөвхөн Wallet-ээс төлөгдөнө.
                    Wallet-д мөнгө нэмэхийн тулд Dashboard-аас "Мөнгө нэмэх" товч дарна уу.
                  </p>
                </div>

                <form id="paymentForm">
                  <div class="form-group">
                    <label class="form-label required">Зээл сонгох</label>
                    <select id="loanSelect" class="form-control" required>
                      <option value="">Уншиж байна...</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label required">Төлбөрийн дүн</label>
                    <div class="number-display">
                      <span class="currency">₮</span>
                      <input type="number" id="amount" value="0" min="1000" required>
                    </div>
                    <p style="font-size: 13px; color: var(--text-muted); margin-top: 8px;">
                      Доод дүн: ₮1,000
                    </p>
                  </div>

                  <button type="submit" class="btn btn-primary btn-block btn-lg">
                    Wallet-ээс төлөх
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div>
            <div class="card">
              <div class="card-header">
                <h3>Нэхэмжлэх</h3>
              </div>
              <div class="card-body" id="invoiceDetails">
                <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                  <p>Зээл сонгоно уу</p>
                </div>
              </div>
            </div>

            <div class="card" style="margin-top: 16px; background: var(--gradient-soft);">
              <div class="card-body">
                <h4 style="font-size: 14px; margin-bottom: 8px;">Санал</h4>
                <p style="font-size: 13px; color: var(--text-muted); margin: 0;">
                  Эрт төлвөл үлдсэн хүүг төлөх шаардлагагүй.
                  ₮810,000 төлөхөд зээл бүрэн барагдана.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // SPA render-ийн дараах bind-уудыг тусад нь хийе
  // ctx.query дээрээс loan param уншина (router.js URLSearchParams өгдөг) :contentReference[oaicite:2]{index=2}
  window.__paymentCtx = ctx;
}

export function afterRenderPayment() {
  // SPA дээр page дахин ороход listener давхардахгүйн тулд
  if (window.__payAbort) window.__payAbort.abort();
  const ac = new AbortController();
  window.__payAbort = ac;
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn, { signal: ac.signal });

  let selectedLoanId = null;
  let allLoans = [];
  let walletBalance = 0;

  const ctx = window.__paymentCtx || {};
  const loanIdFromUrl = ctx.query?.get('loan'); // "#/payment?loan=1" гэх мэт

  const loanSelect = document.getElementById('loanSelect');
  const amountInput = document.getElementById('amount');
  const invoiceDetails = document.getElementById('invoiceDetails');
  const walletBalanceDisplay = document.getElementById('walletBalanceDisplay');
  const form = document.getElementById('paymentForm');

  if (!loanSelect || !amountInput || !invoiceDetails || !walletBalanceDisplay || !form) return;

  async function loadActiveLoans() {
    try {
      const response = await LoansAPI.getMyLoans();
      const loans = Array.isArray(response) ? response : (response.loans || []);
      const activeLoans = loans.filter(loan =>
        loan.status === 'disbursed' || loan.status === 'active' || loan.status === 'approved'
      );

      allLoans = activeLoans;

      if (activeLoans.length > 0) {
        loanSelect.innerHTML =
          '<option value="">Зээл сонгох...</option>' +
          activeLoans.map(loan => {
            const totalAmount = loan.total_amount || loan.amount;
            const remaining = totalAmount - (loan.paid_amount || 0);
            return `<option value="${loan.id}">Зээл #${loan.id} - Үлдэгдэл: ₮${remaining.toLocaleString()}</option>`;
          }).join('');

        if (loanIdFromUrl) {
          loanSelect.value = loanIdFromUrl;
          updateInvoice(parseInt(loanIdFromUrl, 10));
        }
      } else {
        loanSelect.innerHTML = '<option value="">Идэвхтэй зээл байхгүй байна</option>';
      }
    } catch (error) {
      console.error('Load loans error:', error);
      loanSelect.innerHTML = '<option value="">Алдаа гарлаа</option>';
    }
  }

  function clearInvoice() {
    invoiceDetails.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        <p>Зээл сонгоно уу</p>
      </div>
    `;
    selectedLoanId = null;
  }

  function updateInvoice(loanId) {
    const loan = allLoans.find(l => l.id === loanId);
    if (!loan) return;

    selectedLoanId = loanId;

    const totalAmount = loan.total_amount || loan.amount;
    const paidAmount = loan.paid_amount || 0;
    const remaining = totalAmount - paidAmount;
    const interest = totalAmount - loan.amount;
    const termMonths = loan.term_months || loan.term || 12;
    const monthlyPayment = loan.monthly_payment || Math.round(loan.amount / termMonths);

    const statusInfo = ({
      disbursed: { label: 'Олгогдсон', color: '#059669' },
      active: { label: 'Идэвхтэй', color: '#10b981' },
      approved: { label: 'Зөвшөөрөгдсөн', color: '#10b981' },
    }[loan.status]) || { label: loan.status, color: '#6B7280' };

    invoiceDetails.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
        <span style="color: var(--text-muted);">Зээл #${loan.id}</span>
        <span style="font-weight: 700; color: ${statusInfo.color};">${statusInfo.label}</span>
      </div>

      <div style="padding: 16px; background: var(--bg); border-radius: var(--radius-sm); margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: var(--text-muted);">Үндсэн зээл:</span>
          <span style="font-weight: 700;">₮${loan.amount.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: var(--text-muted);">Хүү (${loan.interest_rate || 0}%):</span>
          <span style="font-weight: 700;">₮${interest.toLocaleString()}</span>
        </div>
        <div style="height: 1px; background: var(--line); margin: 16px 0;"></div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-weight: 700;">Нийт дүн:</span>
          <span style="font-weight: 800; font-size: 1.25rem; color: var(--primary);">₮${totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div style="padding: 12px; background: ${remaining > 0 ? '#DFFFD8' : '#E0E7FF'}; border-radius: var(--radius-sm); margin-bottom: 16px;">
        <p style="margin: 0; font-size: 13px; color: ${remaining > 0 ? '#10b981' : '#4f46e5'};">
          ${remaining > 0 ? 'Сарын төлбөр: ₮' + monthlyPayment.toLocaleString() : 'Зээл бүрэн төлөгдсөн'}
        </p>
      </div>

      <div style="font-size: 13px; color: var(--text-muted);">
        <p><strong>Үлдэгдэл:</strong> ₮${remaining.toLocaleString()}</p>
        <p><strong>Төлөгдсөн:</strong> ₮${paidAmount.toLocaleString()}</p>
        <p><strong>Хугацаа:</strong> ${termMonths} сар</p>
      </div>
    `;

    if (remaining > 0) {
      amountInput.value = Math.min(monthlyPayment, remaining);
      amountInput.max = String(remaining);
    } else {
      amountInput.value = '0';
      amountInput.max = '0';
    }
  }

  async function loadWalletBalance() {
    try {
      const response = await WalletAPI.getMyWallet();
      walletBalance = parseFloat(response.wallet.balance) || 0;
      walletBalanceDisplay.textContent = `₮${walletBalance.toLocaleString()}`;
    } catch (error) {
      console.error('Load wallet error:', error);
      walletBalance = 0;
      walletBalanceDisplay.textContent = '₮0';
    }
  }

  on(loanSelect, 'change', (e) => {
    if (e.target.value) updateInvoice(parseInt(e.target.value, 10));
    else clearInvoice();
  });

  on(form, 'submit', async (e) => {
    e.preventDefault();

    if (!loanSelect.value) {
      Utils.showToast('Зээл сонгоно уу', 'error');
      return;
    }

    const loanId = parseInt(loanSelect.value, 10);
    const amount = parseFloat(amountInput.value);

    if (!amount || amount <= 0) {
      Utils.showToast('Төлбөрийн дүн оруулна уу', 'error');
      return;
    }

    if (amount > walletBalance) {
      Utils.showToast('Wallet үлдэгдэл хүрэлцэхгүй байна. Dashboard-аас мөнгө нэмнэ үү.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Төлбөр боловсруулж байна...';

    try {
      await WalletAPI.payLoanFromWallet({ loan_id: loanId, amount });
      await PaymentsAPI.makePayment({ loan_id: loanId, amount, payment_method: 'wallet' });

      Utils.showToast('Амжилттай төлөгдлөө!', 'success');

      // SPA redirect (dashboard.html биш!)
      navigate('#/dashboard', { replace: true });
    } catch (error) {
      console.error('Payment error:', error);
      Utils.showToast(error.message || 'Төлбөр төлөхөд алдаа гарлаа', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    } finally {
      // refresh wallet anyway
      loadWalletBalance();
    }
  });

  // init
  Promise.all([loadActiveLoans(), loadWalletBalance()]);
}
