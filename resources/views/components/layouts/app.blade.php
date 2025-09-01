{{-- resources/views/components/layouts/app.blade.php --}}
@php($splashMode = session('auth_success') ? 'auth-success' : 'auto')
@php($userName  = auth()->check() ? auth()->user()->name : null)

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
    @include('partials.head')
    @vite('resources/js/app.js')
</head>
<body data-splash-mode="{{ $splashMode }}" @if($userName) data-user="{{ $userName }}" @endif
        class="min-h-screen bg-white antialiased dark:bg-neutral-950">

        {{-- ✅ Splash: siempre aquí, inmediatamente después de <body> --}}
        @include('partials.splash')

        {{-- Resolución de tema (oscuro/claro) antes de pintar el contenido --}}
        <script>
        (() => {
        const saved = @json(optional(auth()->user())->theme ?? 'system'); // 'light' | 'dark' | 'system'
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const resolved = saved === 'system' ? (prefersDark ? 'dark' : 'light') : saved;
        if (resolved === 'dark') document.documentElement.classList.add('dark');
        })();
        </script>

        {{-- Layout con sidebar + contenido --}}
        <x-layouts.app.sidebar :title="$title ?? null">
            <flux:main>
                {{ $slot }}
            </flux:main>
        </x-layouts.app.sidebar>

    </body>
    </html>
