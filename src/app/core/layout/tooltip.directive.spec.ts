import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TooltipDirective } from './tooltip.directive';

@Component({
  imports: [TooltipDirective],
  template: `<button type="button" [appTooltip]="texto">botón</button>`,
})
class HostComponent {
  texto = 'Etiqueta de prueba';
}

describe('TooltipDirective', () => {
  const contenedor = () => document.querySelector('.cdk-overlay-container');

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((c) => c.remove());
  });

  it('muestra el texto al pasar el mouse y lo quita al salir', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    boton.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(contenedor()?.textContent).toContain('Etiqueta de prueba');

    boton.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    expect(contenedor()?.textContent ?? '').not.toContain('Etiqueta de prueba');
  });

  it('no crea overlay si el texto está vacío', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.texto = '';
    fixture.detectChanges();
    const boton: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    boton.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(contenedor()?.querySelector('[role="tooltip"]') ?? null).toBeNull();
  });
});
