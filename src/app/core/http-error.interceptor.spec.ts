import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { httpErrorInterceptor } from './http-error.interceptor';
import { ToastService } from './toast.service';

describe('httpErrorInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let toasts: ToastService;
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { navigate: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    toasts = TestBed.inject(ToastService);
  });

  afterEach(() => ctrl.verify());

  it('avisa con toast ante errores 5xx', () => {
    http.get('/api/cualquier').subscribe({ error: () => undefined });
    ctrl.expectOne('/api/cualquier').flush('mal', { status: 500, statusText: 'Error' });
    expect(toasts.toasts()).toHaveLength(1);
    expect(toasts.toasts()[0].tipo).toBe('error');
  });

  it('ignora errores de dominio (409) que maneja el feature', () => {
    http.get('/api/cualquier').subscribe({ error: () => undefined });
    ctrl.expectOne('/api/cualquier').flush('conflicto', { status: 409, statusText: 'Conflict' });
    expect(toasts.toasts()).toHaveLength(0);
  });

  it('401 con sesión activa la cierra, avisa y redirige a login', () => {
    const auth = TestBed.inject(AuthService);
    ctrl.expectOne('/api/auth/me').flush({ correo: 'a@beanflow.dev', nombre: 'A', rol: 'admin' });
    expect(auth.autenticado()).toBe(true);

    http.get('/api/cualquier').subscribe({ error: () => undefined });
    ctrl.expectOne('/api/cualquier').flush('vencido', { status: 401, statusText: 'Unauthorized' });

    expect(auth.autenticado()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(toasts.toasts()[0].texto).toContain('sesión expiró');

    // salir() dispara el logout; su 401 no reentra (autenticado() ya es false).
    ctrl.expectOne('/api/auth/logout').flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(toasts.toasts()).toHaveLength(1);
  });

  it('401 sin sesión activa no hace nada (lo maneja el login)', () => {
    const auth = TestBed.inject(AuthService);
    ctrl.expectOne('/api/auth/me').flush('anónimo', { status: 401, statusText: 'Unauthorized' });
    expect(auth.autenticado()).toBe(false);

    http.get('/api/cualquier').subscribe({ error: () => undefined });
    ctrl.expectOne('/api/cualquier').flush('no', { status: 401, statusText: 'Unauthorized' });

    expect(toasts.toasts()).toHaveLength(0);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
