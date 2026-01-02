
import router from '../router.js';

class LoanCalculatorPage extends HTMLElement {
    constructor() {
        super();
        this.amount = 1000000;
        this.interest = 2; // Fixed 2% annual interest rate
        this.duration = 12;
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.calculate();
    }

        calculatePMT() {
        const P = this.amount;
        const r = (this.interest / 100) / 12; // Monthly interest rate
        const n = this.duration;

        if (r === 0) {
            return P / n;
        }

        const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayment = monthlyPayment * n;
        const totalInterest = totalPayment - P;

        return {
            monthly: Math.round(monthlyPayment),
            total: Math.round(totalPayment),
            interest: Math.round(totalInterest)
        };
    }

        calculate() {
        const result = this.calculatePMT();

        // Update display
        this.querySelector('.monthly-payment').textContent = this.formatNumber(result.monthly);
        this.querySelector('.total-payment').textContent = this.formatNumber(result.total);
        this.querySelector('.total-interest').textContent = this.formatNumber(result.interest);

        // Update chart/bars
        this.updateChart(result);
    }

        updateChart(result) {
        const principalPercent = (this.amount / result.total) * 100;
        const interestPercent = (result.interest / result.total) * 100;

        this.querySelector('.principal-bar').style.width = `${principalPercent}%`;
        this.querySelector('.interest-bar').style.width = `${interestPercent}%`;

        this.querySelector('.principal-amount').textContent = this.formatNumber(this.amount);
        this.querySelector('.interest-amount').textContent = this.formatNumber(result.interest);
    }

        formatNumber(num) {
        return new Intl.NumberFormat('mn-MN').format(num);
    }

