<div id="app-splash" role="status" aria-live="polite" aria-busy="true"
    class="fixed left-0 top-0 z-[9999] grid place-items-center
            w-screen h-screen md:h-dvh
            bg-white/95 dark:bg-neutral-950/95 backdrop-blur
            transition-opacity duration-500 will-change-[opacity]">

    <div class="relative flex flex-col items-center gap-6">
        {{-- SVG con taza + vapor (izquierdo espejado) --}}
        <svg id="coffee-icon" width="64" height="64" viewBox="0 0 64 64"
            class="h-16 w-16 text-neutral-900 dark:text-neutral-100" fill="none" xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true">
            {{-- Taza --}}
            <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 24h28v8a14 14 0 0 1-14 14H26A14 14 0 0 1 12 32v-8Z" />
                <path d="M40 28h6a6 6 0 0 1 0 12h-6" />
                <path d="M10 48h36" />
            </g>

            {{-- Vapor centrado respecto a la taza --}}
            <g stroke="currentColor" stroke-width="2" stroke-linecap="round" transform="translate(26, 6)">
                {{-- Izquierdo espejado --}}
                <g class="steam-mirror">
                    <path class="coffee-steam" d="M-4 6c0 3 3 3 3 6s-3 3-3 6" />
                </g>
                {{-- Centro --}}
                <path class="coffee-steam delay-200" d="M0 4c0 3 3 3 3 6s-3 3-3 6" />
                {{-- Derecho --}}
                <path class="coffee-steam delay-400" d="M6 6c0 3 3 3 3 6s-3 3-3 6" />
            </g>

        </svg>

        <p id="splash-message" class="text-sm text-neutral-700 dark:text-neutral-300 select-none">
            <span class="msg-text">Preparando BeanFlow</span>
            <span class="dots" aria-hidden="true">
                <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
            </span>
        </p>
    </div>
</div>
