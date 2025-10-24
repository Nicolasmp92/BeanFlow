<button
    id="sidebar-toggle"
    type="button"
    class="absolute -right-3 top-4 h-8 w-8 rounded-full bg-white text-zinc-900
        border border-zinc-200 shadow grid place-items-center hover:bg-zinc-100
        dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-600
        transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-400
        hidden lg:grid"  {{-- 👈 Oculto en móvil, visible en desktop --}}
    title="Colapsar/Expandir menú"
    aria-label="Alternar sidebar">
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</button>
