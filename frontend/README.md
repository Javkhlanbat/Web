# OmniCredit Frontend - Web Components Architecture

## 🎨 Architecture Overview

Frontend нь **Vanilla JavaScript + Web Components** ашигладаг:
- ❌ Фреймворк байхгүй (React, Vue, Angular гэх мэт)
- ✅ Modern Web Standards ашигладаг
- ✅ Custom Elements API
- ✅ ES6 Modules
- ✅ Vite build tool

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── app-nav.js
│   │   ├── app-footer.js
│   │   ├── loan-card.js
│   │   └── theme-toggle.js
│   ├── pages/             # Page-level components
│   │   ├── home-page.js
│   │   ├── dashboard-page.js
│   │   ├── login-page.js
│   │   └── ...
│   ├── services/          # API integration
│   │   └── api.js
│   ├── styles/            # Global CSS
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── components.css
│   │   └── theme.css
│   ├── main.js            # Entry point
│   └── router.js          # Custom router
├── public/
│   ├── sw.js              # Service Worker
│   └── favicon.svg
├── index.html             # HTML entry
├── vite.config.js         # Build configuration
└── package.json
```

---

## 🧩 Web Components

### Custom Element Anatomy

```javascript
// Basic structure of a Web Component
class MyComponent extends HTMLElement {
    constructor() {
        super();
        // Initialize state
        this.data = null;
    }

    connectedCallback() {
        // Called when component is added to DOM
        this.render();
        this.attachEventListeners();
        this.loadData();
    }

    disconnectedCallback() {
        // Called when removed from DOM
        // Cleanup event listeners
    }

    render() {
        // Update innerHTML
        this.innerHTML = `<div>...</div>`;
    }

    attachEventListeners() {
        // Add event listeners
        this.querySelector('.btn').addEventListener('click', ...);
    }

    async loadData() {
        // Fetch data from API
        this.data = await API.getData();
        this.render();
    }
}

// Register the component
customElements.define('my-component', MyComponent);
```

### Component Lifecycle

```
1. constructor()
   ↓
2. connectedCallback()  ← Component added to DOM
   ↓
3. render()             ← Initial render
   ↓
4. attachEventListeners() ← Setup interactions
   ↓
5. loadData()           ← Fetch API data
   ↓
6. render()             ← Re-render with data
   ↓
7. disconnectedCallback() ← Component removed (cleanup)
```

---

## 📂 Core Files Explanation

### 1. `main.js` - Application Entry Point

```javascript
import router from './router.js';
import { TokenManager, UserManager } from './services/api.js';

// Critical components - load immediately
import './components/app-nav.js';
import './components/app-footer.js';

// Critical pages - load immediately
import './pages/home-page.js';
import './pages/login-page.js';

// Other pages - lazy loaded on navigation
// Automatically loaded by router when needed

// Define routes
const routes = [
  { path: '/', component: 'home-page', meta: { public: true } },
  { path: '/login', component: 'login-page', meta: { public: true } },
  { path: '/dashboard', component: 'dashboard-page', meta: { requiresAuth: true } },
  // ...
];

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = TokenManager.isAuthenticated();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');  // Redirect to login
  } else {
    next();  // Allow navigation
  }
});

// Register routes
router.addRoutes(routes);
```

**Үүрэг:**
- Components import хийх
- Routes тодорхойлох
- Navigation guards тохируулах
- Application initialization

### 2. `router.js` - Custom Hash Router

```javascript
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.guards = [];

        // Listen to hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    addRoute(path, config) {
        this.routes.set(path, config);
    }

    navigate(path) {
        window.location.hash = path;  // #/dashboard
    }

    async handleRoute() {
        const path = this.getCurrentPath();  // Get path from hash
        const route = this.findRoute(path);

        // Run navigation guards
        const canNavigate = await this.runGuards(route, this.currentRoute);
        if (!canNavigate) return;

        // Render component
        await this.renderComponent(route);
    }

    async renderComponent(route) {
        const app = document.getElementById('app');

        // Lazy load if not yet loaded
        if (!customElements.get(route.component)) {
            await import(`./pages/${route.component}.js`);
        }

        // Create and mount component
        const component = document.createElement(route.component);
        app.innerHTML = '';
        app.appendChild(component);
    }
}
```

**Үүрэг:**
- Hash-based navigation (#/path)
- Lazy loading хуудсууд
- Navigation guards (auth check)
- History management

### 3. `services/api.js` - API Integration

```javascript
// Base API configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    TIMEOUT: 10000
};

