import { isPlatformBrowser } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';

export type EstadoSidebar = 'expanded' | 'compact' | 'hidden';

/**
 * Estado de navegación del shell. Recrea el comportamiento de la v1
 * (Alpine `ui` store) con signals: 3 estados en escritorio ciclando
 * expanded → compact → hidden, overlay aparte en móvil y persistencia
 * en localStorage. La persistencia por usuario en BD pertenece al
 * dominio Settings, fuera del MVP — cuando exista, este servicio es
 * el punto donde conectarla.
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  private static readonly CLAVE = 'beanflow.sidebar';
  private static readonly ORDEN: EstadoSidebar[] = ['expanded', 'compact', 'hidden'];

  /** Estado del sidebar en escritorio (persistido). */
  readonly estado = signal<EstadoSidebar>('expanded');
  /** Sidebar como overlay bajo 1024 px (tablet incluida, como la v1). */
  readonly movilAbierto = signal(false);
  readonly esMovil = signal(false);
  /**
   * Antiflash: las transiciones del sidebar se habilitan recién tras el
   * primer render, para que un estado persistido no anime la barra al
   * cargar (equivalente al `body.sidebar-ready` de la v1).
   */
  readonly listo = signal(false);

  constructor() {
    if (!this.esNavegador) return;

    const guardado = localStorage.getItem(LayoutService.CLAVE);
    if (guardado === 'expanded' || guardado === 'compact' || guardado === 'hidden') {
      this.estado.set(guardado);
    }

    inject(BreakpointObserver)
      .observe('(max-width: 1023.98px)')
      .subscribe((resultado) => this.esMovil.set(resultado.matches));

    afterNextRender(() => this.listo.set(true));
  }

  /** Cicla expanded → compact → hidden y persiste la elección. */
  ciclar(): void {
    const orden = LayoutService.ORDEN;
    this.fijarEstado(orden[(orden.indexOf(this.estado()) + 1) % orden.length]);
  }

  /** Fija el estado del sidebar desde la pantalla de preferencias. */
  fijarEstado(estado: EstadoSidebar): void {
    this.estado.set(estado);
    localStorage.setItem(LayoutService.CLAVE, estado);
  }

  alternarMovil(): void {
    this.movilAbierto.update((abierto) => !abierto);
  }

  cerrarMovil(): void {
    this.movilAbierto.set(false);
  }
}
