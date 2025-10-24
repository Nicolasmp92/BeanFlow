<?php

namespace Database\Factories;

use App\Models\User;                    // <- para usar VALID_ROLES y el modelo
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Lista oficial tomada del modelo (asegura consistencia)
        $roles = User::VALID_ROLES; // ['SUPER ADMIN', 'INSPECTOR', 'ADMINISTRADOR']

        return [
            'name'              => $this->faker->name(),
            'email'             => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => Hash::make('pass123'), // clave de prueba conocida
            'rol'               => $this->faker->randomElement($roles), // 👈 ahora sí, roles válidos
            'cliente'           => $this->faker->company(),
            'cliente_id'        => $this->faker->numberBetween(1, 500000), // unsignedBigInteger
            'status'            => $this->faker->randomElement(['activo', 'inactivo']),
            'theme'             => $this->faker->randomElement(['system', 'light', 'dark']),
            'theme_accent'      => $this->faker->randomElement(['orange', 'emerald', 'purple', 'sky', 'rose']),
            'theme_neutral'     => $this->faker->randomElement(['gray', 'zinc', 'slate', 'neutral', 'stone']),
            'remember_token'    => Str::random(10),
        ];
    }

    /**
     * Asegura sincronización del rol de Spatie post-creación.
     * (Tu modelo ya lo hace en saved(), pero esto lo deja explícito.)
     */
    public function configure()
    {
        return $this->afterCreating(function (User $user) {
            if ($user->rol) {
                $user->syncRoles([$user->rol]); // mantiene coherencia legacy <-> Spatie
            }
        });
    }

    /**
     * Estado: email NO verificado.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /** ---------- Atajos por ROL (útiles en seeders/tests) ---------- */

    public function superAdmin(): static
    {
        return $this->state(fn() => ['rol' => 'SUPER ADMIN']);
    }

    public function inspector(): static
    {
        return $this->state(fn() => ['rol' => 'INSPECTOR']);
    }

    public function administrador(): static
    {
        return $this->state(fn() => ['rol' => 'ADMINISTRADOR']);
    }

    /** ---------- Atajos por STATUS ---------- */

    public function active(): static
    {
        return $this->state(fn() => ['status' => 'activo']);
    }

    public function inactive(): static
    {
        return $this->state(fn() => ['status' => 'inactivo']);
    }
}
