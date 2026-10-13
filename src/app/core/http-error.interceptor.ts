import { isPlatformBrowser } from '@angular/common';
import { Injector, PLATFORM_ID, inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

/**
 * Manejo global de errores HTTP. Regla del kit:
 * - Errores de sistema (sin conexión, 5xx, sesión expirada) → toast + acción
 *   aquí; la página recibe además el error re-lanzado.
 * - Errores de dominio (400, 401 de credenciales, 409) → silencio aquí; los
 *   maneja cada feature junto al formulario o la lista.
 *
 * En SSR este interceptor no actúa: las redirecciones de sesión las decide
 * el guard, y un 401 durante el render por petición no debe gatillar
 * logout ni navegación del lado del servidor.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return next(req);

  const toasts = inject(ToastService);
  const injector = inject(Injector);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0 || error.status >= 500) {
        toasts.error('Sin conexión con el servidor. Intenta de nuevo.');
      } else if (error.status === 401 && !req.url.startsWith('/api/auth/')) {
        // Token vencido o usuario eliminado: la sesión ya no es válida.
        // `/api/auth/*` se excluye: login lo maneja la página, `/me` es el
        // bootstrap (401 = anónimo) y el logout no debe reentrar.
        // Resolución perezosa: `/me` se emite dentro del constructor de
        // AuthService — inyectarlo eager sería una dependencia circular.
        const auth = injector.get(AuthService);
        if (auth.autenticado()) {
          auth.salir();
          toasts.error('Tu sesión expiró. Ingresa de nuevo.');
          void router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    }),
  );
};
