// ==================== DEPENDENCIAS PRINCIPALES ====================
// ! Importa las dependencias principales usadas en toda la app
import './core/popper'; // * Expone window.createPopper desde @popperjs/core

// ==================== MÓDULOS UI GLOBALES ====================
// ! Importa módulos UI globales (inicializa antes de tu propio código)
import './ui/splash'; // * Lógica de la pantalla de carga
import { registerNotify } from "./ui/notify"; // * SweetAlert2 (notificaciones)
import { registerTooltips } from "./ui/tooltip"; // * Tooltips vía data-attributes + Popper
import { registerTheme } from "./ui/theme"; // * Gestión de tema/acento/neutral

// ==================== MÓDULOS ESPECÍFICOS DE PÁGINA ====================
// ! Importa código específico de página (ignora si faltan elementos en el DOM)
import "./pages/login"; // * Recordar email + preferencia "mantener sesión" (localStorage)

// ==================== HELPERS SEGUROS ====================
// ! Wrapper seguro para evitar errores si falta algo
function safe(fn) {
    try {
        fn?.();
    } catch (e) {
        console.warn("[app.js]", e);
    }
}

// ==================== INICIALIZACIÓN DE UI ====================
// ! Inicializa los módulos UI globales
function initUI() {
    safe(registerTheme);
    safe(registerNotify);
    safe(registerTooltips);
}

// ==================== INICIALIZACIÓN AL CARGAR DOM ====================
// ! Inicializa la UI cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
    initUI();
});

// ==================== SOPORTE NAVEGACIÓN LIVEWIRE ====================
// ! Re-inicializa la UI después de navegar con Livewire (sin recarga completa)
document.addEventListener("livewire:navigated", () => {
    initUI();
});

// ==================== LIVEWIRE V3 (OPCIONAL) ====================
// ? Descomenta si usas Livewire v3 para soporte de eventos adicional
// document.addEventListener('livewire:init', initUI);
// document.addEventListener('livewire:load', initUI);

// ==================== SOPORTE VITE HMR (OPCIONAL) ====================
// ! Hot Module Replacement para Vite (re-inicializa la UI automáticamente)
if (import.meta && import.meta.hot) {
    import.meta.hot.accept(() => {
        initUI();
    });
}
