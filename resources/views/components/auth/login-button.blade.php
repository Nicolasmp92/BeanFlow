@props([
    'type' => 'submit',
    'loadingTarget' => 'login',
    'label' => __('Log in'),
])

<button type="{{ $type }}" data-login-button
    {{ $attributes->merge([
        'wire:loading.attr' => 'disabled',
        'wire:target' => $loadingTarget,
        // ✅ Estilos base (bonitos) por si el JS aún no aplica la variante
        'class' => 'w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2
                     font-semibold transition-all duration-200 shadow-sm ring-2 ring-transparent
                     bg-espresso-800 text-foam-50 hover:bg-espresso-700 focus:outline-none focus:ring-mocha-400
                     disabled:opacity-60 disabled:cursor-not-allowed
                     dark:bg-crema-400 dark:text-espresso-900 dark:hover:bg-crema-300 dark:focus:ring-crema-300',
    ]) }}>
    {{-- Contenido estable: siempre inline-flex para evitar salto --}}
    <span class="inline-flex items-center justify-center gap-2 leading-none align-middle">
        {{-- Placeholder fija el ancho del icono para que el texto no salte --}}
        <span class="w-4 h-4 inline-block">
            <svg wire:loading wire:target="{{ $loadingTarget }}" class="h-4 w-4 animate-spin" viewBox="0 0 24 24"
                fill="none" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
        </span>

        {{-- Texto: cambia sin alterar layout --}}
        <span>
            <span wire:loading.remove wire:target="{{ $loadingTarget }}">{{ $label }}</span>
            <span wire:loading wire:target="{{ $loadingTarget }}">{{ __('Loading...') }}</span>
        </span>
    </span>
</button>
