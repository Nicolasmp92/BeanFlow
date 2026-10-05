import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CurrencyPipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, TemplateRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../core/toast.service';
import { confirmar } from '../../shared/confirmar.dialog';
import { mensajeError } from '../../shared/mensaje-error';
import { DialogoXComponent } from '../../shared/dialogo-x.component';
import {
  CategoriaCarta,
  Comanda,
  ComandaItem,
  METODOS_PAGO,
  MetodoPago,
  ProductoCarta,
} from '../../shared/models';

/**
 * La cuenta de una mesa: se agregan consumos a lo largo de la estadía y al
 * final se cobra. A diferencia de un POS de mostrador, la cuenta vive abierta.
 */
@Component({
  imports: [CurrencyPipe, DialogoXComponent, RouterLink],
  selector: 'app-cuenta-page',
  template: `
    @if (comanda.value(); as cuenta) {
      <header class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-xl font-semibold">
            {{ cuenta.mesaNumero ? 'Mesa ' + cuenta.mesaNumero : 'Para llevar' }}
            <span class="text-sm font-normal text-text-muted">· cuenta #{{ cuenta.id }}</span>
          </h1>
          <p class="text-sm text-text-muted">
            {{ cuenta.estado === 'abierta' ? 'Cuenta abierta' : 'Cuenta ' + cuenta.estado }}
          </p>
        </div>
        <a routerLink="/salon" class="text-sm text-primary underline">Volver al salón</a>
      </header>

      <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <!-- Consumos -->
        <section>
          <h2 class="text-sm font-medium">Consumos</h2>
          <ul class="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
            @for (linea of cuenta.items; track linea.id) {
              <li class="flex items-center gap-3 p-3" [class.opacity-50]="linea.estado === 'anulado'">
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium">
                    {{ linea.cantidad }}× {{ linea.nombreProducto }}
                  </p>
                  @if (linea.nota) {
                    <p class="truncate text-xs text-text-muted">{{ linea.nota }}</p>
                  }
                  <span class="text-xs" [class]="colorEstado(linea.estado)">
                    {{ etiquetaEstado(linea.estado) }}
                  </span>
                </div>
                <span class="text-sm font-medium">
                  {{ linea.subtotal | currency: 'CLP' : 'symbol-narrow' : '1.0-0' }}
                </span>
                @if (cuenta.estado === 'abierta' && linea.estado !== 'anulado') {
                  <button
                    type="button"
                    (click)="anularLinea(linea)"
                    [attr.aria-label]="'Quitar ' + linea.nombreProducto"
                    class="h-11 w-11 shrink-0 rounded-lg text-danger hover:bg-danger-soft"
                  >
                    ×
                  </button>
                }
              </li>
            } @empty {
              <li class="p-4 text-sm text-text-muted">Sin consumos todavía.</li>
            }
          </ul>

          <div class="mt-3 flex items-center justify-between rounded-xl border border-border bg-surface p-4">
            <span class="text-sm font-medium">Total</span>
            <span class="text-lg font-semibold">
              {{ cuenta.total | currency: 'CLP' : 'symbol-narrow' : '1.0-0' }}
            </span>
          </div>

          @if (cuenta.estado === 'abierta') {
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                (click)="abrirCobro()"
                class="h-11 flex-1 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover"
              >
                Cobrar
              </button>
              <button
                type="button"
                (click)="anularCuenta()"
                class="h-11 rounded-lg border border-border px-4 text-sm hover:bg-surface-muted"
              >
                Anular cuenta
              </button>
            </div>
          }
        </section>

        <!-- Carta -->
        @if (cuenta.estado === 'abierta') {
          <section>
            <h2 class="text-sm font-medium">Agregar de la carta</h2>
            @for (categoria of carta.value(); track categoria.id) {
              <details class="mt-2 rounded-xl border border-border bg-surface" open>
                <summary class="cursor-pointer px-3 py-2 text-sm font-medium">
                  {{ categoria.nombre }}
                </summary>
                <ul class="divide-y divide-border border-t border-border">
                  @for (producto of categoria.productos; track producto.id) {
                    <li class="flex items-center gap-2 p-2">
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm">{{ producto.nombre }}</p>
                        <p class="text-xs text-text-muted">
                          {{ producto.precio | currency: 'CLP' : 'symbol-narrow' : '1.0-0' }}
                          @if (producto.disponibles !== null) {
                            <span [class]="producto.disponibles > 0 ? 'text-text-muted' : 'text-danger'">
                              · {{ producto.disponibles > 0 ? 'alcanza para ' + producto.disponibles : 'sin insumos' }}
                            </span>
                          }
                        </p>
                      </div>
                      <button
                        type="button"
                        [disabled]="producto.disponibles === 0"
                        (click)="agregar(producto)"
                        [attr.aria-label]="'Agregar ' + producto.nombre"
                        class="h-11 w-11 shrink-0 rounded-lg bg-primary-soft text-lg font-medium text-primary hover:bg-primary hover:text-white disabled:opacity-40"
                      >
                        +
                      </button>
                    </li>
                  }
                </ul>
              </details>
            }
          </section>
        }
      </div>
    } @else if (comanda.isLoading()) {
      <p class="text-sm text-text-muted">Cargando cuenta…</p>
    } @else {
      <p class="text-sm text-danger">No se pudo cargar la cuenta.</p>
    }

    <!-- Cobro en modal: no desplaza la cuenta. -->
    <ng-template #dialogoCobro>
      <div class="dialogo">
        <app-dialogo-x (cerrar)="cerrarCobro()" />
        <h2 class="pr-8 text-sm font-medium">Cobrar cuenta</h2>
        <p class="mt-2 text-sm text-text-muted">
          Total a cobrar:
          <strong class="text-text">
            {{ comanda.value()?.total | currency: 'CLP' : 'symbol-narrow' : '1.0-0' }}
          </strong>
        </p>
        @if (pendientesEnBarra() > 0) {
          <p class="mt-3 rounded-lg bg-warning-soft p-3 text-sm text-warning">
            Hay {{ pendientesEnBarra() }} consumo(s) sin entregar. Confirma con la barra antes de cerrar.
          </p>
        }
        <fieldset class="mt-4">
          <legend class="text-sm font-medium">Método de pago</legend>
          <div class="mt-2 grid grid-cols-2 gap-2">
            @for (metodo of metodos; track metodo) {
              <button
                type="button"
                (click)="metodoElegido.set(metodo)"
                class="h-11 rounded-lg border px-3 text-sm capitalize"
                [class]="
                  metodoElegido() === metodo
                    ? 'border-primary bg-primary-soft text-primary'
                    : 'border-border hover:bg-surface-muted'
                "
              >
                {{ metodo }}
              </button>
            }
          </div>
        </fieldset>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            (click)="cerrarCobro()"
            class="h-11 rounded-lg border border-border px-4 text-sm sm:h-9"
          >
            Cancelar
          </button>
          <button
            type="button"
            [disabled]="cobrando()"
            (click)="cobrar()"
            class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-white disabled:opacity-50 sm:h-9"
          >
            Confirmar cobro
          </button>
        </div>
      </div>
    </ng-template>
  `,
})
export default class CuentaPage {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toasts = inject(ToastService);
  private readonly dialogo = inject(Dialog);

