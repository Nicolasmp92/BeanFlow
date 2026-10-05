import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type Tema = 'claro' | 'oscuro' | 'sistema';
export type Paleta = 'azul' | 'esmeralda' | 'violeta' | 'ambar';

/**
 * Preferencias de apariencia y accesibilidad. Se aplican como clases en
 * `<html>` (`dark`, `texto-grande`, `alto-contraste`, `reduce-motion`) y se
 * persisten en localStorage (el atributo `data-paleta` y las clases `dark`,
 * `texto-grande`, `alto-contraste`, `reduce-motion` en `<html>`) — la persistencia por usuario en BD pertenece
 * al dominio Settings (backlog). El script inline de `index.html` repite la
 * misma lectura antes del primer pintado para evitar el flash de tema.
 */
@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  private static readonly CLAVE_TEMA = 'beanflow.tema';
  private static readonly CLAVE_PALETA = 'beanflow.paleta';
  private static readonly CLAVE_TEXTO = 'beanflow.texto-grande';
  private static readonly CLAVE_CONTRASTE = 'beanflow.alto-contraste';
  private static readonly CLAVE_MOVIMIENTO = 'beanflow.reducir-animaciones';

  readonly tema = signal<Tema>('sistema');
  readonly paleta = signal<Paleta>('azul');
  readonly textoGrande = signal(false);
  readonly altoContraste = signal(false);
  readonly reducirAnimaciones = signal(false);

  /** `matchMedia` puede no existir (tests jsdom); en ese caso `sistema` = claro. */
  private readonly mediaOscuro =
    this.esNavegador && typeof matchMedia === 'function'
      ? matchMedia('(prefers-color-scheme: dark)')
      : null;

  constructor() {
    if (!this.esNavegador) return;

    const tema = localStorage.getItem(PreferencesService.CLAVE_TEMA);
    if (tema === 'claro' || tema === 'oscuro' || tema === 'sistema') {
      this.tema.set(tema);
    }
    const paleta = localStorage.getItem(PreferencesService.CLAVE_PALETA);
    if (paleta === 'azul' || paleta === 'esmeralda' || paleta === 'violeta' || paleta === 'ambar') {
      this.paleta.set(paleta);
    }
    this.textoGrande.set(localStorage.getItem(PreferencesService.CLAVE_TEXTO) === '1');
    this.altoContraste.set(localStorage.getItem(PreferencesService.CLAVE_CONTRASTE) === '1');
    this.reducirAnimaciones.set(localStorage.getItem(PreferencesService.CLAVE_MOVIMIENTO) === '1');

    this.mediaOscuro?.addEventListener('change', () => this.aplicar());
    this.aplicar();
  }

  fijarTema(tema: Tema): void {
    this.tema.set(tema);
    localStorage.setItem(PreferencesService.CLAVE_TEMA, tema);
    this.aplicar();
  }

  fijarPaleta(paleta: Paleta): void {
    this.paleta.set(paleta);
    localStorage.setItem(PreferencesService.CLAVE_PALETA, paleta);
    this.aplicar();
  }

  fijarTextoGrande(activo: boolean): void {
    this.textoGrande.set(activo);
    this.persistir(PreferencesService.CLAVE_TEXTO, activo);
  }

  fijarAltoContraste(activo: boolean): void {
    this.altoContraste.set(activo);
    this.persistir(PreferencesService.CLAVE_CONTRASTE, activo);
  }

  fijarReducirAnimaciones(activo: boolean): void {
    this.reducirAnimaciones.set(activo);
    this.persistir(PreferencesService.CLAVE_MOVIMIENTO, activo);
  }

  private persistir(clave: string, activo: boolean): void {
    localStorage.setItem(clave, activo ? '1' : '0');
    this.aplicar();
  }

  private aplicar(): void {
    const oscuro =
      this.tema() === 'oscuro' || (this.tema() === 'sistema' && !!this.mediaOscuro?.matches);
    const raiz = document.documentElement;
    raiz.dataset['paleta'] = this.paleta();
    raiz.classList.toggle('dark', oscuro);
    raiz.classList.toggle('texto-grande', this.textoGrande());
    raiz.classList.toggle('alto-contraste', this.altoContraste());
    raiz.classList.toggle('reduce-motion', this.reducirAnimaciones());
  }
}
