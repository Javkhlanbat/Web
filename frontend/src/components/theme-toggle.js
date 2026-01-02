/**
 * Theme Toggle Web Component
 * Switches between light and dark themes
 */

class ThemeToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentTheme = this.getTheme();
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    /**
     * Get current theme from localStorage or system preference
     */
    getTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateButton();
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * Update button appearance
     */
    updateButton() {
        const button = this.shadowRoot.querySelector('.theme-toggle');
        const icon = this.shadowRoot.querySelector('.theme-icon');

        if (this.currentTheme === 'dark') {
            icon.textContent = '🌙';
            button.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.textContent = '☀️';
            button.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const button = this.shadowRoot.querySelector('.theme-toggle');
        button.addEventListener('click', () => this.toggleTheme());
    }

    /**
     * Render component
     */
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }

                .theme-toggle {
                    position: relative;
                    width: 60px;
                    height: 30px;
                    background: var(--bg-secondary, #f3f4f6);
                    border: 2px solid var(--line, #e5e7eb);
                    border-radius: 9999px;
                    cursor: pointer;
                    transition: all 200ms ease-in-out;
                    overflow: hidden;
                }

                .theme-toggle:hover {
                    border-color: var(--primary, #6366f1);
                }

                .theme-toggle:focus-visible {
                    outline: 2px solid var(--primary, #6366f1);
                    outline-offset: 2px;
                }

                .theme-icon {
                    position: absolute;
                    top: 50%;
                    left: 4px;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--primary, #6366f1);
                    border-radius: 50%;
                    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 12px;
                }

                [data-theme="dark"] .theme-icon,
                :host([theme="dark"]) .theme-icon {
                    left: calc(100% - 24px);
                    background: var(--accent, #8b5cf6);
                }

                @media (prefers-reduced-motion: reduce) {
                    .theme-toggle,
                    .theme-icon {
                        transition: none;
                    }
                }
            </style>

            <button
                class="theme-toggle"
                role="switch"
                aria-checked="${this.currentTheme === 'dark'}"
                aria-label="${this.currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}"
            >
                <span class="theme-icon">${this.currentTheme === 'dark' ? '🌙' : '☀️'}</span>
            </button>
        `;
    }
}

// Register the custom element
customElements.define('theme-toggle', ThemeToggle);
