class PaymentHistoryPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<app-nav></app-nav><div class="container" style="padding: 4rem 0"><h1>Payment History Page - Coming Soon</h1></div><app-footer></app-footer>';
    }
}
customElements.define('payment-history-page', PaymentHistoryPage);
export default PaymentHistoryPage;
