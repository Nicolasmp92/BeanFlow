<?php

use Illuminate\Support\Facades\Route;

// Livewire (Users)
use App\Livewire\Pages\Users\Index as UsersIndex;
// Si aún no tienes Create, déjalo comentado o créalo.
// use App\Livewire\Pages\Users\Create as UsersCreate;
use App\Livewire\Pages\Users\Edit as UsersEdit;

// Home: si está logueado verá dashboard; si no, el middleware lo manda a login
Route::redirect('/', 'dashboard')->name('home');

Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Auth (starter kit Livewire/Breeze)
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';

/*
|--------------------------------------------------------------------------
| Dashboard (auth + verified)
|--------------------------------------------------------------------------
| Vista: resources/views/dashboard.blade.php
*/
Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Rutas autenticadas
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // Perfil (ajusta la vista si la moviste)
    Route::view('profile', 'profile')->name('profile');

    /*
    |--------------------------------------------------------------------------
    | Gestión de Usuarios
    |--------------------------------------------------------------------------
    | Opción A: por roles (super-admin | admin)
    */
    Route::middleware(['role:super-admin|admin'])->group(function () {
        Route::get('usuarios',               UsersIndex::class)->name('users.index');
        // Route::get('usuarios/crear',         UsersCreate::class)->name('users.create');
        Route::get('usuarios/{user}/editar', UsersEdit::class)->name('users.edit');
    });

    /*
    |--------------------------------------------------------------------------
    | Alias permanente /users -> /usuarios
    |--------------------------------------------------------------------------
    */
    Route::redirect('users', 'usuarios', 301)->name('users.alias');
});
