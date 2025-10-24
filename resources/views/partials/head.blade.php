<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>


    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />


    @if(auth()->check())
        <script>
        (() => {
        const saved = @json(auth()->user()->theme ?? 'system'); // 'light'|'dark'|'system'
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const resolved = saved === 'system' ? (prefersDark ? 'dark' : 'light') : saved;
        if (resolved === 'dark') document.documentElement.classList.add('dark');
        })();
        </script>
    @endif



    @vite(['resources/css/app.css','resources/js/app.js'])
    @livewireStyles
</head>
