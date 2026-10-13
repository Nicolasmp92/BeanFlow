import { Component, output } from '@angular/core';

/**
 * Botón de cierre estándar de diálogos: × fija en la esquina superior
 * derecha del marco `.dialogo` (que es `position: relative`). Emite
 * `cerrar` — el dueño decide cómo cerrar (DialogRef varía entre diálogos
 * de componente y de template).
 */
@Component({
  selector: 'app-dialogo-x',
  template: `
    <button
      type="button"
      (click)="cerrar.emit()"
      aria-label="Cerrar"
      class="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted hover:text-text"
    >
      <svg
        class="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  `,
})
export class DialogoXComponent {
  readonly cerrar = output<void>();
}
