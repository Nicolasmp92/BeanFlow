// resources/js/app.js

// Core
import './core/popper'
import './core/alpine'          // inicialización única de Alpine

// UI global
import { registerNotify } from './ui/notify'
import { registerTooltips } from './ui/tooltip'
import './ui/splash';
import { registerTheme, registerAuthThemeToggle } from './ui/theme';
import { initLoginRandomButton } from './ui/coffee-buttons'; // resources/js/app.js
import { registerSidebar } from './ui/sidebar';

// Inicializa al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    registerSidebar();
});

// Si usas Livewire navigate, vuelve a enlazar después de cada navegación
document.addEventListener('livewire:navigated', () => {
    registerSidebar();
});


// Páginas
import './pages/login'

    /* 0) Seed de estado ANTES de que Alpine arranque */
    ; (() => {
        const KEY = 'sidebarFirstOpen'
        if (localStorage.getItem(KEY) === null) {
            localStorage.setItem(KEY, '1')
            window.__initialSidebarOpen = true
        } else {
            window.__initialSidebarOpen = false
        }
    })()

/* 1) Primera carga del documento */
document.addEventListener('DOMContentLoaded', () => {
    registerTheme()      // aplica tema al entrar
    registerNotify()     // listener para $this->dispatch('notify')
    registerTooltips()   // tooltips por data-attributes
    registerAuthThemeToggle('#auth-root', 'theme-toggle'); //? 👈 sólo login
    initLoginRandomButton();
})

/* 2) Navegación SPA entre Livewire Page Components */
document.addEventListener('livewire:navigated', () => {
    registerTheme()
    registerTooltips()
    registerAuthThemeToggle('#auth-root', 'theme-toggle'); // por si se rehidrata
    initLoginRandomButton();   // 👈 rebind tras navegación SPA
})

/* 3) Renders parciales dentro de la misma página (morph) */
document.addEventListener('livewire:update', () => {
    registerTooltips()
    registerAuthThemeToggle('#auth-root', 'theme-toggle')  // 👈 vuelve a enlazar en morph
    initLoginRandomButton();                  // 👈 rebind tras morph
})


/* 4) Store global cuando Alpine emite 'alpine:init' (SOLO una vez) */
document.addEventListener('alpine:init', () => {
    if (window.__UI_STORE_INIT__) return
    window.__UI_STORE_INIT__ = true

    // Usa siempre window.Alpine en módulos
    window.Alpine.store('ui', {
        sidebarOpen: window.__initialSidebarOpen ?? false,
        toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },
        closeSidebar() { this.sidebarOpen = false },
        openSidebar() { this.sidebarOpen = true },
    })
}, { once: true })


