<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Creando seders para roles de  usuarios
        $admin      = Role::create(['name' => 'admin']);
        $garzon     = Role::create(['name' => 'garzon']);
        $cocina     = Role::create(['name' => 'cocina']);
        $ventas     = Role::create(['name' => 'ventas']);

        $admin->givePermissionTo(Permission::create(['name' => 'ver panel']));
        // Mas permisos se agregaran conforme avance el desarrollo
    }
}
