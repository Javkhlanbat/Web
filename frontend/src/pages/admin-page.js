class AdminPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<app-nav></app-nav><div class="container" style="padding: 4rem 0"><h1>Admin Page - Coming Soon</h1></div><app-footer></app-footer>';
    }
}
customElements.define('admin-page', AdminPage);
export default AdminPage;
