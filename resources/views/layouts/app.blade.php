{{-- resources/views/layouts/app.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    @include('partials.head')
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>

<body class="font-sans antialiased">

    <div x-data
        x-effect="document.documentElement.classList.toggle(
            'overflow-hidden',
            $store.ui.sidebarOpen && window.matchMedia('(max-width: 1023px)').matches
        )"
        class="min-h-screen bg-gray-100 dark:bg-gray-900 relative">

        {{-- SIDEBAR (Livewire) --}}
        <livewire:layout.sidebar />

        {{-- BACKDROP móvil --}}
        <div x-show="$store.ui.sidebarOpen" x-transition.opacity @click="$store.ui.closeSidebar()" id="sidebar-backdrop"
            class="fixed inset-0 z-40 bg-black/40 lg:hidden" x-cloak aria-hidden="true"></div>

        {{-- SHELL empujado por sidebar + compensación topbar --}}
        <div class="shell transition-[margin] duration-200 overflow-x-hidden">
            {{-- TOPBAR / NAVBAR --}}
            <livewire:layout.navigation />

            {{-- HEADER opcional (ya no se superpone) --}}
            @if (isset($header))
                <header class="bg-white dark:bg-zinc-900 shadow">
                    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {{ $header }}
                    </div>
                </header>
            @endif

            {{-- CONTENIDO --}}
            <main class="p-6">
                {{ $slot }}
            </main>
        </div>
    </div>

    @livewireScripts
</body>

</html>
