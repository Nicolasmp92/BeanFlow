import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { EstadoSidebar, LayoutService } from '../../core/layout/layout.service';
import { Paleta, PreferencesService, Tema } from '../../core/preferences.service';
import { Sesion } from '../../shared/models';

/**
 * Autogestión de la cuenta: datos de perfil (nombre/correo), cambio de clave
 * y preferencias de la app. Las preferencias viven en localStorage — la
 * persistencia por usuario en BD pertenece al dominio Settings (backlog).
 */
@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-perfil',
  template: `
    <h1 class="text-2xl font-semibold">Mi cuenta</h1>

    <section class="mt-4 rounded-xl border border-border bg-surface p-5">
      <h2 class="text-sm font-medium text-text-muted">Datos de perfil</h2>
      <form [formGroup]="formPerfil" (ngSubmit)="guardarPerfil()" class="mt-4">
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium" for="nombre">Nombre</label>
            <input
              id="nombre"
              formControlName="nombre"
              autocomplete="name"
              class="mt-1 h-11 w-full rounded-lg border border-border px-3 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium" for="correo">Correo</label>
            <input
              id="correo"
              type="email"
              formControlName="correo"
              autocomplete="email"
              class="mt-1 h-11 w-full rounded-lg border border-border px-3 outline-none focus:border-primary"
            />
          </div>
        </div>
        @if (errorPerfil()) {
          <p class="mt-3 text-sm text-danger" role="alert">
            {{ errorPerfil() }}
          </p>
        }
        @if (okPerfil()) {
          <p class="mt-3 text-sm text-primary" role="status">Perfil actualizado.</p>
        }
        <button
          type="submit"
          [disabled]="formPerfil.invalid || guardandoPerfil()"
          class="mt-4 h-11 rounded-lg bg-primary px-4 text-sm font-medium text-surface hover:bg-primary-hover disabled:opacity-50 sm:h-9"
        >
          {{ guardandoPerfil() ? 'Guardando…' : 'Guardar perfil' }}
        </button>
      </form>
    </section>

    <section class="mt-4 rounded-xl border border-border bg-surface p-5">
      <h2 class="text-sm font-medium text-text-muted">Cambiar clave</h2>
      <form [formGroup]="formClave" (ngSubmit)="guardarClave()" class="mt-4">
        <div class="grid gap-3 sm:grid-cols-3">
          <div>
            <label class="block text-sm font-medium" for="claveActual">Clave actual</label>
            <input
              id="claveActual"
              type="password"
              formControlName="claveActual"
              autocomplete="current-password"
              class="mt-1 h-11 w-full rounded-lg border border-border px-3 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium" for="claveNueva">Clave nueva</label>
            <input
              id="claveNueva"
              type="password"
              formControlName="claveNueva"
              autocomplete="new-password"
              class="mt-1 h-11 w-full rounded-lg border border-border px-3 outline-none focus:border-primary"
            />
            <p class="mt-1 text-xs text-text-muted">Mínimo 8 caracteres.</p>
          </div>
          <div>
            <label class="block text-sm font-medium" for="claveRepetida">Repetir clave nueva</label>
            <input
              id="claveRepetida"
              type="password"
              formControlName="claveRepetida"
              autocomplete="new-password"
              class="mt-1 h-11 w-full rounded-lg border border-border px-3 outline-none focus:border-primary"
            />
          </div>
        </div>
        @if (errorClave()) {
          <p class="mt-3 text-sm text-danger" role="alert">{{ errorClave() }}</p>
        }
        @if (okClave()) {
          <p class="mt-3 text-sm text-primary" role="status">Clave actualizada.</p>
        }
        <button
          type="submit"
          [disabled]="formClave.invalid || guardandoClave()"
          class="mt-4 h-11 rounded-lg bg-primary px-4 text-sm font-medium text-surface hover:bg-primary-hover disabled:opacity-50 sm:h-9"
        >
          {{ guardandoClave() ? 'Guardando…' : 'Cambiar clave' }}
        </button>
      </form>
    </section>

    <section class="mt-4 rounded-xl border border-border bg-surface p-5">
      <h2 class="text-sm font-medium text-text-muted">Preferencias</h2>
      <p class="mt-1 text-xs text-text-muted">Se guardan en este dispositivo.</p>
      <fieldset class="mt-4">
        <legend class="text-sm font-medium">Barra lateral en escritorio</legend>
        <div class="mt-2 flex flex-col gap-1 sm:flex-row sm:gap-4">
          @for (opcion of opcionesSidebar; track opcion.valor) {
            <label class="flex h-11 cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="sidebar"
                [checked]="layout.estado() === opcion.valor"
                (change)="layout.fijarEstado(opcion.valor)"
                class="h-4 w-4 accent-primary"
              />
              {{ opcion.etiqueta }}
            </label>
          }
        </div>
      </fieldset>
    </section>

    <section class="mt-4 rounded-xl border border-border bg-surface p-5">
      <h2 class="text-sm font-medium text-text-muted">Accesibilidad</h2>
      <p class="mt-1 text-xs text-text-muted">Se guardan en este dispositivo.</p>
      <fieldset class="mt-4">
        <legend class="text-sm font-medium">Tema</legend>
        <div class="mt-2 flex flex-col gap-1 sm:flex-row sm:gap-4">
          @for (opcion of opcionesTema; track opcion.valor) {
            <label class="flex h-11 cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="tema"
                [checked]="preferencias.tema() === opcion.valor"
                (change)="preferencias.fijarTema(opcion.valor)"
                class="h-4 w-4 accent-primary"
              />
              {{ opcion.etiqueta }}
            </label>
          }
        </div>
      </fieldset>
      <fieldset class="mt-4">
        <legend class="text-sm font-medium">Color de acento</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          @for (opcion of opcionesPaleta; track opcion.valor) {
            <button
              type="button"
              [attr.data-paleta]="opcion.valor"
              (click)="preferencias.fijarPaleta(opcion.valor)"
              [attr.aria-pressed]="preferencias.paleta() === opcion.valor"
              class="flex h-11 items-center gap-2 rounded-lg border px-3 text-sm"
              [class.border-primary]="preferencias.paleta() === opcion.valor"
              [class.border-border]="preferencias.paleta() !== opcion.valor"
              [class.bg-primary-soft]="preferencias.paleta() === opcion.valor"
            >
              <span class="h-5 w-5 rounded-full bg-primary" aria-hidden="true"></span>
              {{ opcion.etiqueta }}
            </button>
          }
        </div>
      </fieldset>
      <fieldset class="mt-4">
        <legend class="text-sm font-medium">Lectura y movimiento</legend>
        <div class="mt-2 flex flex-col gap-1">
          <label class="flex h-11 cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              [checked]="preferencias.textoGrande()"
              (change)="preferencias.fijarTextoGrande($any($event.target).checked)"
              class="h-4 w-4 accent-primary"
            />
            Texto grande
          </label>
          <label class="flex h-11 cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              [checked]="preferencias.altoContraste()"
              (change)="preferencias.fijarAltoContraste($any($event.target).checked)"
              class="h-4 w-4 accent-primary"
            />
            Alto contraste
          </label>
          <label class="flex h-11 cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              [checked]="preferencias.reducirAnimaciones()"
              (change)="preferencias.fijarReducirAnimaciones($any($event.target).checked)"
              class="h-4 w-4 accent-primary"
            />
            Reducir animaciones
          </label>
        </div>
      </fieldset>
    </section>
  `,
})
export default class PerfilPage {
  private readonly http = inject(HttpClient);
  protected readonly auth = inject(AuthService);
  protected readonly layout = inject(LayoutService);
  protected readonly preferencias = inject(PreferencesService);

