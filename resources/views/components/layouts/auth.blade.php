<x-layouts.auth.split :title="$title ?? null">
    {{-- ! cortina de carga --}}
    @include('partials.splash')

    {{ $slot }}

</x-layouts.auth.split>
