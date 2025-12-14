// pages/application.page.js
import { LoansAPI, TokenManager } from '../mock-api.component.js';
import { Utils } from '../utils.component.js';
import { navigate } from '../router.js';

export function renderApplication(app) {
  app.innerHTML = `
    <div class="container">
      <div class="application-container">
        <h1 style="text-align:center; margin-bottom:8px;">Зээлийн хүсэлт</h1>
        <p style="text-align:center; color: var(--text-muted); margin-bottom:48px;">
          Хүсэлт бөглөж, админ хянасны дараа зээл батлагдана
        </p>

        <div class="card">
          <div class="card-body">
            <form id="applicationForm">
              <h3 style="margin-bottom:24px;">Зээлийн мэдээлэл</h3>

              <div class="form-group">
                <label class="form-label required">Зээлийн дүн</label>
                <div class="number-display">
                  <span class="currency">₮</span>
                  <input type="number" name="amount" id="loanAmount"
                         value="1500000" min="100000" max="10000000" step="100000" required>
                </div>
                <input type="range" id="loanSlider" min="100000" max="10000000" step="100000"
                       value="1500000" style="width:100%; margin-top:12px;">
                <span class="form-text">₮100,000 - ₮10,000,000</span>
              </div>

              <div class="form-group">
                <label class="form-label required">Зээлийн хугацаа</label>
                <select class="form-control form-select" name="term" id="loanTerm" required>
                  <option value="">Сонгох</option>
                  <option value="3">3 сар</option>
                  <option value="6">6 сар</option>
                  <option value="12" selected>12 сар</option>
                  <option value="18">18 сар</option>
                  <option value="24">24 сар</option>
                  <option value="36">36 сар</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label required">Зориулалт</label>
                <select class="form-control form-select" name="purpose" id="purposeSelect" required>
                  <option value="">Сонгох</option>
                  <option value="personal" selected>Хувийн зарцуулалт</option>
                  <option value="business">Бизнес</option>
                  <option value="education">Боловсрол</option>
                  <option value="medical">Эмнэлэг</option>
                  <option value="other">Бусад</option>
                </select>
              </div>

              <div class="form-group" id="otherPurposeGroup" style="display:none;">
                <label class="form-label">Зориулалт дэлгэрэнгүй</label>
                <input type="text" class="form-control" name="otherPurpose" id="otherPurposeInput"
                       placeholder="Зориулалтаа тодорхойлно уу">
              </div>

              <div class="form-group">
                <label class="form-label required">Сарын орлого</label>
                <div class="number-display">
                  <span class="currency">₮</span>
                  <input type="number" name="monthly_income" id="monthlyIncome"
                         value="800000" min="300000" step="50000" placeholder="800000" required>
                </div>
                <span class="form-text">Таны сарын цалин эсвэл орлого</span>
              </div>

              <div class="form-group">
                <label class="form-label required">Ажил мэргэжил</label>
                <input type="text" class="form-control" name="occupation" id="occupation"
                       placeholder="Жишээ: Офисын ажилтан" required>
              </div>

              <hr style="margin:32px 0; border:none; border-top:1px solid var(--line);">

              <h3 style="margin-bottom:16px;">Тооцоолол</h3>
              <div class="summary-box" id="loanSummary">
                <div class="summary-row">
                  <span>Зээлийн дүн:</span>
                  <span class="summary-value" id="summaryAmount">₮1,500,000</span>
                </div>
                <div class="summary-row">
                  <span>Хугацаа:</span>
                  <span class="summary-value" id="summaryTerm">12 сар</span>
                </div>
                <div class="summary-row">
                  <span>Хүүгийн хувь:</span>
                  <span class="summary-value" id="summaryRate">3.0%</span>
                </div>
                <div class="summary-row" style="border-top:1px solid rgba(255,255,255,0.2); padding-top:12px; margin-top:12px;">
                  <span style="font-size:1.125rem;">Сарын төлбөр:</span>
                  <span class="summary-value" style="font-size:1.5rem;" id="summaryMonthly">₮135,416</span>
                </div>
              </div>

              <div class="form-check" style="margin-bottom:24px;">
                <input type="checkbox" id="agreeTerms" required>
                <label for="agreeTerms">
                  Би зээлийн нөхцөл, үйлчилгээний журамтай танилцаж зөвшөөрч байна
                </label>
              </div>

              <div style="padding:16px; background:#FFF0E6; border-left:4px solid var(--primary); border-radius: var(--radius-sm); margin-bottom:24px;">
                <p style="margin:0; font-size:14px;">
                  ✓ Хүсэлт admin-д илгээгдэж, батлагдсаны дараа зээл идэвхжинэ<br>
                  ✓ Хариуг 1-2 хоногийн дотор өгнө
                </p>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" id="submitBtn">
                Хүсэлт илгээх
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function afterRenderApplication() {
  // Auth guard (router auth:true байхад нэмэлт хамгаалалт)
  if (!TokenManager.isAuthenticated()) {
    navigate('#/login?redirect=%2Fapplication', { replace: true });
    return;
  }

  // listener давхардахгүй
  if (window.__appAbort) window.__appAbort.abort();
  const ac = new AbortController();
  window.__appAbort = ac;
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn, { signal: ac.signal });

  const amountInput = document.getElementById('loanAmount');
  const amountSlider = document.getElementById('loanSlider');
  const termSelect = document.getElementById('loanTerm');

  const purposeSelect = document.getElementById('purposeSelect');
  const otherPurposeGroup = document.getElementById('otherPurposeGroup');
  const otherPurposeInput = document.getElementById('otherPurposeInput');

  const form = document.getElementById('applicationForm');
  const submitBtn = document.getElementById('submitBtn');

  // --- helpers ---
  function calculateMonthly(amount, rate, months) {
    if (!months || months <= 0) return 0;
    if (rate === 0) return amount / months;
    const monthlyRate = rate / 100 / 12;
    return (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
           (Math.pow(1 + monthlyRate, months) - 1);
  }

  function updateSummary() {
    const amount = parseInt(amountInput.value, 10) || 0;
    const term = parseInt(termSelect.value, 10) || 12;
    const rate = 3.0;

    document.getElementById('summaryAmount').textContent = `₮${amount.toLocaleString()}`;
    document.getElementById('summaryTerm').textContent = `${term} сар`;
    document.getElementById('summaryRate').textContent = `${rate}%`;

    const monthly = calculateMonthly(amount, rate, term);
    document.getElementById('summaryMonthly').textContent = `₮${Math.round(monthly).toLocaleString()}`;
  }

  // slider sync
  on(amountSlider, 'input', (e) => {
    amountInput.value = e.target.value;
    updateSummary();
  });

  on(amountInput, 'input', (e) => {
    amountSlider.value = e.target.value;
    updateSummary();
  });

  on(termSelect, 'change', updateSummary);

  // purpose other
  on(purposeSelect, 'change', (e) => {
    if (e.target.value === 'other') {
      otherPurposeGroup.style.display = 'block';
      otherPurposeInput.required = true;
    } else {
      otherPurposeGroup.style.display = 'none';
      otherPurposeInput.required = false;
      otherPurposeInput.value = '';
    }
  });

  // submit
  on(form, 'submit', async (e) => {
    e.preventDefault();

    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
      Utils.showToast('Зээлийн нөхцөлийг зөвшөөрнө үү', 'error');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Илгээж байна...';

    try {
      const fd = new FormData(form);

      const amountValue = fd.get('amount');
      const termValue = fd.get('term');
      const monthlyIncomeValue = fd.get('monthly_income');
      const occupationValue = fd.get('occupation');
      let purposeValue = fd.get('purpose');

      if (!amountValue) throw new Error('Зээлийн дүн оруулна уу');
      if (!termValue) throw new Error('Зээлийн хугацаа сонгоно уу');
      if (!monthlyIncomeValue) throw new Error('Сарын орлого оруулна уу');
      if (!occupationValue || !occupationValue.trim()) throw new Error('Ажил мэргэжил оруулна уу');
      if (!purposeValue) throw new Error('Зээлийн зориулалт сонгоно уу');

      if (purposeValue === 'other') {
        const otherPurpose = fd.get('otherPurpose');
        if (!otherPurpose || !otherPurpose.trim()) throw new Error('Зориулалтаа дэлгэрэнгүй тодорхойлно уу');
        purposeValue = otherPurpose.trim();
      }

      const loanData = {
        amount: parseFloat(amountValue),
        duration_months: parseInt(termValue, 10),
        loan_type: 'personal',
        purpose: purposeValue,
        monthly_income: parseFloat(monthlyIncomeValue),
        occupation: occupationValue.trim(),
      };

      if (Number.isNaN(loanData.amount)) throw new Error('Зээлийн дүн буруу байна');
      if (Number.isNaN(loanData.duration_months)) throw new Error('Зээлийн хугацаа буруу байна');
      if (Number.isNaN(loanData.monthly_income)) throw new Error('Сарын орлого буруу байна');

      Utils.showToast('Хүсэлт илгээж байна...', 'info');
      await LoansAPI.applyForLoan(loanData);

      Utils.showToast('✓ Амжилттай илгээлээ! Admin батлах хүлээнэ', 'success');

      // SPA redirect (my-loans.html биш!)
      navigate('#/my-loans', { replace: true });
    } catch (err) {
      console.error('Loan application error:', err);
      Utils.showToast(err?.message || 'Хүсэлт илгээхэд алдаа гарлаа', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // initial
  updateSummary();
}
