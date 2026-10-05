import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../auth.service';
import { PreferencesService } from '../preferences.service';
import { TopbarComponent } from './topbar.component';

describe('TopbarComponent', () => {
  let http: HttpTestingController;

  async function crear(): Promise<ComponentFixture<TopbarComponent>> {
    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    TestBed.inject(AuthService);
    http.expectOne('/api/auth/me').flush({
      correo: 'ana.paz@beanflow.dev',
      nombre: 'Ana Paz',
      rol: 'user',
    });

    const fixture = TestBed.createComponent(TopbarComponent);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => {
    http.verify();
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('muestra las iniciales del usuario en el avatar', async () => {
    const fixture = await crear();
    expect(fixture.componentInstance['iniciales']()).toBe('AP');
  });

  it('cicla el tema claro → oscuro → sistema', async () => {
    const fixture = await crear();
    const preferencias = TestBed.inject(PreferencesService);
    preferencias.fijarTema('claro');

    fixture.componentInstance['ciclarTema']();
    expect(preferencias.tema()).toBe('oscuro');

    fixture.componentInstance['ciclarTema']();
    expect(preferencias.tema()).toBe('sistema');
  });

  it('abre y cierra el panel de notificaciones', async () => {
    const fixture = await crear();
    const componente = fixture.componentInstance;
    componente['alternarNotificaciones']();
    expect(componente['notificacionesAbiertas']()).toBe(true);
    componente['cerrarNotificaciones']();
    expect(componente['notificacionesAbiertas']()).toBe(false);
  });
});
