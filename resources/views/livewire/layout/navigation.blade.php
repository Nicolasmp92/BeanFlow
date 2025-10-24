{{-- resources/views/livewire/layout/navigation.blade.php --}}
<?php

use App\Livewire\Actions\Logout;
use Livewire\Volt\Component;

new class extends Component {
    public function logout(Logout $logout): void
    {
        $logout();
        $this->redirect('/', navigate: true);
    }
}; ?>

<nav x-data="{ open: false }"
    class="app-topbar is-fixed relative z-50 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-700 shadow-sm">
    <div class="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2">
            {{-- Toggle sidebar (móvil) --}}
            <button
                class="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md
                       border border-zinc-300 bg-white text-zinc-700 shadow-sm
                       hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                @click="$store.ui.toggleSidebar()" aria-label="{{ __('Abrir/cerrar menú lateral') }}">
                <x-lucide-panel-left class="h-5 w-5" />
            </button>

            {{-- Toggle colapso (desktop) --}}
            <button
                class="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-md
           border border-zinc-300 bg-white text-zinc-700 shadow-sm
           hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                @click="window.toggleSidebarCollapse && window.toggleSidebarCollapse(); sidebarCollapsed = !sidebarCollapsed"
                title="{{ __('Colapsar/expandir') }}" aria-label="{{ __('Colapsar/expandir') }}"
                x-data="{ sidebarCollapsed: false }">
                <template x-if="!sidebarCollapsed">
                    <x-lucide-panel-right-close class="h-5 w-5" />
                </template>
                <template x-if="sidebarCollapsed">
                    <x-lucide-panel-right-open class="h-5 w-5" />
                </template>
            </button>

            {{-- Logo --}}
            <a href="{{ route('dashboard') }}" wire:navigate class="flex items-center">
                <x-branding.application-logo
                    class="block h-9 w-auto fill-current text-gray-800 dark:text-gray-100 transition-colors duration-300" />
            </a>

            {{-- Links principales (desktop) --}}
            <div class="hidden sm:flex sm:items-center sm:ms-10">
                <x-ui.navigation.nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')" wire:navigate>
                    {{ __('Panel') }}
                </x-ui.navigation.nav-link>
            </div>
        </div>

        {{-- Dropdown usuario (desktop) --}}
        <div class="hidden sm:flex sm:items-center sm:ms-6">
            <x-ui.navigation.dropdown align="right" width="48">
                <x-slot name="trigger">
                    <button
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md
                               text-gray-600 dark:text-gray-200 bg-white dark:bg-zinc-900
                               hover:text-gray-800 dark:hover:text-white
                               focus:outline-none transition ease-in-out duration-150">
                        <div x-data="{{ json_encode(['name' => auth()->user()->name]) }}" x-text="name"
                            x-on:profile-updated.window="name = $event.detail.name"></div>
                        <div class="ms-1">
                            <svg class="fill-current h-4 w-4 text-gray-600 dark:text-gray-300"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                    </button>
                </x-slot>

                <x-slot name="content">
                    <x-ui.navigation.dropdown-link :href="route('profile')" wire:navigate>
                        {{ __('Perfil') }}
                    </x-ui.navigation.dropdown-link>

                    <form method="POST" action="{{ route('logout') }}" class="w-full">
                        @csrf
                        <button type="submit" class="w-full text-start">
                            <x-ui.navigation.dropdown-link>
                                {{ __('Finalizar sesión') }}
                            </x-ui.navigation.dropdown-link>
                        </button>
                    </form>
                </x-slot>
            </x-ui.navigation.dropdown>
        </div>

        {{-- Hamburguesa (menú responsive de la topbar) --}}
        <div class="-me-2 flex items-center sm:hidden">
            <button @click="open = ! open"
                class="inline-flex items-center justify-center p-2 rounded-md
                           text-gray-500 dark:text-gray-300
                           hover:text-gray-700 dark:hover:text-white
                           hover:bg-gray-100 dark:hover:bg-zinc-800
                           focus:outline-none focus:bg-gray-100 dark:focus:bg-zinc-800
                           focus:text-gray-700 dark:focus:text-white
                           transition duration-150 ease-in-out">
                <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path :class="{ 'hidden': open, 'inline-flex': !open }" class="inline-flex" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    <path :class="{ 'hidden': !open, 'inline-flex': open }" class="hidden" stroke-linecap="round"
                        stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>

    {{-- Menú responsive de la topbar --}}
    <div x-cloak x-show="open" @click.outside="open = false" x-transition.opacity.duration.150ms
        class="sm:hidden bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 shadow-md">
        <div class="pt-2 pb-3 space-y-1">
            <x-ui.navigation.responsive-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')" wire:navigate>
                {{ __('Panel') }}
            </x-ui.navigation.responsive-nav-link>
        </div>

        <div class="pt-4 pb-1 border-t border-gray-200 dark:border-zinc-700">
            <div class="px-4">
                <div class="font-medium text-base text-gray-800 dark:text-gray-100" x-data="{{ json_encode(['name' => auth()->user()->name]) }}"
                    x-text="name" x-on:profile-updated.window="name = $event.detail.name"></div>
                <div class="font-medium text-sm text-gray-500 dark:text-gray-300">
                    {{ auth()->user()->email }}
                </div>
            </div>

            <div class="mt-3 space-y-1">
                <x-ui.navigation.responsive-nav-link :href="route('profile')" wire:navigate>
                    {{ __('Perfil') }}
                </x-ui.navigation.responsive-nav-link>

                <form method="POST" action="{{ route('logout') }}" class="w-full">
                    @csrf
                    <button type="submit" class="w-full text-start">
                        <x-ui.navigation.responsive-nav-link>
                            {{ __('Finalizar sesión') }}
                        </x-ui.navigation.responsive-nav-link>
                    </button>
                </form>
            </div>
        </div>
    </div>


</nav>
