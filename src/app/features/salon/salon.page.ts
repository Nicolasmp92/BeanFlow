import { CurrencyPipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../core/toast.service';
import { mensajeError } from '../../shared/mensaje-error';
import { MesaSalon } from '../../shared/models';

/**
 * Plano del salón: una tarjeta por mesa. Libre abre cuenta; ocupada muestra
 * el total en curso y cuántos pedidos están en barra.
 */
@Component({
  imports: [CurrencyPipe],
  selector: 'app-salon-page',
  template: `
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Salón</h1>
        <p class="text-sm text-text-muted">Toca una mesa para abrir o ver su cuenta.</p>
      </div>
      <button
        type="button"
        (click)="abrirParaLlevar()"
        class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Pedido para llevar
      </button>
    </header>

    @if (mesas.isLoading()) {
      <p class="mt-6 text-sm text-text-muted">Cargando salón…</p>
    } @else if (mesas.error()) {
      <p class="mt-6 text-sm text-danger">No se pudo cargar el salón.</p>
    } @else {
      <section class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        @for (mesa of mesas.value(); track mesa.id) {
          <button
            type="button"
            (click)="entrar(mesa)"
            [attr.aria-label]="etiqueta(mesa)"
            class="flex min-h-28 flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors"
            [class]="
              mesa.comandaId
                ? 'border-warning bg-warning-soft hover:border-warning'
                : 'border-border bg-surface hover:border-primary'
            "
          >
            <span class="text-base font-semibold">Mesa {{ mesa.numero }}</span>
            @if (mesa.nombre) {
              <span class="text-xs text-text-muted">{{ mesa.nombre }}</span>
            }
            @if (mesa.comandaId) {
              <span class="mt-auto text-sm font-medium">{{ mesa.total | currency: 'CLP' : 'symbol-narrow' : '1.0-0' }}</span>
              @if (mesa.itemsPendientes) {
                <span class="text-xs font-medium text-warning">
                  {{ mesa.itemsPendientes }} en barra
                </span>
              } @else {
                <span class="text-xs text-success">todo entregado</span>
              }
            } @else {
              <span class="mt-auto text-xs text-text-muted">libre</span>
            }
          </button>
        } @empty {
          <p class="col-span-full text-sm text-text-muted">
            No hay mesas activas. Un administrador puede crearlas en Mesas.
          </p>
        }
      </section>

      @if (ocupadas() > 0) {
        <p class="mt-4 text-sm text-text-muted">
          {{ ocupadas() }} de {{ mesas.value()!.length }} mesas ocupadas.
        </p>
      }
    }
  `,
})
export default class SalonPage {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toasts = inject(ToastService);

  protected readonly mesas = httpResource<MesaSalon[]>(() => '/api/mesas');

  protected readonly ocupadas = computed(
    () => this.mesas.value()?.filter((mesa) => mesa.comandaId !== null).length ?? 0,
  );

  protected etiqueta(mesa: MesaSalon): string {
    return mesa.comandaId
      ? `Mesa ${mesa.numero}, ocupada, ver cuenta`
      : `Mesa ${mesa.numero}, libre, abrir cuenta`;
  }

  /** Si la mesa está libre abre la cuenta primero; si no, entra a la existente. */
  protected entrar(mesa: MesaSalon): void {
    if (mesa.comandaId) {
      void this.router.navigate(['/cuenta', mesa.comandaId]);
      return;
    }
    this.abrir({ mesaId: mesa.id });
  }

  protected abrirParaLlevar(): void {
    this.abrir({ mesaId: null });
  }

  private abrir(cuerpo: { mesaId: number | null }): void {
    this.http.post<{ id: number }>('/api/comandas', cuerpo).subscribe({
      next: (comanda) => void this.router.navigate(['/cuenta', comanda.id]),
      error: (e: unknown) => {
        this.toasts.error(mensajeError(e, 'No se pudo abrir la cuenta.'));
        // Otro garzón pudo tomar la mesa mientras esta vista estaba abierta.
        this.mesas.reload();
      },
    });
  }
}
