import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../core/auth.service';
import PerfilPage from './perfil.page';

describe('PerfilPage', () => {
  let http: HttpTestingController;

  async function crear(): Promise<ComponentFixture<PerfilPage>> {
    await TestBed.configureTestingModule({
      imports: [PerfilPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    // AuthService dispara /api/auth/me al inyectarse; se resuelve antes de
    // crear la página para que el formulario herede los datos de sesión.
    TestBed.inject(AuthService);
    http.expectOne('/api/auth/me').flush({ correo: 'ana@beanflow.dev', nombre: 'Ana', rol: 'user' });

    const fixture = TestBed.createComponent(PerfilPage);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => http.verify());

  it('precarga nombre y correo del usuario en sesión', async () => {
    const fixture = await crear();
    expect(fixture.componentInstance['formPerfil'].getRawValue()).toEqual({
      nombre: 'Ana',
      correo: 'ana@beanflow.dev',
    });
  });

  it('guarda el perfil y refleja la sesión devuelta por la API', async () => {
    const fixture = await crear();
    const page = fixture.componentInstance;
    page['formPerfil'].setValue({ nombre: 'Ana Paz', correo: 'ana.paz@beanflow.dev' });

    page['guardarPerfil']();

    const req = http.expectOne('/api/perfil');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ nombre: 'Ana Paz', correo: 'ana.paz@beanflow.dev' });
    req.flush({ correo: 'ana.paz@beanflow.dev', nombre: 'Ana Paz', rol: 'user' });

    expect(TestBed.inject(AuthService).usuario()?.correo).toBe('ana.paz@beanflow.dev');
  });

  it('rechaza claves nuevas que no coinciden sin llamar a la API', async () => {
    const fixture = await crear();
    const page = fixture.componentInstance;
    page['formClave'].setValue({
      claveActual: 'vieja-clave',
      claveNueva: 'nueva-clave-1',
      claveRepetida: 'nueva-clave-2',
    });

    page['guardarClave']();

    http.expectNone('/api/perfil/clave');
    expect(page['errorClave']()).toBe('Las claves nuevas no coinciden.');
  });
});
