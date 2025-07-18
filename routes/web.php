<?php

use Illuminate\Support\Facades\Route;

// ?ruta principal de la aplicacion, se reemplzara por log in en la siguiente linea
// Route::view('/', 'welcome');

// ?nueva ruta principal, directamente a el ingreso
Route::get('/', function () {
    return redirect()->route('login');
});






Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::view('profile', 'profile')
    ->middleware(['auth'])
    ->name('profile');

require __DIR__.'/auth.php';
