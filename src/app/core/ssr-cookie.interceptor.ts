import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, REQUEST, inject } from '@angular/core';

/**
 * Reenvía la cookie del request entrante a las llamadas `/api/*` cuando el
 * código corre en el servidor (SSR). Sin esto, cada render por petición sale
 * anónimo aunque el navegador tenga sesión: el guard no vería la sesión y
 * los `httpResource` de las páginas recibirían 401.
 *
 * Solo aplica a URLs del mismo origen — nunca se filtran cookies a terceros.
 */
export const ssrCookieInterceptor: HttpInterceptorFn = (req, next) => {
  if (isPlatformBrowser(inject(PLATFORM_ID))) return next(req);

  const peticion = inject(REQUEST, { optional: true });
  if (!peticion) return next(req);

  const destino = new URL(req.url, peticion.url);
  const origen = new URL(peticion.url);
  if (destino.origin !== origen.origin || !destino.pathname.startsWith('/api/')) {
    return next(req);
  }

  const cookie = peticion.headers.get('cookie') ?? '';
  return next(
    req.clone({
      url: destino.toString(),
      setHeaders: cookie ? { cookie } : {},
    }),
  );
};
