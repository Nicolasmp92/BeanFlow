<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />


    {{-- ? estilos --}}
    @vite(['resources/css/login.css'])
    @vite(['resources/css/app.css', 'resources/js/app.js'])



</head>

<body class="bg-dark text-white">

    <div class="container d-flex align-items-center justify-content-center vh-100">
            {{ $slot }}
    </div>


</body>

</html>
