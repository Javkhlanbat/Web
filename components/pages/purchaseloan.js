// pages/purchase-loan.page.js
import { navigate } from '../router.js';
import { TokenManager, LoansAPI } from '../mock-api.component.js';
import { Utils } from '../utils.component.js';

export function renderPurchaseLoan(app) {
  // HTML (inline style байхгүй)
  app.innerHTML = `
    <div class="container">

      <div class="purchase-hero">
        <div class="purchase-hero__tagwrap">
          <span class="purchase-hero__tag">ТООЦООЛУУР</span>
        </div>
        <h2 class="purchase-hero__title">Зээлийн нөхцөл харах ба баталгаажуулах</h2>
      </div>

      <div class="loan-type-tabs">
        <a href="#/calculator" data-link class="btn btn-secondary">Хэрэглээний зээл</a>
        <a href="#/purchase-loan" data-link class="btn btn-primary">Худалдан авалтын зээл</a>
      </div>

      <div class="loan-content">
        <div class="info-box">
          <h3>Худалдан авалтын зээл (0% хүү, урьдчилгаагүй)</h3>
          <p>
            Хамтрагч байгууллагаас авсан <strong>нэхэмжлэхийн код</strong>-оо оруулж баталгаажуулна.
          </p>
        </div>

        <div class="validation-form">
          <h3 style="margin-bottom: 24px; text-align: center;">
            Худалдан авалтын зээл (0% хүү, урьдчилгаагүй)
          </h3>

          <form id="purchaseLoanForm">
            <div class="form-group">
              <label for="invoiceCode">Нэхэмжлэхийн код</label>
              <input
                type="text"
                id="invoiceCode"
                placeholder="AA12-BC34-5678"
                pattern="[A-Z0-9\\-]+"
                required
              />
              <p class="form-help">
                Хамтрагч байгууллагаас авсан нэхэмжлэхийн код шаардлагатай
              </p>
            </div>

            <div class="form-group">
              <label for="phoneNumber">Утасны дугаар</label>
              <input
                type="tel"
                id="phoneNumber"
                placeholder="99xxxxxx"
                pattern="[0-9]{8}"
                maxlength="8"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width:100%; margin-top:8px;">
              Илгээх
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  // handlers
  const form = app.querySelector('#purchaseLoanForm');
  const invoiceEl = app.querySelector('#invoiceCode');
  const phoneEl = app.querySelector('#phoneNumber');

  invoiceEl?.addEventListener('input', function () {
    this.value = String(this.value || '').toUpperCase();
  });

  phoneEl?.addEventListener('input', function () {
    this.value = String(this.value || '').replace(/\D/g, '').substring(0, 8);
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // auth guard: router дээр auth=false байж болно, гэхдээ энэ form дээр заавал login шаардана
    if (!TokenManager.isAuthenticated()) {
      const ok = confirm('Зээл авахын тулд нэвтрэх хэрэгтэй. Нэвтрэх хуудас руу шилжих үү?');
      if (ok) navigate('#/login?redirect=%2Fpurchase-loan', { replace: true });
      return;
    }

    const invoiceCode = (invoiceEl?.value || '').trim();
    const phoneNumber = (phoneEl?.value || '').trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!invoiceCode || !phoneNumber) {
      Utils.showToast('Бүх талбарыг бөглөнө үү', 'error');
      return;
    }

    try {
      submitBtn.disabled = true;
      const old = submitBtn.textContent;
      submitBtn.textContent = 'Баталгаажуулж байна...';

      Utils.showToast('Нэхэмжлэх баталгаажуулж байна...', 'info');

      // 1) API байвал дуудна (доор Mock API дээр нэмэх функцийг өгсөн)
      if (typeof LoansAPI.applyForPurchaseLoan === 'function') {
        await LoansAPI.applyForPurchaseLoan({
          invoice_code: invoiceCode,
          phone: phoneNumber,
          merchant_name: 'Demo Merchant',
          amount: 0,
        });

        Utils.showToast('Амжилттай баталгаажлаа!', 'success');

        // 2) My loans руу
        navigate('#/my-loans', { replace: true });
      } else {
        // API байхгүй бол fallback
        Utils.showToast('applyForPurchaseLoan() API алга байна (Mock API дээр нэмэх хэрэгтэй).', 'error');
      }

      submitBtn.textContent = old;
      submitBtn.disabled = false;
    } catch (err) {
      console.error(err);
      Utils.showToast(err?.message || 'Баталгаажуулахад алдаа гарлаа', 'error');

      submitBtn.disabled = false;
      submitBtn.textContent = 'Илгээх';
    }
  });
}
