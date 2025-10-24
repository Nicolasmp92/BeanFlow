@props(['classMobile' => 'h-16 w-auto', 'classDesktop' => 'h-30 w-auto'])

{{-- LOGO CLIENTE (visible en móviles) --}}
<div class="z-20 flex flex-col items-center gap-2 lg:hidden">
    {{-- Claro --}}
    <img src="{{ asset('img/client_logo/coffe_sinfondo.png') }}" alt="Logo del cliente (tema claro móvil)"
        class="{{ $classMobile }} dark:hidden">

    {{-- Oscuro --}}
    <img src="{{ asset('img/client_logo/coffe_sinfondo.png') }}" alt="Logo del cliente (tema oscuro móvil)"
        class="hidden {{ $classMobile }} dark:block">
</div>

{{-- LOGO CLIENTE (visible en escritorio, tamaño distinto) --}}
<div class="hidden lg:flex flex-col items-center gap-2">
    {{-- Claro --}}
    <img src="{{ asset('img/client_logo/coffe_sinfondo.png') }}" alt="Logo del cliente (tema claro desktop)"
        class="{{ $classDesktop }} dark:hidden ">

    {{-- Oscuro --}}
    <img src="{{ asset('img/client_logo/coffe_sinfondo.png') }}" alt="Logo del cliente (tema oscuro desktop)"
        class="hidden {{ $classDesktop }} dark:block ">
</div>
