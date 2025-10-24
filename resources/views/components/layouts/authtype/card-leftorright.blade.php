<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        @include('partials.head')
    </head>
    <body class="min-h-screen bg-neutral-100 antialiased dark:bg-gradient-to-b dark:from-neutral-950 dark:to-neutral-900">
        <x-auth.wallpaper /> {{-- Fondo agregado --}}
        <div class="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10 bg-neutral-200 dark:bg-neutral-900">
            <div class="flex w-full max-w-md flex-col gap-6 md:flex-row md:max-w-2xl">
                <a href="{{ route('home') }}" class="flex flex-col items-center gap-2 font-medium md:w-1/2">
                    <span class="flex h-9 w-9 items-center justify-center rounded-md">
                        <x-branding.app-logo-icon class="size-9 fill-current text-black dark:text-white" />
                    </span>
                    <span class="sr-only">{{ config('app.name', 'Laravel') }}</span>
                </a>
                <div class="flex flex-col gap-6 md:w-1/2">
                    <div class="rounded-xl border bg-white dark:bg-neutral-950 dark:border-neutral-800 text-neutral-800 shadow">
                        <div class="px-10 py-8">{{ $slot }}</div>
                    </div>
                </div>
            </div>
        </div>
        {{--! Para cambiar la card a la izquierda, intercambia las posiciones de los bloques <a> y <div> en el flex-row --}}
    </body>
</html>
