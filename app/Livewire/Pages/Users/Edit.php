<?php

namespace App\Livewire\Pages\Users;

use App\Models\User;
use Livewire\Component;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class Edit extends Component
{
    public User $user;

    // Form fields
    public string $name   = '';
    public string $email  = '';
    public string $password = '';  // opcional en edición
    public string $rol    = '';    // string legacy; sincroniza con Spatie
    public string $status = 'activo';

    // Roles disponibles
    public array $roles = [];

    /**
     * Route-model binding: /users/{user}/edit
     */
    public function mount(User $user): void
    {
        $this->user = $user;

        // Solo roles del guard 'web'
        $this->roles = Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->pluck('name')
            ->all();

        // Precargar datos
        $this->name   = (string) ($user->name ?? '');
        $this->email  = (string) ($user->email ?? '');
        $legacy       = (string) ($user->rol ?? '');
        $this->rol    = in_array($legacy, $this->roles, true) ? $legacy : '';
        $this->status = (string) ($user->status ?? 'activo');

        if ($legacy !== '' && $this->rol === '') {
            $this->dispatch('notify', type: 'warning',
                text: "Este usuario tenía un rol inexistente ({$legacy}). Se limpió para evitar errores.");
        }
    }

    protected function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => [
                'required', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($this->user->id),
            ],
            'password' => ['nullable', 'min:6'],
            // Solo roles válidos existentes en Spatie
            'rol'      => ['nullable', 'string', 'max:50', Rule::in($this->roles)],
            'status'   => ['required', Rule::in(['activo','inactivo'])],
        ];
    }

    public function save(): void
    {
        $data = $this->validate();

        // Preparar payload
        $payload = [
            'name'   => $data['name'],
            'email'  => $data['email'],
            'status' => $data['status'],
            'rol'    => $data['rol'] ?? null,
        ];
        if (!empty($data['password'])) {
            $payload['password'] = $data['password'];
        }

        // Persistir
        $this->user->fill($payload);
        $this->user->save();

        // Sincronizar rol Spatie de forma segura
        if ($this->rol !== '' && in_array($this->rol, $this->roles, true)) {
            $this->user->syncRoles([$this->rol]);
        } else {
            $this->user->syncRoles([]);
            if ($this->rol !== '') {
                $this->dispatch('notify', type: 'warning',
                    text: "El rol seleccionado ya no existe. Se guardó sin rol.");
            }
        }

        $this->dispatch('notify', type: 'success', text: 'Usuario actualizado');

        // Redirige al índice (Livewire navigate)
        $this->redirectRoute('users.index', navigate: true);
    }

    public function render()
    {
        // Usa la ruta de vista consistente con Index:
        // resources/views/livewire/pages/users/edit.blade.php
        return view('livewire.pages.users.edit', [
            'roles' => $this->roles,
        ]);
    }
}
