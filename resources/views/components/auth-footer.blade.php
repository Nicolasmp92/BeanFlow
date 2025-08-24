@props([
    'owner' => 'BeanFlow',
    'year' => date('Y'),
    'align' => 'right',     // 'left' | 'center' | 'right'
    'fixed' => true,        // true => absolute bottom; false => flujo normal (estático)
])

@php
if ($fixed) {
    $placement = match ($align) {
        'left'   => 'absolute bottom-4 left-4',
        'center' => 'absolute bottom-4 left-1/2 -translate-x-1/2',
        default  => 'absolute bottom-4 right-4',
    };
    $justify = '';
} else {
    $placement = '';
    $justify = match ($align) {
        'left'   => 'justify-start text-left',
        'center' => 'justify-center text-center',
        default  => 'justify-end text-right',
    };
}
@endphp

<div {{ $attributes->merge([
    'class' => "{$placement} flex items-center {$justify} gap-1 text-xs
                text-neutral-500 dark:text-white/60"
]) }}>
    <flux:icon.copyright class="w-4 h-4 relative top-[1px]" />
    <span>{{ $year }} {{ $owner }}. Todos los derechos reservados.</span>
</div>
