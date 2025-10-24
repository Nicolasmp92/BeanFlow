<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    @include('partials.head')
</head>

<body class="min-h-screen bg-white dark:bg-zinc-800 flex">
    <!-- Sidebar -->
    <aside class="sticky top-0 h-screen w-64 border-e border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 flex flex-col">
        <!-- Sidebar Toggle (Mobile) -->
        <button class="lg:hidden p-2 m-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

        <a href="{{ route('dashboard') }}" class="me-5 flex items-center space-x-2 rtl:space-x-reverse p-4" wire:navigate>
            <x-branding.app-logo />
        </a>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-2">
            <div class="mb-4">
                <h2 class="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-2">{{ __('Menu') }}</h2>
                <ul class="space-y-1">
                    <li>
                        <a href="{{ route('dashboard') }}"
                           class="flex items-center px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 {{ request()->routeIs('dashboard') ? 'bg-zinc-200 dark:bg-zinc-700 font-bold' : '' }}"
                           wire:navigate>
                            <span class="mr-2">
                                <!-- Home Icon -->
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0h6m-6 0a2 2 0 01-2-2v-4a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2h-6z" />
                                </svg>
                            </span>
                            {{ __('Dashboard') }}
                        </a>
                    </li>
                    <li>
                        <a href="{{ route('users.index') }}"
                           class="flex items-center px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 {{ request()->routeIs('users.index') ? 'bg-zinc-200 dark:bg-zinc-700 font-bold' : '' }}"
                           wire:navigate>
                            <span class="mr-2">
                                <!-- Users Icon -->
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </span>
                            {{ __('Usuarios') }}
                        </a>
                    </li>
                </ul>
            </div>
            <div class="mt-8">
                <ul class="space-y-1">
                    <li>
                        <a href="#" target="_blank" class="flex items-center px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <span class="mr-2">
                                <!-- Repository Icon -->
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v4a1 1 0 001 1h3m10-5h3a1 1 0 011 1v4a1 1 0 01-1 1h-3m-10 5h10" />
                                </svg>
                            </span>
                            {{ __('Repository') }}
                        </a>
                    </li>
                    <li>
                        <a href="#" target="_blank" class="flex items-center px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <span class="mr-2">
                                <!-- Notes Icon -->
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m0 0H3" />
                                </svg>
                            </span>
                            {{ __('Notas: v0.0.1') }}
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- Desktop User Menu -->
        <div class="hidden lg:block px-4 py-4 border-t border-zinc-200 dark:border-zinc-700">
            <div class="flex items-center gap-2">
                <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                    <span class="flex h-full w-full items-center justify-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {{ auth()->user()->initials() }}
                    </span>
                </span>
                <div class="grid flex-1 text-start text-sm leading-tight">
                    <span class="truncate font-semibold">{{ auth()->user()->name }}</span>
                    <span class="truncate text-xs">{{ auth()->user()->email }}</span>
                </div>
                <!-- Dropdown -->
                <div class="relative group">
                    <button class="ml-2 p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="absolute left-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
                        <a href="{{ route('settings.profile') }}" class="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800" wire:navigate>
                            <svg class="inline h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            {{ __('Settings') }}
                        </a>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <svg class="inline h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                                </svg>
                                {{ __('Log Out') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden w-full flex items-center px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
        <button class="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <div class="flex-1"></div>
        <!-- Mobile User Dropdown -->
        <div class="relative group">
            <button class="flex items-center gap-2 p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {{ auth()->user()->initials() }}
                </span>
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
                <div class="flex items-center gap-2 px-4 py-2">
                    <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {{ auth()->user()->initials() }}
                    </span>
                    <div class="grid flex-1 text-start text-sm leading-tight">
                        <span class="truncate font-semibold">{{ auth()->user()->name }}</span>
                        <span class="truncate text-xs">{{ auth()->user()->email }}</span>
                    </div>
                </div>
                <a href="{{ route('settings.profile') }}" class="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800" wire:navigate>
                    <svg class="inline h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {{ __('Settings') }}
                </a>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <svg class="inline h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                        </svg>
                        {{ __('Log Out') }}
                    </button>
                </form>
            </div>
        </div>
    </header>

    <main class="flex-1">
        {{ $slot }}
    </main>

    @fluxScripts

</body>

</html>