        attachEventListeners() {
        // Amount slider
        const amountSlider = this.querySelector('#amount');
        const amountValue = this.querySelector('.amount-value');
        amountSlider.addEventListener('input', (e) => {
            this.amount = parseInt(e.target.value);
            amountValue.textContent = this.formatNumber(this.amount);
            this.calculate();
        });

        // Duration slider
        const durationSlider = this.querySelector('#duration');
        const durationValue = this.querySelector('.duration-value');
        durationSlider.addEventListener('input', (e) => {
            this.duration = parseInt(e.target.value);
            durationValue.textContent = this.duration;
            this.calculate();
        });

        // Apply loan button
        const applyBtn = this.querySelector('.apply-loan-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                router.navigate('/loan-application');
            });
        }
    }

        render() {
        this.innerHTML = `
            <div class="calculator-page">
                <app-nav></app-nav>

                <div class="container">
                    <div class="calculator-container">
                        <h1 class="page-title">Зээлийн тооцоолуур</h1>
                        <p class="page-subtitle">Сарын төлбөрөө тооцоолоорой</p>

                        <div class="calculator-grid">
                            <!-- Input Controls -->
                            <div class="card calculator-controls">
                                <h2 class="card-title">Параметрүүд</h2>

                                <div class="control-group">
                                    <label class="control-label">
                                        Зээлийн дүн: <span class="amount-value">${this.formatNumber(this.amount)}</span>₮
                                    </label>
                                    <input
                                        type="range"
                                        id="amount"
                                        class="range-input"
                                        min="100000"
                                        max="50000000"
                                        step="100000"
                                        value="${this.amount}"
                                    />
                                    <div class="range-labels">
                                        <span>100,000₮</span>
                                        <span>50,000,000₮</span>
                                    </div>
                                </div>

                                <div class="control-group">
                                    <div class="fixed-interest-display">
                                        <label class="control-label">Жилийн хүү (тогтмол)</label>
                                        <div class="interest-badge">
                                            <span class="interest-value-fixed">${this.interest}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="control-group">
                                    <label class="control-label">
                                        Хугацаа: <span class="duration-value">${this.duration}</span> сар
                                    </label>
                                    <input
                                        type="range"
                                        id="duration"
                                        class="range-input"
                                        min="3"
                                        max="60"
                                        step="1"
                                        value="${this.duration}"
                                    />
                                    <div class="range-labels">
                                        <span>3 сар</span>
                                        <span>60 сар</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Results -->
                            <div class="card calculator-results">
                                <h2 class="card-title">Үр дүн</h2>

                                <div class="result-item highlight">
                                    <div class="result-label">Сарын төлбөр</div>
                                    <div class="result-value monthly-payment">0</div>
                                    <div class="result-unit">₮</div>
                                </div>

                                <div class="result-divider"></div>

                                <div class="result-item">
                                    <div class="result-label">Нийт төлбөр</div>
                                    <div class="result-value total-payment">0</div>
                                    <div class="result-unit">₮</div>
                                </div>

                                <div class="result-item">
                                    <div class="result-label">Нийт хүү</div>
                                    <div class="result-value total-interest">0</div>
                                    <div class="result-unit">₮</div>
                                </div>

                                <!-- Visual Chart -->
                                <div class="chart-container">
                                    <div class="chart-bar">
                                        <div class="principal-bar"></div>
                                        <div class="interest-bar"></div>
                                    </div>
                                    <div class="chart-legend">
                                        <div class="legend-item">
                                            <span class="legend-color principal"></span>
                                            <span>Үндсэн: <span class="principal-amount">0</span>₮</span>
                                        </div>
                                        <div class="legend-item">
                                            <span class="legend-color interest"></span>
                                            <span>Хүү: <span class="interest-amount">0</span>₮</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Apply Loan Button -->
                                <button class="btn btn-primary btn-block apply-loan-btn">
                                    Зээл хүсэх
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                .calculator-page {
                    min-height: 100vh;
                    background: var(--bg);
                    padding-bottom: 4rem;
                }

                .calculator-container {
                    padding: 4rem 0;
                }

                .page-title {
                    font-size: var(--font-4xl);
                    font-weight: var(--font-bold);
                    text-align: center;
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 0.5rem;
                }

                .page-subtitle {
                    text-align: center;
                    color: var(--text-secondary);
                    font-size: var(--font-lg);
                    margin-bottom: 3rem;
                }

                .calculator-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 2rem;
                }

                .calculator-controls,
                .calculator-results {
                    padding: 2rem;
                }

                .card-title {
                    font-size: var(--font-2xl);
                    font-weight: var(--font-semibold);
                    margin-bottom: 2rem;
                    color: var(--text);
                }

                .control-group {
                    margin-bottom: 2.5rem;
                }

                .control-label {
                    display: block;
                    font-weight: var(--font-medium);
                    margin-bottom: 1rem;
                    color: var(--text);
                }

                .control-label span {
                    color: var(--primary);
                    font-weight: var(--font-bold);
                }

                .range-input {
                    width: 100%;
                    height: 8px;
                    border-radius: var(--radius-full);
                    background: var(--bg-secondary);
                    outline: none;
                    -webkit-appearance: none;
                }

                .range-input::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--gradient-primary);
                    cursor: pointer;
                    box-shadow: var(--shadow);
                }

                .range-input::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--gradient-primary);
                    cursor: pointer;
                    border: none;
                }

                .range-labels {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 0.5rem;
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                }

                .fixed-interest-display {
                    text-align: center;
                }

                .interest-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem 2rem;
                    background: var(--gradient-primary);
                    border-radius: var(--radius-xl);
                    margin-top: 0.5rem;
                }

                .interest-value-fixed {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    color: var(--white);
                }

                .result-item {
                    margin-bottom: 1.5rem;
                }

                .result-item.highlight {
                    background: var(--gradient-primary);
                    padding: 1.5rem;
                    border-radius: var(--radius-xl);
                    color: var(--white);
                }

                .result-label {
                    font-size: var(--font-sm);
                    margin-bottom: 0.5rem;
                    opacity: 0.9;
                }

                .result-value {
                    font-size: var(--font-4xl);
                    font-weight: var(--font-bold);
                    margin-bottom: 0.25rem;
                }

                .result-unit {
                    font-size: var(--font-lg);
                }

                .result-divider {
                    height: 1px;
                    background: var(--line);
                    margin: 1.5rem 0;
                }

                .chart-container {
                    margin-top: 2rem;
                }

                .chart-bar {
                    height: 40px;
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    display: flex;
                    background: var(--bg-secondary);
                }

                .principal-bar {
                    background: var(--gradient-primary);
                    transition: width var(--transition);
                }

                .interest-bar {
                    background: var(--gradient-secondary);
                    transition: width var(--transition);
                }

                .chart-legend {
                    display: flex;
                    gap: 2rem;
                    margin-top: 1rem;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: var(--font-sm);
                }

                .legend-color {
                    width: 16px;
                    height: 16px;
                    border-radius: var(--radius-sm);
                }

                .legend-color.principal {
                    background: var(--gradient-primary);
                }

                .legend-color.interest {
                    background: var(--gradient-secondary);
                }

                .apply-loan-btn {
                    margin-top: 2rem;
                    padding: 1rem 2rem;
                    font-size: var(--font-lg);
                    font-weight: var(--font-semibold);
                }

                @media (max-width: 1024px) {
                    .calculator-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 640px) {
                    .page-title {
                        font-size: var(--font-3xl);
                    }

                    .result-value {
                        font-size: var(--font-3xl);
                    }
                }
            </style>
        `;
    }
}

// Register the custom element
customElements.define('loan-calculator-page', LoanCalculatorPage);

export default LoanCalculatorPage;
