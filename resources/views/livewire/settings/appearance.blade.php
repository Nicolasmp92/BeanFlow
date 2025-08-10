<?php

use Livewire\Volt\Component;

new class extends Component {
    public string $theme = 'system';

    public function mount(): void
    {
        $this->theme = auth()->user()->theme ?? 'system';
    }

    public function setTheme(string $mode): void
    {
        if (! in_array($mode, ['light','dark','system'], true)) {
            return;
        }

        $this->theme = $mode;

        if (auth()->check()) {
            auth()->user()->update(['theme' => $mode]); // persistimos en BD
        }

        // Notifica al front para aplicar la clase 'dark' según corresponda
        $this->dispatch('apply-theme', theme: $mode);
    }
}; ?>

<section class="w-full">
    @include('partials.settings-heading')

    <x-settings.layout :heading="__('Appearance')" :subheading=" __('Update the appearance settings for your account')">
        <flux:radio.group
            x-data
            x-init="
                // 1) set inicial desde BD
                $flux.appearance = @js($theme);

                // 2) cuando cambie, avisamos a Livewire para guardar
                $watch('$flux.appearance', (val) => $wire.setTheme(val));

                // 3) aplicar clase 'dark' al vuelo cuando guardemos
                window.addEventListener('apply-theme', (e) => {
                  const mode = e.detail.theme;
                  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const resolved = mode === 'system' ? (sysDark ? 'dark' : 'light') : mode;
                  document.documentElement.classList.toggle('dark', resolved === 'dark');
                });
            "
            variant="segmented"
            x-model="$flux.appearance"
        >
            <flux:radio value="light" icon="sun">{{ __('Light') }}</flux:radio>
            <flux:radio value="dark" icon="moon">{{ __('Dark') }}</flux:radio>
            <flux:radio value="system" icon="computer-desktop">{{ __('System') }}</flux:radio>
        </flux:radio.group>
    </x-settings.layout>
</section>




{{-- LO ANTERIOR --}}
{{-- <section class="w-full">
    @include('partials.settings-heading')

    <x-settings.layout :heading="__('Appearance')" :subheading=" __('Update the appearance settings for your account')">
        <flux:radio.group x-data variant="segmented" x-model="$flux.appearance">
            <flux:radio value="light" icon="sun">{{ __('Light') }}</flux:radio>
            <flux:radio value="dark" icon="moon">{{ __('Dark') }}</flux:radio>
            <flux:radio value="system" icon="computer-desktop">{{ __('System') }}</flux:radio>
        </flux:radio.group>
    </x-settings.layout>
</section> --}}
