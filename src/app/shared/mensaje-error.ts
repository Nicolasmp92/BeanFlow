import { HttpErrorResponse } from '@angular/common/http';

/**
 * Traduce un error HTTP al mensaje que el backend ya redactó.
 *
 * La API responde RFC 7807, así que `detail` trae la razón de negocio
 * ("Stock insuficiente de Leche entera: hay 100 ml"). Mostrarla es mejor que
 * un genérico: el usuario sabe qué pasó y qué hacer. El respaldo se usa
 * cuando el error no viene del dominio (red caída, 500).
 */
export function mensajeError(error: unknown, respaldo: string): string {
  if (error instanceof HttpErrorResponse) {
    const cuerpo: unknown = error.error;
    if (cuerpo && typeof cuerpo === 'object' && 'detail' in cuerpo) {
      const detalle = (cuerpo as { detail?: unknown }).detail;
      if (typeof detalle === 'string' && detalle.trim() !== '') return detalle;
    }
  }
  return respaldo;
}
