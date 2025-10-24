<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  {{-- Pre-hook: evita FOUC y muestra solo la cortina en el primer frame --}}
  <style>html.splash-open body > :not(#app-splash){visibility:hidden}</style>
  <script>!function(){var d=document.documentElement;d.classList.add('splash-open');d.classList.remove('dark');}();</script>

  @include('partials.head')
  @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="bg-muted min-h-screen bg-white antialiased dark:bg-gradient-to-b dark:from-neutral-950 dark:to-neutral-900">
    {{-- 👇 Splash como HIJO DIRECTO de <body> --}}
    @include('partials.splash')

    <div class="relative grid min-h-screen flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
        {{-- Panel izquierdo (solo escritorio) --}}
        <div class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex">
            <div class="z-20 mt-0">
                <div class="flex items-center gap-3">
                    <a href="{{ route('home') }}" class="flex items-center shrink-0">
                        <span class="flex h-10 w-10 items-center justify-center rounded-md">
                            <x-branding.app-logo-icon class="h-7 w-7 fill-current text-white" />
                        </span>
                    </a>
                    <h2 class="text-3xl font-bold leading-tight tracking-wide">
                        <span>{{ config('app.name', 'BeanFlow') }}</span>
                    </h2>
                </div>
                <span class="text-sm text-white/70 leading-tight">
                    Plataforma de gestión para tu cafetería.
                </span>
            </div>

            <x-auth.wallpaper />
            <x-auth.footer class="hidden lg:block" />
        </div>

        {{-- Panel derecho (Login) --}}
        <div class="relative w-full lg:p-8">
            <div class="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px] pb-28 lg:pb-0">
                {{ $slot }}
            </div>
        </div>
    </div>

    <x-auth.footer class="lg:hidden" />
</body>
</html>
