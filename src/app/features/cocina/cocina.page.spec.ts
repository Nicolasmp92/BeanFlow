import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastService } from '../../core/toast.service';
import CocinaPage from './cocina.page';

const COLA = [
  {
    id: 10,
    comandaId: 3,
    mesaNumero: 2,
    nombreProducto: 'Capuchino',
    cantidad: 1,
    estado: 'pendiente',
    nota: 'sin azúcar',
    creadoEn: '2026-10-05T10:00:00Z',
  },
  {
    id: 11,
    comandaId: 3,
    mesaNumero: null,
    nombreProducto: 'Latte',
    cantidad: 2,
    estado: 'preparando',
    nota: null,
    creadoEn: '2026-10-05T10:02:00Z',
  },
];

describe('CocinaPage', () => {
  let http: HttpTestingController;

  async function crear(): Promise<ComponentFixture<CocinaPage>> {
    await TestBed.configureTestingModule({
      imports: [CocinaPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(CocinaPage);
    fixture.detectChanges();
    http.expectOne('/api/cocina/pendientes').flush(COLA);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => http.verify());

  it('separa la cola en espera y en preparación', async () => {
    const fixture = await crear();
    const page = fixture.componentInstance;

    expect(page['enEspera']().map((linea) => linea.id)).toEqual([10]);
    expect(page['enPreparacion']().map((linea) => linea.id)).toEqual([11]);
  });

  it('indica el origen del pedido, con mesa o para llevar', async () => {
    const fixture = await crear();
    const page = fixture.componentInstance;

    expect(page['origen'](COLA[0] as never)).toBe('Mesa 2 · cuenta #3');
    expect(page['origen'](COLA[1] as never)).toBe('Para llevar · cuenta #3');
  });

  it('avanza una línea y recarga la cola', async () => {
    const fixture = await crear();
    fixture.componentInstance['avanzar'](COLA[0] as never, 'preparando');

    const peticion = http.expectOne('/api/cocina/items/10');
    expect(peticion.request.method).toBe('PATCH');
    expect(peticion.request.body).toEqual({ estado: 'preparando' });
    peticion.flush({ ...COLA[0], estado: 'preparando' });

    // Tras avanzar, el tablero se recarga para reflejar el estado real.
    // `reload()` del httpResource corre con la detección de cambios.
    fixture.detectChanges();
    http.expectOne('/api/cocina/pendientes').flush([]);
  });

  it('muestra el motivo del backend cuando falta insumo', async () => {
    const fixture = await crear();
    const toasts = TestBed.inject(ToastService);
    fixture.componentInstance['avanzar'](COLA[0] as never, 'preparando');

    // 409 = error de dominio: el interceptor lo deja pasar y la página
    // debe mostrar el detalle (qué insumo faltó), no un mensaje genérico.
    http.expectOne('/api/cocina/items/10').flush(
      { detail: 'Stock insuficiente de Leche entera: hay 100 ml' },
      { status: 409, statusText: 'Conflict' },
    );
    fixture.detectChanges();
    http.expectOne('/api/cocina/pendientes').flush(COLA);

    expect(toasts.toasts().at(-1)?.texto).toBe('Stock insuficiente de Leche entera: hay 100 ml');
  });
});