  protected readonly opcionesSidebar: { valor: EstadoSidebar; etiqueta: string }[] = [
    { valor: 'expanded', etiqueta: 'Expandida' },
    { valor: 'compact', etiqueta: 'Compacta' },
    { valor: 'hidden', etiqueta: 'Oculta' },
  ];

  protected readonly opcionesTema: { valor: Tema; etiqueta: string }[] = [
    { valor: 'claro', etiqueta: 'Claro' },
    { valor: 'oscuro', etiqueta: 'Oscuro' },
    { valor: 'sistema', etiqueta: 'Según el sistema' },
  ];

  protected readonly opcionesPaleta: { valor: Paleta; etiqueta: string }[] = [
    { valor: 'azul', etiqueta: 'Azul' },
    { valor: 'esmeralda', etiqueta: 'Esmeralda' },
    { valor: 'violeta', etiqueta: 'Violeta' },
    { valor: 'ambar', etiqueta: 'Ámbar' },
  ];

  protected readonly formPerfil = inject(FormBuilder).nonNullable.group({
    nombre: [this.auth.usuario()?.nombre ?? '', Validators.required],
    correo: [this.auth.usuario()?.correo ?? '', [Validators.required, Validators.email]],
  });
  protected readonly guardandoPerfil = signal(false);
  protected readonly errorPerfil = signal<string | null>(null);
  protected readonly okPerfil = signal(false);

  protected readonly formClave = inject(FormBuilder).nonNullable.group({
    claveActual: ['', Validators.required],
    claveNueva: ['', [Validators.required, Validators.minLength(8)]],
    claveRepetida: ['', Validators.required],
  });
  protected readonly guardandoClave = signal(false);
  protected readonly errorClave = signal<string | null>(null);
  protected readonly okClave = signal(false);

  protected guardarPerfil(): void {
    if (this.formPerfil.invalid || this.guardandoPerfil()) return;
    this.guardandoPerfil.set(true);
    this.errorPerfil.set(null);
    this.okPerfil.set(false);

    this.http.put<Sesion>('/api/perfil', this.formPerfil.getRawValue()).subscribe({
      next: (sesion) => {
        this.guardandoPerfil.set(false);
        this.auth.actualizarSesion(sesion);
        this.okPerfil.set(true);
      },
      error: (e: HttpErrorResponse) => {
        this.guardandoPerfil.set(false);
        this.errorPerfil.set(
          e.status === 409
            ? 'Ya existe un usuario con ese correo.'
            : 'No se pudo guardar el perfil.',
        );
      },
    });
  }

  protected guardarClave(): void {
    if (this.formClave.invalid || this.guardandoClave()) return;
    this.errorClave.set(null);
    this.okClave.set(false);

    const { claveActual, claveNueva, claveRepetida } = this.formClave.getRawValue();
    if (claveNueva !== claveRepetida) {
      this.errorClave.set('Las claves nuevas no coinciden.');
      return;
    }

    this.guardandoClave.set(true);
    this.http.put('/api/perfil/clave', { claveActual, claveNueva }).subscribe({
      next: () => {
        this.guardandoClave.set(false);
        this.formClave.reset();
        this.okClave.set(true);
      },
      error: () => {
        this.guardandoClave.set(false);
        this.errorClave.set('La clave actual es incorrecta.');
      },
    });
  }
}
