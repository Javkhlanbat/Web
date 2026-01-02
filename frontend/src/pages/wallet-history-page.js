class WalletHistoryPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<app-nav></app-nav><div class="container" style="padding: 4rem 0"><h1>Wallet History Page - Coming Soon</h1></div><app-footer></app-footer>';
    }
}
customElements.define('wallet-history-page', WalletHistoryPage);
export default WalletHistoryPage;