// Generic API request handler
const api = {
    async request(endpoint, options = {}) {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;

        // Add auth token
        const token = TokenManager.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                timeout: API_CONFIG.TIMEOUT
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'API Error');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

// Specialized API services
const AuthAPI = {
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.token) {
            TokenManager.setToken(response.token);
            UserManager.setUser(response.user);
        }
        return response;
    },

    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.token) {
            TokenManager.setToken(response.token);
            UserManager.setUser(response.user);
        }
        return response;
    },

    async getProfile() {
        return await api.get('/auth/profile');
    }
};

const LoansAPI = {
    async applyForLoan(loanData) {
        return await api.post('/loans/apply', loanData);
    },

    async getMyLoans() {
        return await api.get('/loans/my-loans');
    },

    async getLoanById(loanId) {
        return await api.get(`/loans/${loanId}`);
    }
};

// Token Management
const TokenManager = {
    setToken(token) {
        localStorage.setItem('authToken', token);
    },

    getToken() {
        return localStorage.getItem('authToken');
    },

    removeToken() {
        localStorage.removeItem('authToken');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

// User Management
const UserManager = {
    setUser(user) {
        localStorage.setItem('userData', JSON.stringify(user));
    },

    getUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },

    removeUser() {
        localStorage.removeItem('userData');
    },

    logout() {
        TokenManager.removeToken();
        this.removeUser();
        window.location.hash = '/login';
    }
};
```

**Үүрэг:**
- Backend API-тэй харилцах
- JWT token удирдах
- localStorage-д мэдээлэл хадгалах
- Error handling

---

## 📄 Page Components

### Example: `dashboard-page.js`

```javascript
import { AuthAPI, LoansAPI, WalletAPI } from '../services/api.js';
import router from '../router.js';

class DashboardPage extends HTMLElement {
    constructor() {
        super();
        // State initialization
        this.isLoading = true;
        this.userData = null;
        this.loans = [];
        this.wallet = null;
        this.stats = {
            totalLoansCount: 0,
            activeLoansAmount: 0,
            walletBalance: 0,
            totalPaymentsAmount: 0
        };
    }

    connectedCallback() {
        this.render();  // Initial render with loading state
        this.loadDashboardData();  // Fetch data
    }

    async loadDashboardData() {
        try {
            this.isLoading = true;
            this.updateLoadingState();

            // Fetch data in parallel
            const [userData, loansResponse, walletResponse] = await Promise.all([
                AuthAPI.getProfile(),
                LoansAPI.getMyLoans(),
                WalletAPI.getMyWallet()
            ]);

            this.userData = userData;
            this.loans = loansResponse.loans || [];
            this.wallet = walletResponse.wallet || null;

            this.calculateStats();  // Calculate statistics
            this.isLoading = false;
            this.render();  // Re-render with data
        } catch (error) {
            console.error('Error:', error);
            this.showError(error.message);
        }
    }

    calculateStats() {
        this.stats.totalLoansCount = this.loans.length;
        this.stats.activeLoansAmount = this.loans
            .filter(loan => ['active', 'approved', 'disbursed'].includes(loan.status))
            .reduce((sum, loan) => sum + parseFloat(loan.amount || 0), 0);
        this.stats.walletBalance = this.wallet ? parseFloat(this.wallet.balance || 0) : 0;
    }

    render() {
        this.innerHTML = `
            <div class="dashboard-page">
                <app-nav></app-nav>

                <div class="container">
                    ${this.isLoading ? this.getLoadingHTML() : this.getDashboardHTML()}
                </div>

                <app-footer></app-footer>
            </div>

            <style>
                /* Component-specific styles */
                .dashboard-page { ... }
                .stat-card { ... }
            </style>
        `;

        // Attach event listeners after render
        this.attachEventListeners();
    }

    getDashboardHTML() {
        return `
            <h1>Dashboard</h1>
            <div class="stats-grid">
                <div class="stat-card">
                    <p>Total Loans</p>
                    <h2>${this.stats.totalLoansCount}</h2>
                </div>
                <!-- More stats... -->
            </div>
        `;
    }

    attachEventListeners() {
        // Apply loan button
        const applyLoanBtns = this.querySelectorAll('.apply-loan-btn');
        applyLoanBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                router.navigate('/loan-application');
            });
        });
    }
}

