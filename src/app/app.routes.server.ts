import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Las rutas con parámetros no se pueden prerenderizar: el set de IDs no
    // se conoce en build (y cambia en cada turno). Se renderizan por petición.
    path: 'cuenta/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
