{{-- resources/views/livewire/layout/sidebar.blade.php --}}
<aside id="sidebar" x-data
    :class="{
        'translate-x-0': $store.ui.sidebarOpen,
        '-translate-x-full': !$store.ui.sidebarOpen,
    }"
    class="fixed inset-y-0 left-0 z-50 w-[280px]
            border-e border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900
            transition-[width,transform] duration-200 will-change-[width,transform]
            overflow-y-auto overscroll-contain flex flex-col
            -translate-x-full lg:translate-x-0"
    aria-label="Sidebar">

    {{-- Botón cerrar (solo móvil) --}}
    <button @click="$store.ui.closeSidebar()"
        class="lg:hidden absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center
               rounded-md border border-zinc-300 bg-white text-zinc-700 shadow-sm
               hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        aria-label="{{ __('Cerrar menú lateral') }}">
        <x-lucide-x class="h-5 w-5" />
    </button>

    {{-- Encabezado centrado con nombre de la app --}}
    <div class="px-5 py-4 flex items-center justify-center">
        <span class="text-sm font-semibold text-zinc-700 dark:text-zinc-100 select-none">
            {{ config('app.name', 'BeanFlow') }}
        </span>
    </div>

    {{-- Menú principal --}}
    <nav class="mt-2">
        <h5 class="px-5 mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {{ __('Menú') }}
        </h5>

        <ul class="grid gap-1">
            {{-- Dashboard --}}
            <li>
                <a href="{{ route('dashboard') }}" wire:navigate data-tip="{{ __('Panel') }}"
                    class="mx-2 flex items-center gap-3 rounded-md border px-5 py-2 text-sm
                          hover:border-zinc-300 hover:bg-white
                          dark:hover:border-zinc-600 dark:hover:bg-zinc-800
                          {{ request()->routeIs('dashboard')
                              ? 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800'
                              : 'border-transparent' }}">
                    <x-lucide-home class="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                    <span class="menu-label">{{ __('Panel') }}</span>
                </a>
            </li>

            {{-- Usuarios --}}
            <li>
                <a href="{{ route('users.index') }}" wire:navigate data-tip="{{ __('Usuarios') }}"
                    class="mx-2 flex items-center gap-3 rounded-md border px-5 py-2 text-sm
                          hover:border-zinc-300 hover:bg-white
                          dark:hover:border-zinc-600 dark:hover:bg-zinc-800
                          {{ request()->routeIs('users.index')
                              ? 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800'
                              : 'border-transparent' }}">
                    <x-lucide-users class="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                    <span class="menu-label">{{ __('Usuarios') }}</span>
                </a>
            </li>
        </ul>
    </nav>

    <div class="mt-auto"></div>

    {{-- * Footer --}}
    <div class="sidebar-footer px-5 py-4 border-t border-zinc-200 dark:border-zinc-700">
        <div class="flex justify-center">
            <a {{-- :href="route('profile')" --}} data-tip="{{ __('Configuraciones') }}"
                class="flex items-center gap-2 rounded-md border border-transparent px-5 py-2 text-sm
                   hover:border-zinc-300 hover:bg-white
                   dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
                <x-lucide-settings class="h-5 w-5 text-zinc-700 dark:text-zinc-200" />
                <span class="menu-label">{{ __('Configuraciones') }}</span>
            </a>
        </div>
    </div>


    {{-- ! end Footer --}}

</aside>
