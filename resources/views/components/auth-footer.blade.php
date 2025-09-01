@props([
'owner' => 'BeanFlow',
'year' => date('Y'),
'align' => 'right', // 'left' | 'center' | 'right'
'fixed' => true, // true => absolute bottom; false => flujo normal (estático)
'socials' => [
'twitter' => 'https://twitter.com/',
'facebook' => 'https://facebook.com/',
'instagram' => 'https://instagram.com/',
// agrega o edita según tus necesidades
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

// Nombres tal cual los usa <flux:icon name="...">
    $icons = [
    'twitter' => 'twitter',
    'facebook' => 'facebook',
    'instagram' => 'instagram',
    'github' => 'github',
    'linkedin' => 'linkedin',
    ];
    @endphp

    <div {{ $attributes->merge([
        'class' => "{$placement} w-full text-xs text-neutral-500 dark:text-white/60 px-5"
        ]) }}>
        <div class="flex items-center justify-between gap-3">
            {{-- Izquierda: Copyright --}}
            <div class="flex items-center gap-1">
                <flux:icon.copyright class="w-4 h-4 relative top-[1px]" />
                <span>{{ $year }} {{ $owner }}. Todos los derechos reservados.</span>
            </div>

            {{-- Derecha: Redes --}}
            <div class="flex items-center gap-3">
                @foreach($socials as $platform => $url)
                @if(isset($icons[$platform]))
                <a href="{{ $url }}" target="_blank" rel="noopener" class="group" aria-label="{{ ucfirst($platform) }}">
                    {{--
                    Notas:
                    - 'transition-colors' y 'duration-200' en el ícono.
                    - Usamos group-hover directamente en el ícono para evitar que la cascada del contenedor
                    (dark:text-*) gane.
                    - Fallback seguro: hover a azul en claro y a blanco en oscuro.
                    - Si ya definiste 'primary' en Tailwind, puedes cambiar por: 'group-hover:text-primary'
                    --}}
                    <flux:icon :name="$icons[$platform]" class="w-4 h-4 transition-colors   duration-200
                        text-inherit
                        group-hover:text-blue-500
                        dark:group-hover:text-white" />
                    {{-- Alternativa si ya tienes primary:
                    class="w-4 h-4 transition-colors duration-200 text-inherit group-hover:text-primary"
                    --}}
                </a>
                @endif
                @endforeach
            </div>
        </div>
    </div>
