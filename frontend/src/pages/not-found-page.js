/**
 * 404 Not Found Page Web Component
 */

import router from '../router.js';

class NotFoundPage extends HTMLElement {
    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.querySelectorAll('a[href^="#/"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.getAttribute('href').substring(1);
                router.navigate(path);
            });
        });
    }

    render() {
        this.innerHTML = `
            <div class="not-found-page">
                <app-nav></app-nav>

                <div class="not-found-container">
                    <div class="not-found-content">
                        <div class="error-icon">404</div>
                        <h1 class="error-title">Хуудас олдсонгүй</h1>
                        <p class="error-description">
                            Уучлаарай, таны хайж буй хуудас олдсонгүй.
                        </p>
                        <div class="error-actions">
                            <a href="#/" class="btn btn-primary">Нүүр хуудас руу буцах</a>
                            <button onclick="history.back()" class="btn btn-outline">Буцах</button>
                        </div>
                    </div>
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                .not-found-page {
                    min-height: 100vh;
                    background: var(--bg);
                }

                .not-found-container {
                    min-height: calc(100vh - 300px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem;
                }

                .not-found-content {
                    text-align: center;
                    max-width: 600px;
                    animation: fadeIn var(--transition);
                }

                .error-icon {
                    font-size: 8rem;
                    font-weight: var(--font-bold);
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                    margin-bottom: 1rem;
                }

                .error-title {
                    font-size: var(--font-3xl);
                    font-weight: var(--font-bold);
                    color: var(--text);
                    margin-bottom: 1rem;
                }

                .error-description {
                    font-size: var(--font-lg);
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                }

                .error-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            </style>
        `;
    }
}

// Register the custom element
customElements.define('not-found-page', NotFoundPage);

export default NotFoundPage;
