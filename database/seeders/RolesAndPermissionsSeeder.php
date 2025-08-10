<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Limpia caché de Spatie
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Permisos base (UI + rutas)
        $perms = [
            'admin.view',     // ver cosas de admin
            'users.manage',   // gestión de usuarios
            'orders.handle',  // pedidos/mesas
            'kitchen.handle', // cocina/recetas/menú del día
            'sales.handle',   // caja/ventas/clientes/fidelización
        ];

        foreach ($perms as $p) {
            Permission::findOrCreate($p, 'web');
        }

        // Roles (incluye super-admin)
        $super  = Role::findOrCreate('super-admin', 'web');
        $admin  = Role::findOrCreate('admin', 'web');
        $garzon = Role::findOrCreate('garzon', 'web');
        $cocina = Role::findOrCreate('cocina', 'web');
        $ventas = Role::findOrCreate('ventas', 'web');

        // Permisos por rol
        $admin->givePermissionTo([
            'admin.view',
            'users.manage',
            'orders.handle',
            'kitchen.handle',
            'sales.handle',
        ]);

        $garzon->givePermissionTo(['orders.handle']);
        $cocina->givePermissionTo(['kitchen.handle']);
        $ventas->givePermissionTo(['sales.handle']);

        // super-admin no necesita permisos; Gate::before le da pase total
        // $super->syncPermissions(Permission::all());
    }
}
