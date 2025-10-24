<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role as SpatieRole;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    /** Guard explícito para Spatie */
    protected $guard_name = 'web';

    /** Roles válidos de ESTA app */
    public const VALID_ROLES = ['super-admin','admin','garzon','cocina','ventas'];

    /** Asignables en masa */
    protected $fillable = [
        'name','email','password',
        'rol',            // string “legacy” que mostrará tu UI
        'cliente','cliente_id',
        'status',
        'theme','theme_accent','theme_neutral',
    ];

    /** Ocultos */
    protected $hidden = ['password','remember_token'];

    /** Casts */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'cliente_id'        => 'integer',
            'theme'             => 'string',
        ];
    }

    /**
     * Hook de ciclo de vida:
     * - No toca roles cuando rota remember_token (logout/login).
     * - Solo sincroniza si cambió 'rol' y existe en Spatie (guard web).
     */
    protected static function booted(): void
    {
        static::saving(function (User $user) {
            if ($user->isDirty('remember_token')) {
                return; // evitar sync en logout/login
            }

            if ($user->isDirty('rol')) {
                $rol = (string) ($user->rol ?? '');

                if ($rol === '') {
                    $user->syncRoles([]); // sin rol
                    return;
                }

                $exists = SpatieRole::query()
                    ->where('name', $rol)
                    ->where('guard_name', 'web')
                    ->exists();

                if ($exists) {
                    $user->syncRoles([$rol]);
                } else {
                    $user->syncRoles([]); // evita excepción por rol fantasma
                    // \Log::warning("Rol inexistente '{$rol}' en user {$user->id}");
                }
            }
        });
    }

    /** Normaliza 'rol' a minúsculas y trim para alinear con tus roles */
    public function setRolAttribute($value): void
    {
        $this->attributes['rol'] = is_string($value)
            ? mb_strtolower(trim($value))
            : $value;
    }

    /** Iniciales para avatar */
    public function initials(): string
    {
        return Str::of($this->name)
            ->explode(' ')
            ->take(2)
            ->map(fn ($w) => Str::substr($w, 0, 1))
            ->implode('');
    }

    /* ---------- Scopes & helpers ---------- */

    /** Solo activos */
    public function scopeActive($q)
    {
        return $q->where('status', 'activo');
    }

    /** Por nombre de rol (legacy, ya normalizado a minúsculas) */
    public function scopeRoleName($q, string $role)
    {
        return $q->where('rol', mb_strtolower(trim($role)));
    }

    /** Helper: ¿super-admin? (Spatie) */
    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super-admin');
    }
}
