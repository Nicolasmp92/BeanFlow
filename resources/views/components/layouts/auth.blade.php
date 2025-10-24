<x-layouts.authtype.dividido :title="$title ?? null">
    {{-- Cortina de carga --}}
    @include('partials.splash')

    <div id="auth-root" class="relative">
        {{ $slot }}

        {{-- Botón cambio de tema del login (solo este scope) --}}
        @include('partials.darkmode-login-toggle')
    </div>

    <style>
        @media (prefers-reduced-motion: no-preference) {
            html, body { transition: background-color .2s ease, color .2s ease, border-color .2s ease; }
        }
    </style>
</x-layouts.authtype.dividido>
