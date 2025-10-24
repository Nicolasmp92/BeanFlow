<?php

namespace App\Livewire\Users;

use App\Models\User;
use Livewire\Component;
use Livewire\WithPagination;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;

class Index extends Component
{
    use WithPagination;                          // ← habilita paginación Livewire

    // ---------- Tabla: estado de UI ----------
    public string $q = '';                       // ← búsqueda
    public string $sortBy = 'name';              // ← columna orden actual
    public string $sortDirection = 'asc';        // ← asc|desc
    public int    $perPage = 10;                 // ← filas por página

    // ---------- Modal / Form ----------
    public bool   $showForm = false;             // ← mostrar/ocultar modal
    public ?int   $editingId = null;             // ← null=create; id=edit

    // Campos del formulario (coinciden con tu User fillable)
    public string $name = '';
    public string $email = '';
    public string $password = '';                // ← en edición puede quedar vacío
    public string $rol = '';                     // ← string legacy; sincroniza Spatie
    public string $status = 'activo';            // ← activo|inactivo

    // Roles disponibles (Spatie)
    public array $roles = [];                    // ← ['SUPER ADMIN','INSPECTOR',...]

    // ---------- Hooks ----------
    public function mount(): void
    {
        // Carga roles desde Spatie, como strings
        $this->roles = Role::query()->pluck('name')->all();
    }

    // Cada vez que cambia búsqueda, vuelve a página 1
    public function updatingQ(): void { $this->resetPage(); }

    // Alterna dirección o cambia columna de orden
    public function sort(string $field): void
    {
        if ($this->sortBy === $field) {
            $this->sortDirection = $this->sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            $this->sortBy = $field;
            $this->sortDirection = 'asc';
        }
    }

    // ---------- Reglas de validación ----------
    protected function rules(): array
    {
        return [
            'name'     => ['required','string','max:255'],
            'email'    => [
                'required','email','max:255',
                Rule::unique('users','email')->ignore($this->editingId), // único salvo en edición
            ],
            'password' => [$this->editingId ? 'nullable' : 'required','min:6'],
            'rol'      => ['nullable','string','max:50'], // validas con tu lista si quieres
            'status'   => ['required', Rule::in(['activo','inactivo'])],
        ];
    }

    // Limpia el form a valores por defecto
    protected function resetForm(): void
    {
        $this->editingId = null;
        $this->name = $this->email = $this->password = '';
        $this->rol = '';
        $this->status = 'activo';
    }

    // Abre modal en modo crear
    public function create(): void
    {
        $this->resetForm();
        $this->showForm = true;
    }

    // Abre modal en modo editar
    public function edit(int $id): void
    {
        $u = User::findOrFail($id);
        $this->editingId = $u->id;
        $this->name      = (string) $u->name;
        $this->email     = (string) $u->email;
        $this->rol       = (string) ($u->rol ?? '');
        $this->status    = (string) ($u->status ?? 'activo');

        $this->password  = '';                   // ← nunca precargar passwords
        $this->showForm  = true;
    }

    // Crear o actualizar
    public function save(): void
    {
        $data = $this->validate();

        // Si password viene vacío en edición, sácalo para no sobreescribir
        if ($this->editingId && ($data['password'] ?? '') === '') {
            unset($data['password']);
        }

        // Alta o edición
        $user = User::updateOrCreate(
            ['id' => $this->editingId],
            $data
        );

        // Mantener alineado campo 'rol' (string) con roles Spatie
        // (tu modelo ya hace syncRoles en el hook saved; esto es por si quieres forzar aquí)
        if (!empty($this->rol)) {
            $user->syncRoles([$this->rol]);
        } else {
            $user->syncRoles([]); // sin rol si vacío
        }

        $this->dispatch('notify', type: 'success', text: 'Usuario guardado');
        $this->showForm = false;
        $this->resetForm();
        $this->resetPage(); // vuelve a 1 para ver el nuevo registro
    }

    // Confirmación se maneja con SweetAlert en la vista; aquí solo ejecutamos
    public function delete(int $id): void
    {
        $u = User::findOrFail($id);
        // Evita que un usuario se elimine a sí mismo (opcional)
        if (auth()->id() === $u->id) {
            $this->dispatch('notify', type: 'warning', text: 'No puedes eliminar tu propio usuario');
            return;
        }
        $u->delete();

        $this->dispatch('notify', type: 'success', text: 'Usuario eliminado');
        $this->resetPage();
    }

    // Toggle de estado (switch/checkbox → boolean)
    public function toggleStatus(int $id, bool $checked): void
    {
        $u = User::findOrFail($id);
        $u->status = $checked ? 'activo' : 'inactivo';
        $u->save();

        $this->dispatch('notify', type: 'success', text: 'Estado actualizado');
    }

    // Listado con búsqueda+orden+paginar
    public function getUsersProperty()
    {
        return User::query()
            ->when($this->q !== '', function ($q) {
                $q->where(function ($sub) {
                    $sub->where('name', 'like', "%{$this->q}%")
                        ->orWhere('email', 'like', "%{$this->q}%")
                        ->orWhere('rol', 'like', "%{$this->q}%");
                });
            })
            ->orderBy($this->sortBy, $this->sortDirection)
            ->paginate($this->perPage);
    }

    public function render()
    {
        return view('livewire.users.index', [
            'users' => $this->users,             // ← property accessor
            'roles' => $this->roles,             // ← para el <select> del form
        ]);
    }
}
