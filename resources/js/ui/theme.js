// resources/js/ui/theme.js

/* ===============================
   Preferencias persistidas
   =============================== */
const KEY_MODE      = 'theme:mode';          // 'light' | 'dark' | 'system'
const KEY_ACCENT    = 'theme:accent';      // 'orange' | 'emerald' | 'purple' | 'sky' | ...
const KEY_NEUTRAL   = 'theme:neutral';    // 'zinc' | 'gray' | 'slate' | 'neutral' | 'stone'

/* ===============================
   Helpers
   =============================== */
function getSystemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function onSystemThemeChange(cb) {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener?.('change', () => cb(mq.matches));
    mq.addListener?.((e) => cb(e.matches)); // fallback muy viejo
}

/* ===============================
   APLICACIÓN GLOBAL (toda la app)
   =============================== */
function computeDarkFromMode(mode) {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return getSystemPrefersDark(); // 'system'
}

function applyGlobalTheme() {
    const html = document.documentElement;
    const mode = localStorage.getItem(KEY_MODE) || 'system';
    const dark = computeDarkFromMode(mode);
    const accent = localStorage.getItem(KEY_ACCENT) || 'orange';
    const neutral = localStorage.getItem(KEY_NEUTRAL) || 'zinc';

    // Clase dark para Tailwind (modo global)
    html.classList.toggle('dark', dark);
    html.setAttribute('data-mode', mode);

    // Paletas
    html.setAttribute('data-accent', accent);
    html.setAttribute('data-neutral', neutral);
}

// Aplica solo paletas (NO toca html.dark). Útil en páginas con scope (login).
function applyGlobalPalettesOnly() {
    const html = document.documentElement;
    const accent = localStorage.getItem(KEY_ACCENT) || 'orange';
    const neutral = localStorage.getItem(KEY_NEUTRAL) || 'zinc';

    html.setAttribute('data-accent', accent);
    html.setAttribute('data-neutral', neutral);
}

/* ===============================
   API pública (global)
   =============================== */
export function setThemeMode(mode /* 'light'|'dark'|'system' */) {
    localStorage.setItem(KEY_MODE, mode);
    applyGlobalTheme();
}
export function setThemeAccent(name) {
    localStorage.setItem(KEY_ACCENT, name);
    document.documentElement.setAttribute('data-accent', name);
}
export function setThemeNeutral(name) {
    localStorage.setItem(KEY_NEUTRAL, name);
    document.documentElement.setAttribute('data-neutral', name);
}

/* ===============================
   TOGGLE SÓLO PARA LOGIN (scope)
   =============================== */
/**
 * Para accesibilidad en el login:
 * – No toca el tema global de la app.
 * – Alterna 'dark' en un contenedor específico (por ejemplo #auth-root).
 * – Persiste en localStorage con una llave separada.
 */
const KEY_AUTH_SCOPE = 'auth:theme'; // 'light' | 'dark'

export function registerAuthThemeToggle(selector = '#auth-root', buttonId = 'theme-toggle') {
    const scope = document.querySelector(selector);
    const btn = document.getElementById(buttonId);
    if (!scope || !btn) return;
    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';

    const KEY_AUTH_SCOPE = 'auth:theme';
    const saved = localStorage.getItem(KEY_AUTH_SCOPE); // 'dark'|'light'|null
    const startDark = saved ? saved === 'dark' : false;

    // Estado inicial: scope y html (asegura que las utilidades dark existan y apliquen)
    scope.classList.toggle('dark', startDark);
    document.documentElement.classList.toggle('dark', startDark);

    btn.addEventListener('click', () => {
        const willDark = !scope.classList.contains('dark');

        scope.classList.toggle('dark', willDark);
        document.documentElement.classList.toggle('dark', willDark); // 👈 clave

        localStorage.setItem(KEY_AUTH_SCOPE, willDark ? 'dark' : 'light');
    });
}


/* ===============================
   REGISTRO GLOBAL
   =============================== */
export function registerTheme() {
    const inAuth = !!document.querySelector('#auth-root');

    if (inAuth) {
        // En login: no forzar dark global; aplica solo paletas globales.
        document.documentElement.classList.remove('dark');
        applyGlobalPalettesOnly();
        // En login no necesitamos escuchar cambios del SO (lo maneja el botón local).
        return;
    }

    // En el resto de la app: modo normal (light/dark/system) sobre <html>
    applyGlobalTheme();

    const mode = localStorage.getItem(KEY_MODE) || 'system';
    if (mode === 'system') {
        onSystemThemeChange(() => applyGlobalTheme());
    }
}

/* ===============================
   PICKERS opcionales (Alpine)
   =============================== */
export function modePicker() {
    return {
        current: localStorage.getItem(KEY_MODE) || 'system',
        set(m) { setThemeMode(m); this.current = m; }
    };
}
export function accentPicker() {
    return {
        current: localStorage.getItem(KEY_ACCENT) || 'orange',
        set(name) { setThemeAccent(name); this.current = name; }
    };
}
export function neutralPicker() {
    return {
        current: localStorage.getItem(KEY_NEUTRAL) || 'zinc',
        set(name) { setThemeNeutral(name); this.current = name; }
    };
}
