@props([
    'owner' => 'BeanFlow',
    'year' => date('Y'),
    'align' => 'right', // 'left' | 'center' | 'right'
    'fixed' => true, // true => absolute bottom; false => flujo normal (estático)
    'socials' => [
        'twitter' => 'https://twitter.com/',
        'facebook' => 'https://facebook.com/',
        'instagram' => 'https://instagram.com/',
    ],
])

@php
    if ($fixed) {
        $placement = match ($align) {
            'left', 'center', 'right' => 'absolute inset-x-0 bottom-4',
            default => 'absolute bottom-4 right-4',
        };
        $justify = '';
    } else {
        $placement = '';
        $justify = match ($align) {
            'left' => 'justify-start text-left',
            'center' => 'justify-center text-center',
            default => 'justify-end text-right',
        };
    }

    $icons = [
        'twitter' =>
            '<svg class="w-4 h-4 transition-colors duration-200 text-inherit group-hover:text-primary dark:group-hover:text-crema-300" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 0 0 1.965-2.475 8.94 8.94 0 0 1-2.828 1.082 4.48 4.48 0 0 0-7.636 4.086A12.72 12.72 0 0 1 3.112 4.89a4.48 4.48 0 0 0 1.388 5.976 4.46 4.46 0 0 1-2.03-.56v.057a4.48 4.48 0 0 0 3.594 4.393 4.48 4.48 0 0 1-2.025.077 4.48 4.48 0 0 0 4.185 3.112A8.98 8.98 0 0 1 2 19.54a12.68 12.68 0 0 0 6.88 2.018c8.26 0 12.78-6.84 12.78-12.78 0-.195-.004-.39-.013-.583A9.14 9.14 0 0 0 24 4.59a8.93 8.93 0 0 1-2.54.698z"/></svg>',
        'facebook' =>
            '<svg class="w-4 h-4 transition-colors duration-200 text-inherit group-hover:text-primary dark:group-hover:text-crema-300" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.592 1.325-1.326V1.326C24 .592 23.405 0 22.675 0"/></svg>',
        'instagram' =>
            '<svg class="w-4 h-4 transition-colors duration-200 text-inherit group-hover:text-primary dark:group-hover:text-crema-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.782 2.295 7.148 2.233 8.414 2.175 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.212 2.092-1.271 3.373C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.613.059 1.281.291 2.393 1.271 3.373.98.98 2.092 1.212 3.373 1.271C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.291 3.373-1.271.98-.98 1.212-2.092 1.271-3.373.059-1.281.072-1.69.072-7.613 0-5.923-.013-6.332-.072-7.613-.059-1.281-.291-2.393-1.271-3.373-.98-.98-2.092-1.212-3.373-1.271C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>',
    ];
@endphp

<div
    {{ $attributes->merge([
        // Contenedor externo: placement + spacing
        'class' => "{$placement} w-full px-5 text-xs",
    ]) }}>
    {{-- Capa visual con contraste sobre wallpaper --}}
    <div
        class="mx-auto max-w-[720px] rounded-xl border backdrop-blur-sm
                bg-foam-50/70 border-foam-200/70 text-espresso-700
                shadow-sm
                dark:bg-espresso-900/40 dark:border-espresso-700/60 dark:text-foam-200">

        <div class="flex items-center justify-between gap-3 py-2.5 px-3">
            {{-- Izquierda: Copyright --}}
            <div class="flex items-center gap-1">
                <svg class="w-4 h-4 relative top-[1px] text-espresso-700 dark:text-foam-200" fill="currentColor"
                    viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="none" />
                    <text x="12" y="16" text-anchor="middle" font-size="12" fill="currentColor"
                        font-family="Arial, sans-serif" font-weight="bold">C</text>
                </svg>
                <span class="text-espresso-700 dark:text-foam-200">
                    {{ $year }} {{ $owner }}. {{ __('Todos los derechos reservados.') }}
                </span>
            </div>

            {{-- Derecha: Redes --}}
            <div class="flex items-center gap-3">
                @foreach ($socials as $platform => $url)
                    @if (isset($icons[$platform]))
                        <a href="{{ $url }}" target="_blank" rel="noopener"
                            class="group inline-flex items-center justify-center rounded-md p-1.5
                                  text-espresso-600 hover:text-primary
                                  dark:text-foam-300 dark:hover:text-crema-300
                                  transition-colors"
                            aria-label="{{ ucfirst($platform) }}">
                            {!! $icons[$platform] !!}
                        </a>
                    @endif
                @endforeach
            </div>
        </div>
    </div>
</div>
