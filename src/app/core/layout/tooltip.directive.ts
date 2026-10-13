import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, OnDestroy, PLATFORM_ID, inject, input } from '@angular/core';

/**
 * Tooltip mínimo sobre CDK Overlay — equivalente Angular del sistema
 * tooltip.js de la v1 (Popper portaleado a <body>). El contenido vive
 * en el overlay container global, así nunca queda recortado por el
 * overflow del sidebar. Si el texto está vacío no se muestra.
 *
 * Uso: [appTooltip]="compacto() ? item.etiqueta : ''"
 */
@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseenter)': 'mostrar()',
    '(mouseleave)': 'ocultar()',
    '(focusin)': 'mostrar()',
    '(focusout)': 'ocultar()',
    '(window:keydown.escape)': 'ocultar()',
  },
})
export class TooltipDirective implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  readonly texto = input('', { alias: 'appTooltip' });

  private ref: OverlayRef | null = null;
  private nodo: HTMLElement | null = null;

  protected mostrar(): void {
    const texto = this.texto();
    if (!texto || !this.esNavegador || this.ref) return;

    const posicion = this.overlay
      .position()
      .flexibleConnectedTo(this.host)
      .withPositions([
        {
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: 10,
        },
      ]);

    this.ref = this.overlay.create({ positionStrategy: posicion });

    const el = document.createElement('div');
    el.textContent = texto;
    el.setAttribute('role', 'tooltip');
    el.className = 'rounded-md bg-text px-2 py-1 text-xs whitespace-nowrap text-surface shadow-lg';
    // DomPortal mueve un nodo EXISTENTE (deja un ancla para devolverlo al
    // desmontar): sin parentNode lanza "DOM portal content must be attached
    // to a parent node". Se ancla a body y ocultar() lo retira.
    document.body.appendChild(el);
    this.nodo = el;
    this.ref.attach(new DomPortal(el));
  }

  protected ocultar(): void {
    this.ref?.dispose();
    this.ref = null;
    this.nodo?.remove();
    this.nodo = null;
  }

  ngOnDestroy(): void {
    this.ocultar();
  }
}
