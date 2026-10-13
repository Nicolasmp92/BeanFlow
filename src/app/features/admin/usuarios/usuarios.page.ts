import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { ToastService } from '../../../core/toast.service';
import { TooltipDirective } from '../../../core/layout/tooltip.directive';
import { confirmar } from '../../../shared/confirmar.dialog';
import { DialogoXComponent } from '../../../shared/dialogo-x.component';
import { Usuario } from '../../../shared/models';

/**
 * Gestión de usuarios: alta, edición, cambio de rol/estado y baja.
 * La fila propia no muestra acciones: editarse aquí podría romper la sesión
 * (el correo es el `sub` del JWT) o degradar el propio rol — la autogestión
 * vive en /perfil.
 */
@Component({
  imports: [DialogoXComponent, ReactiveFormsModule, TooltipDirective],
  selector: 'app-usuarios',
  template: `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold">Usuarios</h1>
      <button
        type="button"
        (click)="nuevo()"
        class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-surface hover:bg-primary-hover sm:h-9"
      >
        Nuevo usuario
      </button>
    </div>

    <label class="mt-4 block">
      <span class="sr-only">Buscar usuario</span>
      <input
        type="search"
        [value]="busqueda()"
        (input)="busqueda.set($any($event.target).value)"
        placeholder="Buscar por nombre o correo…"
        class="h-11 w-full rounded-lg border border-border bg-surface px-3 outline-none focus:border-primary sm:max-w-xs"
      />
    </label>

    <!-- Formulario en modal: no desplaza la lista. -->
    <ng-template #dialogoUsuario>
      <form [formGroup]="formulario" (ngSubmit)="guardar()" class="dialogo">
        <app-dialogo-x (cerrar)="cerrarDialogo()" />
        <h2 class="pr-8 text-sm font-medium">
          {{ editando()?.id === 0 ? 'Nuevo usuario' : 'Editar usuario' }}
        </h2>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            formControlName="nombre"
            placeholder="Nombre"
            class="h-11 rounded-lg border border-border px-3 outline-none focus:border-primary"
          />
          <input
            formControlName="correo"
            type="email"
            placeholder="Correo"
            class="h-11 rounded-lg border border-border px-3 outline-none focus:border-primary"
          />
          <input
            formControlName="clave"
            type="password"
            [placeholder]="editando()?.id === 0 ? 'Clave' : 'Nueva clave (opcional)'"
            autocomplete="new-password"
            class="h-11 rounded-lg border border-border px-3 outline-none focus:border-primary"
          />
          <select
            formControlName="rol"
            class="h-11 rounded-lg border border-border bg-surface px-3 outline-none focus:border-primary"
          >
            <option value="garzon">Garzón</option>
            <option value="cocina">Cocina</option>
            <option value="caja">Caja</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        @if (error()) {
          <p class="mt-3 text-sm text-danger" role="alert">{{ error() }}</p>
        }
        <div class="mt-3 flex gap-2">
          <button
            type="submit"
            [disabled]="formulario.invalid"
            class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-surface hover:bg-primary-hover disabled:opacity-50 sm:h-9"
          >
            Guardar
          </button>
          <button
            type="button"
            (click)="cerrarDialogo()"
            class="h-11 rounded-lg border border-border px-4 text-sm sm:h-9"
          >
            Cancelar
          </button>
        </div>
      </form>
    </ng-template>

    @if (usuarios.hasValue()) {
      <ul class="mt-4 space-y-2">
        @for (usuario of filtrados(); track usuario.id) {
          <li
            class="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-surface p-4"
          >
            <div class="flex min-w-0 flex-1 basis-52 items-center gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary"
                aria-hidden="true"
              >
                {{ iniciales(usuario.nombre) }}
              </span>
              <div class="min-w-0">
                <p class="truncate font-medium">
                  {{ usuario.nombre }}
                  @if (usuario.correo === auth.usuario()?.correo) {
                    <span class="text-xs font-normal text-text-muted">(tú)</span>
                  }
                </p>
                <p class="truncate text-xs text-text-muted">{{ usuario.correo }}</p>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                class="rounded-full px-2 py-0.5 text-xs"
                [class]="
                  usuario.rol === 'admin'
                    ? 'bg-primary-soft text-primary'
                    : 'bg-surface-muted text-text-muted'
                "
              >
                {{ etiquetaRol(usuario.rol) }}
              </span>
              @if (usuario.correo !== auth.usuario()?.correo) {
                <button
                  type="button"
                  role="switch"
                  [attr.aria-checked]="usuario.activo"
                  (click)="alternar(usuario)"
                  [appTooltip]="usuario.activo ? 'Desactivar' : 'Activar'"
                  [attr.aria-label]="
                    (usuario.activo ? 'Desactivar a ' : 'Activar a ') + usuario.nombre
                  "
                  class="flex h-11 items-center gap-2 rounded-lg px-2 hover:bg-surface-muted"
                >
                  <span
                    class="relative h-5 w-9 shrink-0 rounded-full transition-colors motion-reduce:transition-none"
                    [class.bg-success]="usuario.activo"
                    [class.bg-border]="!usuario.activo"
                    aria-hidden="true"
                  >
                    <span
                      class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-surface shadow transition-transform motion-reduce:transition-none"
                      [class.translate-x-4]="usuario.activo"
                    ></span>
                  </span>
                  <span
                    [class]="
                      'text-xs ' +
                      (usuario.activo
                        ? 'text-success'
                        : 'text-text-muted')
                    "
                  >
                    {{ usuario.activo ? 'activo' : 'inactivo' }}
                  </span>
                </button>
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    (click)="editar(usuario)"
                    appTooltip="Editar"
                    [attr.aria-label]="'Editar a ' + usuario.nombre"
                    class="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:bg-surface-muted"
                  >
                    <svg
                      class="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    (click)="eliminar(usuario)"
                    appTooltip="Eliminar"
                    [attr.aria-label]="'Eliminar a ' + usuario.nombre"
                    class="flex h-11 w-11 items-center justify-center rounded-lg text-danger hover:bg-surface-muted"
                  >
                    <svg
                      class="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 6h18" />
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                      />
                      <path d="M10 11v6m4-6v6" />
                    </svg>
                  </button>
                </div>
              } @else {
                <span
                  class="rounded-full px-2 py-0.5 text-xs"
                  [class]="
                    usuario.activo
                      ? 'bg-success-soft text-success'
                      : 'bg-surface-muted text-text-muted'
                  "
                >
                  {{ usuario.activo ? 'activo' : 'inactivo' }}
                </span>
              }
            </div>
          </li>
        } @empty {
          <li class="rounded-xl border border-border bg-surface p-4 text-sm text-text-muted">
            {{ busqueda() ? 'Sin resultados para «' + busqueda() + '».' : 'Sin usuarios.' }}
          </li>
        }
      </ul>
    } @else if (usuarios.error()) {
      <p
        class="mt-4 rounded-xl border border-border bg-surface p-4 text-sm text-danger"
      >
        No se pudo cargar la lista de usuarios.
      </p>
    } @else {
      <p class="mt-4 text-sm text-text-muted">Cargando…</p>
    }
  `,
})
export default class UsuariosPage {
  private readonly http = inject(HttpClient);
  private readonly toasts = inject(ToastService);
  protected readonly auth = inject(AuthService);

