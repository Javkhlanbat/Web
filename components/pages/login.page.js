
// pages/login.page.js
import { TokenManager, UserManager, AuthAPI } from '../mock-api.component.js';
import { Utils } from '../utils.component.js';
import { navigate } from '../router.js';

function getRedirectPath() {
  const hash = window.location.hash || '';
  const q = hash.split('?')[1] || '';
  const params = new URLSearchParams(q);
  return params.get('redirect'); // жишээ: "/dashboard"
}

export function renderLogin(app) {
  app.innerHTML = `
    <div class="container">
      <div class="auth-container">
        <div class="auth-card card">
          <div class="card-body auth-card-body">
            <div class="auth-header">
              <h1>Тавтай морил!</h1>
              <p class="muted">Өөрийн дансанд нэвтрэх</p>
            </div>

            <form id="loginForm">
              <div class="form-group">
                <label class="form-label required">Утасны дугаар</label>
                <input type="tel" id="loginPhone" class="form-control" placeholder="99001122" required maxlength="8">
                <span class="form-text">8 оронтой дугаар</span>
              </div>

              <div class="form-group">
                <label class="form-label required">Нууц үг</label>
                <div class="password-wrap">
                  <input type="password" id="loginPassword" class="form-control" placeholder="••••••••" required>
                  <button type="button" id="toggleLoginPassword" class="toggle-pass">Show</button>
                </div>
              </div>

              <div class="login-row">
                <div class="form-check">
                  <input type="checkbox" id="remember">
                  <label for="remember">Сануул</label>
                </div>
                <a href="#/forgot" data-link class="forgot-link">Нууц үг мартсан?</a>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" id="loginSubmitBtn">
                Нэвтрэх
              </button>
            </form>

            <div class="auth-footer">
              Данс байхгүй юу? <a href="#/register" data-link>Бүртгүүлэх</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function afterRenderLogin() {
  // listener давхардахгүй
  if (window.__loginAbort) window.__loginAbort.abort();
  const ac = new AbortController();
  window.__loginAbort = ac;
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn, { signal: ac.signal });

  // already logged in -> redirect
  if (TokenManager.isAuthenticated()) {
    const user = UserManager.getUser();
    if (user && user.is_admin) {
      navigate('#/admin', { replace: true });
    } else {
      navigate('#/dashboard', { replace: true });
    }
    return;
  }

  const phoneInput = document.getElementById('loginPhone');
  const loginPassword = document.getElementById('loginPassword');
  const toggleBtn = document.getElementById('toggleLoginPassword');
  const form = document.getElementById('loginForm');
  const submitBtn = document.getElementById('loginSubmitBtn');

  // phone format
  on(phoneInput, 'input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 8);
  });

  // toggle password
  on(toggleBtn, 'click', () => {
    const type = loginPassword.type === 'password' ? 'text' : 'password';
    loginPassword.type = type;
    toggleBtn.textContent = type === 'password' ? 'Show' : 'Hide';
  });

  // submit
  on(form, 'submit', async (e) => {
    e.preventDefault();

    const phone = (phoneInput.value || '').trim();
    const password = loginPassword.value || '';

    if (!phone || phone.length < 8) {
      Utils.showToast('Утасны дугаар буруу байна', 'error');
      return;
    }
    if (!password) {
      Utils.showToast('Нууц үг оруулна уу', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Нэвтэрч байна...';

    try {
      Utils.showToast('Нэвтэрч байна...', 'info');

      await AuthAPI.login({ phone, password });

      Utils.showToast('Амжилттай нэвтэрлээ!', 'success');

      const user = UserManager.getUser();
      const redirect = getRedirectPath();

      // redirect параметр байвал тэр рүү (жишээ: /dashboard)
      if (redirect) {
        navigate(`#/` + redirect.replace(/^\//, ''), { replace: true });
        return;
      }

      if (user && user.is_admin) navigate('#/admin', { replace: true });
      else navigate('#/dashboard', { replace: true });

    } catch (err) {
      console.error('Login error:', err);
      Utils.showToast(err.message || 'Нэвтрэх үед алдаа гарлаа', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Нэвтрэх';
    }
  });
}
