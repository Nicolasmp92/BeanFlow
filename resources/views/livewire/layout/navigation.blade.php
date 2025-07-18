<?php

use App\Livewire\Actions\Logout;
use Livewire\Volt\Component;

new class extends Component
{
    /**
     * Log the current user out of the application.
     */
    public function logout(Logout $logout): void
    {
        $logout();

        $this->redirect('/', navigate: true);
    }
}; ?>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom shadow-sm">
    <div class="container-fluid">
        <!-- Logo -->
        <a class="navbar-brand fw-bold" href="{{ route('dashboard') }}">
            BeanFlow
        </a>

        <!-- Botón hamburguesa móvil -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarDashboard" aria-controls="navbarDashboard" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Contenido de la barra -->
        <div class="collapse navbar-collapse" id="navbarDashboard">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <!-- Enlaces de navegación -->
                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">Dashboard</a>
                </li>
            </ul>

            <!-- Dropdown de usuario -->
            <div class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {{ auth()->user()->name }}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                        <a class="dropdown-item" href="{{ route('profile') }}">Perfil</a>
                    </li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <form wire:submit.prevent="logout">
                            <button type="submit" class="dropdown-item">Cerrar sesión</button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</nav>
