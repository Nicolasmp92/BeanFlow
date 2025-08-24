// resources/js/ui/theme.js

/**
 * Aplica el tema guardado al cargar la app.
 * - data-accent: orange | emerald | purple | sky | ...
 * - data-neutral: zinc | gray | slate | neutral | stone
 * Mantengo compatibilidad con el viejo 'theme:name' (lo mapeo a accent).
 */
export function registerTheme() {
  const html = document.documentElement;

  // --- Backward compat (si existía la preferencia anterior) ---
  const legacy = localStorage.getItem('theme:name'); // 'zinc'|'emerald'|'purple'|'sky'
  if (legacy && !localStorage.getItem('theme:accent')) {
    // mapeo simple: antes usábamos 'palette' como "accent"
    localStorage.setItem('theme:accent', legacy);
    localStorage.removeItem('theme:name'); // opcional: limpiamos
  }

  // --- Leer preferencias actuales ---
  const accent  = localStorage.getItem('theme:accent')  || 'orange';
  const neutral = localStorage.getItem('theme:neutral') || 'zinc';

  // --- Aplicar en <html> ---
  html.setAttribute('data-accent',  accent);
  html.setAttribute('data-neutral', neutral);
}

/**
 * Setea y persiste el ACCENT desde cualquier UI (opcional de utilidad).
 * Útil si lo llamas fuera de Livewire o desde un partial.
 */
export function setThemeAccent(name) {
  const html = document.documentElement;
  localStorage.setItem('theme:accent', name);
  html.setAttribute('data-accent', name);
}

/**
 * Setea y persiste el NEUTRAL (familia de grises).
 */
export function setThemeNeutral(name) {
  const html = document.documentElement;
  localStorage.setItem('theme:neutral', name);
  html.setAttribute('data-neutral', name);
}

/**
 * (Opcional) Un picker Alpine solo para ACCENT.
 * Si quieres también para neutral, puedes duplicar la idea.
 */
export function accentPicker() {
  return {
    current: localStorage.getItem('theme:accent') || 'orange',
    set(name) {
      setThemeAccent(name);
      this.current = name;
    }
  };
}
