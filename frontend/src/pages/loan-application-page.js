
import { LoansAPI } from '../services/api.js';
import router from '../router.js';

class LoanApplicationPage extends HTMLElement {
    constructor() {
        super();
        this.isLoading = false;
        this.loanType = 'consumer';
        this.formData = {
            amount: '',
            duration: 12, // Default 12 months for consumer
            purpose: '',
            loanType: 'consumer'
        };
        this.monthlyPayment = 0;
        this.totalPayment = 0;
        this.totalInterest = 0;
        this.ANNUAL_INTEREST_RATE = 0.02; // 2% annual interest rate
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.calculateLoanDetails();
    }

        calculateMonthlyPayment(principal, months) {
        if (!principal || principal <= 0 || !months || months <= 0) {
            return 0;
        }

        const monthlyRate = this.ANNUAL_INTEREST_RATE / 12;

        if (monthlyRate === 0) {
            return principal / months;
        }

        const numerator = monthlyRate * Math.pow(1 + monthlyRate, months);
        const denominator = Math.pow(1 + monthlyRate, months) - 1;

        return principal * (numerator / denominator);
    }

        calculateLoanDetails() {
        const amount = parseFloat(this.formData.amount) || 0;
        const duration = parseInt(this.formData.duration) || 0;

        if (amount > 0 && duration > 0) {
            this.monthlyPayment = this.calculateMonthlyPayment(amount, duration);
            this.totalPayment = this.monthlyPayment * duration;
            this.totalInterest = this.totalPayment - amount;
        } else {
            this.monthlyPayment = 0;
            this.totalPayment = 0;
            this.totalInterest = 0;
        }

        this.updateCalculationDisplay();
    }

        updateCalculationDisplay() {
        const monthlyEl = this.querySelector('.monthly-payment-value');
        const totalEl = this.querySelector('.total-payment-value');
        const interestEl = this.querySelector('.total-interest-value');

        if (monthlyEl) {
            monthlyEl.textContent = `${this.formatNumber(Math.round(this.monthlyPayment))}₮`;
        }
        if (totalEl) {
            totalEl.textContent = `${this.formatNumber(Math.round(this.totalPayment))}₮`;
        }
        if (interestEl) {
            interestEl.textContent = `${this.formatNumber(Math.round(this.totalInterest))}₮`;
        }
    }

        formatNumber(num) {
        return new Intl.NumberFormat('mn-MN').format(num || 0);
    }

    
        handleAmountChange(e) {
        const value = e.target.value;
        this.formData.amount = value;
        this.calculateLoanDetails();
    }

        handleDurationChange(e) {
        const value = e.target.value;
        this.formData.duration = parseInt(value) || 0;

        // Update duration display
        const durationValueEl = this.querySelector('.duration-value');
        if (durationValueEl) {
            durationValueEl.textContent = this.formData.duration;
        }

        this.calculateLoanDetails();
    }


        validateForm() {
        const errors = [];
        const amount = parseFloat(this.formData.amount);
        const duration = parseInt(this.formData.duration);

        // Amount validation
        if (!this.formData.amount || isNaN(amount) || amount <= 0) {
            errors.push('Зээлийн дүн оруулна уу');
        }

        // Consumer loan duration validation
        if (this.loanType === 'consumer') {
            if (!duration || duration < 2 || duration > 24) {
                errors.push('Хугацаа 2-24 сарын хооронд байх ёстой');
            }
        }

        // Purpose validation
        if (!this.formData.purpose || this.formData.purpose.trim().length < 10) {
            errors.push('Зээлийн зориулалтыг дор хаяж 10 тэмдэгтээр бичнэ үү');
        }

        return errors;
    }

        async handleSubmit(e) {
        e.preventDefault();

        if (this.isLoading) return;

        // Get form values
        this.formData.amount = this.querySelector('#loan-amount').value.trim();
        this.formData.duration = parseInt(this.querySelector('#loan-duration')?.value || 6);
        this.formData.purpose = this.querySelector('#loan-purpose').value.trim();

        // Validate
        const errors = this.validateForm();
        if (errors.length > 0) {
            this.showError(errors.join(', '));
            return;
        }

        try {
            this.isLoading = true;
            this.updateButtonState();

            // Prepare loan data
            const loanData = {
                amount: parseFloat(this.formData.amount),
                duration_months: parseInt(this.formData.duration),
                interest_rate: this.ANNUAL_INTEREST_RATE,
                purpose: this.formData.purpose,
                loan_type: this.loanType
            };

            // Submit to API
            const response = await LoansAPI.applyForLoan(loanData);

            if (response && response.loan) {
                this.showSuccess('Зээлийн хүсэлт амжилттай илгээгдлээ! Та хариуг удахгүй хүлээн авна.');

                // Redirect to my loans page after 2 seconds
                setTimeout(() => {
                    router.navigate('/my-loans');
                }, 2000);
            } else {
                throw new Error('Зээлийн хүсэлт илгээхэд алдаа гарлаа');
            }
        } catch (error) {
            console.error('Loan application error:', error);
            this.showError(error.message || 'Зээлийн хүсэлт илгээхэд алдаа гарлаа');
        } finally {
            this.isLoading = false;
            this.updateButtonState();
        }
    }