  /** Llega por la ruta /cuenta/:id. */
  readonly id = input.required<string>();

  protected readonly metodos = METODOS_PAGO;
  protected readonly metodoElegido = signal<MetodoPago>('efectivo');
  protected readonly cobrando = signal(false);

  protected readonly comanda = httpResource<Comanda>(() => `/api/comandas/${this.id()}`);
  protected readonly carta = httpResource<CategoriaCarta[]>(() => '/api/carta');

  private readonly plantillaCobro = viewChild.required<TemplateRef<unknown>>('dialogoCobro');
  private ref: DialogRef | null = null;

  protected readonly pendientesEnBarra = computed(
    () =>
      this.comanda
        .value()
        ?.items.filter(
          (linea) => linea.estado === 'pendiente' || linea.estado === 'preparando',
        ).length ?? 0,
  );

  protected etiquetaEstado(estado: ComandaItem['estado']): string {
    return {
      pendiente: 'en espera',
      preparando: 'preparando',
      listo: 'listo para llevar a la mesa',
      entregado: 'entregado',
      anulado: 'anulado',
    }[estado];
  }

  protected colorEstado(estado: ComandaItem['estado']): string {
    return {
      pendiente: 'text-text-muted',
      preparando: 'text-warning',
      listo: 'text-success',
      entregado: 'text-text-muted',
      anulado: 'text-danger',
    }[estado];
  }

