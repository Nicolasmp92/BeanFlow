// resources/js/pages/login.js

// Evita duplicar listeners en renders SPA
const BOUND_FLAG = 'bound';

function initPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeOffIcon = document.getElementById('eyeOffIcon');

    if (!passwordInput || !toggleBtn || !eyeIcon || !eyeOffIcon) return;
    if (toggleBtn.dataset[BOUND_FLAG] === '1') return;
    toggleBtn.dataset[BOUND_FLAG] = '1';

    toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        // alterna íconos
        eyeIcon.classList.toggle('hidden', !isPassword);
        eyeOffIcon.classList.toggle('hidden', isPassword);

        // accesibilidad
        toggleBtn.setAttribute('aria-pressed', String(isPassword));
        toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
}

function applyRememberedEmail() {
    const emailInput = document.getElementById('email');
    const rememberEmail = document.getElementById('rememberEmail');
    if (!emailInput || !rememberEmail) return;

    // precarga si existe
    const saved = localStorage.getItem('login_email');
    if (saved) {
        emailInput.value = saved;
        rememberEmail.checked = true;
        // dispara input para que Livewire reciba el valor
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // guarda/borra al cambiar el checkbox
    if (rememberEmail.dataset[BOUND_FLAG] !== '1') {
        rememberEmail.addEventListener('change', () => {
            if (rememberEmail.checked) {
                localStorage.setItem('login_email', emailInput.value || '');
            } else {
                localStorage.removeItem('login_email');
            }
        });
        rememberEmail.dataset[BOUND_FLAG] = '1';
    }

    // sincroniza mientras se escribe
    if (emailInput.dataset[BOUND_FLAG] !== '1') {
        emailInput.addEventListener('input', () => {
            if (rememberEmail.checked) {
                localStorage.setItem('login_email', emailInput.value || '');
            }
        });
        emailInput.dataset[BOUND_FLAG] = '1';
    }
}

// Punto único de registro para la página de login
export function registerLoginPage() {
    initPasswordToggle();
    applyRememberedEmail();
}

// Auto-registro en eventos de ciclo de vida
document.addEventListener('DOMContentLoaded', registerLoginPage);
document.addEventListener('livewire:navigated', registerLoginPage);
// Si Livewire hace morph parcial que reemplace solo parte del form:
document.addEventListener('livewire:update', registerLoginPage);
