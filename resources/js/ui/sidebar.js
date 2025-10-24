// Manejo de sidebar colapsable en desktop + drawer en móvil
const STORAGE_KEY = 'sidebar:collapsed';
const isMobile = () => window.matchMedia('(max-width: 1023.5px)').matches;

function applyDesktopStateFromStorage() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    if (!isMobile()) {
        document.body.classList.add('has-sidenav');
    } else {
        document.body.classList.remove('has-sidenav', 'collapsed');
    }

    if (isMobile()) {
        sidebar.classList.remove('collapsed');
        return;
    }

    const savedCollapsed = (localStorage.getItem(STORAGE_KEY) || '0') === '1';
    sidebar.classList.toggle('collapsed', savedCollapsed);
    document.body.classList.toggle('collapsed', savedCollapsed);
}

function toggleCollapsed() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || isMobile()) return;

    const willCollapse = !sidebar.classList.contains('collapsed');
    sidebar.classList.toggle('collapsed', willCollapse);
    document.body.classList.toggle('collapsed', willCollapse);
    try { localStorage.setItem(STORAGE_KEY, willCollapse ? '1' : '0'); } catch { }
}

export function registerSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    // Estado inicial
    applyDesktopStateFromStorage();

    // Exponer el toggle para usarlo desde la topbar
    window.toggleSidebarCollapse = toggleCollapsed;

    // Reaplicar en resize (debounce)
    if (!window.__sidebarResizeBound) {
        let t = null;
        window.addEventListener('resize', () => {
            clearTimeout(t);
            t = setTimeout(applyDesktopStateFromStorage, 120);
        });
        window.__sidebarResizeBound = true;
    }

    // Reaplicar en navegación Livewire
    document.addEventListener('livewire:navigated', applyDesktopStateFromStorage);
}
