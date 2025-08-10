<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Asegura que los roles existan (por si este seeder corre solo)
        foreach (['super-admin', 'admin', 'garzon', 'cocina', 'ventas'] as $r) {
            Role::findOrCreate($r, 'web');
        }

        // 🔑 SUPER ADMIN 1
        $super1 = User::factory()->create([
            'name' => 'Nye (Super Admin)',
            'email' => 'nikolasmp92@gmail.com',
            'password' => bcrypt('super123'),
        ]);
        $super1->assignRole('super-admin');

        // 🔑 SUPER ADMIN 2
        $super2 = User::factory()->create([
            'name' => 'Elizabeth (Super Admin)',
            'email' => 'otro_correo@tudominio.com',
            'password' => bcrypt('super123'),
        ]);
        $super2->assignRole('super-admin');


        // ADMIN
        $admin = User::firstOrCreate(
            ['email' => 'admin@beanflow.test'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'), // cámbialo luego
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');

        // GARZÓN
        $garzon = User::firstOrCreate(
            ['email' => 'garzon@beanflow.test'],
            [
                'name' => 'Garzón 1',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $garzon->assignRole('garzon');

        // COCINA
        $cocina = User::firstOrCreate(
            ['email' => 'cocina@beanflow.test'],
            [
                'name' => 'Cocinero',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $cocina->assignRole('cocina');

        // VENTAS
        $ventas = User::firstOrCreate(
            ['email' => 'ventas@beanflow.test'],
            [
                'name' => 'Caja',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $ventas->assignRole('ventas');
    }
}
