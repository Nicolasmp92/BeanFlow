<x-layouts.app.sidebar :title="$title ?? null">
    <script>
    (() => {
    // Laravel: si hay usuario autenticado, vendrá la preferencia desde la BD.
    const saved = @json(optional(auth()->user())->theme ?? 'system'); // 'light' | 'dark' | 'system'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = saved === 'system' ? (prefersDark ? 'dark' : 'light') : saved;
    if (resolved === 'dark') document.documentElement.classList.add('dark');
    })();
    </script>

    <flux:main>
        {{ $slot }}
    </flux:main>

</button>
</x-layouts.app.sidebar>
