// resources/js/ui/notify.js
import Swal from 'sweetalert2';

/**
 * Registra un listener global para el evento 'notify'
 * Compatible con Livewire v3: $this->dispatch('notify', ...)
 * Acepta detail: { type, body, message, title, position, timer }
 */
export function registerNotify() {
    const handler = (e) => {
        const d = (e && e.detail) ? e.detail : {};

        // Tipo de icono del toast
        const type = (typeof d.type === 'string' && d.type) ? d.type : 'info'; // success|error|warning|info|question

        // Posición del toast
        const position = (typeof d.position === 'string' && d.position) ? d.position : 'top-end';

        // Duración (ms)
        let timer = 2200;
        if (typeof d.timer === 'number' && Number.isFinite(d.timer)) {
            timer = d.timer;
        } else if (typeof d.timer === 'string' && d.timer.trim() !== '' && !Number.isNaN(Number(d.timer))) {
            timer = Number(d.timer);
        }

        // Texto visible (en SweetAlert2 toast, lo que se muestra es 'title')
        const title =
            (typeof d.body === 'string' && d.body.trim()) ? d.body :
                (typeof d.message === 'string' && d.message.trim()) ? d.message :
                    (typeof d.title === 'string' && d.title.trim()) ? d.title :
                        'Operación realizada.';

        if (!Swal || typeof Swal.fire !== 'function') {
            // eslint-disable-next-line no-console
            console.warn('[notify] SweetAlert2 no está disponible.');
            return;
        }

        Swal.fire({
            toast: true,
            position,
            icon: type,
            title,
            showConfirmButton: false,
            timer,
            timerProgressBar: true,
            showCloseButton: true
        });
    };

    // Evita registrar el listener más de una vez
    if (!window.__notifyBound) {
        window.addEventListener('notify', handler);
        window.__notifyBound = true;
    }

    // Helper global opcional: window.toast({ type, body, ... })
    window.toast = function toast(opts = {}) {
        const ev = new CustomEvent('notify', { detail: opts });
        window.dispatchEvent(ev);
    };

}



// NUEVO: confirmaciones globales
export function registerConfirm() {
    if (window.__confirmBound) return;
    window.__confirmBound = true;

    window.addEventListener('confirm', async (e) => {
        const d = e?.detail ?? {};
        const res = await Swal.fire({
            title: d.title ?? '¿Estás seguro?',
            text: d.text ?? 'Esta acción no se puede deshacer.',
            icon: d.icon ?? 'warning',
            showCancelButton: true,
            confirmButtonText: d.confirmText ?? 'Sí',
            cancelButtonText: d.cancelText ?? 'Cancelar',
            reverseButtons: true,
            focusCancel: true,
        });

        if (res.isConfirmed) {
            // Llama método Livewire si viene indicado
            if (d.livewire?.method) {
                const params = Array.isArray(d.livewire.params) ? d.livewire.params : [];
                // Usa el componente actual si no te pasan uno
                const comp = d.livewire.componentId
                    ? window.Livewire.find(d.livewire.componentId)
                    : window.Livewire.all()?.[0];

                if (comp) await comp.call(d.livewire.method, ...params);
            }

            // Toast opcional post-confirmación
            if (d.toast !== false) {
                window.toast?.({
                    type: d.toastType ?? 'success',
                    body: d.toastBody ?? 'Eliminado correctamente.',
                });
            }
        }
    });
}
