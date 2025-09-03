import './core/popper';
import './ui/splash';
import { registerNotify } from "./ui/notify";
import { registerTooltips } from "./ui/tooltip";
import { registerTheme } from "./ui/theme";
import "./pages/login";

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

document.addEventListener("DOMContentLoaded", initUI);
document.addEventListener("livewire:navigated", initUI);

if (import.meta && import.meta.hot) {
    import.meta.hot.accept(() => {
        initUI();
    });
}
