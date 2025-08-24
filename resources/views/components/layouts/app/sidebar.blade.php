{{-- resources\views\components\layouts\app\sidebar.blade.php --}}
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
{{-- <html lang="{{ str_replace('_', '-', app()->getLocale()) }}"> --}}

<head>
    @include('partials.head')
</head>

<body class="min-h-screen bg-white dark:bg-zinc-800">
    <flux:sidebar sticky stashable class="border-e border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
        <flux:sidebar.toggle class="lg:hidden" icon="x-mark" />

        <a href="{{ route('dashboard') }}" class="me-5 flex items-center space-x-2 rtl:space-x-reverse" wire:navigate>
            <x-app-logo />
        </a>
        @role('super-admin')
        <flux:navlist variant="outline">
            {{-- CAFETERÍA / OPERACIÓN --}}
            <flux:navlist.group :heading="__('Cafetería')" class="grid">
                <flux:navlist.item icon="home" :href="route('dashboard')" :current="request()->routeIs('dashboard')"
                    wire:navigate>
                    {{ __('Dashboard') }}
                </flux:navlist.item>

                {{-- Operación diaria --}}
                @can('orders.handle')
                <flux:navlist.item icon="coffee" :href="route('stub', 'pedidos')"
                    :current="request()->is('stub/pedidos')" wire:navigate>{{ __('Pedidos') }}
                </flux:navlist.item>

                <flux:navlist.item icon="table" :href="route('stub', 'mesas')" :current="request()->is('stub/mesas')"
                    wire:navigate>{{ __('Mesas') }}
                </flux:navlist.item>
                @endcan

                {{-- Carta y productos (puedes cambiar a permissions más finos luego) --}}
                @can('admin.view')
                <flux:navlist.item icon="package" :href="route('stub', 'productos')"
                    :current="request()->is('stub/productos')" wire:navigate>{{ __('Productos') }}
                </flux:navlist.item>

                <flux:navlist.item icon="tags" :href="route('stub', 'categorias')"
                    :current="request()->is('stub/categorias')" wire:navigate>{{ __('Categorías') }}
                </flux:navlist.item>
                @endcan
            </flux:navlist.group>

            {{-- VENTAS --}}
            @can('sales.handle')
            <flux:navlist.group :heading="__('Ventas')">
                <flux:navlist.item icon="credit-card" :href="route('stub', 'caja')"
                    :current="request()->is('stub/caja')" wire:navigate>{{ __('Caja / Ventas') }}
                </flux:navlist.item>

                <flux:navlist.item icon="users" :href="route('stub', 'clientes')"
                    :current="request()->is('stub/clientes')" wire:navigate>{{ __('Clientes') }}
                </flux:navlist.item>

                <flux:navlist.item icon="star" :href="route('stub', 'fidelizacion')"
                    :current="request()->is('stub/fidelizacion')" wire:navigate>{{ __('Fidelización') }}
                </flux:navlist.item>

                <flux:navlist.item icon="receipt" :href="route('stub', 'compras')"
                    :current="request()->is('stub/compras')" wire:navigate>{{ __('Compras') }}
                </flux:navlist.item>
            </flux:navlist.group>
            @endcan

            {{-- COCINA --}}
            @can('kitchen.handle')
            <flux:navlist.group :heading="__('Cocina')">
                <flux:navlist.item icon="chef-hat" :href="route('stub', 'menu-del-dia')"
                    :current="request()->is('stub/menu-del-dia')" wire:navigate>{{ __('Menú del día') }}
                </flux:navlist.item>

                <flux:navlist.item icon="book-open" :href="route('stub', 'recetas')"
                    :current="request()->is('stub/recetas')" wire:navigate>{{ __('Recetas') }}
                </flux:navlist.item>
            </flux:navlist.group>
            @endcan

            {{-- ADMINISTRACIÓN --}}
            @canany(['admin.view','users.manage'])
            <flux:navlist.group :heading="__('Administración')">
                @can('admin.view')
                <flux:navlist.item icon="boxes" :href="route('stub', 'inventario')"
                    :current="request()->is('stub/inventario')" wire:navigate>{{ __('Inventario') }}
                </flux:navlist.item>

                <flux:navlist.item icon="truck" :href="route('stub', 'proveedores')"
                    :current="request()->is('stub/proveedores')" wire:navigate>{{ __('Proveedores') }}
                </flux:navlist.item>

                {{-- Reportes: usa chart-bar (Heroicons). Si prefieres Lucide, importa chart-column. --}}
                <flux:navlist.item icon="chart-bar" :href="route('stub', 'reportes')"
                    :current="request()->is('stub/reportes')" wire:navigate>{{ __('Reportes') }}
                </flux:navlist.item>
                @endcan

                @can('users.manage')
                <flux:navlist.item icon="users" :href="route('stub', 'usuarios')"
                    :current="request()->is('stub/usuarios')" wire:navigate>{{ __('Gestión de Usuarios') }}
                </flux:navlist.item>
                @endcan

                @can('admin.view')
                <flux:navlist.item icon="cog" :href="route('stub', 'ajustes')" :current="request()->is('stub/ajustes')"
                    wire:navigate>{{ __('Ajustes') }}
                </flux:navlist.item>
                @endcan
            </flux:navlist.group>
            @endcanany
        </flux:navlist>
        @endrole
        <flux:spacer />

        <flux:navlist variant="outline">
            <flux:navlist.item icon="folder-git-2" href="#" target="_blank">
                {{ __('Repository') }}
            </flux:navlist.item>
            {{-- !noas de la version --}}
            {{-- Notas de la versión (abre modal) --}}
            <flux:navlist.item icon="book-open-text" href="#" onclick="openReleaseNotes(); return false;">
                {{ __('Notas: v') . config('app.version') }}
            </flux:navlist.item>




        </flux:navlist>

        <!-- Desktop User Menu -->
        <flux:dropdown class="hidden lg:block" position="bottom" align="start">
            <flux:profile :name="auth()->user()->name" :initials="auth()->user()->initials()"
                icon:trailing="chevrons-up-down" />

            <flux:menu class="w-[220px]">
                <flux:menu.radio.group>
                    <div class="p-0 text-sm font-normal">
                        <div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                            <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                                <span
                                    class="flex h-full w-full items-center justify-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {{ auth()->user()->initials() }}
                                </span>
                            </span>

                            <div class="grid flex-1 text-start text-sm leading-tight">
                                <span class="truncate font-semibold">{{ auth()->user()->name }}</span>
                                <span class="truncate text-xs">{{ auth()->user()->email }}</span>
                            </div>
                        </div>
                    </div>
                </flux:menu.radio.group>

                <flux:menu.separator />

                <flux:menu.radio.group>
                    <flux:menu.item :href="route('settings.profile')" icon="cog" wire:navigate>{{ __('Settings') }}
                    </flux:menu.item>
                </flux:menu.radio.group>

                <flux:menu.separator />

                <form method="POST" action="{{ route('logout') }}" class="w-full">
                    @csrf
                    <flux:menu.item as="button" type="submit" icon="arrow-right-start-on-rectangle" class="w-full">
                        {{ __('Log Out') }}
                    </flux:menu.item>
                </form>
            </flux:menu>
        </flux:dropdown>
    </flux:sidebar>

    <!-- Mobile User Menu -->
    <flux:header class="lg:hidden">
        <flux:sidebar.toggle class="lg:hidden" icon="bars-2" inset="left" />

        <flux:spacer />

        <flux:dropdown position="top" align="end">
            <flux:profile :initials="auth()->user()->initials()" icon-trailing="chevron-down" />

            <flux:menu>
                <flux:menu.radio.group>
                    <div class="p-0 text-sm font-normal">
                        <div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                            <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                                <span
                                    class="flex h-full w-full items-center justify-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {{ auth()->user()->initials() }}
                                </span>
                            </span>

                            <div class="grid flex-1 text-start text-sm leading-tight">
                                <span class="truncate font-semibold">{{ auth()->user()->name }}</span>
                                <span class="truncate text-xs">{{ auth()->user()->email }}</span>
                            </div>
                        </div>
                    </div>
                </flux:menu.radio.group>

                <flux:menu.separator />

                <flux:menu.radio.group>
                    <flux:menu.item :href="route('settings.profile')" icon="cog" wire:navigate>{{ __('Settings') }}
                    </flux:menu.item>
                </flux:menu.radio.group>

                <flux:menu.separator />

                <form method="POST" action="{{ route('logout') }}" class="w-full">
                    @csrf
                    <flux:menu.item as="button" type="submit" icon="arrow-right-start-on-rectangle" class="w-full">
                        {{ __('Log Out') }}
                    </flux:menu.item>
                </form>
            </flux:menu>
        </flux:dropdown>
    </flux:header>

    {{ $slot }}

    @fluxScripts
</body>

</html>
