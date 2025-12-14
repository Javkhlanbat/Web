

class OmniCalcHero extends HTMLElement {
  static get observedAttributes() { return ['tag', 'title']; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const tag = this.getAttribute('tag') || 'ТООЦООЛУУР';
    const title = this.getAttribute('title') || '';

    this.innerHTML = /* html */`
      <div class="calc-hero">
        <div class="calc-hero__tagwrap">
          <span class="calc-hero__tag">${tag}</span>
        </div>
        <h2 class="calc-hero__title">${title}</h2>
      </div>
    `;
  }
}
customElements.define('omni-calc-hero', OmniCalcHero);


class OmniLoanTypeSwitch extends HTMLElement {
  static get observedAttributes() { return ['active', 'purchase-href']; }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const active = (this.getAttribute('active') || 'consumer').toLowerCase(); // consumer | purchase
    const purchaseHref = this.getAttribute('purchase-href') || 'purchase-loan.html';

    this.innerHTML = /* html */`
      <div class="loan-type-buttons">
        <button class="btn btn-primary loan-type-btn ${active === 'consumer' ? 'active' : ''}" data-type="consumer" type="button">
          Хэрэглээний зээл
        </button>

        <a href="${purchaseHref}"
           class="btn btn-secondary loan-type-btn loan-type-btn--link ${active === 'purchase' ? 'active' : ''}">
          Худалдан авалтын зээл
        </a>
      </div>
    `;
  }
}
customElements.define('omni-loan-type-switch', OmniLoanTypeSwitch);


class OmniInfoTabs extends HTMLElement {
  // content-уудаа slot-оор авна
  connectedCallback() {
    const uid = this.getAttribute('uid') || ('t' + Math.random().toString(36).slice(2));
    const title1 = this.getAttribute('tab1') || 'Үйлчилгээний нөхцөл';
    const title2 = this.getAttribute('tab2') || 'Тавигдах шаардлага';
    const title3 = this.getAttribute('tab3') || 'Түгээмэл асуулт';

    this.innerHTML = /* html */`
      <input type="radio" name="info-${uid}" id="i-cond-${uid}" checked hidden>
      <input type="radio" name="info-${uid}" id="i-req-${uid}" hidden>
      <input type="radio" name="info-${uid}" id="i-faq-${uid}" hidden>

      <div class="info-tabs">
        <label for="i-cond-${uid}">${title1}</label>
        <label for="i-req-${uid}">${title2}</label>
        <label for="i-faq-${uid}">${title3}</label>
      </div>

      <div class="card pad info-pane-wrap">
        <div class="pane" id="pane-conditions-${uid}">
          <slot name="conditions"></slot>
        </div>

        <div class="pane" id="pane-requirements-${uid}">
          <slot name="requirements"></slot>
        </div>

        <div class="pane" id="pane-faq-${uid}">
          <slot name="faq"></slot>
        </div>
      </div>
    `;

    // CSS selector чинь одоо хуучин id-уудтай таарахгүй тул JS-ээр toggle хийнэ
    const cond = this.querySelector(`#i-cond-${uid}`);
    const req  = this.querySelector(`#i-req-${uid}`);
    const faq  = this.querySelector(`#i-faq-${uid}`);

    const paneCond = this.querySelector(`#pane-conditions-${uid}`);
    const paneReq  = this.querySelector(`#pane-requirements-${uid}`);
    const paneFaq  = this.querySelector(`#pane-faq-${uid}`);

    const sync = () => {
      paneCond.style.display = cond.checked ? 'block' : 'none';
      paneReq.style.display  = req.checked  ? 'block' : 'none';
      paneFaq.style.display  = faq.checked  ? 'block' : 'none';
    };

    [cond, req, faq].forEach(r => r.addEventListener('change', sync));
    sync();
  }
}
customElements.define('omni-info-tabs', OmniInfoTabs);


class OmniKpiStrip extends HTMLElement {
  connectedCallback() {
    // ID-ууд чинь JS дээр ашиглагддаг тул default-оор хуучин ID-уудаа хадгаллаа
    const idPay = this.getAttribute('pay-id') || 'kpiPayment';
    const idInt = this.getAttribute('int-id') || 'kpiInterest';
    const idTot = this.getAttribute('tot-id') || 'kpiTotal';

    this.innerHTML = /* html */`
      <section class="kpis-wide">
        <div class="kpi">Сарын төлбөр<b id="${idPay}">—</b></div>
        <div class="kpi">Нийт хүү<b id="${idInt}">—</b></div>
        <div class="kpi">Нийт төлөх<b id="${idTot}">—</b></div>
      </section>
    `;
  }
}
customElements.define('omni-kpi-strip', OmniKpiStrip);


class OmniChartTabs extends HTMLElement {
  connectedCallback() {
    const uid = this.getAttribute('uid') || ('c' + Math.random().toString(36).slice(2));
    const payId = this.getAttribute('pay-canvas') || 'paymentsChart';
    const balId = this.getAttribute('bal-canvas') || 'balanceChart';

    this.innerHTML = /* html */`
      <input type="radio" name="chart-${uid}" id="c-pay-${uid}" checked hidden>
      <input type="radio" name="chart-${uid}" id="c-bal-${uid}" hidden>

      <div class="chart-tabs">
        <label for="c-pay-${uid}">Төлөлтийн график</label>
        <label for="c-bal-${uid}">Үлдэгдлийн график</label>
      </div>

      <div class="panels">
        <div id="panel-pay-${uid}" class="panel">
          <canvas id="${payId}" width="800" height="360"></canvas>
        </div>
        <div id="panel-bal-${uid}" class="panel">
          <canvas id="${balId}" width="800" height="360"></canvas>
        </div>
      </div>
    `;

    // display:none таб-тай болохоор toggle-оо JS-ээр хийх нь найдвартай
    const rPay = this.querySelector(`#c-pay-${uid}`);
    const rBal = this.querySelector(`#c-bal-${uid}`);
    const pPay = this.querySelector(`#panel-pay-${uid}`);
    const pBal = this.querySelector(`#panel-bal-${uid}`);

    const sync = () => {
      pPay.style.display = rPay.checked ? 'block' : 'none';
      pBal.style.display = rBal.checked ? 'block' : 'none';

      this.dispatchEvent(new CustomEvent('omni-chart-tab-change', { bubbles: true }));
    };

    [rPay, rBal].forEach(r => r.addEventListener('change', sync));
    sync();
  }
}
customElements.define('omni-chart-tabs', OmniChartTabs);
