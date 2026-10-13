import { TestBed } from '@angular/core/testing';
import { PreferencesService } from './preferences.service';

describe('PreferencesService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    delete document.documentElement.dataset['paleta'];
  });

  function crear(): PreferencesService {
    return TestBed.inject(PreferencesService);
  }

  it('aplica el tema oscuro a <html> y lo persiste', () => {
    const preferencias = crear();
    preferencias.fijarTema('oscuro');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('beanflow.tema')).toBe('oscuro');
  });

  it('quita la clase dark al volver a claro', () => {
    const preferencias = crear();
    preferencias.fijarTema('oscuro');
    preferencias.fijarTema('claro');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('restaura las preferencias guardadas al iniciar', () => {
    localStorage.setItem('beanflow.tema', 'oscuro');
    localStorage.setItem('beanflow.texto-grande', '1');
    crear();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('texto-grande')).toBe(true);
  });

  it('aplica la paleta como data-paleta en <html> y la persiste', () => {
    const preferencias = crear();
    preferencias.fijarPaleta('esmeralda');
    expect(document.documentElement.dataset['paleta']).toBe('esmeralda');
    expect(localStorage.getItem('beanflow.paleta')).toBe('esmeralda');
  });

  it('restaura la paleta guardada al iniciar', () => {
    localStorage.setItem('beanflow.paleta', 'violeta');
    crear();
    expect(document.documentElement.dataset['paleta']).toBe('violeta');
  });

  it('activa las opciones de accesibilidad como clases y las persiste', () => {
    const preferencias = crear();
    preferencias.fijarAltoContraste(true);
    preferencias.fijarReducirAnimaciones(true);
    expect(document.documentElement.classList.contains('alto-contraste')).toBe(true);
    expect(document.documentElement.classList.contains('reduce-motion')).toBe(true);
    expect(localStorage.getItem('beanflow.alto-contraste')).toBe('1');
    expect(localStorage.getItem('beanflow.reducir-animaciones')).toBe('1');
  });
});
