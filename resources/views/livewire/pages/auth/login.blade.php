{{-- !formulario --}}
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
    public bool $remember = false;

    public function login(): void
    {
        $this->validate();
        $this->ensureIsNotRateLimited();

        if (!Auth::attempt(['email' => $this->email, 'password' => $this->password], $this->remember)) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
        Session::regenerate();

        $this->redirectIntended(default: route('dashboard', absolute: false), navigate: true);
    }

    protected function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
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

    protected function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->email) . '|' . request()->ip());
    }
}; ?>

<div class="space-y-6"> {{-- (2) respiración global entre bloques --}}

    {{-- ! Bloque para mostrar todos los errores de validación --}}
    @if ($errors->any())
        <div
            class="mb-2 rounded-lg border border-red-300/40 bg-red-50/50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            @foreach ($errors->all() as $error)
                <div>{{ $error }}</div>
            @endforeach
        </div>
    @endif

    {{-- Header con jerarquía corregida (punto 1 aplicado en el componente) --}}
    <x-auth.header :title="__('Log in to your account')" :description="__('Enter your email and password below to log in')" />

    {{-- * Session Status --}}
    <x-auth.session-status class="text-center" :status="session('status')" />

    <form wire:submit.prevent="login" class="flex flex-col gap-6">

        {{-- * Email Address --}}
        <div class="flex flex-col">
            <label for="email" class="mb-1.5 text-sm font-medium text-espresso-800 dark:text-foam-200">
                {{-- (1) jerarquía sutil --}}
                {{ __('Email address') }}
            </label>

            <input wire:model="email" id="email" type="email" required autofocus autocomplete="email"
                placeholder="email@example.com"
                class="rounded-lg border border-espresso-300/80 dark:border-espresso-700
                       bg-foam-50 dark:bg-espresso-800
                       px-3 py-2
                       text-espresso-900 dark:text-foam-100
                       placeholder:text-espresso-500/60 dark:placeholder:text-foam-300/60
                       outline-none ring-2 ring-transparent
                       focus:border-mocha-400 focus:ring-mocha-400 transition" />
            {{-- (3) contraste/focus claro --}}
            @error('email')
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p> {{-- (3) feedback cercano al campo --}}
            @enderror
        </div>

        {{-- * Recordar solo el correo + tooltip --}}
        <div class="flex items-center gap-2 -mt-1"> {{-- (2) compacidad ajustada --}}
            <label for="rememberEmail" class="inline-flex items-center gap-2 cursor-pointer">
                <input id="rememberEmail" type="checkbox"
                    class="rounded border-espresso-300 dark:border-espresso-700 accent-mocha-500">
                <span class="text-sm text-espresso-800 dark:text-foam-200">{{ __('Recordar correo') }}</span>
            </label>

            {{-- * Tooltip trigger --}}
            <button type="button" id="rememberEmailTooltipBtn"
                class="p-1 rounded hover:bg-foam-100 dark:hover:bg-espresso-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mocha-400"
                {{-- (4) accesibilidad/hover --}} aria-label="¿Qué hace Recordar correo?">
                <x-lucide-info class="h-4 w-4 text-espresso-500 dark:text-foam-300" />
            </button>

            {{-- * Tooltip (Popper posiciona) --}}
            <div id="rememberEmailTooltip" role="tooltip"
                class="hidden z-50 w-72 rounded-lg border border-foam-200 bg-foam-50 p-3 text-sm text-espresso-800 shadow-lg
                       dark:border-espresso-700 dark:bg-espresso-800 dark:text-foam-200">
                <p class="mb-1 font-medium">Recordar correo</p>
                <p>Guarda tu correo en este navegador para precargarlo la próxima vez. Úsalo en equipos de confianza.
                </p>
            </div>
        </div>

        {{-- * Password --}}
        <div class="flex flex-col gap-1">
            {{-- fila de etiqueta + enlace (mejor para mobile que posición absoluta) --}}
            <div class="flex items-center justify-between">
                <label for="password" class="text-sm font-medium text-espresso-800 dark:text-foam-200">
                    {{ __('Password') }}
                </label>

                @if (Route::has('password.request'))
                    <a class="text-xs font-medium text-mocha-700 underline-offset-2 hover:text-mocha-600 hover:underline
                               dark:text-crema-300 dark:hover:text-crema-200"
                        href="{{ route('password.request') }}">
                        {{ __('Forgot your password?') }}
                    </a>
                @endif
            </div>

            <div class="relative">
                <input wire:model="password" id="password" type="password" required autocomplete="current-password"
                    placeholder="{{ __('Password') }}"
                    class="w-full rounded-lg border border-espresso-300/80 dark:border-espresso-700
                           bg-foam-50 dark:bg-espresso-800
                           px-3 py-2 pr-10
                           text-espresso-900 dark:text-foam-100
                           placeholder:text-espresso-500/60 dark:placeholder:text-foam-300/60
                           outline-none ring-2 ring-transparent
                           focus:border-mocha-400 focus:ring-mocha-400 transition" />
                {{-- (3) foco visible y consistente --}}

                <button type="button" id="togglePassword"
                    class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1
                           hover:bg-foam-100 dark:hover:bg-espresso-700
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mocha-400"
                    {{-- (4) accesibilidad --}} aria-label="{{ __('Show password') }}" aria-controls="password"
                    aria-pressed="false">
                    <x-lucide-eye id="eyeIcon" class="h-5 w-5 text-espresso-500 dark:text-foam-300" />
                    <x-lucide-eye-off id="eyeOffIcon" class="hidden h-5 w-5 text-espresso-500 dark:text-foam-300" />
                </button>
            </div>

            @error('password')
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ $message }}</p>
            @enderror
        </div>

        {{-- * Remember Me + Tooltip (Popper vía data-attributes) --}}
        <div class="inline-flex items-center gap-2">
            <label for="remember" class="inline-flex items-center gap-2 cursor-pointer">
                <input id="remember" type="checkbox" wire:model="remember"
                    class="rounded border-espresso-300 dark:border-espresso-700 accent-mocha-500">
                <span class="text-sm text-espresso-800 dark:text-foam-200">{{ __('Recordarme') }}</span>
            </label>

            <button type="button"
                class="rounded p-1 hover:bg-foam-100 dark:hover:bg-espresso-700
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mocha-400"
                data-tooltip data-tooltip-content="#tip-remember" data-placement="right-start" data-noflip="1"
                aria-describedby="tip-remember" aria-label="¿Qué hace Recordarme?">
                <x-lucide-info class="h-4 w-4 text-espresso-500 dark:text-foam-300" />
            </button>
        </div>

        {{-- * Tooltip (oculto por defecto) --}}
        <div id="tip-remember" role="tooltip"
            class="hidden z-50 w-80 rounded-lg border border-foam-200 bg-foam-50 p-3 text-sm text-espresso-800 shadow-lg
                   dark:border-espresso-700 dark:bg-espresso-800 dark:text-foam-200">
            <p class="mb-1 font-medium">Recordarme</p>
            <p>Mantiene tu sesión iniciada en este dispositivo incluso si cierras el navegador.
                Si cierras sesión manualmente, deberás iniciar nuevamente. Úsalo en equipos de confianza.</p>
        </div>

        {{-- * Botón login --}}
        <div class="flex items-center justify-end pt-2"> {{-- (2) respiración antes del CTA --}}
            <x-auth.login-button />
        </div>

    </form>
</div>
