<?php

use Livewire\Volt\Component;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;
use Livewire\WithPagination;
use function Livewire\Volt\layout;

layout('layouts.app');

new class extends Component {
    use WithPagination;

    // 🔍 Filtros y orden
    public string $q = '';
    public int $perPage = 10;
    public string $sortBy = 'name';
    public string $sortDirection = 'asc';

    // ✏️ Formulario
    public bool $showForm = false;
    public ?int $editingId = null;
    public string $name = '';
    public string $email = '';
    public string $password = '';
    public string $rol = '';
    public string $status = 'activo';
    public array $roles = [];

    // 🚀 Montaje inicial
    public function mount(): void
    {
        $this->roles = Role::pluck('name')->toArray();
    }

    // 🔄 Reactividad
    public function updatingQ(): void { $this->resetPage(); }

    // 📊 Datos
    public function with(): array
    {
        $query = User::query()
            ->when($this->q, fn($q) => $q->where(function ($sub) {
                $sub->where('name', 'like', "%{$this->q}%")
                    ->orWhere('email', 'like', "%{$this->q}%");
            }))
            ->orderBy($this->sortBy, $this->sortDirection);

        return ['users' => $query->paginate($this->perPage)];
    }

    // ↕️ Orden
    public function sort(string $field): void
    {
        if ($this->sortBy === $field) {
            $this->sortDirection = $this->sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            $this->sortBy = $field;
            $this->sortDirection = 'asc';
        }
    }

    // 🟢 Abrir formulario
    public function create(): void
    {
        $this->reset(['editingId', 'name', 'email', 'password', 'rol', 'status']);
        $this->showForm = true;
    }

    // 🖊️ Editar usuario
    public function edit(int $id): void
    {
        $u = User::findOrFail($id);
        $this->editingId = $u->id;
        $this->name = $u->name;
        $this->email = $u->email;
        $this->rol = $u->getRoleNames()->first() ?? '';
        $this->status = $u->status ?? 'activo';
        $this->showForm = true;
    }

    // 💾 Guardar (crear o editar)
    public function save(): void
    {
        $rules = [
            'name' => ['required', 'string', 'min:3'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($this->editingId)],
            'rol' => ['nullable', 'string'],
            'status' => ['required', 'string', Rule::in(['activo', 'inactivo'])],
        ];
        if (!$this->editingId) {
            $rules['password'] = ['required', 'string', 'min:8'];
        } elseif ($this->password) {
            $rules['password'] = ['string', 'min:8'];
        }

        $this->validate($rules);

        $data = [
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status,
        ];
        if ($this->password) $data['password'] = $this->password;

        $user = User::updateOrCreate(['id' => $this->editingId], $data);

        // 🎭 Asignar rol con Spatie
        $user->syncRoles($this->rol ? [$this->rol] : []);

        $this->showForm = false;
        $this->dispatch('notify', 'Usuario guardado correctamente.');
    }

    // 🚫 Eliminar
    public function delete(int $id): void
    {
        if (auth()->id() === $id) {
            $this->dispatch('notify', 'No puedes eliminar tu propio usuario.');
            return;
        }

        $u = User::find($id);
        if ($u) $u->delete();

        $this->dispatch('notify', 'Usuario eliminado.');
    }

    // 🔁 Alternar estado
    public function toggleStatus(int $id, bool $checked): void
    {
        $u = User::find($id);
        if ($u) {
            $u->status = $checked ? 'activo' : 'inactivo';
            $u->save();
        }
    }
};
?>

