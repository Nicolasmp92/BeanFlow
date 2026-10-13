import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DialogoXComponent } from './dialogo-x.component';

export interface DatosConfirmacion {
  titulo: string;
  mensaje: string;
  /** Etiqueta del botón que confirma (por defecto "Confirmar"). */
  textoConfirmar?: string;
  /** Acciones destructivas: el botón principal se pinta de peligro. */
  peligroso?: boolean;
}

/**
 * Diálogo de confirmación compartido — reemplazo accesible y con el tema
 * de la app para `window.confirm` (que bloquea, ignora el modo oscuro y
 * no se puede diseñar). Abrir con `confirmar(dialog, datos)`.
 */
@Component({
  imports: [DialogoXComponent],
  selector: 'app-confirmar-dialogo',
  template: `
    <div class="dialogo" role="alertdialog" [attr.aria-label]="datos.titulo">
      <app-dialogo-x (cerrar)="ref.close(false)" />
      <div class="flex gap-3">
        <span
          class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          [class]="
            datos.peligroso ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary'
          "
          aria-hidden="true"
        >
          @if (datos.peligroso) {
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
              />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          } @else {
            <svg
              class="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          }
        </span>
        <div class="min-w-0">
          <h2 class="pr-6 text-base font-semibold">{{ datos.titulo }}</h2>
          <p class="mt-1 text-sm text-text-muted">{{ datos.mensaje }}</p>
        </div>
      </div>
      <div class="mt-5 flex justify-end gap-2">
        <button
          type="button"
          (click)="ref.close(false)"
          class="h-11 rounded-lg border border-border px-4 text-sm hover:bg-surface-muted sm:h-9"
        >
          Cancelar
        </button>
        <button
          type="button"
          (click)="ref.close(true)"
          [class]="
            'h-11 rounded-lg px-4 text-sm font-medium text-surface sm:h-9 ' +
            (datos.peligroso
              ? 'bg-danger hover:opacity-90'
              : 'bg-primary hover:bg-primary-hover')
          "
        >
          {{ datos.textoConfirmar ?? 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmarDialogoComponent {
  protected readonly datos = inject<DatosConfirmacion>(DIALOG_DATA);
  protected readonly ref = inject<DialogRef<boolean>>(DialogRef);
}

/** `true` si el usuario confirmó; `false` ante cancelar, Esc o backdrop. */
export function confirmar(dialog: Dialog, datos: DatosConfirmacion): Observable<boolean> {
  return dialog
    .open<boolean, DatosConfirmacion>(ConfirmarDialogoComponent, {
      data: datos,
      ariaLabel: datos.titulo,
    })
    .closed.pipe(map((decision) => decision === true));
}
