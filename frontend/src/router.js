
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.guards = [];

                window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

        addRoute(path, config) {
        this.routes.set(path, config);
        return this;
    }

        addRoutes(routes) {
        routes.forEach(route => {
            this.addRoute(route.path, {
                component: route.component,
                meta: route.meta || {}
            });
        });
        return this;
    }

        beforeEach(guard) {
        this.guards.push(guard);
        return this;
    }

        navigate(path) {
        window.location.hash = path;
    }

        back() {
        window.history.back();
    }

        replace(path) {
        window.location.replace(`#${path}`);
    }

        getCurrentPath() {
        return window.location.hash.slice(1) || '/';
    }

        async handleRoute() {
        const path = this.getCurrentPath();
        const route = this.findRoute(path);

        if (!route) {
            console.warn(`Route not found: ${path}`);
            this.navigate('/404');
            return;
        }

                const canNavigate = await this.runGuards(route, this.currentRoute);

        if (!canNavigate) {
            return;
        }

                this.currentRoute = route;

                this.renderComponent(route);
    }

        findRoute(path) {
                if (this.routes.has(path)) {
            return { path, ...this.routes.get(path) };
        }

                for (const [routePath, config] of this.routes) {
            const params = this.matchRoute(routePath, path);
            if (params) {
                return { path: routePath, params, ...config };
            }
        }

        return null;
    }

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

        renderComponent(route) {
        const app = document.getElementById('app');

        if (!app) {
            console.error('App root element not found');
            return;
        }

                app.innerHTML = '';

                const component = document.createElement(route.component);

                if (route.params) {
            Object.entries(route.params).forEach(([key, value]) => {
                component.setAttribute(key, value);
            });
        }

                app.appendChild(component);

                window.dispatchEvent(new CustomEvent('route-changed', {
            detail: { route }
        }));
    }
}

const router = new Router();

export default router;
