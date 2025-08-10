<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Puedes cambiar el dominio para mantener consistencia del entorno
        $email = fake()->unique()->safeEmail();
        if (str_ends_with($email, '@example.org') || str_ends_with($email, '@example.com')) {
            $email = str_replace('@example.com', '@beanflow.test', $email);
            $email = str_replace('@example.org', '@beanflow.test', $email);
        }

        return [
            'name'              => fake()->name(),
            'email'             => $email,
            'email_verified_at' => now(),
            // Permite sobreescribir con FACTORY_PASSWORD en .env si quieres
            'password'          => static::$password ??= Hash::make(env('FACTORY_PASSWORD', 'password')),
            'remember_token'    => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Estados por rol (Spatie). No rompe si aún no tienes HasRoles/roles creados.
     */
    public function superAdmin(): static
    {
        return $this->afterCreating(function ($user) {
            if (method_exists($user, 'assignRole')) {
                try { $user->assignRole('super-admin'); } catch (\Throwable $e) {}
            }
        });
    }

    public function admin(): static
    {
        return $this->afterCreating(function ($user) {
            if (method_exists($user, 'assignRole')) {
                try { $user->assignRole('admin'); } catch (\Throwable $e) {}
            }
        });
    }

    public function garzon(): static
    {
        return $this->afterCreating(function ($user) {
            if (method_exists($user, 'assignRole')) {
                try { $user->assignRole('garzon'); } catch (\Throwable $e) {}
            }
        });
    }

    public function cocina(): static
    {
        return $this->afterCreating(function ($user) {
            if (method_exists($user, 'assignRole')) {
                try { $user->assignRole('cocina'); } catch (\Throwable $e) {}
            }
        });
    }

    public function ventas(): static
    {
        return $this->afterCreating(function ($user) {
            if (method_exists($user, 'assignRole')) {
                try { $user->assignRole('ventas'); } catch (\Throwable $e) {}
            }
        });
    }
}
