import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Ingresar — BeanFlow',
    loadComponent: () => import('./features/login/login.page'),
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/shell.component'),
    canMatch: [authGuard],
    children: [
      {
        path: '',
        title: 'Panel — BeanFlow',
        loadComponent: () => import('./features/dashboard/dashboard.page'),
      },
      {
        path: 'salon',
        title: 'Salón — BeanFlow',
        loadComponent: () => import('./features/salon/salon.page'),
      },
      {
        // `id` llega al componente por `input()` (withComponentInputBinding).
        path: 'cuenta/:id',
        title: 'Cuenta — BeanFlow',
        loadComponent: () => import('./features/salon/cuenta.page'),
      },
      {
        path: 'cocina',
        title: 'Barra — BeanFlow',
        loadComponent: () => import('./features/cocina/cocina.page'),
      },
      {
        path: 'admin/carta',
        title: 'Carta — BeanFlow',
        loadComponent: () => import('./features/admin/carta/carta-admin.page'),
      },
      {
        path: 'admin/bodega',
        title: 'Bodega — BeanFlow',
        loadComponent: () => import('./features/admin/bodega/bodega.page'),
      },
      {
        path: 'admin/mesas',
        title: 'Mesas — BeanFlow',
        loadComponent: () => import('./features/admin/mesas/mesas.page'),
      },
      {
        path: 'admin/usuarios',
        title: 'Usuarios — BeanFlow',
        loadComponent: () => import('./features/admin/usuarios/usuarios.page'),
      },
      {
        path: 'perfil',
        title: 'Mi cuenta — BeanFlow',
        loadComponent: () => import('./features/perfil/perfil.page'),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
