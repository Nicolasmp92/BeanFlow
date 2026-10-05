import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavItem } from '../../shared/models';
import { LayoutService } from './layout.service';
import { TooltipDirective } from './tooltip.directive';

/**
 * Barra lateral del shell — recreación Angular del sidebar de la v1.
 * Un solo componente, dos modos:
 *  - Escritorio (≥1024px): rail de 280px | 84px | colapsado con
 *    transición animada; `hidden` se mantiene en DOM (inert) para que
 *    la transición pueda correr.
 *  - Móvil/tablet (<1024px): overlay fijo con backdrop, Escape y
 *    animación de entrada.
 * Los items llegan por `input()` — cada proyecto define su menú sin
 * tocar el mecanismo.
 */
@Component({
  imports: [RouterLink, RouterLinkActive, TooltipDirective],
  selector: 'app-sidebar',
  host: { '(window:keydown.escape)': 'layout.cerrarMovil()' },
  template: `
    @if (visible()) {
      @if (layout.esMovil()) {
        <button
          type="button"
          aria-label="Cerrar menú"
          (click)="layout.cerrarMovil()"
          class="fixed inset-0 z-40 bg-black/40"
        ></button>
      }
      <aside
        [class]="clases()"
        [attr.inert]="oculto() ? '' : null"
        [attr.aria-hidden]="oculto() ? true : null"
      >
        <div
          class="flex h-14 items-center gap-2 border-b border-border px-4"
          [class.justify-center]="compacto()"
        >
          <a
            routerLink="/"
            (click)="layout.cerrarMovil()"
            aria-label="Inicio"
            class="flex items-center gap-2 text-lg font-semibold text-primary"
          >
            <!-- Marca placeholder: sustituir por el logo del proyecto. -->
            <svg
              class="h-6 w-6 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
              />
              <path d="M3.27 6.96 12 12.01l8.73-5.05" />
              <path d="M12 22.08V12" />
            </svg>
            <span
              class="truncate whitespace-nowrap transition-all duration-200 motion-reduce:transition-none"
              [class]="compacto() ? 'w-0 opacity-0' : 'opacity-100'"
            >
              BeanFlow
            </span>
          </a>
        </div>

        <nav class="flex-1 space-y-1 overflow-y-auto p-2" aria-label="Navegación principal">
          @for (item of items(); track item.ruta) {
            <a
              [routerLink]="item.ruta"
              routerLinkActive="bg-primary-soft text-primary"
              [routerLinkActiveOptions]="{ exact: item.ruta === '/' }"
              [appTooltip]="compacto() ? item.etiqueta : ''"
              (click)="layout.cerrarMovil()"
              class="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-text-muted hover:bg-surface-muted"
              [class.justify-center]="compacto()"
              [class.gap-0]="compacto()"
            >
              <svg
                class="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                @switch (item.icono) {
                  @case ('panel') {
                    <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                    <path d="M9 22V12h6v10" />
                  }
                  @case ('lista') {
                    <path d="M8 6h13M8 12h13M8 18h13" />
                    <path d="M3 6h.01M3 12h.01M3 18h.01" />
                  }
                  @case ('usuarios') {
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  }
                  @case ('mesas') {
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  }
                  @case ('cocina') {
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" />
                    <path d="M6 1v3M10 1v3M14 1v3" />
                  }
                  @case ('carta') {
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  }
                  @case ('bodega') {
                    <path d="m7.5 4.27 9 5.15" />
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  }
                }
              </svg>
              <span
                class="truncate whitespace-nowrap transition-all duration-200 motion-reduce:transition-none"
                [class]="compacto() ? 'w-0 opacity-0' : 'opacity-100'"
              >
                {{ item.etiqueta }}
              </span>
            </a>
          }
        </nav>

        <div class="border-t border-border p-2">
          <a
            routerLink="/perfil"
            routerLinkActive="bg-primary-soft"
            aria-label="Mi cuenta"
            [appTooltip]="compacto() ? 'Mi cuenta' : ''"
            (click)="layout.cerrarMovil()"
            class="flex items-center gap-2 overflow-hidden rounded-lg px-2 whitespace-nowrap hover:bg-surface-muted"
            [class]="compacto() ? 'h-11 justify-center' : 'py-2'"
          >
            @if (!compacto()) {
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium">{{ auth.usuario()?.nombre }}</p>
                <p class="truncate text-xs text-text-muted">{{ auth.usuario()?.correo }}</p>
              </div>
            }
            <svg
              class="h-5 w-5 shrink-0 text-text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              @if (compacto()) {
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              } @else {
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
              }
            </svg>
          </a>
          <button
            type="button"
            (click)="salir()"
            [appTooltip]="compacto() ? 'Salir' : ''"
            class="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-text-muted hover:bg-surface-muted"
            [class.justify-center]="compacto()"
            [class.gap-0]="compacto()"
          >
            <svg
              class="h-5 w-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            <span
              class="whitespace-nowrap transition-all duration-200 motion-reduce:transition-none"
              [class]="compacto() ? 'w-0 opacity-0' : 'opacity-100'"
            >
              Salir
            </span>
          </button>
        </div>
      </aside>
    }
  `,
})
export class SidebarComponent {
  protected readonly layout = inject(LayoutService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly items = input.required<NavItem[]>();

  /** Compacto solo aplica en escritorio; en móvil el overlay va completo. */
  protected readonly compacto = computed(
    () => !this.layout.esMovil() && this.layout.estado() === 'compact',
  );

  /** En escritorio `hidden` queda renderizado (inert) para animar el cierre. */
  protected readonly oculto = computed(
    () => !this.layout.esMovil() && this.layout.estado() === 'hidden',
  );

  protected readonly visible = computed(() =>
    this.layout.esMovil() ? this.layout.movilAbierto() : true,
  );

  /**
   * 280px expandida / 84px compacta / colapsada animada — mismas medidas
   * que la v1 (w-70 = 280px, w-21 = 84px en la escala dinámica de Tailwind 4).
   * Las transiciones esperan a `layout.listo()` para no animar el estado
   * persistido al cargar la página.
   */
  protected readonly clases = computed(() => {
    const base = 'flex flex-col overflow-hidden border-e border-border bg-surface';
    const transicion = this.layout.listo()
      ? ' transition-[width,opacity] duration-300 ease-in-out motion-reduce:transition-none'
      : '';
    if (this.layout.esMovil()) {
      return `${base} animate-slide-in fixed inset-y-0 left-0 z-50 w-70 shadow-xl`;
    }
    // En escritorio el rail queda clavado al viewport (sticky, altura de
    // pantalla) como el fixed de la v1: el contenido scrollea aparte y
    // el nav interno lleva su propio overflow-y.
    const rail = `${base}${transicion} sticky top-0 h-svh self-start`;
    if (this.oculto()) {
      return `${rail} w-0 min-w-0 shrink-0 border-e-0 opacity-0 pointer-events-none`;
    }
    return this.compacto() ? `${rail} w-21 shrink-0` : `${rail} w-70 shrink-0`;
  });

  protected salir(): void {
    this.auth.salir();
    this.layout.cerrarMovil();
    this.router.navigate(['/login']);
  }
}
