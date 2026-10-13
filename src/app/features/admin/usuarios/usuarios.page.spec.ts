import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../../core/auth.service';
import UsuariosPage from './usuarios.page';

const LISTA = [
  { id: 1, correo: 'admin@beanflow.dev', nombre: 'Administrador', rol: 'admin', activo: true },
  { id: 2, correo: 'berta@beanflow.dev', nombre: 'Berta Sol', rol: 'user', activo: true },
  { id: 3, correo: 'carlos@beanflow.dev', nombre: 'Carlos Rio', rol: 'user', activo: false },
];

describe('UsuariosPage', () => {
  let http: HttpTestingController;

  async function crear(): Promise<ComponentFixture<UsuariosPage>> {
    await TestBed.configureTestingModule({
      imports: [UsuariosPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    TestBed.inject(AuthService);
    http
      .expectOne('/api/auth/me')
      .flush({ correo: 'admin@beanflow.dev', nombre: 'Administrador', rol: 'admin' });

    const fixture = TestBed.createComponent(UsuariosPage);
    fixture.detectChanges();
    http.expectOne('/api/admin/usuarios').flush(LISTA);
    return fixture;
  }

  afterEach(() => http.verify());

  it('ordena la lista alfabéticamente y filtra por nombre o correo', async () => {
    const fixture = await crear();
    const page = fixture.componentInstance;
    expect(page['filtrados']().map((u) => u.nombre)).toEqual([
      'Administrador',
      'Berta Sol',
      'Carlos Rio',
    ]);

    page['busqueda'].set('berta');
    expect(page['filtrados']().map((u) => u.correo)).toEqual(['berta@beanflow.dev']);
  });

  it('edita un usuario: precarga el formulario y envía PUT sin clave', async () => {
    const fixture = await crear();
    const page = fixture.componentInstance;

    page['editar'](LISTA[1]);
    expect(page['formulario'].getRawValue()).toEqual({
      nombre: 'Berta Sol',
      correo: 'berta@beanflow.dev',
      clave: '',
      rol: 'user',
    });

    page['formulario'].patchValue({ nombre: 'Berta Solana' });
    page['guardar']();

    const req = http.expectOne('/api/admin/usuarios/2');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      nombre: 'Berta Solana',
      correo: 'berta@beanflow.dev',
      clave: '',
      rol: 'user',
    });
    req.flush({});
    // El reload() del httpResource dispara el GET en el siguiente ciclo de efectos.
    fixture.detectChanges();
    http.expectOne('/api/admin/usuarios').flush(LISTA);
  });

  it('exige clave al crear un usuario nuevo', async () => {
    const fixture = await crear();
    const page = fixture.componentInstance;

    page['nuevo']();
    page['formulario'].setValue({
      nombre: 'Nuevo',
      correo: 'nuevo@beanflow.dev',
      clave: '',
      rol: 'user',
    });
    page['guardar']();

    http.expectNone((req) => req.method === 'POST' && req.url === '/api/admin/usuarios');
    expect(page['error']()).toBe('La clave es obligatoria al crear.');
  });
});
