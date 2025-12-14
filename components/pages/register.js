// pages/register.page.js
import { AuthAPI, TokenManager } from '../mock-api.component.js';
import { Utils } from '../utils.component.js';
import { navigate } from '../router.js';

export function renderRegister(app) {
  app.innerHTML = `
    <div class="container">
      <div class="auth-container">
        <div class="auth-card card">
          <div class="card-body" style="padding: 48px 40px;">
            <div class="auth-header">
              <h1>Бүртгүүлэх</h1>
              <p style="color: var(--text-muted);">Шинэ данс үүсгэх</p>
            </div>

            <form id="registerForm">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">Овог</label>
                  <input type="text" id="lastName" class="form-control" placeholder="Овог" required>
                </div>
                <div class="form-group">
                  <label class="form-label required">Нэр</label>
                  <input type="text" id="firstName" class="form-control" placeholder="Нэр" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label required">Имэйл хаяг</label>
                <input type="email" id="email" class="form-control" placeholder="name@example.com" required>
                <div class="form-feedback invalid" id="emailError" style="display:none;"></div>
              </div>

              <div class="form-group">
                <label class="form-label required">Утасны дугаар</label>
                <input type="tel" id="phone" class="form-control" placeholder="99119911"
                       required maxlength="8" pattern="[0-9]{8}">
                <span class="form-text">8 оронтой дугаар оруулна уу</span>
              </div>

              <div class="form-group">
                <label class="form-label required">Регистрийн дугаар</label>
                <input type="text" id="registerId" class="form-control" placeholder="АА12345678"
                       required pattern="[А-Яа-яӨҮөүA-Za-z]{2}[0-9]{8}">
                <span class="form-text">2 үсэг + 8 тоо (жишээ: АА12345678)</span>
              </div>

              <div class="form-group">
                <label class="form-label required">Иргэний үнэмлэх (Урд тал)</label>
                <div style="border:2px dashed var(--line); border-radius: var(--radius); padding:20px; text-align:center; cursor:pointer; transition: var(--transition);"
                     id="idFrontUpload">
                  <input type="file" id="idFront" accept="image/*,.pdf" style="display:none;" required>
                  <div style="font-size:48px; margin-bottom:8px;"></div>
                  <div style="font-weight:600; margin-bottom:4px;" id="idFrontText">Файл сонгох</div>
                  <div style="font-size:13px; color: var(--text-muted);">PNG, JPG эсвэл PDF</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label required">Иргэний үнэмлэх (Ард тал)</label>
                <div style="border:2px dashed var(--line); border-radius: var(--radius); padding:20px; text-align:center; cursor:pointer; transition: var(--transition);"
                     id="idBackUpload">
                  <input type="file" id="idBack" accept="image/*,.pdf" style="display:none;" required>
                  <div style="font-size:48px; margin-bottom:8px;"></div>
                  <div style="font-weight:600; margin-bottom:4px;" id="idBackText">Файл сонгох</div>
                  <div style="font-size:13px; color: var(--text-muted);">PNG, JPG эсвэл PDF</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label required">Нууц үг</label>
                <div style="position:relative;">
                  <input type="password" id="password" class="form-control" placeholder="••••••••"
                         required style="padding-right:40px;">
                  <button type="button" id="togglePassword"
                          style="position:absolute; right:10px; top:50%; transform: translateY(-50%);
                                 background:none; border:none; cursor:pointer; font-size:18px;">Show</button>
                </div>
                <div class="password-strength">
                  <div class="password-strength-bar" id="strengthBar"></div>
                </div>
                <span class="form-text" id="strengthText">Доод тал нь 8 тэмдэгт</span>
              </div>

              <div class="form-group">
                <label class="form-label required">Нууц үг давтах</label>
                <div style="position:relative;">
                  <input type="password" id="confirmPassword" class="form-control" placeholder="••••••••"
                         required style="padding-right:40px;">
                  <button type="button" id="toggleConfirmPassword"
                          style="position:absolute; right:10px; top:50%; transform: translateY(-50%);
                                 background:none; border:none; cursor:pointer; font-size:18px;">Show</button>
                </div>
                <div class="form-feedback invalid" id="passwordError" style="display:none;"></div>
              </div>

              <div class="form-check" style="margin-bottom:24px;">
                <input type="checkbox" id="terms" required>
                <label for="terms">
                  <a href="#" style="text-decoration: underline;">Үйлчилгээний нөхцөл</a> болон
                  <a href="#" style="text-decoration: underline;">Нууцлалын бодлого</a>-той танилцаж зөвшөөрч байна
                </label>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg">
                Бүртгүүлэх
              </button>
            </form>

            <div class="auth-footer">
              Аль хэдийн бүртгэлтэй юу?
              <a href="#/login" data-link>Нэвтрэх</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function afterRenderRegister() {
  // Хэрвээ аль хэдийн нэвтэрсэн бол SPA dashboard руу
  if (TokenManager.isAuthenticated()) {
    navigate('#/dashboard', { replace: true });
    return;
  }

  // listener давхардахгүй
  if (window.__regAbort) window.__regAbort.abort();
  const ac = new AbortController();
  window.__regAbort = ac;
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn, { signal: ac.signal });

  const form = document.getElementById('registerForm');

  const password = document.getElementById('password');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');

  const confirmPassword = document.getElementById('confirmPassword');
  const passwordError = document.getElementById('passwordError');

  const email = document.getElementById('email');
  const emailError = document.getElementById('emailError');

  const phoneInput = document.getElementById('phone');

  const idFrontInput = document.getElementById('idFront');
  const idBackInput = document.getElementById('idBack');
  const idFrontUpload = document.getElementById('idFrontUpload');
  const idBackUpload = document.getElementById('idBackUpload');
  const idFrontText = document.getElementById('idFrontText');
  const idBackText = document.getElementById('idBackText');

  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

  // helper
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  on(phoneInput, 'input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 8);
  });

  on(idFrontUpload, 'click', () => idFrontInput.click());
  on(idBackUpload, 'click', () => idBackInput.click());

  on(idFrontInput, 'change', (e) => {
    if (e.target.files?.length) {
      idFrontText.textContent = e.target.files[0].name;
      idFrontText.style.color = 'var(--primary)';
    }
  });

  on(idBackInput, 'change', (e) => {
    if (e.target.files?.length) {
      idBackText.textContent = e.target.files[0].name;
      idBackText.style.color = 'var(--primary)';
    }
  });

  on(password, 'input', () => {
    const val = password.value;
    let strength = 0;

    if (val.length >= 8) strength++;
    if (val.match(/[a-z]/) && val.match(/[A-Z]/)) strength++;
    if (val.match(/[0-9]/)) strength++;
    if (val.match(/[^a-zA-Z0-9]/)) strength++;

    strengthBar.className = 'password-strength-bar';

    if (strength <= 1) {
      strengthBar.classList.add('weak');
      strengthText.textContent = 'Сул нууц үг';
      strengthText.style.color = '#ff6b6b';
    } else if (strength <= 3) {
      strengthBar.classList.add('medium');
      strengthText.textContent = 'Дунд зэргийн нууц үг';
      strengthText.style.color = '#ffa500';
    } else {
      strengthBar.classList.add('strong');
      strengthText.textContent = 'Хүчтэй нууц үг';
      strengthText.style.color = '#10b981';
    }
  });

  on(email, 'blur', () => {
    if (!Utils.isValidEmail(email.value)) {
      emailError.textContent = 'Зөв имэйл хаяг оруулна уу';
      emailError.style.display = 'block';
      email.classList.add('is-invalid');
    } else {
      emailError.style.display = 'none';
      email.classList.remove('is-invalid');
    }
  });

  on(confirmPassword, 'blur', () => {
    if (password.value !== confirmPassword.value) {
      passwordError.textContent = 'Нууц үг таарахгүй байна';
      passwordError.style.display = 'block';
      confirmPassword.classList.add('is-invalid');
    } else {
      passwordError.style.display = 'none';
      confirmPassword.classList.remove('is-invalid');
    }
  });

  on(togglePassword, 'click', () => {
    const type = password.type === 'password' ? 'text' : 'password';
    password.type = type;
    togglePassword.textContent = type === 'password' ? 'Show' : 'Hide';
  });

  on(toggleConfirmPassword, 'click', () => {
    const type = confirmPassword.type === 'password' ? 'text' : 'password';
    confirmPassword.type = type;
    toggleConfirmPassword.textContent = type === 'password' ? 'Show' : 'Hide';
  });

  on(form, 'submit', async (e) => {
    e.preventDefault();

    const lastName = document.getElementById('lastName').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const emailValue = email.value.trim();
    const phoneValue = document.getElementById('phone').value.trim();
    const registerIdValue = document.getElementById('registerId').value.trim();
    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;
    const termsAccepted = document.getElementById('terms').checked;
    const submitBtn = form.querySelector('button[type="submit"]');

    const idFrontFile = idFrontInput.files[0];
    const idBackFile = idBackInput.files[0];

    if (passwordValue !== confirmPasswordValue) {
      Utils.showToast('Нууц үг таарахгүй байна', 'error');
      return;
    }
    if (!termsAccepted) {
      Utils.showToast('Үйлчилгээний нөхцөлийг зөвшөөрнө үү', 'error');
      return;
    }
    if (passwordValue.length < 8) {
      Utils.showToast('Нууц үг доод тал нь 8 тэмдэгт байх ёстой', 'error');
      return;
    }
    if (!idFrontFile || !idBackFile) {
      Utils.showToast('Иргэний үнэмлэхний зургийг оруулна уу', 'error');
      return;
    }
    if (phoneValue.length !== 8 || !/^[0-9]{8}$/.test(phoneValue)) {
      Utils.showToast('Утасны дугаар 8 оронтой байх ёстой', 'error');
      return;
    }
    const registerIdPattern = /^[А-Яа-яӨҮөүA-Za-z]{2}[0-9]{8}$/;
    if (!registerIdPattern.test(registerIdValue)) {
      Utils.showToast('Регистрийн дугаарын формат буруу байна', 'error');
      return;
    }
    if (!Utils.isValidEmail(emailValue)) {
      Utils.showToast('Зөв имэйл хаяг оруулна уу', 'error');
      return;
    }

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Бүртгэж байна...';

    try {
      Utils.showToast('Бүртгэл үүсгэж байна...', 'info');

      const idFrontBase64 = await fileToBase64(idFrontFile);
      const idBackBase64 = await fileToBase64(idBackFile);

      await AuthAPI.register({
        firstName,
        lastName,
        email: emailValue,
        phone: phoneValue,
        registerId: registerIdValue,
        password: passwordValue,
        idFront: idFrontBase64,
        idBack: idBackBase64,
      });

      Utils.showToast('Амжилттай бүртгэгдлээ!', 'success');

      // SPA redirect
      navigate('#/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      Utils.showToast(err?.message || 'Бүртгэл үүсгэхэд алдаа гарлаа', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
