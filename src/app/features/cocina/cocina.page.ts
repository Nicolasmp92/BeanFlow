import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { ToastService } from '../../core/toast.service';
import { mensajeError } from '../../shared/mensaje-error';
import { LineaCocina } from '../../shared/models';

/**
 * Tablero de la barra, en orden de llegada. Dos columnas porque es la decisión
 * real del barista: qué tomo ahora y qué ya está saliendo.
 *
 * Al pasar a «preparando» el servidor descuenta los insumos de la receta; si
 * no alcanzan, la acción falla y el stock queda intacto.
 */
@Component({
  selector: 'app-cocina-page',
  template: `
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Barra</h1>
        <p class="text-sm text-text-muted">
          {{ enEspera().length }} en espera · {{ enPreparacion().length }} preparando
        </p>
      </div>
      <button
        type="button"
        (click)="lineas.reload()"
        class="h-11 rounded-lg border border-border px-4 text-sm hover:bg-surface-muted"
      >
        Actualizar
      </button>
    </header>

    @if (lineas.isLoading()) {
      <p class="mt-6 text-sm text-text-muted">Cargando pedidos…</p>
    } @else if (lineas.error()) {
      <p class="mt-6 text-sm text-danger">No se pudieron cargar los pedidos.</p>
    } @else {
      <div class="mt-6 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 class="text-sm font-medium">En espera</h2>
          <ul class="mt-2 space-y-2">
            @for (linea of enEspera(); track linea.id) {
              <li class="rounded-xl border border-border bg-surface p-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-sm font-medium">
                      {{ linea.cantidad }}× {{ linea.nombreProducto }}
                    </p>
                    <p class="text-xs text-text-muted">{{ origen(linea) }}</p>
                    @if (linea.nota) {
                      <p class="mt-1 text-xs font-medium text-warning">{{ linea.nota }}</p>
                    }
                  </div>
                  <button
                    type="button"
                    (click)="avanzar(linea, 'preparando')"
                    class="h-11 shrink-0 rounded-lg bg-primary px-3 text-sm font-medium text-white hover:bg-primary-hover"
                  >
                    Preparar
                  </button>
                </div>
              </li>
            } @empty {
              <li class="rounded-xl border border-border bg-surface p-4 text-sm text-text-muted">
                Nada en espera.
              </li>
            }
          </ul>
        </section>

        <section>
          <h2 class="text-sm font-medium">Preparando</h2>
          <ul class="mt-2 space-y-2">
            @for (linea of enPreparacion(); track linea.id) {
              <li class="rounded-xl border border-warning bg-warning-soft p-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-sm font-medium">
                      {{ linea.cantidad }}× {{ linea.nombreProducto }}
                    </p>
                    <p class="text-xs text-text-muted">{{ origen(linea) }}</p>
                    @if (linea.nota) {
                      <p class="mt-1 text-xs font-medium">{{ linea.nota }}</p>
                    }
                  </div>
                  <button
                    type="button"
                    (click)="avanzar(linea, 'listo')"
                    class="h-11 shrink-0 rounded-lg bg-success px-3 text-sm font-medium text-white"
                  >
                    Listo
                  </button>
                </div>
              </li>
            } @empty {
              <li class="rounded-xl border border-border bg-surface p-4 text-sm text-text-muted">
                Nada en preparación.
              </li>
            }
          </ul>
        </section>
      </div>
    }
  `,
})
export default class CocinaPage {
  private readonly http = inject(HttpClient);
  private readonly toasts = inject(ToastService);

  protected readonly lineas = httpResource<LineaCocina[]>(() => '/api/cocina/pendientes');

  protected readonly enEspera = computed(
    () => this.lineas.value()?.filter((linea) => linea.estado === 'pendiente') ?? [],
  );

  protected readonly enPreparacion = computed(
    () => this.lineas.value()?.filter((linea) => linea.estado === 'preparando') ?? [],
  );

  protected origen(linea: LineaCocina): string {
    const lugar = linea.mesaNumero ? `Mesa ${linea.mesaNumero}` : 'Para llevar';
    return `${lugar} · cuenta #${linea.comandaId}`;
  }

  protected avanzar(linea: LineaCocina, estado: 'preparando' | 'listo'): void {
    this.http.patch(`/api/cocina/items/${linea.id}`, { estado }).subscribe({
      next: () => this.lineas.reload(),
      error: (e: unknown) => {
        // 409 del backend = faltó insumo. El mensaje nombra qué y cuánto hay:
        // el barista necesita ese dato, no un "error al actualizar".
        this.toasts.error(mensajeError(e, 'No se pudo actualizar el pedido.'));
        this.lineas.reload();
      },
    });
  }
}
