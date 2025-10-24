// resources/js/ui/layout.js

const STORAGE_COLLAPSED = 'ui.sidenav.collapsed';

function isDesktop() {
  return window.matchMedia('(min-width: 1024px)').matches; // lg:
}

/* Drawer móvil */
function openDrawer(sidebar, backdrop) {
  sidebar.classList.remove('-translate-x-full');
  backdrop.classList.remove('hidden');
}
function closeDrawer(sidebar, backdrop) {
  sidebar.classList.add('-translate-x-full');
  backdrop.classList.add('hidden');
}

/* Colapso desktop (y empuje de contenido vía body) */
function applyCollapsed(sidebar, collapsed) {
  sidebar.classList.toggle('collapsed', collapsed);
  document.body.classList.toggle('collapsed', collapsed); // body.has-sidenav.collapsed => padding-left menor
  localStorage.setItem(STORAGE_COLLAPSED, collapsed ? '1' : '0');
}

export function initSidenav() {
  const sidebar   = document.getElementById('sidenav');
  const backdrop  = document.getElementById('sidenav-backdrop');
  const btnOpen   = document.getElementById('sidenav-open');    // móvil (hamburguesa)
  const btnToggle = document.getElementById('sidenav-toggle');  // desktop (tu botón)
  if (!sidebar || !backdrop) return;

  // Marcamos que hay sidenav para aplicar padding en desktop
  document.body.classList.add('has-sidenav');

  // Estado inicial según viewport
  if (isDesktop()) {
    // Siempre visible en desktop (modo side)
    sidebar.classList.remove('-translate-x-full');
    backdrop.classList.add('hidden');

    // Aplica colapso persistente
    const collapsed = localStorage.getItem(STORAGE_COLLAPSED) === '1';
    applyCollapsed(sidebar, collapsed);
  } else {
    // En móvil parte cerrado (drawer)
    closeDrawer(sidebar, backdrop);
    // El padding-left del body no afecta en móvil (solo aplica en @media lg)
  }

  // Interacciones móvil
  btnOpen?.addEventListener('click', () => openDrawer(sidebar, backdrop));
  backdrop.addEventListener('click', () => closeDrawer(sidebar, backdrop));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
      closeDrawer(sidebar, backdrop);
    }
  });

  // Interacción desktop: tu botón ahora SÍ colapsa en pantallas grandes
  btnToggle?.addEventListener('click', () => {
    const next = !sidebar.classList.contains('collapsed');
    applyCollapsed(sidebar, next);
    document.dispatchEvent(new CustomEvent('sidenav:collapsed', { detail: { collapsed: next }}));
  });
}

/* Re-init cuando cambia el tamaño (p. ej., redimensionas ventana) */
let rto;
window.addEventListener('resize', () => {
  clearTimeout(rto);
  rto = setTimeout(() => initSidenav(), 150);
});
