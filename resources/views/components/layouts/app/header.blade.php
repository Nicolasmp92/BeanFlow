<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" >

    @vite('resources/js/app.js')

    <head>
        @include('partials.head')
    </head>
    <body class="min-h-screen bg-white dark:bg-zinc-800">
        <header class="flex items-center border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 px-4 py-2">
            <button class="lg:hidden p-2" aria-label="Toggle sidebar">
                <!-- Icon: bars-2 -->
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>

            <a href="{{ route('dashboard') }}" class="ms-2 me-5 flex items-center space-x-2 rtl:space-x-reverse lg:ms-0" wire:navigate>
                <x-branding.app-logo />
            </a>

            <nav class="-mb-px max-lg:hidden flex space-x-4">
                <a href="{{ route('dashboard') }}" class="flex items-center px-3 py-2 border-b-2 {{ request()->routeIs('dashboard') ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 dark:text-gray-300' }}" wire:navigate>
                    <!-- Icon: layout-grid -->
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                    {{ __('Dashboard') }}
                </a>
            </nav>

            <div class="flex-1"></div>

            <nav class="me-1.5 flex space-x-2 rtl:space-x-reverse py-0">
                <button class="h-10 flex items-center justify-center" title="{{ __('Search') }}">
                    <!-- Icon: magnifying-glass -->
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </button>
                <a href="https://github.com/laravel/livewire-starter-kit" target="_blank" class="h-10 max-lg:hidden flex items-center justify-center" title="{{ __('Repository') }}">
                    <!-- Icon: folder-git-2 -->
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2"/><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"/><circle cx="12" cy="12" r="3"/></svg>
                </a>
                <a href="https://laravel.com/docs/starter-kits#livewire" target="_blank" class="h-10 max-lg:hidden flex items-center justify-center" title="{{ __('Documentation') }}">
                    <!-- Icon: book-open-text -->
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M2 7v13a2 2 0 002 2h16a2 2 0 002-2V7"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                    Documentation
                </a>
            </nav>

            <!-- Desktop User Menu -->
            <div class="relative ml-4">
                <button class="flex items-center cursor-pointer" id="user-menu-button">
                    <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {{ auth()->user()->initials() }}
                    </span>
                </button>
                <!-- Dropdown menu -->
                <div class="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-800 rounded shadow-lg z-10 hidden" id="user-menu-dropdown">
                    <div class="p-4 text-sm font-normal flex items-center gap-2">
                        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                            {{ auth()->user()->initials() }}
                        </span>
                        <div class="flex-1 text-start leading-tight">
                            <span class="truncate font-semibold">{{ auth()->user()->name }}</span>
                            <span class="truncate text-xs">{{ auth()->user()->email }}</span>
                        </div>
                    </div>
                    <div class="border-t border-gray-200 dark:border-zinc-700"></div>
                    <a href="{{ route('settings.profile') }}" class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700">
                        <!-- Icon: cog -->
                        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                        {{ __('Settings') }}
                    </a>
                    <div class="border-t border-gray-200 dark:border-zinc-700"></div>
                    <form method="POST" action="{{ route('logout') }}" class="w-full">
                        @csrf
                        <button type="submit" class="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700">
                            <!-- Icon: arrow-right-start-on-rectangle -->
                            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><path d="M3 12a9 9 0 0118 0 9 9 0 01-18 0z"/></svg>
                            {{ __('Log Out') }}
                        </button>
                    </form>
                </div>
            </div>
        </header>

        <!-- Mobile Menu -->
        <aside class="lg:hidden border-e border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 fixed inset-y-0 left-0 w-64 z-40 transform -translate-x-full transition-transform duration-200 ease-in-out" id="mobile-sidebar">
            <button class="lg:hidden p-2" aria-label="Close sidebar">
                <!-- Icon: x-mark -->
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <a href="{{ route('dashboard') }}" class="ms-1 flex items-center space-x-2 rtl:space-x-reverse" wire:navigate>
                <x-branding.app-logo />
            </a>

            <nav class="mt-4">
                <div class="mb-2 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">{{ __('Platform') }}</div>
                <a href="{{ route('dashboard') }}" class="flex items-center px-4 py-2 {{ request()->routeIs('dashboard') ? 'bg-blue-100 text-blue-600' : 'text-gray-700 dark:text-gray-200' }}" wire:navigate>
                    <!-- Icon: layout-grid -->
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                    {{ __('Dashboard') }}
                </a>
            </nav>

            <div class="mt-4">
                <a href="https://github.com/laravel/livewire-starter-kit" target="_blank" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200">
                    <!-- Icon: folder-git-2 -->
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2"/><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"/><circle cx="12" cy="12" r="3"/></svg>
                    {{ __('Repository') }}
                </a>
                <a href="https://laravel.com/docs/starter-kits#livewire" target="_blank" class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200">
                    <!-- Icon: book-open-text -->
                    <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M2 7v13a2 2 0 002 2h16a2 2 0 002-2V7"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                    {{ __('Documentation') }}
                </a>
            </div>
        </aside>

        {{ $slot }}

        @vite('resources/js/app.js')
        <script>
            // Simple dropdown toggle for user menu
            document.getElementById('user-menu-button')?.addEventListener('click', function() {
                document.getElementById('user-menu-dropdown').classList.toggle('hidden');
            });
            // Simple sidebar toggle for mobile
            document.querySelectorAll('[aria-label="Toggle sidebar"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.getElementById('mobile-sidebar').classList.toggle('-translate-x-full');
                });
            });
            document.querySelectorAll('[aria-label="Close sidebar"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.getElementById('mobile-sidebar').classList.add('-translate-x-full');
                });
            });
        </script>
    </body>
</html>