<div class="p-6 space-y-5">
    {{-- 🔍 Barra superior --}}
    <div class="flex flex-col md:flex-row gap-3 md:items-center">
        <input type="text" wire:model.live.debounce.300ms="q"
            placeholder="Buscar por nombre o email…"
            class="w-full md:w-80 rounded-lg border px-3 py-2 focus:outline-none focus:ring" />

        <select wire:model.live="perPage" class="w-28 rounded-lg border px-3 py-2">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
        </select>

        <div class="ms-auto">
            <button class="rounded-lg bg-black text-white px-4 py-2 hover:opacity-90"
                wire:click="create">
                + Nuevo usuario
            </button>
        </div>
    </div>

    {{-- 📋 Tabla --}}
    <div class="overflow-x-auto rounded-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700">
        <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-zinc-800 text-left">
                <tr>
                    <th class="px-4 py-3 cursor-pointer" wire:click="sort('name')">
                        Nombre
                        @if ($sortBy === 'name')
                            <span>({{ strtoupper($sortDirection) }})</span>
                        @endif
                    </th>
                    <th class="px-4 py-3 cursor-pointer" wire:click="sort('email')">
                        Email
                        @if ($sortBy === 'email')
                            <span>({{ strtoupper($sortDirection) }})</span>
                        @endif
                    </th>
                    <th class="px-4 py-3">Rol</th>
                    <th class="px-4 py-3">Estado</th>
                    <th class="px-4 py-3 w-40">Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-zinc-700">
                @forelse($users as $u)
                    <tr class="hover:bg-gray-50 dark:hover:bg-zinc-800">
                        <td class="px-4 py-3">{{ $u->name }}</td>
                        <td class="px-4 py-3">{{ $u->email }}</td>
                        <td class="px-4 py-3">
                            @php $roles = $u->getRoleNames(); @endphp
                            @if($roles->isNotEmpty())
                                {{ $roles->implode(', ') }}
                            @else
                                <span class="text-gray-400">—</span>
                            @endif
                        </td>
                        <td class="px-4 py-3">
                            <label class="inline-flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="rounded border-gray-300"
                                    @checked(($u->status ?? 'activo') === 'activo')
                                    wire:change="toggleStatus({{ $u->id }}, $event.target.checked)">
                                <span>{{ $u->status ?? 'activo' }}</span>
                            </label>
                        </td>
                        <td class="px-4 py-3">
                            <div class="flex items-center gap-2">
                                <button class="rounded-lg border px-3 py-1 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                    wire:click="edit({{ $u->id }})">Editar</button>

                                <button x-data
                                    @click="
                                        import('/resources/js/ui/confirm.js').then(async m => {
                                            const ok = await m.confirmDialog({ title: '¿Eliminar usuario?' });
                                            if (ok) { $wire.delete({{ $u->id }}) }
                                        })
                                    "
                                    class="rounded-lg border px-3 py-1 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                    Eliminar
                                </button>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-4 py-6 text-center text-gray-500">Sin resultados</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    {{-- 📄 Paginación --}}
    <div>
        {{ $users->links(data: ['scrollTo' => false]) }}
    </div>

    {{-- 🪟 Modal Crear/Editar --}}
    <div x-data="{ open: @entangle('showForm') }" x-show="open" x-cloak
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div @click.away="open=false"
            class="w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-lg space-y-4
                   border dark:border-zinc-700 transition-colors duration-300">

            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">
                    {{ $editingId ? 'Editar usuario' : 'Nuevo usuario' }}
                </h3>
                <button class="text-gray-500 hover:text-black dark:hover:text-white"
                    @click="open=false">✕</button>
            </div>

            @if ($errors->any())
                <div class="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/40">
                    <ul class="list-disc ms-5">
                        @foreach ($errors->all() as $e)
                            <li>{{ $e }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm mb-1">Nombre</label>
                    <input type="text" wire:model.live="name"
                        class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring
                               dark:bg-zinc-800 dark:border-zinc-700" />
                </div>

                <div>
                    <label class="block text-sm mb-1">Email</label>
                    <input type="email" wire:model.live="email"
                        class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring
                               dark:bg-zinc-800 dark:border-zinc-700" />
                </div>

                <div>
                    <label class="block text-sm mb-1">
                        {{ $editingId ? 'Password (opcional)' : 'Password' }}
                    </label>
                    <input type="password" wire:model.live="password"
                        class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring
                               dark:bg-zinc-800 dark:border-zinc-700" />
                </div>

                <div>
                    <label class="block text-sm mb-1">Rol</label>
                    <select wire:model.live="rol"
                        class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring
                               dark:bg-zinc-800 dark:border-zinc-700">
                        <option value="">— (sin rol)</option>
                        @foreach ($roles as $r)
                            <option value="{{ $r }}">{{ Str::headline($r) }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-sm mb-1">Estado</label>
                    <select wire:model.live="status"
                        class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring
                               dark:bg-zinc-800 dark:border-zinc-700">
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
                <button class="rounded-lg border px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    @click="open=false">Cancelar</button>
                <button class="rounded-lg bg-black text-white px-4 py-2 hover:opacity-90
                               dark:bg-white dark:text-zinc-900"
                    wire:click="save">Guardar</button>
            </div>
        </div>
    </div>
</div>
