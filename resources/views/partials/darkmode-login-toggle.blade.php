{{-- Botón Dark/Light para el login (sin persistencia) --}}
<div x-data class="fixed top-4 right-4 z-50">
    <button type="button" class="rounded-full p-2 bg-white/90 shadow-lg ring-1 ring-black/5 transition-colors
    hover:bg-white dark:bg-neutral-800 dark:hover:bg-neutral-700"
        @click="document.documentElement.classList.toggle('dark')" aria-label="Cambiar tema">
        {{-- Flux icons: cambia solo con la clase `dark` --}}
        <flux:icon.sun class="h-5 w-5 block dark:hidden" variant="solid" />
        <flux:icon.moon class="h-5 w-5 hidden dark:block" variant="solid" />
    </button>
</div>
