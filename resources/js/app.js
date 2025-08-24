// resources/js/app.js

// --- Core (una sola vez para toda la app) ---
import './core/popper';
 // -> expone window.createPopper desde @popperjs/core

// --- UI global ---
import { registerNotify } from "./ui/notify"; // SweetAlert2 (toasts)
import { registerTooltips } from "./ui/tooltip"; // Tooltips via data-attributes + Popper
import { registerTheme } from "./ui/theme"; // Manejo de tema/accent/neutral

// --- Páginas (código específico; se auto-ignora si el DOM no tiene esos elementos) ---
import "./pages/login"; // Recordar correo + preferencia "mantener sesión" (localStorage)

// --- Helpers seguros para no romper si falta algo ---
function safe(fn) {
    try {
        fn?.();
    } catch (e) {
        console.warn("[app.js]", e);
    }
}

function initUI() {
    safe(registerTheme);
    safe(registerNotify);
    safe(registerTooltips);
}

// --- Inicializa cuando el DOM está listo ---
document.addEventListener("DOMContentLoaded", () => {
    initUI();
});

// --- Re-inicializa después de navegación con Livewire (sin recargar) ---
document.addEventListener("livewire:navigated", () => {
    initUI();
});

// --- (Opcional) Si usas Livewire v3, a veces ayuda escuchar estos también ---
// document.addEventListener('livewire:init', initUI);
// document.addEventListener('livewire:load', initUI);

// --- Vite HMR (opcional) ---
if (import.meta && import.meta.hot) {
    import.meta.hot.accept(() => {
        initUI();
    });
}
