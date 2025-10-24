<?php
namespace App\Livewire\Pages\Users;

use App\Models\User;
use Livewire\Component;
use Livewire\WithPagination;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;

class Index extends Component
{
    use WithPagination;

    // ---------- Tabla: estado de UI ----------
    public string $q = '';
    public string $sortBy = 'name';
    public string $sortDirection = 'asc';
    public int    $perPage = 10;

    // ---------- Modal / Form ----------
    public bool   $showForm = false;
    public ?int   $editingId = null;

    // Campos del formulario
    public string $name = '';
    public string $email = '';
    public string $password = '';
    public string $rol = '';              // string legacy; sincroniza Spatie
    public string $status = 'activo';     // activo|inactivo

    // Roles disponibles (Spatie)
    public array $roles = [];             // ['super-admin','admin','garzon','cocina','ventas']

    // ---------- Hooks ----------
    public function mount(): void
    {
        // Solo roles del guard web; ordenados
        $this->roles = Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->pluck('name')
            ->all();
    }

    public function updatingQ(): void { $this->resetPage(); }

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
                Rule::unique('users','email')->ignore($this->editingId),
            ],
            'password' => [$this->editingId ? 'nullable' : 'required','min:6'],
            // ✅ Solo permitimos roles que EXISTEN
            'rol'      => ['nullable','string','max:50', Rule::in($this->roles)],
            'status'   => ['required', Rule::in(['activo','inactivo'])],
        ];
    }

    protected function resetForm(): void
    {
        $this->editingId = null;
        $this->name = $this->email = $this->password = '';
        $this->rol = '';
        $this->status = 'activo';
    }

    public function create(): void
    {
        $this->resetForm();
        $this->showForm = true;
    }

    public function edit(int $id): void
    {
        $u = User::findOrFail($id);

        $this->editingId = $u->id;
        $this->name      = (string) $u->name;
        $this->email     = (string) $u->email;

        // ✅ Si el rol legacy no existe en Spatie, lo vaciamos para no romper
        $legacy = (string) ($u->rol ?? '');
        $legacyNorm = mb_strtolower(trim($legacy));
        $this->rol = in_array($legacyNorm, $this->roles, true) ? $legacyNorm : '';

        $this->status    = (string) ($u->status ?? 'activo');
        $this->password  = '';
        $this->showForm  = true;

        if ($legacy !== '' && $this->rol === '') {
            $this->dispatch('notify', type: 'warning',
                text: "Este usuario tenía un rol inexistente ({$legacy}). Se limpió para evitar errores.");
        }
    }

    public function save(): void
    {
        $data = $this->validate();

        // No sobreescribir password vacío en edición
        if ($this->editingId && ($data['password'] ?? '') === '') {
            unset($data['password']);
        }

        $user = User::updateOrCreate(['id' => $this->editingId], $data);

        // ✅ Sincroniza roles solo si el rol existe
        if ($this->rol !== '' && in_array($this->rol, $this->roles, true)) {
            $user->syncRoles([$this->rol]);
        } else {
            $user->syncRoles([]);
            if ($this->rol !== '') {
                $this->dispatch('notify', type: 'warning',
                    text: "El rol seleccionado ya no existe. Se guardó sin rol.");
            }
        }

        $this->dispatch('notify', type: 'success', text: 'Usuario guardado');
        $this->showForm = false;
        $this->resetForm();
        $this->resetPage();
    }

    public function delete(int $id): void
    {
        $u = User::findOrFail($id);
        if (auth()->user()?->id === $u->id) {
            $this->dispatch('notify', type: 'warning', text: 'No puedes eliminar tu propio usuario');
            return;
        }
        $u->delete();

        $this->dispatch('notify', type: 'success', text: 'Usuario eliminado');
        $this->resetPage();
    }

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
        return view('livewire.pages.users.index', [
            'users' => $this->users,
            'roles' => $this->roles,
        ]);
    }
}
