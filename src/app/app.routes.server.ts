import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'login',
    renderMode: RenderMode.Prerender,
  },
  {
    // El shell exige sesión: se renderiza por petición, no se prerenderiza.
    // Cubre también las rutas con parámetros (`cuenta/:id`).
    path: '**',
    renderMode: RenderMode.Server,
  },
];
