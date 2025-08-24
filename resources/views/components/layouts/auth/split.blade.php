{{-- resources/views/components/layouts/auth/split.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">

<head>
    @include('partials.head')

    {{-- Vite (CSS + JS) --}}
    @vite(['resources/css/app.css','resources/js/app.js'])

</head>

<body class="min-h-screen bg-white antialiased dark:bg-linear-to-b dark:from-neutral-950 dark:to-neutral-900">
    <div
        class="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">

        {{-- Panel izquierdo (Wallpaper con overlay) --}}
        <div class="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-e dark:border-neutral-800">
            {{-- Fondo --}}
            <x-auth-wallpaper />

            <a href="{{ route('home') }}" class="relative z-20 flex items-center text-lg font-medium" wire:navigate>
                <span class="flex h-10 w-10 items-center justify-center rounded-md">
                    <x-app-logo-icon class="me-2 h-7 fill-current text-white" />
                </span>
                {{ config('app.name', 'BeanFlow') }}
            </a>

            {{-- Logo mobile (solo sm) --}}
            <div class="z-20 flex flex-col items-center gap-2 font-medium lg:hidden">
                <img src="{{ asset('img/coffe_sinfondo.png') }}" alt="Logo BeanFlow"
                    class="max-w-[200px] w-full h-auto object-contain mx-auto">
                <span class="sr-only">BeanFlow</span>
            </div>

            <div class="relative z-20 mt-auto">
                <blockquote class="space-y-2">
                    {{-- opcional: frase/autor --}}
                </blockquote>
            </div>

            {{-- Footer pegado al pie del panel izquierdo (solo desktop) --}}
            <x-auth-footer owner="BeanFlow" align="left" class="z-20" />
        </div>

        {{-- Panel derecho (formulario) --}}
        {{-- Panel derecho (formulario) --}}
        <div class="w-full lg:p-8">
            <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                {{-- ... logo mobile + {{ $slot }} ... --}}
                {{ $slot }}
            </div>

            {{-- Footer en móvil: bajo del formulario con hr encima --}}
            <div class="lg:hidden mt-8 px-6 sm:px-0">
                <hr class="mb-4 border-neutral-200 dark:border-neutral-800" />
                <x-auth-footer owner="BeanFlow" align="center" {{-- cambia a "left" o "right" si prefieres
                    --}} :fixed="false" {{-- modo estático para que fluya bajo el hr --}} />
            </div>
        </div>

    </div>
    @fluxScripts


    @include('partials.darkmode-login-toggle')

    <style>
        @media (prefers-reduced-motion: no-preference) {

            html,
            body {
                transition: background-color .2s ease, color .2s ease, border-color .2s ease;
            }
        }
    </style>
</body>

</html>
