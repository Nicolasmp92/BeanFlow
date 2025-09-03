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

export function showSplash() {
    const el = $(SPLASH_ID);
    if (!el) return;
    finalized = false;
    el.style.display = "";
    el.removeAttribute("inert");
    void el.offsetWidth;
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

function setupSplashEvents() {
    document.addEventListener("livewire:load", () => {
        requestAnimationFrame(() =>
            finishAfterMin(TIMING.MIN_INITIAL_MS, TIMING.GREETING_READ_MS)
        );
    });
    window.addEventListener("load", () => {
        if (!DEBUG_SPLASH)
            finishAfterMin(TIMING.MIN_INITIAL_MS, TIMING.GREETING_READ_MS);
    });
    document.addEventListener("livewire:navigating", () => {
        showSplash();
        startRotatingPreparing();
    });
    document.addEventListener("livewire:navigated", () => {
        finishAfterMin(TIMING.MIN_NAV_MS, 600);
    });
}

(function boot() {
    removeDuplicateSplashes();
    showSplash();
    startRotatingPreparing();
    setupSplashEvents();
})();

document.addEventListener("DOMContentLoaded", () => {
    const svg = $("coffee-icon");
    if (!svg) return;
    const targetDs = new Set(["M10 2v2", "M14 2v2", "M6 2v2"]);
    const steamPaths = Array.from(svg.querySelectorAll("path")).filter((p) =>
        targetDs.has(p.getAttribute("d"))
    );
    steamPaths.forEach((p, i) => {
        p.classList.add("coffee-steam");
        if (i === 1) p.classList.add("delay-200");
        if (i === 2) p.classList.add("delay-400");
    });
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
