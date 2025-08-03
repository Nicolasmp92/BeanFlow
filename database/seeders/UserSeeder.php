<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // Usuario administrador
        $admin = User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@beanflow.test',
            'password' => bcrypt('admin123'), // cambia después por seguridad
        ]);
        $admin->assignRole('admin');

        // Usuario garzón
        $garzon = User::factory()->create([
            'name' => 'Garzón 1',
            'email' => 'garzon@beanflow.test',
        ]);
        $garzon->assignRole('garzon');

        // Usuario cocina
        $cocina = User::factory()->create([
            'name' => 'Cocinero',
            'email' => 'cocina@beanflow.test',
        ]);
        $cocina->assignRole('cocina');

        // Usuario ventas
        $ventas = User::factory()->create([
            'name' => 'Caja',
            'email' => 'ventas@beanflow.test',
        ]);
        $ventas->assignRole('ventas');
    }

}