customElements.define('dashboard-page', DashboardPage);
export default DashboardPage;
```

**Pattern:**
1. **State** - constructor-д тодорхойлох
2. **Lifecycle** - connectedCallback-д render + loadData
3. **Data Loading** - async functions, Promise.all ашиглах
4. **Rendering** - Template literals ашиглах
5. **Event Handling** - render-ийн дараа attachEventListeners
6. **Styles** - Component-specific styles inline

---

## 🎨 CSS Architecture

### 1. `variables.css` - CSS Custom Properties

```css
:root {
  /* Colors */
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #e0e7ff;

  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;

  --text: #1f2937;
  --text-muted: #6b7280;
  --bg: #f9fafb;
  --card: #ffffff;
  --line: #e5e7eb;

  /* Typography */
  --font-xs: 0.75rem;    /* 12px */
  --font-sm: 0.875rem;   /* 14px */
  --font-base: 1rem;     /* 16px */
  --font-lg: 1.125rem;   /* 18px */
  --font-xl: 1.25rem;    /* 20px */
  --font-2xl: 1.5rem;    /* 24px */
  --font-3xl: 1.875rem;  /* 30px */

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Radius */
  --radius: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* Shadows */
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);

  /* Transitions */
  --transition: all 0.3s ease;
}

/* Dark Mode */
[data-theme="dark"] {
  --text: #f9fafb;
  --text-muted: #d1d5db;
  --bg: #111827;
  --card: #1f2937;
  --line: #374151;
}
```

### 2. `base.css` - Base Styles

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: var(--font-base);
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
}

/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.card {
  background: var(--card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow);
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

/* Forms */
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  font-size: var(--font-base);
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
}
```

### 3. Component Styles (Scoped)

Компонент бүр өөрийн style-тай:

```javascript
render() {
    this.innerHTML = `
        <div class="my-component">
            <h1>Title</h1>
        </div>

        <style>
            /* Scoped to this component instance */
            .my-component {
                padding: 1rem;
                background: var(--card);
            }

            .my-component h1 {
                color: var(--primary);
            }
        </style>
    `;
}
```

**Note**: Энэ scoped биш, гэхдээ unique class names ашигласнаар conflict-аас зайлсхийдэг.

---

## 🔄 Data Flow

### 1. Component → API → Component

```
Component (UI)
    ↓
  Event (button click)
    ↓
  Handler function
    ↓
  API Service call
    ↓
  Backend API
    ↓
  Response
    ↓
  Update component state
    ↓
  Re-render
    ↓
  Updated UI
```

### 2. Example: Login Flow

```javascript
// 1. User clicks login button
<button class="btn" onclick="this.handleLogin()">Login</button>

// 2. Handler function
async handleLogin(e) {
    e.preventDefault();

    const email = this.querySelector('#email').value;
    const password = this.querySelector('#password').value;

    try {
        // 3. API call
        const response = await AuthAPI.login({ email, password });

        // 4. Token & user saved automatically in AuthAPI.login()

        // 5. Navigate to dashboard
        router.navigate('/dashboard');
    } catch (error) {
        // 6. Show error
        this.showError(error.message);
    }
}
```

---

## 🚀 Performance Optimizations

### 1. Lazy Loading

```javascript
// Only load pages when needed
async renderComponent(route) {
    if (!customElements.get(route.component)) {
        await import(`./pages/${route.component}.js`);
    }
    // ...
}
```