  protected agregar(producto: ProductoCarta): void {
    this.http
      .post<Comanda>(`/api/comandas/${this.id()}/items`, {
        productoId: producto.id,
        cantidad: 1,
      })
      .subscribe({
        next: () => {
          this.comanda.reload();
          // La carta cambia al consumirse insumos de otras preparaciones.
          this.carta.reload();
        },
        error: (e: unknown) => this.toasts.error(mensajeError(e, 'No se pudo agregar el consumo.')),
      });
  }

  protected anularLinea(linea: ComandaItem): void {
    confirmar(this.dialogo, {
      titulo: 'Quitar consumo',
      mensaje:
        linea.estado === 'pendiente'
          ? `¿Quitar ${linea.cantidad}× ${linea.nombreProducto} de la cuenta?`
          : `${linea.nombreProducto} ya se preparó: los insumos usados no vuelven al stock. ¿Quitarlo de la cuenta?`,
      textoConfirmar: 'Quitar',
      peligroso: true,
    }).subscribe((ok) => {
      if (!ok) return;
      this.http.delete<Comanda>(`/api/comandas/items/${linea.id}`).subscribe({
        next: () => this.comanda.reload(),
        error: (e: unknown) => this.toasts.error(mensajeError(e, 'No se pudo quitar el consumo.')),
      });
    });
  }

  protected abrirCobro(): void {
    this.metodoElegido.set('efectivo');
    this.ref = this.dialogo.open(this.plantillaCobro(), { ariaLabel: 'Cobrar cuenta' });
    this.ref.closed.subscribe(() => (this.ref = null));
  }

  protected cerrarCobro(): void {
    this.ref?.close();
  }

  protected cobrar(): void {
    this.cobrando.set(true);
    this.http
      .post<Comanda>(`/api/comandas/${this.id()}/cobrar`, { metodoPago: this.metodoElegido() })
      .subscribe({
        next: () => {
          this.cobrando.set(false);
          this.cerrarCobro();
          this.toasts.exito('Cuenta cobrada.');
          void this.router.navigate(['/salon']);
        },
        error: (e: unknown) => {
          this.cobrando.set(false);
          this.toasts.error(mensajeError(e, 'No se pudo cobrar la cuenta.'));
        },
      });
  }

  protected anularCuenta(): void {
    confirmar(this.dialogo, {
      titulo: 'Anular cuenta',
      mensaje:
        'Se anulan todos los consumos y la mesa queda libre. Los insumos ya preparados no se devuelven. ¿Continuar?',
      textoConfirmar: 'Anular',
      peligroso: true,
    }).subscribe((ok) => {
      if (!ok) return;
      this.http.post(`/api/comandas/${this.id()}/anular`, {}).subscribe({
        next: () => {
          this.toasts.exito('Cuenta anulada.');
          void this.router.navigate(['/salon']);
        },
        error: (e: unknown) => this.toasts.error(mensajeError(e, 'No se pudo anular la cuenta.')),
      });
    });
  }
}
