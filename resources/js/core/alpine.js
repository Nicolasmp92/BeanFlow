// resources/js/core/alpine.js
import Alpine from 'alpinejs'

// 1) Expón Alpine una sola vez
if (!window.Alpine) {
    window.Alpine = Alpine
}

// 2) Arranca Alpine SOLO una vez (aunque el script se re-ejecute por navigate/HMR)
function startAlpineOnce() {
    if (window.__ALPINE_STARTED__) return
    window.__ALPINE_STARTED__ = true
    window.Alpine.start()
}

// 3) Si Livewire ya está cargado, espera su init (para que @entangle exista)
//    Si no, usa DOMContentLoaded como fallback.
function wireAlpineStart() {
    if (window.Livewire) {
        // 'once' evita listeners duplicados si el script se re-inyecta
        document.addEventListener('livewire:init', startAlpineOnce, { once: true })
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startAlpineOnce, { once: true })
    } else {
        startAlpineOnce()
    }
}

// 4) Evita registrar wiring más de una vez
if (!window.__ALPINE_WIRED__) {
    window.__ALPINE_WIRED__ = true
    wireAlpineStart()
}

// (Opcional) plugins
// import persist from '@alpinejs/persist'
// window.Alpine.plugin(persist)
