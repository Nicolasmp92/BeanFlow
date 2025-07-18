<x-app-layout>
    <x-slot name="header">
        <div class="container py-4">
            <h2 class="text-white text-center fs-3 fw-bold mb-0">
                {{ __('Dashboard') }}
            </h2>
        </div>
    </x-slot>

    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-lg">
                    <div class="card-header bg-primary text-white fw-semibold">
                        ¡Bienvenido!
                    </div>
                    <div class="card-body text-dark">
                        <p class="mb-0">{{ __("Has iniciado sesión correctamente en tu panel BeanFlow.") }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
