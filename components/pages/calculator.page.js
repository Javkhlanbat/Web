// pages/calculator.page.js
import { TokenManager, LoansAPI, PromoCodeAPI } from '../mock-api.component.js';
import { Utils } from '../utils.component.js';
import { navigate } from '../router.js';

export function renderCalculator(app) {
  app.innerHTML = `
    <div class="container">
      <!-- HERO -->
      <div class="calc-hero">
        <div class="calc-hero__tagwrap">
          <span class="calc-hero__tag">ТООЦООЛУУР</span>
        </div>
        <h2 class="calc-hero__title">Зээлийн нөхцөл харах ба баталгаажуулах</h2>
      </div>

      <!-- LOAN TYPE BUTTONS -->
      <div class="loan-type-buttons">
        <button class="btn btn-primary loan-type-btn active" data-type="consumer">
          Хэрэглээний зээл
        </button>
        <a href="#/purchase-loan" data-link class="btn btn-secondary loan-type-btn loan-type-btn--link">
          Худалдан авалтын зээл
        </a>
      </div>

      <input type="radio" name="info" id="i-cond" checked hidden>
      <input type="radio" name="info" id="i-req" hidden>
      <input type="radio" name="info" id="i-faq" hidden>

      <div class="info-tabs">
        <label for="i-cond">Үйлчилгээний нөхцөл</label>
        <label for="i-req">Тавигдах шаардлага</label>
        <label for="i-faq">Түгээмэл асуулт</label>
      </div>

      <div class="card pad info-pane-wrap">
        <div class="pane" id="pane-conditions">
          <h3>Ерөнхий нөхцөл</h3>
          <table>
            <tr>
              <th>Зорилго</th>
              <td>Хэрэглээний зээл</td>
              <th>Хугацаа</th>
              <td>1–24 сар</td>
            </tr>
            <tr>
              <th>Хүү</th>
              <td>Сард 2% – 5%</td>
              <th>Барьцаа</th>
              <td>Шаардлагагүй</td>
            </tr>
            <tr>
              <th>Хязгаар</th>
              <td>₮10,000 – ₮3,000,000</td>
              <th>Хураамж</th>
              <td>0–1%</td>
            </tr>
          </table>
        </div>

        <div class="pane" id="pane-requirements">
          <h3>Тавигдах шаардлага</h3>
          <ul>
            <li>Монгол Улсын иргэн</li>
            <li>Тогтмол орлоготой</li>
            <li>Идэвхтэй банкны данстай</li>
          </ul>
        </div>

        <div class="pane" id="pane-faq">
          <h3>Түгээмэл асуулт</h3>
          <details>
            <summary>Урьдчилан төлбөл торгуультай юу?</summary>
            <div>Үгүй, хугацаанаас өмнө төлсөн тохиолдолд нэмэлт шимтгэлгүй.</div>
          </details>
          <details>
            <summary>Шийдвэр хэдий хугацаанд гарах вэ?</summary>
            <div>Урьдчилсан шийдвэр минутын дотор гарна.</div>
          </details>
        </div>
      </div>

      <section class="grid" id="calculator">
        <div class="card pad">
          <h3>Тохиргоо</h3>

          <div class="control">
            <label>Зээлийн дүн</label>
            <div class="display">
              <span>₮</span>
              <input id="amountNum" type="number" value="1500000" min="10000" max="3000000" step="10000" inputmode="numeric" />
            </div>
            <input id="amountRange" type="range" min="10000" max="3000000" step="10000" value="1500000" />
            <div class="range-meta">
              <span>₮10,000</span><span>₮3,000,000</span>
            </div>
          </div>

          <div class="control">
            <label>Сарын хүү (%)</label>
            <div class="display">
              <input id="rateNum" type="number" value="3" min="2" max="5" step="0.1" />
              <span>%</span>
            </div>
            <input id="rateRange" type="range" min="2" max="5" step="0.1" value="3" />
            <div class="range-meta">
              <span>2%</span><span>5%</span>
            </div>
          </div>

          <div class="control">
            <label>Зээлийн хугацаа (сар)</label>
            <div class="display">
              <input id="termNum" type="number" value="12" min="1" max="24" step="1" />
              <span>сар</span>
            </div>
            <input id="termRange" type="range" min="1" max="24" step="1" value="12" />
            <div class="range-meta">
              <span>1 сар</span><span>24 сар</span>
            </div>
          </div>

          <div class="control">
            <label>Нэмэгдлийн код (байгаа бол)</label>
            <div class="promo-row">
              <input id="promoCodeInput" type="text" placeholder="жнь: OMNI-ABC123" />
              <button type="button" id="verifyPromoBtn" class="btn btn-secondary">Шалгах</button>
            </div>
            <div id="promoCodeStatus" class="promo-status"></div>
          </div>

          <div class="cta">
            <button class="btn btn-primary" id="applyBtn">Хүсэлт илгээх</button>
            <button class="btn btn-ghost" id="pdfBtn">PDF хадгалах</button>
          </div>
        </div>

        <div class="card pad">
          <input type="radio" name="chart" id="c-pay" checked hidden>
          <input type="radio" name="chart" id="c-bal" hidden>

          <div class="chart-tabs">
            <label for="c-pay">Төлөлтийн график</label>
            <label for="c-bal">Үлдэгдлийн график</label>
          </div>

          <div class="panels">
            <div id="panel-pay" class="panel">
              <canvas id="paymentsChart" width="800" height="360"></canvas>
            </div>
            <div id="panel-bal" class="panel">
              <canvas id="balanceChart" width="800" height="360"></canvas>
            </div>
          </div>
        </div>
      </section>

      <section class="kpis-wide">
        <div class="kpi">Сарын төлбөр<b id="kpiPayment">—</b></div>
        <div class="kpi">Нийт хүү<b id="kpiInterest">—</b></div>
        <div class="kpi">Нийт төлөх<b id="kpiTotal">—</b></div>
      </section>
    </div>

    <div id="chartTip" class="chart-tip"></div>
  `;
}

