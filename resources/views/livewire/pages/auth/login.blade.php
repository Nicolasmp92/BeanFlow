<?php

use App\Livewire\Forms\LoginForm;
use Illuminate\Support\Facades\Session;
use Livewire\Attributes\Layout;
use Livewire\Volt\Component;

new #[Layout('layouts.guest')] class extends Component {
    public LoginForm $form;

    /**
     * Handle an incoming authentication request.
     */
    public function login(): void
    {
        $this->validate();

        $this->form->authenticate();

        Session::regenerate();

        $this->redirectIntended(default: route('dashboard', absolute: false), navigate: true);
    }
}; ?>



<div class="container d-flex align-items-center justify-content-center vh-100">
    <div class="row w-100 justify-content-center align-items-center">

        <!-- Imagen a la izquierda -->
        <div class="col-md-5 text-center mb-4 mb-md-0">
            <img src="{{ asset('img/coffe.png') }}" alt="Taza de café humeante sobre mesa de madera"
                class="img-fluid rounded shadow" style="max-height: 350px">
        </div>

        <!-- Formulario a la derecha -->
        <div class="col-md-6 bg-dark text-white p-4 rounded shadow-lg px-5">
            <h2 class="text-center mb-4">Iniciar sesión</h2>

            <x-auth-session-status class="mb-3" :status="session('status')" />

            <form wire:submit="login">
                <div class="mb-3">
                    <label for="email" class="form-label">Correo electrónico</label>
                    <input wire:model="form.email" type="email" id="email" name="email" class="form-control" required autofocus>
                    <x-input-error :messages="$errors->get('form.email')" class="mt-2" />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Contraseña</label>
                    <input wire:model="form.password" type="password" id="password" name="password" class="form-control" required>
                    <x-input-error :messages="$errors->get('form.password')" class="mt-2" />
                </div>

                <div class="form-check mb-3">
                    <input wire:model="form.remember" class="form-check-input" type="checkbox" id="remember" name="remember">
                    <label class="form-check-label" for="remember">Recordarme</label>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}" class="text-light">¿Olvidaste tu contraseña?</a>
                    @endif

                    <button type="submit" class="btn btn-primary px-4">Entrar</button>
                </div>
            </form>
        </div>
    </div>
</div>

