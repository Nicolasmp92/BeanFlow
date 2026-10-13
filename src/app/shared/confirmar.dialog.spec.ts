import { Dialog } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { confirmar } from './confirmar.dialog';

describe('confirmar (diálogo compartido)', () => {
  let dialog: Dialog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    dialog = TestBed.inject(Dialog);
  });

  it('devuelve true al confirmar y false al cancelar', async () => {
    const decision = firstValueFrom(
      confirmar(dialog, { titulo: 'Prueba', mensaje: '¿Seguro?', peligroso: true }),
    );

    // El diálogo se abre en el overlay container del DOM.
    await Promise.resolve();
    const panel = document.querySelector('.cdk-overlay-container .dialogo');
    expect(panel).not.toBeNull();
    const botones = panel!.querySelectorAll('button');
    expect(botones.length).toBe(3); // ×, Cancelar, Confirmar
    (botones[2] as HTMLButtonElement).click(); // Confirmar
    expect(await decision).toBe(true);

    const decisionX = firstValueFrom(
      confirmar(dialog, { titulo: 'Prueba', mensaje: '¿Seguro?' }),
    );
    await Promise.resolve();
    const panelX = document.querySelector('.cdk-overlay-container .dialogo');
    (panelX!.querySelector('button') as HTMLButtonElement).click(); // ×
    expect(await decisionX).toBe(false);
  });
});
