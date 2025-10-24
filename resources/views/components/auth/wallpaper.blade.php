@props([
    'src' => 'img/login/workcoffe.jpg',
    'overlay' => 'bg-black/10',
    'class' => '',
])

{{-- El contenedor del wallpaper ya NO usa z negativo --}}
<div {{ $attributes->merge(['class' => "absolute inset-0 z-0 {$class}"]) }}>
    {{-- Imagen de fondo --}}
    <img
        src="{{ asset($src) }}"
        alt="Wallpaper"
        class="h-full w-full object-cover object-center select-none pointer-events-none"
        loading="lazy"
        decoding="async">

    {{-- Overlay oscuro encima de la imagen --}}
    <div class="absolute inset-0 {{ $overlay }} pointer-events-none"></div>
</div>