        updateButtonState() {
        const btn = this.querySelector('.submit-btn');
        if (btn) {
            btn.disabled = this.isLoading;
            btn.textContent = this.isLoading ? 'Түр хүлээнэ үү...' : 'Зээл хүсэх';
        }
    }

        showError(message) {
        const errorEl = this.querySelector('.error-message');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';

            // Scroll to error
            errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                errorEl.style.display = 'none';
            }, 6000);
        }
    }

        showSuccess(message) {
        const successEl = this.querySelector('.success-message');
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';

            // Scroll to success
            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

        attachEventListeners() {
        // Form inputs
        const amountInput = this.querySelector('#loan-amount');
        const durationInput = this.querySelector('#loan-duration');

        if (amountInput) {
            amountInput.addEventListener('input', (e) => this.handleAmountChange(e));
        }
        if (durationInput) {
            durationInput.addEventListener('input', (e) => this.handleDurationChange(e));
        }

        // Form submission
        const form = this.querySelector('.loan-application-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Cancel button
        const cancelBtn = this.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => router.back());
        }
    }

        getLoanTypeTabsHTML() {
        return `
            <div class="loan-type-tabs">
                <button
                    class="loan-type-tab consumer-tab ${this.loanType === 'consumer' ? 'active' : ''}"
                    type="button"
                >
                    <div class="tab-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="tab-content">
                        <h3 class="tab-title">Хэрэглээний зээл</h3>
                        <p class="tab-description">2-24 сар, 2% хүү</p>
                    </div>
                </button>
            </div>
        `;
    }

        getLoanInfoHTML() {
        return `
            <div class="loan-info-card">
                <div class="info-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h3>Хэрэглээний зээлийн мэдээлэл</h3>
                </div>
                <ul class="info-list">
                    <li>Хугацаа: 2-24 сар хүртэл</li>
                    <li>Жилийн хүү: 2%</li>
                    <li>Урьдчилгаа: Шаардлагагүй</li>
                    <li>Зээлийн дүн: Таны төлбөрийн чадвараас хамаарна</li>
                    <li>Зориулалт: Хувийн хэрэглээ, төлбөр, бусад зардал</li>
                </ul>
            </div>
        `;
    }

        getFormFieldsHTML() {
        return `
            <div class="form-section">
                <div class="form-group">
                    <label for="loan-amount" class="form-label">
                        Зээлийн дүн (₮) *
                    </label>
                    <input
                        type="number"
                        id="loan-amount"
                        class="form-input"
                        placeholder="Дүнгээ оруулна уу"
                        min="1000"
                        step="1000"
                        value="${this.formData.amount}"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="loan-duration" class="form-label">
                        Хугацаа (сар) *
                    </label>
                    <div class="duration-input-wrapper">
                        <input
                            type="range"
                            id="loan-duration"
                            class="form-range"
                            min="2"
                            max="24"
                            step="1"
                            value="${this.formData.duration}"
                        />
                        <div class="duration-display">
                            <span class="duration-value">${this.formData.duration}</span>
                            <span class="duration-label">сар</span>
                        </div>
                    </div>
                    <div class="duration-markers">
                        <span>2 сар</span>
                        <span>12 сар</span>
                        <span>24 сар</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Жилийн хүү</label>
                    <div class="interest-rate-display">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>2% (тогтмол)</span>
                    </div>
                </div>


                <div class="form-group">
                    <label for="loan-purpose" class="form-label">
                        Зээлийн зориулалт *
                    </label>
                    <textarea
                        id="loan-purpose"
                        class="form-textarea"
                        placeholder="Зээлийг юунд зарцуулах талаар дэлгэрэнгүй бичнэ үү..."
                        rows="4"
                        minlength="10"
                        required
                    >${this.formData.purpose}</textarea>
                    <small class="form-help">Дор хаяж 10 тэмдэгт оруулна уу</small>
                </div>
            </div>
        `;
    }

        getCalculationSummaryHTML() {
        return `
            <div class="calculation-summary card">
                <h3 class="summary-title">Төлбөрийн мэдээлэл</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <div class="summary-label">Сарын төлбөр</div>
                        <div class="summary-value monthly-payment-value">${this.formatNumber(Math.round(this.monthlyPayment))}₮</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Нийт төлөх дүн</div>
                        <div class="summary-value total-payment-value">${this.formatNumber(Math.round(this.totalPayment))}₮</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Нийт хүү</div>
                        <div class="summary-value total-interest-value">${this.formatNumber(Math.round(this.totalInterest))}₮</div>
                    </div>
                </div>
                <div class="workflow-info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p>Зээл зөвшөөрөгдсөний дараа мөнгө таны түрийвч рүү шилжинэ. Дараа нь та банк руугаа шилжүүлж болно.</p>
                </div>
            </div>
        `;
    }

        render() {
        this.innerHTML = `
            <div class="loan-application-page">
                <app-nav></app-nav>

                <div class="loan-application-container container">
                    <div class="page-header">
                        <h1 class="page-title">Зээл хүсэх</h1>
                        <p class="page-subtitle">Өөрт тохирсон зээлийн төрлөө сонгоод хүсэлт илгээнэ үү</p>
                    </div>

                    <div class="error-message alert alert-danger" style="display: none;"></div>
                    <div class="success-message alert alert-success" style="display: none;"></div>

                    <div class="loan-application-content">
                        ${this.getLoanTypeTabsHTML()}

                        <div class="loan-application-grid">
                            <div class="loan-form-section">
                                <div class="card form-card">
                                    <form class="loan-application-form">
                                        ${this.getFormFieldsHTML()}

                                        <div class="form-actions">
                                            <button type="button" class="btn btn-outline cancel-btn">
                                                Цуцлах
                                            </button>
                                            <button type="submit" class="btn btn-primary submit-btn">
                                                Зээл хүсэх
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div class="loan-info-section">
                                ${this.getCalculationSummaryHTML()}
                                ${this.getLoanInfoHTML()}
                            </div>
                        </div>
                    </div>
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                .loan-application-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .loan-application-container {
                    padding: 2rem 1rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    animation: slideInDown 0.5s ease-out;
                }

                .page-title {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                }

                .page-subtitle {
                    font-size: var(--font-base);
                    color: var(--text-muted);
                    margin: 0;
                }

                                .loan-type-tabs {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-bottom: 2rem;
                    animation: slideInUp 0.5s ease-out;
                }

                .loan-type-tab {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: var(--card);
                    border: 2px solid var(--card-border);
                    border-radius: var(--radius-xl);
                    cursor: pointer;
                    transition: all var(--transition);
                    text-align: left;
                }

                .loan-type-tab:hover {
                    border-color: var(--primary);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }

                .loan-type-tab.active {
                    border-color: var(--primary);
                    background: var(--primary-light);
                    box-shadow: var(--shadow-hover);
                }

                .tab-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: var(--radius-lg);
                    background: var(--gradient-primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .loan-type-tab.active .tab-icon {
                    animation: pulse 2s infinite;
                }

                .tab-icon svg {
                    width: 28px;
                    height: 28px;
                }

                .tab-content {
                    flex: 1;
                }

                .tab-title {
                    font-size: var(--font-lg);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                    margin: 0 0 0.25rem 0;
                }

                .tab-description {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                    margin: 0;
                }

                                .loan-application-grid {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 2rem;
                    animation: slideInUp 0.5s ease-out 0.1s;
                    animation-fill-mode: both;
                }

                .loan-form-section {
                    min-width: 0;
                }

                .loan-info-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                                .form-card {
                    padding: 2rem;
                }

                .form-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                                .duration-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 0.5rem;
                }

                .form-range {
                    flex: 1;
                    height: 6px;
                    border-radius: 3px;
                    background: var(--line);
                    outline: none;
                    -webkit-appearance: none;
                }

                .form-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--gradient-primary);
                    cursor: pointer;
                    transition: transform var(--transition);
                }

                .form-range::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }

                .form-range::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--gradient-primary);
                    cursor: pointer;
                    border: none;
                    transition: transform var(--transition);
                }

                .form-range::-moz-range-thumb:hover {
                    transform: scale(1.2);
                }

                .duration-display {
                    display: flex;
                    align-items: baseline;
                    gap: 0.25rem;
                    min-width: 80px;
                    padding: 0.5rem 1rem;
                    background: var(--primary-light);
                    border-radius: var(--radius);
                }

                .duration-value {
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                    color: var(--primary);
                }

                .duration-label {
                    font-size: var(--font-sm);
                    color: var(--text-muted);
                }

                .duration-markers {
                    display: flex;
                    justify-content: space-between;
                    font-size: var(--font-xs);
                    color: var(--text-muted);
                    padding: 0 0.5rem;
                }

                                .fixed-duration-display {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border: 1px solid var(--line);
                    border-radius: var(--radius-lg);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                }

                .fixed-duration-display svg {
                    width: 24px;
                    height: 24px;
                    color: var(--primary);
                }

                                .interest-rate-display {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border: 1px solid var(--line);
                    border-radius: var(--radius-lg);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                }

                .interest-rate-display svg {
                    width: 24px;
                    height: 24px;
                    color: var(--success);
                }

                                .calculation-summary {
                    padding: 1.5rem;
                    background: var(--gradient-primary);
                    color: white;
                }

                .summary-title {
                    font-size: var(--font-xl);
                    font-weight: var(--font-semibold);
                    margin: 0 0 1.5rem 0;
                    text-align: center;
                }

                .summary-grid {
                    display: grid;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .summary-item {
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-lg);
                    backdrop-filter: blur(10px);
                }

                .summary-label {
                    font-size: var(--font-sm);
                    opacity: 0.9;
                    margin-bottom: 0.5rem;
                }

                .summary-value {
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                }

                .workflow-info {
                    display: flex;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-lg);
                    font-size: var(--font-sm);
                    line-height: var(--leading-relaxed);
                }

                .workflow-info svg {
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                    margin-top: 0.125rem;
                }

                .workflow-info p {
                    margin: 0;
                }

                                .loan-info-card {
                    padding: 1.5rem;
                }

                .info-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--line);
                }

                .info-header svg {
                    width: 24px;
                    height: 24px;
                    color: var(--primary);
                }

                .info-header h3 {
                    font-size: var(--font-lg);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                    margin: 0;
                }

                .info-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .info-list li {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.5rem;
                    font-size: var(--font-sm);
                    color: var(--text-secondary);
                    line-height: var(--leading-relaxed);
                }

                .info-list li::before {
                    content: "•";
                    color: var(--primary);
                    font-weight: var(--font-bold);
                    font-size: var(--font-lg);
                }

                                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid var(--line);
                }

                .form-actions .btn {
                    flex: 1;
                }

                                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }

                                @media (max-width: 1024px) {
                    .loan-application-grid {
                        grid-template-columns: 1fr;
                    }

                    .loan-info-section {
                        order: -1;
                    }
                }

                @media (max-width: 768px) {
                    .loan-application-container {
                        padding: 1rem;
                    }

                    .loan-type-tabs {
                        grid-template-columns: 1fr;
                    }

                    .form-card {
                        padding: 1.5rem;
                    }

                    .page-title {
                        font-size: var(--font-2xl);
                    }

                    .tab-title {
                        font-size: var(--font-base);
                    }

                    .summary-value {
                        font-size: var(--font-xl);
                    }

                    .form-actions {
                        flex-direction: column;
                    }
                }

                /* Promo Code Styles */
                .promo-code-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .promo-code-input {
                    text-transform: uppercase;
                    flex: 1;
                }

                .promo-badge {
                    padding: 0.375rem 0.75rem;
                    border-radius: var(--radius);
                    font-size: 0.75rem;
                    font-weight: var(--font-medium);
                    white-space: nowrap;
                }

                .promo-valid {
                    background: var(--success-light);
                    color: var(--success);
                }

                .promo-invalid {
                    background: var(--danger-light);
                    color: var(--danger);
                }

                @media (max-width: 480px) {
                    .page-title {
                        font-size: var(--font-xl);
                    }

                    .loan-type-tab {
                        padding: 1rem;
                    }

                    .tab-icon {
                        width: 40px;
                        height: 40px;
                    }

                    .tab-icon svg {
                        width: 24px;
                        height: 24px;
                    }

                    .form-card {
                        padding: 1rem;
                    }

                    .promo-code-wrapper {
                        flex-direction: column;
                        align-items: stretch;
                    }
                }
            </style>
        `;
    }
}

// Register the custom element
customElements.define('loan-application-page', LoanApplicationPage);

export default LoanApplicationPage;
