/**
 * Custom Router for Web Components
 * Supports:
 * - Hash-based routing (#/path)
 * - Route guards (authentication, authorization)
 * - Dynamic route parameters
 * - Programmatic navigation
 */

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.guards = [];

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    /**
     * Register a route
     * @param {string} path - Route path (e.g., '/login', '/dashboard')
     * @param {Object} config - Route configuration
     * @param {string} config.component - Web component tag name
     * @param {Object} config.meta - Route metadata (auth required, roles, etc.)
     */
    addRoute(path, config) {
        this.routes.set(path, config);
        return this;
    }

    /**
     * Add multiple routes at once
     * @param {Array} routes - Array of route objects
     */
    addRoutes(routes) {
        routes.forEach(route => {
            this.addRoute(route.path, {
                component: route.component,
                meta: route.meta || {}
            });
        });
        return this;
    }

    /**
     * Add a navigation guard
     * @param {Function} guard - Guard function (to, from, next)
     */
    beforeEach(guard) {
        this.guards.push(guard);
        return this;
    }

    /**
     * Navigate to a route
     * @param {string} path - Route path
     */
    navigate(path) {
        window.location.hash = path;
    }

    /**
     * Go back in history
     */
    back() {
        window.history.back();
    }

    /**
     * Replace current route
     * @param {string} path - Route path
     */
    replace(path) {
        window.location.replace(`#${path}`);
    }

    /**
     * Get current route path
     */
    getCurrentPath() {
        return window.location.hash.slice(1) || '/';
    }

    /**
     * Handle route changes
     */
    async handleRoute() {
        const path = this.getCurrentPath();
        const route = this.findRoute(path);

        if (!route) {
            console.warn(`Route not found: ${path}`);
            this.navigate('/404');
            return;
        }

        // Run navigation guards
        const canNavigate = await this.runGuards(route, this.currentRoute);

        if (!canNavigate) {
            return;
        }

        // Update current route
        this.currentRoute = route;

        // Render the component
        this.renderComponent(route);
    }

    /**
     * Find route by path
     * @param {string} path - Route path
     */
    findRoute(path) {
        // Try exact match first
        if (this.routes.has(path)) {
            return { path, ...this.routes.get(path) };
        }

        // Try pattern matching for dynamic routes
        for (const [routePath, config] of this.routes) {
            const params = this.matchRoute(routePath, path);
            if (params) {
                return { path: routePath, params, ...config };
            }
        }

        return null;
    }

    /**
     * Match route with parameters
     * @param {string} routePath - Route pattern
     * @param {string} actualPath - Actual path
     */
    matchRoute(routePath, actualPath) {
        const routeParts = routePath.split('/').filter(Boolean);
        const pathParts = actualPath.split('/').filter(Boolean);

        if (routeParts.length !== pathParts.length) {
            return null;
        }

        const params = {};

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                params[routeParts[i].slice(1)] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
                return null;
            }
        }

        return Object.keys(params).length > 0 ? params : null;
    }

    /**
     * Run navigation guards
     * @param {Object} to - Target route
     * @param {Object} from - Current route
     */
    async runGuards(to, from) {
        for (const guard of this.guards) {
            const result = await new Promise((resolve) => {
                guard(to, from, (path) => {
                    if (path === false) {
                        resolve(false);
                    } else if (typeof path === 'string') {
                        this.navigate(path);
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            });

            if (!result) {
                return false;
            }
        }

        return true;
    }

    /**
     * Render component for route
     * @param {Object} route - Route object
     */
    renderComponent(route) {
        const app = document.getElementById('app');

        if (!app) {
            console.error('App root element not found');
            return;
        }

        // Clear existing content
        app.innerHTML = '';

        // Create the web component
        const component = document.createElement(route.component);

        // Pass route params as properties
        if (route.params) {
            Object.entries(route.params).forEach(([key, value]) => {
                component.setAttribute(key, value);
            });
        }

        // Append to app
        app.appendChild(component);

        // Dispatch route change event
        window.dispatchEvent(new CustomEvent('route-changed', {
            detail: { route }
        }));
    }
}

// Create singleton instance
const router = new Router();

// Export router
export default router;
