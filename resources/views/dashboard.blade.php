<x-layouts.app :title="__('Dashboard')">
    <div class="flex h-full w-full flex-1 flex-col gap-4 rounded-xl">
        {{-- Grid superior por permisos --}}
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">

            @can('admin.view')
                <div class="relative aspect-video overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <x-placeholder-pattern class="absolute inset-0 size-full stroke-gray-900/20 dark:stroke-neutral-100/20" />
                    <h3 class="text-lg font-bold p-4">Panel Admin</h3>
                    <p class="p-4">Estadísticas, gestión de usuarios, menú...</p>
                </div>
            @endcan

            @can('admin.view')
                <div class="p-4 bg-white  dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 ">
                    <h3 class="text-lg font-bold">Panel Admin</h3>
                    <p>Estadísticas, gestión de usuarios, menú...</p>
                </div>
            @endcan

            @can('orders.handle') {{-- garzón/caja --}}
                <div class="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <h3 class="text-lg font-bold">Panel Garzón</h3>
                    <p>Pedidos, mesas y comandas.</p>
                </div>
            @endcan

            @can('kitchen.handle')
                <div class="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <h3 class="text-lg font-bold">Panel Cocina</h3>
                    <p>Comandas activas y orden de preparación.</p>
                </div>
            @endcan

            @can('sales.handle')
                <div class="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <h3 class="text-lg font-bold">Panel Ventas</h3>
                    <p>Ventas por caja, boletas, facturación.</p>
                </div>
            @endcan

        </div>

        {{-- Área inferior --}}
        <div class="relative h-full flex-1 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
            @can('admin.view')
                <p class="text-neutral-800 dark:text-neutral-200">Bienvenido administrador.</p>
            @endcan

            @can('orders.handle')
                <p class="text-neutral-800 dark:text-neutral-200">Pedidos activos y estado de las mesas.</p>
            @endcan

            @can('kitchen.handle')
                <p class="text-neutral-800 dark:text-neutral-200">Comandas en preparación...</p>
            @endcan

            @can('sales.handle')
                <p class="text-neutral-800 dark:text-neutral-200">Resumen de ventas del día.</p>
            @endcan
        </div>
    </div>
</x-layouts.app>




{{-- !codigo antiguo --}}
{{-- <x-layouts.app :title="__('Dashboard')">
    <div class="flex h-full w-full flex-1 flex-col gap-4 rounded-xl">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
            <div class="relative aspect-video overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                <x-placeholder-pattern class="absolute inset-0 size-full stroke-gray-900/20 dark:stroke-neutral-100/20" />
            </div>
            <div class="relative aspect-video overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                <x-placeholder-pattern class="absolute inset-0 size-full stroke-gray-900/20 dark:stroke-neutral-100/20" />
            </div>
            <div class="relative aspect-video overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
                <x-placeholder-pattern class="absolute inset-0 size-full stroke-gray-900/20 dark:stroke-neutral-100/20" />
            </div>
        </div>
        <div class="relative h-full flex-1 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
            <x-placeholder-pattern class="absolute inset-0 size-full stroke-gray-900/20 dark:stroke-neutral-100/20" />
        </div>
    </div>
</x-layouts.app> --}}
