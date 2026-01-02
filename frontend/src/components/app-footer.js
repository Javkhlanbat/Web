/**
 * Footer Web Component
 * Application footer with links and copyright
 */

class AppFooter extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        const currentYear = new Date().getFullYear();

        this.innerHTML = `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h3 class="footer-title">OmniCredit</h3>
                            <p class="footer-text">Найдвартай зээлийн платформ</p>
                        </div>

                        <div class="footer-section">
                            <h4 class="footer-heading">Холбоосууд</h4>
                            <ul class="footer-links">
                                <li><a href="#/" class="footer-link">Нүүр</a></li>
                                <li><a href="#/aboutus" class="footer-link">Бидний тухай</a></li>
                                <li><a href="#/faq" class="footer-link">Түгээмэл асуулт</a></li>
                            </ul>
                        </div>

                        <div class="footer-section">
                            <h4 class="footer-heading">Үйлчилгээ</h4>
                            <ul class="footer-links">
                                <li><a href="#/zeelhuudas" class="footer-link">Зээлийн тооцоолуур</a></li>
                                <li><a href="#/application" class="footer-link">Зээл хүсэх</a></li>
                            </ul>
                        </div>

                        <div class="footer-section">
                            <h4 class="footer-heading">Холбоо барих</h4>
                            <p class="footer-text">И-мэйл: info@omnicredit.mn</p>
                            <p class="footer-text">Утас: +976 7777-7777</p>
                        </div>
                    </div>

                    <div class="footer-bottom">
                        <p class="copyright">© ${currentYear} OmniCredit. Бүх эрх хуулиар хамгаалагдсан.</p>
                    </div>
                </div>
            </footer>

            <style>
                .footer {
                    background: var(--bg-secondary);
                    border-top: 1px solid var(--line);
                    padding: 3rem 0 1.5rem;
                    margin-top: 4rem;
                }

                .footer-content {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                .footer-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .footer-title {
                    font-size: var(--font-2xl);
                    font-weight: var(--font-bold);
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0;
                }

                .footer-heading {
                    font-size: var(--font-lg);
                    font-weight: var(--font-semibold);
                    color: var(--text);
                    margin: 0;
                }

                .footer-text {
                    color: var(--text-muted);
                    margin: 0;
                    font-size: var(--font-sm);
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .footer-link {
                    color: var(--text-muted);
                    text-decoration: none;
                    font-size: var(--font-sm);
                    transition: color var(--transition);
                }

                .footer-link:hover {
                    color: var(--primary);
                }

                .footer-bottom {
                    padding-top: 2rem;
                    border-top: 1px solid var(--line);
                    text-align: center;
                }

                .copyright {
                    color: var(--text-muted);
                    font-size: var(--font-sm);
                    margin: 0;
                }

                @media (max-width: 640px) {
                    .footer-content {
                        grid-template-columns: 1fr;
                    }

                    .footer {
                        padding: 2rem 0 1rem;
                        margin-top: 2rem;
                    }
                }
            </style>
        `;
    }
}

// Register the custom element
customElements.define('app-footer', AppFooter);

export default AppFooter;
