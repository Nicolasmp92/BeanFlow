<?php

use Illuminate\Support\Facades\Route;
use Livewire\Volt\Volt;


// Ruta conla que el proyecto inicia la comentamos ya que usaremos login como incio de la aplicacion
// Route::get('/', function () {
//     return view('welcome');
// })->name('home');



// 🌐 Ruta principal: redirige al login si no está autenticado, o al dashboard si ya inició sesión
Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

// 🧠 Dashboard solo para usuarios autenticados y verificados
Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// ⚙️ Rutas de configuración (solo si estás autenticado)
Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', 'settings/profile');

    Volt::route('settings/profile', 'settings.profile')->name('settings.profile');
    Volt::route('settings/password', 'settings.password')->name('settings.password');
    Volt::route('settings/appearance', 'settings.appearance')->name('settings.appearance');
    //* ruta volt para las notas del control de versiones
    Volt::route('version/notes', 'version.notes')->name('version.notes');
});

// 🔐 Rutas de autenticación (login, register, forgot, etc.)
require __DIR__.'/auth.php';


// 👀 Rutas auxiliares
// ⚙️ Ruta auxiliar temporal para enlaces del menú (evita 404 mientras construimos módulos)
// routes/web.php
Route::middleware(['auth'])->get('/stub/{page}', function (string $page) {
    $allowed = [
        'pedidos','mesas','caja','productos','categorias','menu-del-dia','inventario',
        'recetas','proveedores','compras','clientes','fidelizacion','turnos','reportes','ajustes',
        'usuarios',
    ];

    abort_unless(in_array($page, $allowed, true), 404);

    // Mapa de permisos por página
    $permissionMap = [
        // Operación
        'pedidos'      => 'orders.handle',
        'mesas'        => 'orders.handle',

        // Caja / ventas / clientes
        'caja'         => 'sales.handle',
        'clientes'     => 'sales.handle',
        'fidelizacion' => 'sales.handle',
        'compras'      => 'sales.handle',     // cámbialo luego a purchases.manage si lo creas

        // Cocina
        'recetas'      => 'kitchen.handle',
        'menu-del-dia' => 'kitchen.handle',

        // Catálogo
        'productos'    => 'admin.view',       // o crea 'products.manage'
        'categorias'   => 'admin.view',

        // Admin
        'inventario'   => 'admin.view',       // o inventory.manage más adelante
        'proveedores'  => 'admin.view',       // o suppliers.manage
        'turnos'       => 'admin.view',
        'reportes'     => 'admin.view',
        'ajustes'      => 'admin.view',
        'usuarios'     => 'users.manage',
    ];

    if (isset($permissionMap[$page])) {
        abort_unless(auth()->user()->can($permissionMap[$page]), 403);
    }

    return view('stub', [
        'page' => $page,
        'titleMap' => [
            'pedidos' => 'Pedidos',
            'mesas' => 'Mesas',
            'caja' => 'Caja / Ventas',
            'productos' => 'Productos',
            'categorias' => 'Categorías',
            'menu-del-dia' => 'Menú del día',
            'inventario' => 'Inventario',
            'recetas' => 'Recetas',
            'proveedores' => 'Proveedores',
            'compras' => 'Compras',
            'clientes' => 'Clientes',
            'fidelizacion' => 'Fidelización',
            'turnos' => 'Turnos / Personal',
            'reportes' => 'Reportes',
            'ajustes' => 'Ajustes',
            'usuarios' => 'Gestión de Usuarios',
        ],
    ]);
})->name('stub');






// ! respaldo
// <?php
// use Illuminate\Support\Facades\Route;
// use Livewire\Volt\Volt;
// Route::get('/', function () {
//     return view('welcome');
// })->name('home');
// Route::view('dashboard', 'dashboard')
//     ->middleware(['auth', 'verified'])
//     ->name('dashboard');
// Route::middleware(['auth'])->group(function () {
//     Route::redirect('settings', 'settings/profile');
//     Volt::route('settings/profile', 'settings.profile')->name('settings.profile');
//     Volt::route('settings/password', 'settings.password')->name('settings.password');
//     Volt::route('settings/appearance', 'settings.appearance')->name('settings.appearance');
// });
// require __DIR__.'/auth.php';
