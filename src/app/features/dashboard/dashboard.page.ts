import { CurrencyPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Comanda, LineaCocina, MesaSalon } from '../../shared/models';

/**
 * Panel del turno: lo que está pasando ahora. Las cifras se derivan de las
 * cuentas del día, no de un contador aparte — una sola fuente de verdad.
 */
@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-dashboard',
  template: `
    <h1 class="text-xl font-semibold">Panel</h1>
    <p class="text-sm text-text-muted">Hola, {{ auth.usuario()?.nombre }}.</p>

    <section class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <a
        routerLink="/salon"
        class="rounded-xl border border-border bg-surface p-4 hover:border-primary"
      >
        <p class="text-sm text-text-muted">Mesas ocupadas</p>
        <p class="mt-1 text-2xl font-semibold">
          {{ ocupadas() }}<span class="text-base text-text-muted">/{{ totalMesas() }}</span>
        </p>
      </a>

      <div class="rounded-xl border border-border bg-surface p-4">
        <p class="text-sm text-text-muted">En curso (sin cobrar)</p>
        <p class="mt-1 text-2xl font-semibold">
          {{ totalAbierto() | currency: 'CLP' : 'symbol-narrow' : '1.0-0' }}
        </p>
      </div>

      <div class="rounded-xl border border-border bg-surface p-4">
        <p class="text-sm text-text-muted">Cobrado hoy</p>
        <p class="mt-1 text-2xl font-semibold">
          {{ cobradoHoy() | currency: 'CLP' : 'symbol-narrow' : '1.0-0' }}
        </p>
        <p class="text-xs text-text-muted">{{ cuentasHoy() }} cuenta(s)</p>
      </div>

      @if (esBarra()) {
        <a
          routerLink="/cocina"
          class="rounded-xl border bg-surface p-4"
          [class]="pendientes() > 0 ? 'border-warning hover:border-warning' : 'border-border hover:border-primary'"
        >
          <p class="text-sm text-text-muted">Pendientes en barra</p>
          <p class="mt-1 text-2xl font-semibold" [class.text-warning]="pendientes() > 0">
            {{ pendientes() }}
          </p>
        </a>
      }
    </section>

    @if (cuentasAbiertas().length > 0) {
      <section class="mt-8">
        <h2 class="text-sm font-medium">Cuentas abiertas</h2>
        <ul class="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
          @for (cuenta of cuentasAbiertas(); track cuenta.id) {
            <li>
              <a
                [routerLink]="['/cuenta', cuenta.id]"
                class="flex items-center gap-3 p-3 hover:bg-surface-muted"
              >
                <span class="min-w-0 flex-1 truncate text-sm font-medium">
                  {{ cuenta.mesaNumero ? 'Mesa ' + cuenta.mesaNumero : 'Para llevar' }}
                  <span class="font-normal text-text-muted">· #{{ cuenta.id }}</span>
                </span>
                <span class="shrink-0 text-sm">
                  {{ cuenta.total | currency: 'CLP' : 'symbol-narrow' : '1.0-0' }}
                </span>
              </a>
            </li>
          }
        </ul>
      </section>
    }
  `,
})
export default class DashboardPage {
  protected readonly auth = inject(AuthService);

  private readonly comandas = httpResource<Comanda[]>(() => '/api/comandas');
  private readonly historial = httpResource<Comanda[]>(() => '/api/comandas/historial');
  private readonly mesas = httpResource<MesaSalon[]>(() => '/api/mesas');

  /** La cola de barra solo se consulta si el rol puede verla (si no, 403). */
  private readonly cocina = httpResource<LineaCocina[]>(() =>
    this.esBarra() ? '/api/cocina/pendientes' : undefined,
  );

  protected readonly esBarra = computed(() => {
    const rol = this.auth.usuario()?.rol;
    return rol === 'cocina' || rol === 'admin';
  });

  protected readonly cuentasAbiertas = computed(() => this.comandas.value() ?? []);

  protected readonly totalMesas = computed(() => this.mesas.value()?.length ?? 0);

  protected readonly ocupadas = computed(
    () => this.mesas.value()?.filter((mesa) => mesa.comandaId !== null).length ?? 0,
  );

  protected readonly totalAbierto = computed(() =>
    this.cuentasAbiertas().reduce((suma, cuenta) => suma + cuenta.total, 0),
  );

  private readonly cobradasHoy = computed(() => {
    const hoy = new Date().toDateString();
    return (this.historial.value() ?? []).filter(
      (cuenta) =>
        cuenta.estado === 'cobrada' &&
        cuenta.cerradaEn !== null &&
        new Date(cuenta.cerradaEn).toDateString() === hoy,
    );
  });

  protected readonly cobradoHoy = computed(() =>
    this.cobradasHoy().reduce((suma, cuenta) => suma + cuenta.total, 0),
  );

  protected readonly cuentasHoy = computed(() => this.cobradasHoy().length);

  protected readonly pendientes = computed(() => this.cocina.value()?.length ?? 0);
}
