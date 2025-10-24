{{-- resources/views/components/auth-header.blade.php --}}
@props([
    'title',
    'description',
])

<div class="flex w-full flex-col text-center">
    {{-- Ícono centrado (sin fondo) --}}
    <div class="mx-auto mb-6">
        <x-branding.app-logo-icon class="h-16 w-16 fill-current text-mocha-600 dark:text-crema-300" />
    </div>

    <h1 class="text-3xl sm:text-4xl font-semibold mb-2 text-espresso-900 dark:text-foam-100">
        {{ $title }}
    </h1>

    <p class="text-sm sm:text-base text-espresso-600 dark:text-foam-300/90">
        {{ $description }}
    </p>

    {{-- Acento único: 1px, ancho completo --}}
    <div class="my-6 h-px w-full bg-mocha-500/50 dark:bg-crema-300/50"></div>
</div>
