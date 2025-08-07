<!DOCTYPE html>
{{-- ? es la plantilla de login que utilizaremos para mostrar --}}
{{-- <html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark"> --}}
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" x-data
    x-init="document.documentElement.classList.add(localStorage.getItem('theme') || 'dark')">


<head>
    @include('partials.head')
</head>

<body class="min-h-screen bg-white antialiased dark:bg-linear-to-b dark:from-neutral-950 dark:to-neutral-900">
    <div
        class="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div
            class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-e dark:border-neutral-800">
            <div class="absolute inset-0 bg-neutral-900"></div>
            <a href="{{ route('home') }}" class="relative z-20 flex items-center text-lg font-medium" wire:navigate>
                <span class="flex h-10 w-10 items-center justify-center rounded-md">
                    <x-app-logo-icon class="me-2 h-7 fill-current text-white" />
                </span>
                {{ config('app.name', 'BeanFlow') }}
            </a>

            @php
            [$message, $author] = str(Illuminate\Foundation\Inspiring::quotes()->random())->explode('-');
            @endphp
            {{--! LOGO BEANFLOW --}}
            {{-- Logo grande BeanFlow responsivo y centrado --}}
            {{-- 🌐 Logo BeanFlow para versión mobile --}}
            <div class="z-20 flex flex-col items-center gap-2 font-medium lg:hidden">
                <img src="{{ asset('img/coffe_sinfondo.png') }}" alt="Logo BeanFlow"
                    class="max-w-[200px] w-full h-auto object-contain mx-auto">
                <span class="sr-only">BeanFlow</span>
            </div>

            <div class="relative z-20 mt-auto">
                <blockquote class="space-y-2">

                    {{-- <flux:heading size="lg">&ldquo;{{ trim($message) }}&rdquo;</flux:heading>
                    <footer>
                        <flux:heading>{{ trim($author) }}</flux:heading>
                    </footer> --}}
                </blockquote>
            </div>
        </div>
        <div class="w-full lg:p-8">
            <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <a href="{{ route('home') }}" class="z-20 flex flex-col items-center gap-2 font-medium lg:hidden"
                    wire:navigate>
                    <span class="flex h-9 w-9 items-center justify-center rounded-md">
                        <x-app-logo-icon class="size-9 fill-current text-black dark:text-white" />
                    </span>
                    <span class="sr-only">{{ config('app.name', 'Laravel') }}</span>
                </a>
                {{ $slot }}
            </div>
        </div>
    </div>
    @fluxScripts
    {{-- Booton para el dark mode --}}
    <button x-data @click="
        const html = document.documentElement;
        const isDark = html.classList.contains('dark');
        html.classList.toggle('dark');
        html.classList.toggle('light');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    " class="absolute top-4 right-4 z-50 rounded-full bg-white/90 p-2 shadow-lg dark:bg-neutral-800 transition-colors"
        title="Cambiar tema">
        🌗
    </button>

</body>

</html>
