{{-- resources/views/partials/splash.blade.php --}}
<div id="app-splash" role="status" aria-live="polite" aria-busy="true" class="fixed left-0 top-0 z-[9999] grid place-items-center
            w-screen h-screen md:h-dvh          {{-- cubre 100% y usa dvh cuando haya --}}
            bg-white/95 dark:bg-neutral-950/95 backdrop-blur
            transition-opacity duration-500 will-change-[opacity]">

    <div class="relative flex flex-col items-center gap-6">
        {{-- Ícono Lucide (Flux) con ID para animación de vapor --}}
        <flux:icon id="coffee-icon" name="coffee" class="h-16 w-16 text-neutral-900 dark:text-neutral-100"
            stroke-width="1.6" />

        {{-- Mensaje con puntos animados --}}
        <p id="splash-message" class="text-sm text-neutral-700 dark:text-neutral-300 select-none">
            <span class="msg-text">Preparando BeanFlow</span>
            <span class="dots" aria-hidden="true">
                <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
            </span>
        </p>
    </div>
</div>
