<x-layouts.app :title="$title ?? null">
    {{ $slot }}
    @include('partials.release-notes-modal')
</x-layouts.app>
