// resources/js/ui/tooltip.js
// Requiere: window.createPopper (lo exponemos en resources/js/core/popper.js)

let tooltips = [];
let bound = false;

function makeTip(trigger, tip) {
    // Lee atributos
    const placement = trigger.getAttribute("data-placement") || "top";
    const arrowEl = tip.querySelector("[data-popper-arrow]");

    // Mostrar/ocultar
    const show = () => {
        if (!tip) return;
        tip.classList.remove("hidden");
        tip.style.visibility = "visible";

        // Instancia Popper
        const instance = window.createPopper(trigger, tip, {
            placement,
            modifiers: [
                { name: "offset", options: { offset: [0, 8] } },
                arrowEl ? { name: "arrow", options: { element: arrowEl } } : {},
                { name: "preventOverflow", options: { padding: 8 } },
            ],
        });

        // Guardamos para poder cerrar luego
        tooltips.push({ trigger, tip, instance });
    };

    const hide = () => {
        const idx = tooltips.findIndex(
            (t) => t.trigger === trigger && t.tip === tip
        );
        if (idx !== -1) {
            tooltips[idx].instance?.destroy?.();
            tooltips.splice(idx, 1);
        }
        tip.style.visibility = "hidden";
        tip.classList.add("hidden");
    };

    // Eventos por defecto: hover + focus
    const onEnter = () => show();
    const onLeave = (e) => {
        // si el mouse va al propio tooltip, no cerrar inmediatamente
        const toEl = e.relatedTarget;
        if (toEl && (toEl === tip || tip.contains(toEl))) return;
        hide();
    };

    trigger.addEventListener("mouseenter", onEnter);
    trigger.addEventListener("mouseleave", onLeave);
    trigger.addEventListener("focus", onEnter);
    trigger.addEventListener("blur", hide);

    // Click alterna
    trigger.addEventListener("click", () => {
        const isHidden = tip.classList.contains("hidden");
        isHidden ? show() : hide();
    });

    // Esc cierra
    const onKey = (e) => {
        if (e.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKey);

    // Cierre si clic fuera
    const onDocClick = (e) => {
        if (trigger.contains(e.target) || tip.contains(e.target)) return;
        hide();
    };
    document.addEventListener("click", onDocClick);

    // Limpieza cuando Livewire re-renderiza: devolvemos un destructor
    return () => {
        trigger.removeEventListener("mouseenter", onEnter);
        trigger.removeEventListener("mouseleave", onLeave);
        trigger.removeEventListener("focus", onEnter);
        trigger.removeEventListener("blur", hide);
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("click", onDocClick);
        hide();
    };
}

// Export principal
export function registerTooltips() {
    // Evitar doble binding masivo
    if (bound) {
        // Cierra instancias previas para evitar fugas
        tooltips.forEach((t) => t.instance?.destroy?.());
        tooltips = [];
    }

    // Busca triggers
    const triggers = document.querySelectorAll(
        "[data-tooltip][data-tooltip-content]"
    );
    triggers.forEach((tr) => {
        const sel = tr.getAttribute("data-tooltip-content"); // p.ej. "#tip-remember"
        if (!sel) return;
        const tip = document.querySelector(sel);
        if (!tip) return;

        // Estado inicial oculto (por si el HTML no lo trae)
        tip.classList.add("hidden");
        tip.style.position = "absolute";
        tip.style.zIndex = "9999";
        tip.style.visibility = "hidden";

        // Crea manejadores
        makeTip(tr, tip);
    });

    bound = true;
}
