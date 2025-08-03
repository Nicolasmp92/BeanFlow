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
});

// 🔐 Rutas de autenticación (login, register, forgot, etc.)
require __DIR__.'/auth.php';





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
