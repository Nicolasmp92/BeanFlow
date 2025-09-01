// resources/js/ui/splash.js

const SPLASH_ID = "app-splash";
const DEBUG_SPLASH = false; // true = congela la cortina para diseñar

// Ajusta aquí tus tiempos
const TIMING = {
    MIN_INITIAL_MS: 2800, // mínimo visible al entrar por primera vez
    MIN_NAV_MS: 1400, // mínimo visible en navegaciones SPA
    ROTATE_MS: 1600, // cada cuánto cambia el mensaje
    GREETING_READ_MS: 900, // tiempo para leer el saludo final
};

let hideTimer = null;
let rotateTimer = null;
let splashShownAt = 0;
let finalized = false;

const $ = (id) => document.getElementById(id);

function getMsgEls() {
    const msg = document.getElementById("splash-message");
    return { wrap: msg, text: msg?.querySelector(".msg-text") };
}

/* ====== Mostrar / Ocultar ====== */
export function showSplash() {
    const el = $(SPLASH_ID);
    if (!el) return;
    finalized = false;

    // restablece display y estado
    el.style.removeProperty("display"); // vuelve a existir para navegaciones
    el.removeAttribute("inert");
    void el.offsetWidth; // reflow para asegurar transición

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
        el.setAttribute("inert", ""); // no capta focus ni eventos
        document.documentElement.classList.remove("splash-open");

        // kill definitivo post-fade (evita bloquear clics aunque z-index sea alto)
        setTimeout(() => {
            el.style.display = "none";
        }, 120);
    }, delay);
}

/* ====== Textos interactivos ====== */
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

    text.textContent = PREPARING_MESSAGES[0];
    let i = 1;
    clearInterval(rotateTimer);
    rotateTimer = setInterval(() => {
        const msg = PREPARING_MESSAGES[i % PREPARING_MESSAGES.length];
        text.textContent = msg;
        i++;
    }, TIMING.ROTATE_MS);
}

function stopRotatingPreparing() {
    clearInterval(rotateTimer);
}

/* Saludo dinámico según hora local */
function dynamicGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "¡Listo! ☀️ ¡Que tengas una gran mañana!";
    if (h < 18) return "¡Todo listo! 🌤️ ¡Buena tarde!";
    return "¡Listo! 🌙 ¡Que tengas una excelente noche!";
}

/* Finalizar: saludo + estilo "done" + ocultar */
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

/* Garantiza un tiempo mínimo visible desde showSplash() */
function finishAfterMin(minMs, greetingMs = TIMING.GREETING_READ_MS) {
    const elapsed = performance.now() - splashShownAt;
    const wait = Math.max(0, minMs - elapsed);
    setTimeout(() => finalizeSplashAndHide(greetingMs), wait);
}

/* ====== Boot ====== */
(function boot() {
    // elimina duplicados del partial si por error se incluyó dos veces
    const all = document.querySelectorAll("#app-splash");
    if (all.length > 1) all.forEach((n, i) => i && n.remove());

    showSplash();
    startRotatingPreparing();

    // Livewire hidratado (primer render completo)
    document.addEventListener("livewire:load", () => {
        requestAnimationFrame(() =>
            finishAfterMin(TIMING.MIN_INITIAL_MS, TIMING.GREETING_READ_MS)
        );
    });

    // Fallback por si algo externo tarda
    window.addEventListener("load", () => {
        if (!DEBUG_SPLASH)
            finishAfterMin(TIMING.MIN_INITIAL_MS, TIMING.GREETING_READ_MS);
    });

    // Navegaciones SPA (Livewire Navigate)
    document.addEventListener("livewire:navigating", () => {
        showSplash();
        startRotatingPreparing();
    });
    document.addEventListener("livewire:navigated", () => {
        finishAfterMin(TIMING.MIN_NAV_MS, 600); // navegación: saludo breve
    });
})();

/* ====== Animación de vapor del icono Lucide coffee ====== */
document.addEventListener("DOMContentLoaded", () => {
    const svg = document.getElementById("coffee-icon");
    if (!svg) return;

    // Paths cortitos del vapor: identif. por atributo "d"
    const targetDs = new Set(["M10 2v2", "M14 2v2", "M6 2v2"]);

    const steamPaths = Array.from(svg.querySelectorAll("path")).filter((p) =>
        targetDs.has(p.getAttribute("d"))
    );

    steamPaths.forEach((p, i) => {
        p.classList.add("coffee-steam");
        if (i === 1) p.classList.add("delay-200");
        if (i === 2) p.classList.add("delay-400");
    });

    // Dead-man switch: si a los 6s no se ocultó, ocúltalo igual
    setTimeout(() => {
        const el = document.getElementById(SPLASH_ID);
        if (el && !el.classList.contains("splash-hidden")) {
            try {
                finalizeSplashAndHide(400);
            } catch {
                hideSplash(200);
            }
        }
    }, 6000);
});