/**
 * DOM render дууссаны дараа event / canvas bind хийх hook
 * main.js дээр route-д afterRender гэж өгнө.
 */
export function afterRenderCalculator() {
  // --- cleanup (SPA дээр дахин орж ирэхэд listener давхардахгүйн тулд) ---
  if (window.__calcAbort) window.__calcAbort.abort();
  const ac = new AbortController();
  window.__calcAbort = ac;
  const on = (el, ev, fn) => el.addEventListener(ev, fn, { signal: ac.signal });

  const fmt = new Intl.NumberFormat('mn-MN');
  const money = n => '₮' + fmt.format(Math.round(n || 0));
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  function computeSchedule(P, ratePct, n) {
    P = Math.max(10000, +P || 0);
    n = Math.max(1, Math.floor(+n || 0));
    const r = (+ratePct || 0) / 100;
    let payment, bal = P, sch = [];

    if (r === 0) {
      payment = P / n;
      for (let m = 1; m <= n; m++) {
        const interest = 0, principal = payment;
        bal = Math.max(0, bal - principal);
        sch.push({ m, interest, principal, payment, bal });
      }
    } else {
      payment = P * r / (1 - Math.pow(1 + r, -n));
      for (let m = 1; m <= n; m++) {
        const interest = bal * r;
        const principal = Math.min(payment - interest, bal);
        bal = Math.max(0, bal - principal);
        sch.push({ m, interest, principal, payment, bal });
      }
    }

    return {
      payment,
      totalInterest: sch.reduce((s, x) => s + x.interest, 0),
      totalPay: sch.reduce((s, x) => s + x.payment, 0),
      schedule: sch
    };
  }

  const amountNum = document.getElementById('amountNum');
  const amountRange = document.getElementById('amountRange');
  const rateNum = document.getElementById('rateNum');
  const rateRange = document.getElementById('rateRange');
  const termNum = document.getElementById('termNum');
  const termRange = document.getElementById('termRange');

  const kpiPayment = document.getElementById('kpiPayment');
  const kpiInterest = document.getElementById('kpiInterest');
  const kpiTotal = document.getElementById('kpiTotal');

  const paymentsCanvas = document.getElementById('paymentsChart');
  const balanceCanvas = document.getElementById('balanceChart');
  const tip = document.getElementById('chartTip');

  if (!amountNum || !paymentsCanvas || !balanceCanvas) return; // route солигдсон байж болно

  function bind(a, b, min, max) {
    const upd = v => {
      v = clamp(+v || 0, min, max);
      a.value = v;
      b.value = v;
      recalc();
    };
    on(a, 'input', () => upd(a.value));
    on(b, 'input', () => upd(b.value));
  }

  bind(amountNum, amountRange, 10000, 3000000);
  bind(rateNum, rateRange, 2, 5);
  bind(termNum, termRange, 1, 24);

  function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function drawPayments(schedule, hover = -1) {
    const ctx = paymentsCanvas.getContext('2d');
    clearCanvas(ctx);

    const W = ctx.canvas.width, H = ctx.canvas.height, margin = 40;
    const innerW = W - margin * 2, innerH = H - margin * 2;

    ctx.strokeStyle = '#e5e7eb';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(margin, margin, innerW, innerH);
    ctx.setLineDash([]);

    const bars = Math.min(12, schedule.length);
    const maxPay = Math.max(...schedule.map(s => s.payment));
    const slot = innerW / bars, bw = slot * 0.72, gap = slot * 0.28;

    ctx.font = '12px Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = 0; i < bars; i++) {
      const s = schedule[i];
      const x = margin + i * slot + gap / 2;
      const yB = H - margin;

      const totalH = innerH * (s.payment / maxPay);
      const intH = innerH * (s.interest / maxPay);
      const prinH = Math.max(0, totalH - intH);

      if (i === hover) {
        ctx.fillStyle = 'rgba(148,163,184,.35)';
        ctx.fillRect(x - gap / 2, margin, bw + gap, innerH);
      }

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x, yB - intH, bw, intH);

      ctx.fillStyle = '#10b981';
      ctx.fillRect(x, yB - intH - prinH, bw, prinH);

      ctx.fillStyle = '#4b5563';
      ctx.fillText(`${i + 1}-р сар`, x + bw / 2, yB + 6);
    }

    ctx.fillStyle = '#111827';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '16px Inter, system-ui';
    ctx.fillText('Зээл төлөлтийн график', W / 2, 24);

    return { margin, slot, bars, bw, gap };
  }

  function drawBalance(schedule, P, hover = -1) {
    const ctx = balanceCanvas.getContext('2d');
    clearCanvas(ctx);

    const W = ctx.canvas.width, H = ctx.canvas.height, margin = 40;
    const innerW = W - margin * 2, innerH = H - margin * 2;
    const n = schedule.length;

    ctx.strokeStyle = '#e5e7eb';
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(margin, margin, innerW, innerH);
    ctx.setLineDash([]);

    const pts = [];
    for (let i = 0; i < n; i++) {
      const x = margin + innerW * (i / (n - 1));
      const bal = P * (1 - i / (n - 1));
      const y = H - margin - innerH * (bal / P);
      pts.push([x, y, bal]);
    }

    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.lineTo(margin + innerW, H - margin);
    ctx.lineTo(margin, H - margin);
    ctx.closePath();
    ctx.fillStyle = 'rgba(59,130,246,0.25)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (hover >= 0 && hover < pts.length) {
      const [x, y] = pts[hover];
      ctx.strokeStyle = 'rgba(100,116,139,.7)';
      ctx.beginPath();
      ctx.moveTo(x, margin);
      ctx.lineTo(x, H - margin);
      ctx.stroke();

      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#111827';
    ctx.textAlign = 'center';
    ctx.font = '16px Inter, system-ui';
    ctx.fillText('Зээлийн үлдэгдлийн график', W / 2, 24);

    return { margin, innerW, pts };
  }

  let schedule = [];
  let geomPay = null, geomBal = null;

  function recalc() {
    const P = +amountNum.value || 10000;
    const r = +rateNum.value || 2;
    const n = +termNum.value || 1;
    const res = computeSchedule(P, r, n);
    schedule = res.schedule;

    kpiPayment.textContent = money(res.payment);
    kpiInterest.textContent = money(res.totalInterest);
    kpiTotal.textContent = money(res.totalPay);

    geomPay = drawPayments(schedule, -1);
    geomBal = drawBalance(schedule, Math.max(P, 1), -1);
  }

  const showTip = (html, x, y) => {
    tip.innerHTML = html;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
    tip.style.display = 'block';
  };
  const hideTip = () => tip.style.display = 'none';

  on(paymentsCanvas, 'mousemove', (e) => {
    if (!geomPay) return;
    const rect = paymentsCanvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (paymentsCanvas.width / rect.width);

    const { margin, slot, bars } = geomPay;
    if (cx < margin || cx > (paymentsCanvas.width - margin)) {
      hideTip(); drawPayments(schedule, -1); return;
    }
    let idx = Math.floor((cx - margin) / slot);
    idx = Math.max(0, Math.min(bars - 1, idx));

    drawPayments(schedule, idx);
    const s = schedule[idx];
    showTip(
      `<b>${idx + 1}-р сар</b>
       <div class="row"><span>Үндсэн зээл:</span><span class="v">${money(s.principal)}</span></div>
       <div class="row"><span>Бодогдсон хүү:</span><span class="v">${money(s.interest)}</span></div>
       <div class="row"><span>Нийт төлбөр:</span><span class="v">${money(s.payment)}</span></div>`,
      e.clientX, e.clientY
    );
  });
  on(paymentsCanvas, 'mouseleave', () => { hideTip(); drawPayments(schedule, -1); });

  on(balanceCanvas, 'mousemove', (e) => {
    if (!geomBal) return;
    const rect = balanceCanvas.getBoundingClientRect();
    const cx = (e.clientX - rect.left) * (balanceCanvas.width / rect.width);

    const { margin, innerW, pts } = geomBal;
    if (cx < margin || cx > (balanceCanvas.width - margin)) {
      hideTip(); drawBalance(schedule, Math.max(+amountNum.value || 1, 1), -1); return;
    }
    let idx = Math.round(((cx - margin) / innerW) * (pts.length - 1));
    idx = Math.max(0, Math.min(pts.length - 1, idx));

    drawBalance(schedule, Math.max(+amountNum.value || 1, 1), idx);
    const bal = pts[idx][2];
    showTip(`<b>${idx + 1}-р сар</b><div class="row"><span>Үлдэгдэл:</span><span class="v">${money(bal)}</span></div>`, e.clientX, e.clientY);
  });
  on(balanceCanvas, 'mouseleave', () => { hideTip(); drawBalance(schedule, Math.max(+amountNum.value || 1, 1), -1); });

  // PDF
  const pdfBtn = document.getElementById('pdfBtn');
  on(pdfBtn, 'click', () => window.print());

  // Promo verify
  let verifiedPromoCode = null;

  const verifyPromoBtn = document.getElementById('verifyPromoBtn');
  const promoInput = document.getElementById('promoCodeInput');
  const statusDiv = document.getElementById('promoCodeStatus');

  on(verifyPromoBtn, 'click', async () => {
    const code = promoInput.value.trim();

    if (!code) { statusDiv.innerHTML = '<span style="color:#f59e0b;">Код оруулна уу</span>'; return; }
    if (!TokenManager.isAuthenticated()) {
      statusDiv.innerHTML = '<span style="color:#ef4444;">Код шалгахын тулд эхлээд нэвтэрнэ үү</span>';
      return;
    }

    statusDiv.innerHTML = '<span style="color:#64748b;">Шалгаж байна...</span>';

    try {
      const result = await PromoCodeAPI.verifyCode(code);

      if (result.valid) {
        verifiedPromoCode = result.promoCode;

        if (result.promoCode.interest_rate_override !== null) {
          rateNum.value = result.promoCode.interest_rate_override;
          rateRange.value = result.promoCode.interest_rate_override;
          recalc();
        }

        statusDiv.innerHTML = `
          <div style="background:#d1fae5;border-radius:8px;padding:10px;color:#065f46;">
            <strong>✓ Код хүчинтэй!</strong><br>
            <span style="font-size:12px;">Компани: ${result.promoCode.company_name}</span><br>
            ${result.promoCode.interest_rate_override !== null ? `<span style="font-size:12px;">Хүү: ${result.promoCode.interest_rate_override}%</span>` : ''}
          </div>
        `;
      } else {
        verifiedPromoCode = null;
        statusDiv.innerHTML = `<span style="color:#ef4444;">✗ ${result.error || 'Код хүчингүй'}</span>`;
      }
    } catch (error) {
      verifiedPromoCode = null;
      statusDiv.innerHTML = `<span style="color:#ef4444;">✗ ${error.message || 'Код шалгахад алдаа гарлаа'}</span>`;
    }
  });

  on(promoInput, 'input', () => {
    verifiedPromoCode = null;
    statusDiv.innerHTML = '';
  });

  // Apply loan
  const applyBtn = document.getElementById('applyBtn');

  on(applyBtn, 'click', async () => {
    if (!TokenManager.isAuthenticated()) {
      if (confirm('Зээл авахын тулд нэвтрэх хэрэгтэй. Нэвтрэх хуудас руу шилжих үү?')) {
        navigate('#/login?redirect=%2Fcalculator', { replace: false });
      }
      return;
    }

    const amount = parseFloat(amountNum.value);
    const term = parseInt(termNum.value);
    const rate = parseFloat(rateNum.value);
    const promoCodeValue = promoInput.value.trim();

    if (isNaN(amount) || isNaN(term) || isNaN(rate)) { alert('Зээлийн төрөл, дүн, хугацаа оруулна уу'); return; }
    if (amount < 10000 || amount > 3000000) { alert('Зээлийн дүн ₮10,000 - ₮3,000,000 хооронд байх ёстой'); return; }
    if (term < 1 || term > 24) { alert('Хугацаа 1-24 сарын хооронд байх ёстой'); return; }
    if (promoCodeValue && !verifiedPromoCode) { alert('Нэмэгдлийн кодыг эхлээд "Шалгах" товч дарж баталгаажуулна уу'); return; }

    const confirmMsg = verifiedPromoCode
      ? `₮${fmt.format(amount)} зээлийн хүсэлт илгээх үү?\nХугацаа: ${term} сар\nХүү: ${rate}%\nНэмэгдлийн код: ${verifiedPromoCode.code} (${verifiedPromoCode.company_name})`
      : `₮${fmt.format(amount)} зээлийн хүсэлт илгээх үү?\nХугацаа: ${term} сар\nХүү: ${rate}%`;

    if (!confirm(confirmMsg)) return;

    try {
      applyBtn.disabled = true;
      applyBtn.textContent = 'Илгээж байна...';

      await LoansAPI.applyForLoan({
        amount,
        duration_months: term,
        purpose: verifiedPromoCode
          ? `Хэрэглээний зээл - ${verifiedPromoCode.company_name} (${verifiedPromoCode.code})`
          : 'Хэрэглээний зээл - тооцоолуураас',
        monthly_income: 500000,
        occupation: 'Хэрэглэгч',
        promo_code: verifiedPromoCode ? verifiedPromoCode.code : null
      });

      Utils?.showToast?.('Амжилттай илгээлээ!', 'success');
      setTimeout(() => navigate('#/my-loans', { replace: true }), 800);
    } catch (error) {
      console.error('Loan application error:', error);
      Utils?.showToast?.(error.message || 'Хүсэлт илгээхэд алдаа гарлаа', 'error');
      applyBtn.disabled = false;
      applyBtn.textContent = 'Хүсэлт илгээх';
    }
  });

  // Responsive canvas width
  function resizeCanvases() {
    const container = document.querySelector('.panels');
    if (container && window.innerWidth <= 768) {
      const width = container.offsetWidth - 24;
      paymentsCanvas.style.width = width + 'px';
      balanceCanvas.style.width = width + 'px';
    }
  }

  on(window, 'resize', resizeCanvases);
  recalc();
  resizeCanvases();
}
