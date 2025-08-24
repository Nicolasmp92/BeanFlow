{{-- Botón toggle de tema: se puede ubicar donde quieras --}}
<button id="theme-toggle" type="button" class="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs
               border border-neutral-300 bg-white/90 backdrop-blur
               dark:border-neutral-700 dark:bg-neutral-900/80
               hover:bg-neutral-50 dark:hover:bg-neutral-800">
    <span class="sr-only">Cambiar tema</span>
    {{-- Iconos Flux (lucide) --}}
    <flux:icon.sun class="h-4 w-4 dark:hidden" />
    <flux:icon.moon class="h-4 w-4 hidden dark:inline" />
    <span class="hidden sm:inline">Tema</span>
</button>

<script>
    // Toggle y persistencia
  (function () {
    const KEY = 'theme';
    function applyStoredTheme() {
      const stored = localStorage.getItem(KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = stored ? stored === 'dark' : prefersDark;
      document.documentElement.classList.toggle('dark', dark);
    }

    // Al hacer click en el botón
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#theme-toggle');
      if (!btn) return;
      const willDark = !document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', willDark);
      localStorage.setItem(KEY, willDark ? 'dark' : 'light');
    });

    // Reaplicar tras navegación Livewire (sin recarga)
    document.addEventListener('livewire:navigated', applyStoredTheme);

    // Asegura estado correcto si este partial se inyecta tarde
    applyStoredTheme();
  })();
</script>
