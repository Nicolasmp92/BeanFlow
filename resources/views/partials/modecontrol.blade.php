{{-- Botón para cambiar modo oscuro/claro --}}
<button x-data @click="
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    html.classList.toggle('dark');
    html.classList.toggle('light');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
" class="absolute top-4 right-4 z-50 rounded-full bg-white/90 p-2 shadow-lg dark:bg-neutral-800 transition-colors" title="Cambiar tema">
    🌗
</button>
