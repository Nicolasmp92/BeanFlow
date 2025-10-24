{{-- resources/views/partials/darkmode-login-toggle.blade.php --}}
<button id="theme-toggle" type="button"
    class="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs
         border transition-colors shadow-sm
         bg-espresso-800 text-foam-50 border-espresso-800
         hover:bg-espresso-700 hover:border-espresso-700
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mocha-400 focus:ring-offset-foam-50
         dark:bg-crema-400 dark:text-espresso-900 dark:border-crema-400
         dark:hover:bg-crema-300 dark:hover:border-crema-300
         dark:focus:ring-crema-300 dark:focus:ring-offset-espresso-900">
    <span class="sr-only">Cambiar tema</span>
    <x-lucide-sun class="h-4 w-4 dark:hidden" />
    <x-lucide-moon-star class="h-4 w-4 hidden dark:inline" />
    <span class="hidden sm:inline">Tema</span>
</button>
