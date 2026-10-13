import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { PreferencesService, Tema } from '../preferences.service';
import { LayoutService } from './layout.service';

/**
 * Barra superior del shell. A la derecha el cluster canónico de admin:
 * toggle de tema (claro → oscuro → sistema), campana de notificaciones
 * (panel placeholder — punto de conexión del dominio notificaciones,
 * aún en backlog) y menú de usuario con avatar de iniciales.
 */
@Component({
  imports: [RouterLink, CdkMenuTrigger, CdkMenu, CdkMenuItem],
  selector: 'app-topbar',
  host: { '(window:keydown.escape)': 'cerrarNotificaciones()' },
  template: `
    <header class="flex h-14 items-center gap-3 border-b border-border bg-surface px-4">
      <button
        type="button"
        (click)="layout.esMovil() ? layout.alternarMovil() : layout.ciclar()"
        aria-label="Alternar barra lateral"
        class="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted"
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span class="text-sm text-text-muted">BeanFlow</span>

      <div class="ms-auto flex items-center gap-1">
        <button
          type="button"
          (click)="ciclarTema()"
          [attr.aria-label]="'Tema: ' + etiquetaTema()"
          [attr.title]="'Tema: ' + etiquetaTema()"
          class="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            @switch (preferencias.tema()) {
              @case ('claro') {
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                />
              }
              @case ('oscuro') {
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              }
              @case ('sistema') {
                <rect x="3" y="4" width="18" height="13" rx="2" />
                <path d="M8 21h8m-4-4v4" />
              }
            }
          </svg>
        </button>

        <div class="relative">
          <button
            type="button"
            (click)="alternarNotificaciones()"
            aria-label="Notificaciones"
            [attr.aria-expanded]="notificacionesAbiertas()"
            class="relative flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted"
          >
            <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            @if (pendientes() > 0) {
              <span
                class="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger"
                aria-hidden="true"
              ></span>
            }
          </button>
          @if (notificacionesAbiertas()) {
            <button
              type="button"
              aria-label="Cerrar notificaciones"
              (click)="cerrarNotificaciones()"
              class="fixed inset-0 z-40"
            ></button>
            <div
              class="absolute top-full right-0 z-50 mt-1 w-72 rounded-xl border border-border bg-surface p-4 shadow-lg"
              role="status"
            >
              <p class="text-sm font-medium">Notificaciones</p>
              <p class="mt-2 text-sm text-text-muted">Sin notificaciones nuevas.</p>
            </div>
          }
        </div>

        <button
          type="button"
          [cdkMenuTriggerFor]="menuUsuario"
          aria-label="Menú de usuario"
          class="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-surface-muted"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary"
          >
            {{ iniciales() }}
          </span>
        </button>
        <ng-template #menuUsuario>
          <div cdkMenu class="w-48 rounded-xl border border-border bg-surface p-1 shadow-lg">
            <a
              cdkMenuItem
              routerLink="/perfil"
              class="flex h-11 cursor-pointer items-center rounded-lg px-3 text-sm outline-none hover:bg-surface-muted"
            >
              Mi cuenta
            </a>
            <button
              cdkMenuItem
              type="button"
              (cdkMenuItemTriggered)="salir()"
              class="flex h-11 w-full cursor-pointer items-center rounded-lg px-3 text-sm outline-none hover:bg-surface-muted"
            >
              Salir
            </button>
          </div>
        </ng-template>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  protected readonly layout = inject(LayoutService);
  protected readonly preferencias = inject(PreferencesService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private static readonly ORDEN_TEMA: Tema[] = ['claro', 'oscuro', 'sistema'];
  private static readonly ETIQUETA_TEMA: Record<Tema, string> = {
    claro: 'claro',
    oscuro: 'oscuro',
    sistema: 'según el sistema',
  };

  protected readonly notificacionesAbiertas = signal(false);

  /**
   * Contador placeholder del badge — el dominio notificaciones (backlog)
   * debe alimentarlo desde su fuente de datos.
   */
  protected readonly pendientes = signal(0);

  protected readonly iniciales = computed(() => {
    const nombre = this.auth.usuario()?.nombre ?? '';
    const partes = nombre.split(' ').filter(Boolean);
    return partes
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join('');
  });

  protected readonly etiquetaTema = computed(
    () => TopbarComponent.ETIQUETA_TEMA[this.preferencias.tema()],
  );

  protected ciclarTema(): void {
    const orden = TopbarComponent.ORDEN_TEMA;
    this.preferencias.fijarTema(
      orden[(orden.indexOf(this.preferencias.tema()) + 1) % orden.length],
    );
  }

  protected alternarNotificaciones(): void {
    this.notificacionesAbiertas.update((abierto) => !abierto);
  }

  protected cerrarNotificaciones(): void {
    this.notificacionesAbiertas.set(false);
  }

  protected salir(): void {
    this.auth.salir();
    this.router.navigate(['/login']);
  }
}
