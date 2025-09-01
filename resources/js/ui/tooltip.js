// resources/js/ui/tooltip.js
// Requiere: window.createPopper (lo exponemos en resources/js/core/popper.js)

let tooltips = [];
let bound = false;

function makeTip(trigger, tip) {
    // Lee atributos
    const placement = trigger.getAttribute("data-placement") || "top";
    const arrowEl = tip.querySelector("[data-popper-arrow]");
    // helper: crea popper una sola vez por tip/trigger
    let instance = null;

    const create = () => {
        // Evita instancias duplicadas si alguien “spamea” hover/click
        if (instance) return instance;

        // Construye array de modifiers limpio
        const modifiers = [
            { name: "offset", options: { offset: [0, 8] } },
            {
                name: "preventOverflow",
                options: { padding: 8, boundary: "clippingParents" },
            },
            // Importante: desactivar GPU a veces corrige desfases de flecha
            { name: "computeStyles", options: { gpuAcceleration: false } },
        ];
        if (arrowEl) {
            modifiers.push({
                name: "arrow",
                options: { element: arrowEl, padding: 6 },
            });
        }

        instance = window.createPopper(trigger, tip, {
            placement,
            strategy: "fixed", // suele alinear mejor en layouts con transforms/scrolls
            modifiers,
        });

        return instance;
    };

    const show = () => {
        if (!tip) return;
        tip.classList.remove("hidden");
        tip.style.visibility = "visible";
        tip.style.pointerEvents = "auto";

        create(); // crea si no existe
        instance.update(); // fuerza cálculo con el elemento ya visible
    };

    const hide = () => {
        if (instance) {
            instance.destroy();
            instance = null;
        }
        tip.style.visibility = "hidden";
        tip.style.pointerEvents = "none";
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
