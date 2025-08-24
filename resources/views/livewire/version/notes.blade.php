<?php

use App\Services\ReleaseNotesService;
use Livewire\Volt\Component;
use League\CommonMark\CommonMarkConverter;

new class extends Component
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

<div>
    <h2 class="text-lg font-semibold mb-3">Notas de la versión {{ $version }}</h2>
    <div class="max-w-none prose dark:prose-invert">{!! $html !!}</div>
</div>
