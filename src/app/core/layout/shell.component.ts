import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';
import { NavItem } from '../../shared/models';
import { SidebarComponent } from './sidebar.component';
import { TopbarComponent } from './topbar.component';

/**
 * Marco del área autenticada: sidebar + topbar + contenido.
 */
@Component({
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  selector: 'app-shell',
  template: `
    <div class="flex min-h-screen">
      <app-sidebar [items]="items()" />

      <div class="flex min-w-0 flex-1 flex-col">
        <app-topbar />
        <main class="flex-1 p-4 sm:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export default class ShellComponent {
  private readonly auth = inject(AuthService);

  /**
   * El menú refleja el rol: el garzón no ve la barra, el barista no ve el
   * salón. Es el mismo criterio que aplica el backend — aquí solo se evita
   * ofrecer una pantalla que terminaría en 403.
   */
  protected readonly items = computed<NavItem[]>(() => {
    const rol = this.auth.usuario()?.rol;
    const items: NavItem[] = [{ ruta: '/', etiqueta: 'Panel', icono: 'panel' }];

    if (rol === 'garzon' || rol === 'caja' || rol === 'admin') {
      items.push({ ruta: '/salon', etiqueta: 'Salón', icono: 'mesas' });
    }
    if (rol === 'cocina' || rol === 'admin') {
      items.push({ ruta: '/cocina', etiqueta: 'Barra', icono: 'cocina' });
    }
    if (rol === 'admin') {
      items.push(
        { ruta: '/admin/carta', etiqueta: 'Carta', icono: 'carta' },
        { ruta: '/admin/bodega', etiqueta: 'Bodega', icono: 'bodega' },
        { ruta: '/admin/mesas', etiqueta: 'Mesas', icono: 'mesas' },
        { ruta: '/admin/usuarios', etiqueta: 'Usuarios', icono: 'usuarios' },
      );
    }
    return items;
  });
}
