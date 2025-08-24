@props([
// Imagen de fondo por defecto (ajusta la ruta si quieres otra)
'src' => asset('img/wallpaper/workcoffe.jpg'),

// Overlay Tailwind (puedes variar opacidad/gradiente)
'overlay' => 'bg-gradient-to-t from-black/70 via-black/40 to-transparent',

// Desenfoque opcional
'blur' => false,
])

<div class="absolute inset-0">
    {{-- Imagen de fondo --}}
    <img src="{{ $src }}" alt="Wallpaper de autenticación"
        class="absolute inset-0 h-full w-full object-cover select-none {{ $blur ? 'blur-sm' : '' }}" draggable="false"
        decoding="async" loading="eager" />

    {{-- Capa de overlay --}}
    <div class="absolute inset-0 {{ $overlay }}"></div>

    {{-- Patrón sutil (grid punteado) --}}
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay
                [background-image:radial-gradient(white_1px,transparent_1px)]
                [background-size:24px_24px]">
    </div>
</div>
