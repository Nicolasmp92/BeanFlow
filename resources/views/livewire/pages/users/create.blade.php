<div x-data="{ open: @entangle('open').live }" x-cloak>
    {{-- Overlay --}}
    <div
        x-show="open"
        x-transition.opacity
        class="fixed inset-0 z-40 bg-black/40"
        @click="open=false; $wire.cerrar()"
    ></div>

    {{-- Contenedor modal --}}
    <div
        x-show="open"
        x-trap.noscroll="open"
        x-transition
        class="fixed inset-0 z-50 flex items-center justify-center p-4">

        <div class="w-full max-w-lg rounded-xl border bg-white p-5 shadow-xl
                    dark:border-zinc-700 dark:bg-neutral-900">
            <div class="mb-4 flex items-center justify-between">
                <h3 class="text-lg font-semibold">Crear usuario</h3>
                <button type="button"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full p-2"
                    @click="open=false; $wire.cerrar()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form wire:submit.prevent="guardar" class="grid gap-4">
                {{-- Nombre --}}
                <div>
                    <label class="block text-sm font-medium mb-1">Nombre</label>
                    <input wire:model.defer="name" x-ref="nombre"
                        class="w-full rounded border-gray-300 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        type="text" />
                    @error('name')
                        <span class="text-sm text-red-600">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Email --}}
                <div>
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input wire:model.defer="email" type="email"
                        class="w-full rounded border-gray-300 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    @error('email')
                        <span class="text-sm text-red-600">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Rol --}}
                <div>
                    <label class="block text-sm font-medium mb-1">Rol</label>
                    <select wire:model.defer="rol"
                        class="w-full rounded border-gray-300 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                        <option value="SUPER ADMIN">SUPER ADMIN</option>
                        <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                        <option value="INSPECTOR">INSPECTOR</option>
                    </select>
                    @error('rol')
                        <span class="text-sm text-red-600">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Estado (switch) --}}
                <div class="flex items-center gap-2">
                    <label class="block text-sm font-medium">Activo</label>
                    <input type="checkbox" wire:model.live="is_active"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    @error('is_active')
                        <span class="text-sm text-red-600">{{ $message }}</span>
                    @enderror
                </div>

                {{-- Password --}}
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium mb-1">Contraseña</label>
                        <input wire:model.defer="password" type="password"
                            class="w-full rounded border-gray-300 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                        @error('password')
                            <span class="text-sm text-red-600">{{ $message }}</span>
                        @enderror
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Confirmar contraseña</label>
                        <input wire:model.defer="password_confirmation" type="password"
                            class="w-full rounded border-gray-300 dark:border-zinc-700 dark:bg-neutral-800 dark:text-white focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                    </div>
                </div>

                <div class="mt-2 flex justify-end gap-2">
                    <button type="button"
                        class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700"
                        @click="open=false; $wire.cerrar()">Cancelar</button>
                    <button type="submit"
                        class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
