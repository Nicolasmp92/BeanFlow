<?php
use Illuminate\Auth\Events\Lockout;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Validate;
use Livewire\Volt\Component;

new #[Layout('components.layouts.auth')] class extends Component {
    #[Validate('required|string|email')]
    public string $email = '';
    #[Validate('required|string')]
    public string $password = '';
    // Backend: "Recordarme" real de Laravel
    public bool $remember = false;
    public function login(): void{
    $this->validate();
    $this->ensureIsNotRateLimited();
    if (! Auth::attempt(['email' => $this->email, 'password' => $this->password], $this->remember)) {
        RateLimiter::hit($this->throttleKey());
        // Mensaje global por si el @error('email') no se ve
        session()->flash('status', __('Estas credenciales no coinciden con nuestros registros.'));
        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }

    RateLimiter::clear($this->throttleKey());
    session()->regenerate(); // usa helper (equivale a Session::regenerate())

    $this->redirectIntended(default: route('dashboard', absolute: false), navigate: true);
}

    protected function ensureIsNotRateLimited(): void{
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }
        event(new Lockout(request()));
        $seconds = RateLimiter::availableIn($this->throttleKey());
        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }
    protected function throttleKey(): string{
        return Str::transliterate(Str::lower($this->email).'|'.request()->ip());
    }
};  ?>

<div class="flex flex-col gap-6">
    <x-auth-header :title="__('Log in to your account')"
        :description="__('Enter your email and password below to log in')" />

    <!-- Session Status -->
    <x-auth-session-status class="text-center" :status="session('status')" />

    {{-- IMPORTANTE: .prevent evita submit nativo y garantiza la acción Livewire --}}
    <form wire:submit.prevent="login" class="flex flex-col gap-6" autocomplete="on">
        {{--* Email Address --}}
        <flux:input id="email" wire:model="email" :label="__('Email address')" type="email" required autofocus
            autocomplete="email" placeholder="email@example.com" />
        @error('email')
        <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
        @enderror
        {{--* Recordar correo --}}
        <div class="flex items-center -mt-2 gap-2">
            <input id="rememberEmail" type="checkbox" class="rounded border-zinc-300 dark:border-zinc-600">
            <label for="rememberEmail" class="select-none text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                {{ __('Recordar correo') }}
            </label>
            <button type="button" class="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700" data-tooltip
                data-tooltip-content="#tip-remember-email" data-placement="right" aria-describedby="tip-remember-email"
                aria-label="¿Qué hace Recordar correo?">
                <flux:icon name="info" class="w-4 h-4 text-zinc-500 dark:text-zinc-300" />
            </button>
        </div>

        {{--* Password --}}
        <div class="relative">
                <flux:input wire:model="password" :label="__('Password')" type="password" required
                    autocomplete="current-password" :placeholder="__('Password')" viewable />

                @if (Route::has('password.request'))
                    <flux:link class="absolute end-0 top-0 text-sm" :href="route('password.request')" wire:navigate>
                        {{ __('Forgot your password?') }}
                    </flux:link>
                @endif
            </div>
            @error('password')
                <p class="text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
            @enderror


        {{--* Recordarme --}}
        <div class="flex items-center -mt-2 gap-2">
            <input id="remember" name="remember" type="checkbox" wire:model.live="remember"
                class="rounded border-zinc-300 dark:border-zinc-600"/>
            <label for="remember" class="cursor-pointer select-none text-sm text-zinc-700 dark:text-zinc-300">
                {{ __('Recordarme') }}
            </label>
            <button type="button" class="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700" data-tooltip
                data-tooltip-content="#tip-remember" data-placement="right" aria-describedby="tip-remember"
                aria-label="¿Qué hace Recordarme?">
                <flux:icon name="info" class="w-4 h-4 text-zinc-500 dark:text-zinc-300" />
            </button>
        </div>



        {{--todo Tooltips ocultos --}}
        {{--* TIP: Recordar correo --}}
        <div id="tip-remember-email" role="tooltip" class="hidden z-50 w-80 rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 shadow-lg
                    dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            style="position:absolute; visibility:hidden;">
            <p class="font-medium mb-1">Recordar correo</p>
            <p>Guarda tu dirección de correo en este navegador para autocompletarla la próxima vez.
                No inicia sesión automáticamente.</p>
            <div data-popper-arrow></div>
        </div>

        {{-- TIP: Recordarme --}}
        <div id="tip-remember" role="tooltip" class="hidden z-50 w-80 rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 shadow-lg
                    dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            style="position:absolute; visibility:hidden;">
            <p class="font-medium mb-1">Recordarme</p>
            <p>Mantiene tu sesión iniciada en este dispositivo incluso si cierras el navegador.
                Úsalo solo en equipos de confianza.</p>
            <div data-popper-arrow></div>
        </div>

        <div class="flex items-center justify-end">
            <flux:button variant="primary" type="submit" class="w-full" wire:loading.attr="disabled"
                wire:target="login">
                <span wire:loading.remove>{{ __('Log in') }}</span>
                <span wire:loading>{{ __('Loading...') }}</span>
            </flux:button>
        </div>
    </form>

    @if (Route::has('register'))
    <div class="space-x-1 rtl:space-x-reverse text-center text-sm text-zinc-600 dark:text-zinc-400">
        <span>{{ __('Don\'t have an account?') }}</span>
        <flux:link :href="route('register')" wire:navigate>{{ __('Sign up') }}</flux:link>
    </div>
    @endif
</div>

@once


<script>
    /**
         * Recordar SOLO el correo (frontend, localStorage) y mantener sincronía con Livewire.
         * (sin cambios de lógica; sólo vive aquí para que funcione tal cual)
         */
        function applyRememberedEmail() {
            const emailInput    = document.querySelector('#email');
            const rememberEmail = document.querySelector('#rememberEmail');
            if (!emailInput || !rememberEmail) return;

            const KEY_ENABLED = 'login_email_enabled';
            const KEY_VALUE   = 'login_email';

            // Cargar estado guardado
            const enabled = localStorage.getItem(KEY_ENABLED) === 'true';
            const saved   = localStorage.getItem(KEY_VALUE) || '';

            rememberEmail.checked = enabled;

            // Precargar valor si corresponde
            if (enabled && saved) {
                if (!emailInput.value) {
                    emailInput.value = saved;
                    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }

            // Al cambiar el checkbox
            rememberEmail.addEventListener('change', () => {
                const on = rememberEmail.checked;
                localStorage.setItem(KEY_ENABLED, String(on));
                if (!on) {
                    localStorage.removeItem(KEY_VALUE);
                } else {
                    localStorage.setItem(KEY_VALUE, emailInput.value || '');
                }
            });

            // Al escribir en el correo, si está activo, persistir
            emailInput.addEventListener('input', () => {
                if (rememberEmail.checked) {
                    localStorage.setItem(KEY_VALUE, emailInput.value || '');
                }
            });
        }

        document.addEventListener('DOMContentLoaded', applyRememberedEmail);
        document.addEventListener('livewire:navigated', applyRememberedEmail);
</script>
@endonce