### 2. Code Splitting (vite.config.js)

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['./src/services/api.js', './src/router.js'],
          'pages-auth': ['./src/pages/login-page.js', './src/pages/register-page.js'],
          'pages-main': ['./src/pages/dashboard-page.js', './src/pages/home-page.js'],
          // ...
        }
      }
    }
  }
});
```

### 3. CSS Async Loading

```html
<!-- Critical CSS -->
<link rel="stylesheet" href="/src/styles/variables.css">
<link rel="stylesheet" href="/src/styles/base.css">

<!-- Non-critical CSS async -->
<link rel="preload" href="/src/styles/components.css" as="style"
      onload="this.onload=null;this.rel='stylesheet'">
```

### 4. Service Worker (Caching)

```javascript
// sw.js
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached version or fetch new
        return cachedResponse || fetch(event.request);
      })
  );
});
```

---

## 🧪 Development Tips

### 1. Debugging Components

```javascript
// In browser console
// Check if component is registered
customElements.get('dashboard-page');

// Get component instance
const dashboard = document.querySelector('dashboard-page');
console.log(dashboard.loans);  // Access state

// Trigger methods
dashboard.loadDashboardData();
```

### 2. Hot Module Replacement (HMR)

Vite автоматаар дэмждэг:
```bash
npm run dev
# File өөрчлөхөд автоматаар reload хийнэ
```

### 3. State Management

Component state:
```javascript
constructor() {
    super();
    // Component-level state
    this.data = null;
    this.isLoading = false;
}

// Update state
this.data = newData;
this.render();  // Re-render
```

Global state (localStorage):
```javascript
// Save
TokenManager.setToken(token);
UserManager.setUser(user);

// Load
const user = UserManager.getUser();
```

---

## 📦 Build & Deploy

### Development
```bash
npm run dev
# → http://localhost:5173
```

### Production Build
```bash
npm run build
# → dist/ folder

# Files will be:
# - Minified
# - Code-split
# - Optimized
```

### Preview Production Build
```bash
npm run preview
# → http://localhost:3000
```

---

## 🎯 Best Practices

### 1. Component Structure
```javascript
class MyPage extends HTMLElement {
    constructor() { /* Initialize state */ }
    connectedCallback() { /* Lifecycle */ }
    disconnectedCallback() { /* Cleanup */ }

    async loadData() { /* API calls */ }
    calculateStats() { /* Business logic */ }

    render() { /* UI */ }
    attachEventListeners() { /* Events */ }

    showError() { /* Error handling */ }
    formatNumber() { /* Utility methods */ }
}
```

### 2. Error Handling
```javascript
try {
    const response = await API.getData();
} catch (error) {
    console.error('Error:', error);
    this.showError(error.message);
}
```

### 3. Event Delegation
```javascript
// ✅ Good - using querySelectorAll + forEach
const buttons = this.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleClick();
    });
});

// ❌ Bad - single querySelector (only gets first)
const button = this.querySelector('.btn');
button.addEventListener('click', ...);
```

### 4. Prevent Default
```javascript
btn.addEventListener('click', (e) => {
    e.preventDefault();  // Prevent default browser behavior
    router.navigate('/path');
});
```

---

## 🔍 Troubleshooting

### Component не харагдаж байна
```javascript
// 1. Registered эсэхийг шалгах
console.log(customElements.get('my-component'));

// 2. Import хийсэн эсэх
import './pages/my-page.js';

// 3. define() дуудсан эсэх
customElements.define('my-page', MyPage);
```

### Event listeners ажиллахгүй байна
```javascript
// Render-ийн ДАРАА attachEventListeners дуудах
render() {
    this.innerHTML = '...';
}
// Then:
this.attachEventListeners();
```

### API дуудлага амжилтгүй
```javascript
// 1. Token шалгах
console.log(TokenManager.getToken());

// 2. Backend ажиллаж байгаа эсэх
// http://localhost:5000

// 3. Network tab шалгах (F12)
```

---

Асуулт байвал GitHub Issues дээр асууна уу!
