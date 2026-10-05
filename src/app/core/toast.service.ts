import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Toast {
  readonly id: number;
  readonly tipo: 'exito' | 'error' | 'info';
  readonly texto: string;
}

const DURACION_MS = 4000;

/**
 * Avisos efímeros para feedback global del sistema (éxito de operaciones,
 * errores de red, sesión expirada). Los errores de dominio por formulario
 * siguen mostrándose inline junto al campo — ver httpErrorInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private contador = 0;
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  exito(texto: string): void {
    this.agregar(texto, 'exito');
  }

  error(texto: string): void {
    this.agregar(texto, 'error');
  }

  info(texto: string): void {
    this.agregar(texto, 'info');
  }

  quitar(id: number): void {
    this.toasts.update((lista) => lista.filter((t) => t.id !== id));
  }

  private agregar(texto: string, tipo: Toast['tipo']): void {
    const id = ++this.contador;
    this.toasts.update((lista) => [...lista, { id, tipo, texto }]);
    if (this.esNavegador) {
      setTimeout(() => this.quitar(id), DURACION_MS);
    }
  }
}
