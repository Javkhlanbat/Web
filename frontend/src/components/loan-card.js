/**
 * Loan Card Web Component
 * Displays loan information in a card format
 */

class LoanCard extends HTMLElement {
    static get observedAttributes() {
        return ['loan-id', 'amount', 'status', 'interest', 'duration', 'monthly-payment'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    /**
     * Get status badge class
     */
    getStatusClass(status) {
        const statusMap = {
            'pending': 'badge-warning',
            'approved': 'badge-success',
            'rejected': 'badge-danger',
            'active': 'badge-info',
            'completed': 'badge-success',
            'paid': 'badge-success'
        };
        return statusMap[status] || 'badge-info';
    }

    /**
     * Get status text in Mongolian
     */
    getStatusText(status) {
        const statusMap = {
            'pending': 'Хүлээгдэж буй',
            'approved': 'Зөвшөөрөгдсөн',
            'rejected': 'Татгалзсан',
            'active': 'Идэвхтэй',
            'completed': 'Дууссан',
            'paid': 'Төлөгдсөн'
        };
        return statusMap[status] || status;
    }

    /**
     * Format number with comma separator
     */
    formatNumber(num) {
        return new Intl.NumberFormat('mn-MN').format(num);
    }

    /**
     * Render component
     */
    render() {
        const loanId = this.getAttribute('loan-id') || '';
        const amount = this.getAttribute('amount') || '0';
        const status = this.getAttribute('status') || 'pending';
        const interest = this.getAttribute('interest') || '0';
        const duration = this.getAttribute('duration') || '0';
        const monthlyPayment = this.getAttribute('monthly-payment') || '0';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .loan-card {
                    background: var(--card, #ffffff);
                    border: 1px solid var(--card-border, #e5e7eb);
                    border-radius: var(--radius-xl, 1rem);
                    padding: 1.5rem;
                    box-shadow: var(--shadow, 0 4px 6px rgba(0, 0, 0, 0.1));
                    transition: all 200ms ease-in-out;
                }

                .loan-card:hover {
                    box-shadow: var(--shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.1));
                    border-color: var(--primary-light, #818cf8);
                    transform: translateY(-2px);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--line, #e5e7eb);
                }

                .loan-id {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--text-muted, #6b7280);
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .badge-success { background: #d1fae5; color: #065f46; }
                .badge-warning { background: #fef3c7; color: #92400e; }
                .badge-danger { background: #fee2e2; color: #991b1b; }
                .badge-info { background: #dbeafe; color: #1e40af; }

                .card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .info-label {
                    font-size: 0.875rem;
                    color: var(--text-secondary, #4b5563);
                }

                .info-value {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text, #111827);
                }

                .amount-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: var(--gradient-primary, linear-gradient(135deg, #6366f1, #8b5cf6));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            </style>

            <div class="loan-card">
                <div class="card-header">
                    <span class="loan-id">Зээл #${loanId}</span>
                    <span class="badge ${this.getStatusClass(status)}">${this.getStatusText(status)}</span>
                </div>

                <div class="card-body">
                    <div class="info-row">
                        <span class="info-label">Зээлийн дүн:</span>
                        <span class="amount-value">${this.formatNumber(amount)}₮</span>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Хүү:</span>
                        <span class="info-value">${interest}%</span>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Хугацаа:</span>
                        <span class="info-value">${duration} сар</span>
                    </div>

                    <div class="info-row">
                        <span class="info-label">Сарын төлбөр:</span>
                        <span class="info-value">${this.formatNumber(monthlyPayment)}₮</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// Register the custom element
customElements.define('loan-card', LoanCard);

export default LoanCard;
