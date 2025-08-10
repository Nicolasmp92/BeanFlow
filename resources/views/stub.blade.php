<x-layouts.app :title="$titleMap[$page] ?? Str::headline($page)">
    <div class="p-6">
        <h1 class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {{ $titleMap[$page] ?? Str::headline($page) }}
        </h1>

        <p class="mt-2 text-zinc-600 dark:text-zinc-300">
            {{ __('Este módulo está en construcción. Aquí conectaremos rutas, controladores, modelos y BD.') }}
        </p>

        <div class="mt-6">
            <flux:alert icon="info">
                <span class="font-medium">{{ __('Tip') }}:</span>
                {{ __('Puedes navegar libremente por el menú sin errores gracias a la ruta auxiliar.') }}
            </flux:alert>
        </div>
    </div>
</x-layouts.app>
