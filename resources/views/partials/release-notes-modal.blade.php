<dialog id="release-notes-modal" class="m-0 p-0 bg-transparent">
    <div class="w-full max-w-3xl mx-auto rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-xl">
        <div class="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 class="text-base font-semibold">
                Notas de la versión {{ config('app.version') }}
            </h3>
            <button class="p-2 text-xl" onclick="closeReleaseNotes()" aria-label="Cerrar">&times;</button>
        </div>

        <div class="p-4">
            <livewire:version.notes lazy />
        </div>
    </div>
</dialog>

<style>
    /* oscurecer fondo */
    #release-notes-modal::backdrop { background: rgba(0,0,0,.45); }
</style>

<script>
    window.openReleaseNotes = function () {
        const dlg = document.getElementById('release-notes-modal');
        if (dlg && !dlg.open) dlg.showModal();
    };
    window.closeReleaseNotes = function () {
        const dlg = document.getElementById('release-notes-modal');
        if (dlg && dlg.open) dlg.close();
    };
    // cerrar al hacer click fuera del panel
    (function () {
        const dlg = document.getElementById('release-notes-modal');
        if (!dlg) return;
        dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
        // Esc ya cierra por defecto en <dialog>
    })();
</script>
