// resources/js/ui/coffee-buttons.js

// Escoge un estilo bonito aleatorio por **carga de página** y lo mantiene
// estable durante la navegación SPA/morph (Livewire) usando una variable global.
// Incluye sombras/“glow” en hover/focus, y combina con dark mode.
export function initLoginRandomButton() {
    const btn = document.querySelector('[data-login-button]');
    if (!btn || btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';

    const BASE = [
        "w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2",
        "font-semibold transition-all duration-200",
        "ring-2 ring-transparent focus:outline-none",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        // sombras base suaves
        "shadow-sm hover:shadow-md active:shadow",
    ].join(" ");

    // Variantes que combinan con la paleta y el dark mode + glow
    const variants = {
        // 1) Mocha sólido (cálido)
        mocha: [
            "bg-mocha-500 hover:bg-mocha-600 active:bg-mocha-700 text-foam-50",
            "focus:ring-mocha-300 dark:focus:ring-crema-400",
            "dark:bg-crema-500 dark:hover:bg-crema-400 dark:active:bg-crema-300 dark:text-espresso-900",
            // Glow cálido
            "shadow-[0_8px_24px_rgba(147,95,73,0.25)] hover:shadow-[0_10px_28px_rgba(147,95,73,0.35)]",
            "dark:shadow-[0_8px_24px_rgba(231,184,112,0.22)] dark:hover:shadow-[0_10px_28px_rgba(231,184,112,0.32)]",
        ].join(" "),

        // 2) Latte degradado (suave)
        "latte-gradient": [
            "bg-gradient-to-b from-latte-400 to-cappuccino-500 hover:from-latte-500 hover:to-cappuccino-600",
            "text-espresso-900 focus:ring-cappuccino-300",
            "dark:from-espresso-700 dark:to-espresso-900 dark:hover:from-espresso-600 dark:hover:to-espresso-800",
            "dark:text-foam-100 dark:focus:ring-espresso-500",
            // Glow suave crema/cappuccino
            "shadow-[0_8px_24px_rgba(195,158,122,0.22)] hover:shadow-[0_10px_28px_rgba(195,158,122,0.32)]",
            "dark:shadow-[0_8px_24px_rgba(59,79,88,0.28)] dark:hover:shadow-[0_10px_28px_rgba(59,79,88,0.38)]",
        ].join(" "),

        // 3) Espresso contorno (elegante)
        "espresso-outline": [
            "bg-transparent text-espresso-800 border border-espresso-400 hover:bg-espresso-50",
            "focus:ring-espresso-300",
            "dark:text-foam-100 dark:border-foam-400 dark:hover:bg-espresso-800/60 dark:focus:ring-foam-400",
            // Glow frío controlado
            "shadow-[0_6px_18px_rgba(47,42,39,0.18)] hover:shadow-[0_8px_22px_rgba(47,42,39,0.26)]",
            "dark:shadow-[0_6px_18px_rgba(255,255,255,0.10)] dark:hover:shadow-[0_8px_22px_rgba(255,255,255,0.16)]",
        ].join(" "),

        // 4) Cappuccino sólido (neutral cálido)
        cappuccino: [
            "bg-cappuccino-500 hover:bg-cappuccino-600 active:bg-cappuccino-700 text-foam-50",
            "focus:ring-cappuccino-300",
            "dark:bg-espresso-700 dark:hover:bg-espresso-600 dark:active:bg-espresso-500",
            "dark:text-foam-100 dark:focus:ring-espresso-500",
            // Glow neutro cálido
            "shadow-[0_8px_24px_rgba(179,131,97,0.25)] hover:shadow-[0_10px_28px_rgba(179,131,97,0.35)]",
            "dark:shadow-[0_8px_24px_rgba(43,37,36,0.30)] dark:hover:shadow-[0_10px_28px_rgba(43,37,36,0.40)]",
        ].join(" "),

        // 5) Crema luminoso (alto contraste en dark)
        crema: [
            "bg-crema-500 hover:bg-crema-400 active:bg-crema-300 text-espresso-900",
            "focus:ring-crema-300",
            "dark:bg-crema-400 dark:hover:bg-crema-300 dark:active:bg-crema-200 dark:text-espresso-900",
            // Glow crema suave
            "shadow-[0_8px_24px_rgba(231,184,112,0.20)] hover:shadow-[0_10px_28px_rgba(231,184,112,0.28)]",
            "dark:shadow-[0_8px_24px_rgba(231,184,112,0.24)] dark:hover:shadow-[0_10px_28px_rgba(231,184,112,0.34)]",
        ].join(" "),
    };

    // Elegir variante UNA VEZ por carga de página, persistir en global para SPA/morph
    if (!window.__loginBtnVariant || !variants[window.__loginBtnVariant]) {
        const keys = Object.keys(variants);
        window.__loginBtnVariant = keys[Math.floor(Math.random() * keys.length)];
    }

    // Aplica base + variante
    btn.className = `${BASE} ${variants[window.__loginBtnVariant]}`;
}
