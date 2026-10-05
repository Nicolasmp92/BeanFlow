import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { Sesion } from '../shared/models';

export type ResultadoLogin = 'ok' | 'credenciales' | 'error';

/**
 * Autenticación del kit. La sesión web vive en una cookie httpOnly emitida
 * por el backend (`docs/backend.md`); los clientes móviles usan el campo
 * `token` de la respuesta como Bearer.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  readonly autenticado = signal(false);
  readonly usuario = signal<Sesion | null>(null);

  /**
   * `/api/auth/me` compartido: se dispara una sola vez al crear el servicio
   * y el guard lo reutiliza para esperar la sesión en recargas directas.
   * En SSR el `ssrCookieInterceptor` reenvía la cookie del request entrante,
   * así el guard también ve la sesión al renderizar por petición.
   */
  private readonly sesionInicial$: Observable<Sesion | null> = this.http
    .get<Sesion>('/api/auth/me')
    .pipe(
      map((sesion) => {
        this.autenticado.set(true);
        this.usuario.set(sesion);
        return sesion;
      }),
      catchError(() => of(null)),
      shareReplay(1),
    );

  constructor() {
    this.sesionInicial$.subscribe();
  }

  /** Resuelve `true` cuando la sesión quedó confirmada. */
  esperarSesion(): Observable<boolean> {
    if (this.autenticado()) return of(true);
    return this.sesionInicial$.pipe(map(() => this.autenticado()));
  }

  /** Refleja en la sesión local una respuesta fresca de `/api/perfil`. */
  actualizarSesion(sesion: Sesion): void {
    this.usuario.set(sesion);
  }

  ingresar(correo: string, clave: string): Observable<ResultadoLogin> {
    return this.http.post<Sesion>('/api/auth/login', { correo, clave }).pipe(
      map((sesion) => {
        this.autenticado.set(true);
        this.usuario.set(sesion);
        return 'ok' as const;
      }),
      catchError((error: HttpErrorResponse) =>
        of(error.status === 401 ? ('credenciales' as const) : ('error' as const)),
      ),
    );
  }

  salir(): void {
    this.autenticado.set(false);
    this.usuario.set(null);
    if (this.esNavegador) {
      this.http
        .post('/api/auth/logout', {})
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
  }
}
