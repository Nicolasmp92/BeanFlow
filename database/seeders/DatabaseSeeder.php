<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 🌱 Seeders base (roles/permissions primero, luego usuarios)
        $this->call([
            RolesAndPermissionsSeeder::class, // <— nombre correcto (plural)
            UserSeeder::class,
        ]);

        // 🧪 FACTORIES: crea 10 usuarios de prueba
        // Si NO quieres asignar roles a estos random, deja la línea simple:
        // User::factory(10)->create();

        // Si SÍ quieres ver segregación real (opcional):
        User::factory(10)->create()->each(function (User $u) {
            if (method_exists($u, 'assignRole')) {
                // distribuye roles operativos al azar
                $u->assignRole(collect(['garzon','cocina','ventas'])->random());
            }
        });
    }
}
