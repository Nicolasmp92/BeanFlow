import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let servicio: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(ToastService);
  });

  it('agrega un toast con su tipo y texto', () => {
    servicio.exito('Listo.');
    expect(servicio.toasts()).toHaveLength(1);
    expect(servicio.toasts()[0]).toMatchObject({ tipo: 'exito', texto: 'Listo.' });
  });

  it('acumula toasts y los quita por id', () => {
    servicio.exito('Uno.');
    servicio.error('Dos.');
    const segundo = servicio.toasts()[1];

    servicio.quitar(segundo.id);
    expect(servicio.toasts().map((t) => t.texto)).toEqual(['Uno.']);
  });
});
