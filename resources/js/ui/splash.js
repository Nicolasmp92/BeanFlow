// resources/js/ui/splash.js

const SPLASH_ID = "app-splash";
const DEBUG_SPLASH = false;

const TIMING = {
    MIN_INITIAL_MS: 2800,
    MIN_NAV_MS: 1400,
    ROTATE_MS: 1600,
    GREETING_READ_MS: 900,
};

let hideTimer = null;
let rotateTimer = null;
let splashShownAt = 0;
let finalized = false;

const $ = (id) => document.getElementById(id);

function getMsgEls() {
    const msg = $("splash-message");
    return { wrap: msg, text: msg?.querySelector(".msg-text") };
}

/* ============================
   Cortina: mostrar/ocultar
   ============================ */
export function showSplash() {
    const el = $(SPLASH_ID);
    if (!el) return;
    finalized = false;
    el.style.display = "";
    el.removeAttribute("inert");
    void el.offsetWidth; // fuerza reflow para activar transiciones
    el.classList.remove("splash-hidden", "splash-done");
    el.setAttribute("aria-busy", "true");
    el.removeAttribute("aria-hidden");
    document.documentElement.classList.add("splash-open");
    splashShownAt = performance.now();
}

export function hideSplash(delay = 180) {
    if (DEBUG_SPLASH) return;
    const el = $(SPLASH_ID);
    if (!el) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
        el.classList.add("splash-hidden");
        el.setAttribute("aria-busy", "false");
        el.setAttribute("aria-hidden", "true");
        el.setAttribute("inert", "");
        document.documentElement.classList.remove("splash-open");
        setTimeout(() => {
            el.style.display = "none";
        }, 120);
    }, delay);
}

/* ============================
   Mensajes "Preparando..."
   ============================ */
const PREPARING_MESSAGES = [
    "Preparando BeanFlow",
    "Calentando la cafetera",
    "Moliendo granos",
    "Espumando la leche",
    "Cargando módulos",
    "Ajustando la molienda",
];

function startRotatingPreparing() {
    const { text } = getMsgEls();
    if (!text) return;
    let i = 0;
    text.textContent = PREPARING_MESSAGES[i];
    clearInterval(rotateTimer);
    rotateTimer = setInterval(() => {
        i = (i + 1) % PREPARING_MESSAGES.length;
        text.textContent = PREPARING_MESSAGES[i];
    }, TIMING.ROTATE_MS);
}

function stopRotatingPreparing() {
    clearInterval(rotateTimer);
}

function dynamicGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "¡Listo! ☀️ ¡Que tengas una gran mañana!";
    if (h < 18) return "¡Todo listo! 🌤️ ¡Buena tarde!";
    return "¡Listo! 🌙 ¡Que tengas una excelente noche!";
}

function finalizeSplashAndHide(totalDelay = TIMING.GREETING_READ_MS) {
    if (finalized) return;
    finalized = true;
    const splash = $(SPLASH_ID);
    const { text } = getMsgEls();
    if (!splash || !text) return hideSplash(150);
    stopRotatingPreparing();
    text.textContent = dynamicGreeting();
    splash.classList.add("splash-done");
    hideSplash(totalDelay);
}

function finishAfterMin(minMs, greetingMs = TIMING.GREETING_READ_MS) {
    const elapsed = performance.now() - splashShownAt;
    const wait = Math.max(0, minMs - elapsed);
    setTimeout(() => finalizeSplashAndHide(greetingMs), wait);
}

function removeDuplicateSplashes() {
    const all = document.querySelectorAll(`#${SPLASH_ID}`);
    if (all.length > 1) {
        all.forEach((n, i) => i && n.remove());
    }
}

/* ============================
   🟤 Preparar tema/paletas antes de cerrar la cortina
   ============================ */

// Lectura segura de localStorage con fallback
function lsGet(key, fallback) {
    try {
        const v = localStorage.getItem(key);
        return v == null ? fallback : v;
    } catch {
        return fallback;
    }
}

// Aplica paletas globales al <html> (no toca el modo)
function applyPalettesToHtml() {
    const html = document.documentElement;
    html.setAttribute("data-accent", lsGet("theme:accent", "orange"));
    html.setAttribute("data-neutral", lsGet("theme:neutral", "zinc"));
}

// Aplica el modo (dark/light) SOLO al scope de login (#auth-root)
function applyLoginScopeTheme() {
    const wantDark = lsGet("auth:theme", "light") === "dark";
    const deadline = performance.now() + 1500; // reintenta por si el nodo tarda en renderizar

    (function tick() {
        const scope = document.querySelector("#auth-root");
        if (scope) return scope.classList.toggle("dark", wantDark);
        if (performance.now() < deadline) return requestAnimationFrame(tick);
        // sin scope, queda claro por defecto
    })();
}

/** Prepara paletas + tema del login mientras la cortina está visible */
function prepareLoginTheme() {
    // Asegura que NO usamos dark global en el primer paint (prehook del <head> ya lo hizo)
    document.documentElement.classList.remove("dark");
    applyPalettesToHtml();
    applyLoginScopeTheme();
}

/* ============================
   Wire-up de eventos
   ============================ */
function setupSplashEvents() {
    document.addEventListener("livewire:load", () => {
        // Por si el contenido llega tarde, aplicamos tema de login una vez más
        prepareLoginTheme();
        requestAnimationFrame(() =>
            finishAfterMin(TIMING.MIN_INITIAL_MS, TIMING.GREETING_READ_MS)
        );
    });

    window.addEventListener("load", () => {
        if (!DEBUG_SPLASH) finishAfterMin(TIMING.MIN_INITIAL_MS, TIMING.GREETING_READ_MS);
    });

    document.addEventListener("livewire:navigating", () => {
        showSplash();
        startRotatingPreparing();
    });

    document.addEventListener("livewire:navigated", () => {
        // En navegación SPA aplicamos de nuevo por si cambió el DOM de login
        prepareLoginTheme();
        finishAfterMin(TIMING.MIN_NAV_MS, 600);
    });
}

/* ============================
   Boot
   ============================ */
(function boot() {
    removeDuplicateSplashes();
    showSplash();
    startRotatingPreparing();

    // ⬇️ La cortina “prepara todo” antes de ocultarse
    prepareLoginTheme();

    setupSplashEvents();
})();

/* ============================
   Salvaguarda si algo queda abierto
   ============================ */
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const el = $(SPLASH_ID);
        if (el && !el.classList.contains("splash-hidden")) {
            try {
                finalizeSplashAndHide(400);
            } catch {
                hideSplash(200);
            }
        }
    }, 6000);
});
