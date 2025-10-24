// resources/js/ui/tooltip.js

const HAS_BOUND = 'tooltipBound';
const PORTED = 'tooltipPorted';

/** Popper factory (global) */
function getCreatePopper() {
    return typeof window !== 'undefined' && typeof window.createPopper === 'function'
        ? window.createPopper
        : null;
}


/** Asegura que el tooltip viva bajo <body> (portal) para que jamás afecte el layout local */
function ensurePortal(tooltip) {
    if (!tooltip || tooltip.dataset[PORTED] === '1') return;
    document.body.appendChild(tooltip);
    tooltip.dataset[PORTED] = '1';
}

/** Mide/Inicializa sin provocar reflow visible */
function measureWhileHidden(tooltip, fn) {
    const prev = {
        hidden: tooltip.classList.contains('hidden'),
        position: tooltip.style.position,
        top: tooltip.style.top,
        left: tooltip.style.left,
        transform: tooltip.style.transform,
        visibility: tooltip.style.visibility,
        pointerEvents: tooltip.style.pointerEvents,
        willChange: tooltip.style.willChange,
    };

    // Forzamos condiciones seguras de medición
    if (prev.hidden) tooltip.classList.remove('hidden');
    tooltip.style.position = 'fixed';
    tooltip.style.top = '0px';
    tooltip.style.left = '0px';
    tooltip.style.transform = 'translate3d(-9999px, -9999px, 0)'; // fuera de pantalla
    tooltip.style.visibility = 'hidden';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.willChange = 'transform';

    try {
        fn();
    } finally {
        // Restablece; Popper aplicará sus estilos reales al mostrar
        tooltip.style.position = prev.position;
        tooltip.style.top = prev.top;
        tooltip.style.left = prev.left;
        tooltip.style.transform = prev.transform;
        tooltip.style.visibility = prev.visibility;
        tooltip.style.pointerEvents = prev.pointerEvents;
        tooltip.style.willChange = prev.willChange;
        if (prev.hidden) tooltip.classList.add('hidden');
    }
}

/** Crea Popper con opciones estándar del proyecto */
function createPopperInstance(referenceEl, tooltipEl, { placement = 'top', noflip = false } = {}) {
    const createPopper = getCreatePopper();
    if (!createPopper) {
        console.warn('[tooltip.js] Popper no está disponible. Asegúrate de importar ./core/popper.js en app.js');
        return null;
    }

    return createPopper(referenceEl, tooltipEl, {
        placement,
        strategy: 'fixed',
        modifiers: [
            { name: 'offset', options: { offset: [0, 8] } },
            { name: 'preventOverflow', options: { boundary: 'viewport', padding: 8 } },
            noflip
                ? { name: 'flip', enabled: false }
                : { name: 'flip', options: { fallbackPlacements: ['top', 'bottom', 'right', 'left'] } },
            { name: 'computeStyles', options: { adaptive: false } },
        ],
    });
}


/**
 * Enlaza botón + tooltip
 * - Portal a <body> (no empuja layout jamás)
 * - Forzamos fixed antes de mostrar
 * - Interactivo (no se oculta al pasar al tooltip)
 */
function bindTooltipButton(btn, tooltip, { placement = 'top', noflip = false } = {}) {
    if (!btn || !tooltip) return;
    if (btn.dataset[HAS_BOUND] === '1') return;

    // Saca el tooltip del flujo del contenedor
    ensurePortal(tooltip);

    let popperInstance = null;
    let hideTimer = null;

    function ensureMeasuredAndInit() {
        if (popperInstance) return;
        measureWhileHidden(tooltip, () => {
            popperInstance = createPopperInstance(btn, tooltip, { placement, noflip });
        });
    }

    function show() {
        clearTimeout(hideTimer);
        ensureMeasuredAndInit();

        // Asegura que nunca empuje layout al mostrarse
        tooltip.style.position = 'fixed';
        tooltip.style.willChange = 'transform';
        tooltip.classList.remove('hidden');

        popperInstance && popperInstance.update();
        btn.setAttribute('aria-expanded', 'true');

        // El tooltip debe ser interactivo
        tooltip.style.pointerEvents = '';
    }

    function scheduleHide() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            tooltip.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
        }, 100);
    }

    // Mantener abierto si el mouse está sobre el tooltip
    tooltip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    tooltip.addEventListener('mouseleave', scheduleHide);

    // Eventos del trigger
    btn.addEventListener('mouseenter', show);
    btn.addEventListener('focus', show);
    btn.addEventListener('mouseleave', scheduleHide);
    btn.addEventListener('blur', scheduleHide);

    btn.dataset[HAS_BOUND] = '1';

    // Limpieza si Livewire reemplaza
    document.addEventListener(
        'livewire:update',
        () => {
            if (popperInstance) {
                popperInstance.destroy();
                popperInstance = null;
            }
        },
        { once: true }
    );
}

/** Tooltip dedicado: Recordar correo */
export function registerRememberEmailTooltip() {
    const btn = document.getElementById('rememberEmailTooltipBtn');
    const tooltip = document.getElementById('rememberEmailTooltip');
    if (!btn || !tooltip) return;
    bindTooltipButton(btn, tooltip, { placement: 'right', noflip: false });
}

/**
 * Tooltips genéricos por data-attributes
 * - data-tooltip
 * - data-tooltip-content="#tip-id"
 * - data-placement="right-start" | "right" | "top" | ...
 * - data-noflip="1"  (para fijarlo y evitar flip)
 */
export function registerDataAttrTooltips() {
    const triggers = document.querySelectorAll('[data-tooltip][data-tooltip-content]');
    if (!triggers.length) return;

    triggers.forEach((btn) => {
        if (btn.dataset[HAS_BOUND] === '1') return;

        const selector = btn.getAttribute('data-tooltip-content');
        const tooltip = selector ? document.querySelector(selector) : null;
        if (!tooltip) return;

        const placement = btn.getAttribute('data-placement') || 'top';
        const noflip = btn.hasAttribute('data-noflip');

        bindTooltipButton(btn, tooltip, { placement, noflip });
    });
}

/** Registro general */
export function registerTooltips() {
    registerRememberEmailTooltip();
    registerDataAttrTooltips();
}
