class ProfilePage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<app-nav></app-nav><div class="container" style="padding: 4rem 0"><h1>Profile Page - Coming Soon</h1></div><app-footer></app-footer>`;
    }
}
customElements.define("profile-page", ProfilePage);
export default ProfilePage;
