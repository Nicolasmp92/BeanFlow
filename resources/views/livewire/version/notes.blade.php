<?php

use App\Services\ReleaseNotesService;
use Livewire\Volt\Component;
use Livewire\Attributes\Layout;
use League\CommonMark\CommonMarkConverter;

new #[Layout('layouts.app')] class extends Component
{
    public string $version = '';
    public string $html = '';

    public function mount(ReleaseNotesService $svc): void
    {
        $this->version = (string) config('app.version');

        $md = $svc->getNotesFor($this->version);

        if (class_exists(CommonMarkConverter::class)) {
            $converter = new CommonMarkConverter();
            $this->html = $converter->convert($md)->getContent();
        } else {
            $this->html = nl2br(e($md));
        }
    }
};
?>

<div class="p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
    <h1 class="text-xl font-bold mb-4">Notas de la versión {{ $version }}</h1>
    <div class="max-w-none prose dark:prose-invert">{!! $html !!}</div>
</div>
