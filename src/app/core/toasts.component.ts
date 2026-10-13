import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

/**
 * Contenedor de toasts montado una vez en App (fuera del shell, así también
 * cubre el login). aria-live anuncia cada aviso a lectores de pantalla.
 */
@Component({
  selector: 'app-toasts',
  template: `
    <div
      class="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:w-80"
      aria-live="polite"
    >
      @for (toast of toasts.toasts(); track toast.id) {
        <div
          [attr.role]="toast.tipo === 'error' ? 'alert' : 'status'"
          class="pointer-events-auto flex items-start gap-2 rounded-xl border border-border bg-surface p-3 text-sm shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="mt-0.5 h-4 w-4 shrink-0"
            [class.text-success]="toast.tipo === 'exito'"
            [class.text-danger]="toast.tipo === 'error'"
            [class.text-primary]="toast.tipo === 'info'"
            aria-hidden="true"
          >
            @if (toast.tipo === 'exito') {
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                clip-rule="evenodd"
              />
            } @else if (toast.tipo === 'error') {
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                clip-rule="evenodd"
              />
            } @else {
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
                clip-rule="evenodd"
              />
            }
          </svg>
          <p class="flex-1 text-text">{{ toast.texto }}</p>
          <button
            type="button"
            (click)="toasts.quitar(toast.id)"
            aria-label="Cerrar aviso"
            class="shrink-0 rounded p-0.5 text-text-muted transition hover:bg-surface-muted hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
              />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastsComponent {
  protected readonly toasts = inject(ToastService);
}