  protected readonly usuarios = httpResource<Usuario[]>(() => '/api/admin/usuarios');
  protected readonly busqueda = signal('');
  /** `id === 0` significa alta; otro id, edición de ese usuario. */
  protected readonly editando = signal<Usuario | null>(null);
  protected readonly error = signal<string | null>(null);
  private readonly dialogo = inject(Dialog);
  private readonly plantillaDialogo =
    viewChild.required<TemplateRef<unknown>>('dialogoUsuario');
  private ref: DialogRef | null = null;

  protected readonly formulario = inject(FormBuilder).nonNullable.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    clave: [''],
    rol: ['garzon'],
  });

  protected readonly filtrados = computed(() => {
    const consulta = this.busqueda().trim().toLowerCase();
    return (this.usuarios.value() ?? [])
      .filter(
        (usuario) =>
          !consulta ||
          usuario.nombre.toLowerCase().includes(consulta) ||
          usuario.correo.toLowerCase().includes(consulta),
      )
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  });

  protected etiquetaRol(rol: string): string {
    const etiquetas: Record<string, string> = {
      garzon: 'Garzón',
      cocina: 'Cocina',
      caja: 'Caja',
      admin: 'Administrador',
    };
    return etiquetas[rol] ?? rol;
  }

  protected iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join('');
  }

  protected nuevo(): void {
    this.error.set(null);
    this.editando.set({ id: 0, correo: '', nombre: '', rol: 'garzon', activo: true });
    this.formulario.reset({ rol: 'garzon' });
    this.abrirDialogo();
  }

  protected editar(usuario: Usuario): void {
    this.error.set(null);
    this.editando.set(usuario);
    this.formulario.reset({ nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol });
    this.abrirDialogo();
  }

  /** El modal se cierra por Cancelar, Esc o clic en el backdrop. */
  private abrirDialogo(): void {
    this.ref = this.dialogo.open(this.plantillaDialogo(), {
      ariaLabel: this.editando()?.id === 0 ? 'Nuevo usuario' : 'Editar usuario',
    });
    this.ref.closed.subscribe(() => {
      this.ref = null;
      this.editando.set(null);
    });
  }

  protected cerrarDialogo(): void {
    this.ref?.close();
  }

  protected guardar(): void {
    if (this.formulario.invalid) return;
    this.error.set(null);

    const datos = this.formulario.getRawValue();
    const usuario = this.editando()!;
    if (usuario.id === 0 && !datos.clave) {
      this.error.set('La clave es obligatoria al crear.');
      return;
    }

    const peticion =
      usuario.id === 0
        ? this.http.post('/api/admin/usuarios', datos)
        : this.http.put(`/api/admin/usuarios/${usuario.id}`, datos);
    peticion.subscribe({
      next: () => {
        this.toasts.exito(usuario.id === 0 ? 'Usuario creado.' : 'Usuario actualizado.');
        this.cerrarDialogo();
        this.usuarios.reload();
      },
      error: (e: HttpErrorResponse) =>
        this.error.set(
          e.status === 409 ? 'Ya existe un usuario con ese correo.' : 'Error al guardar.',
        ),
    });
  }

  protected alternar(usuario: Usuario): void {
    this.http.patch(`/api/admin/usuarios/${usuario.id}/estado`, {}).subscribe(() => {
      this.toasts.exito(usuario.activo ? 'Usuario desactivado.' : 'Usuario activado.');
      this.usuarios.reload();
    });
  }

  protected eliminar(usuario: Usuario): void {
    confirmar(this.dialogo, {
      titulo: 'Eliminar usuario',
      mensaje: `¿Eliminar a "${usuario.nombre}"? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      peligroso: true,
    }).subscribe((ok) => {
      if (!ok) return;
      this.http.delete(`/api/admin/usuarios/${usuario.id}`).subscribe(() => {
        this.toasts.exito('Usuario eliminado.');
        this.usuarios.reload();
      });
    });
  }
}
