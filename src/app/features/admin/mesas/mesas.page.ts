import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, TemplateRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/toast.service';
import { confirmar } from '../../../shared/confirmar.dialog';
import { DialogoXComponent } from '../../../shared/dialogo-x.component';
import { mensajeError } from '../../../shared/mensaje-error';
import { Mesa } from '../../../shared/models';

/** Alta y baja de mesas del salón. */
@Component({
  imports: [DialogoXComponent, ReactiveFormsModule],
  selector: 'app-mesas-page',
  template: `
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Mesas</h1>
        <p class="text-sm text-text-muted">El salón muestra solo las mesas activas.</p>
      </div>
      <button
        type="button"
        (click)="nueva()"
        class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Nueva mesa
      </button>
    </header>

    <ul class="mt-6 divide-y divide-border rounded-xl border border-border bg-surface">
      @for (mesa of mesas.value(); track mesa.id) {
        <li class="flex items-center gap-3 p-3" [class.opacity-60]="!mesa.activa">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium">Mesa {{ mesa.numero }}</p>
            @if (mesa.nombre) {
              <p class="truncate text-xs text-text-muted">{{ mesa.nombre }}</p>
            }
          </div>
          <button
            type="button"
            (click)="editar(mesa)"
            class="h-11 rounded-lg border border-border px-3 text-sm hover:bg-surface-muted"
          >
            Editar
          </button>
          <button
            type="button"
            (click)="alternar(mesa)"
            class="h-11 rounded-lg px-3 text-sm"
            [class]="mesa.activa ? 'text-danger hover:bg-danger-soft' : 'text-success hover:bg-success-soft'"
          >
            {{ mesa.activa ? 'Retirar' : 'Reponer' }}
          </button>
        </li>
      } @empty {
        <li class="p-4 text-sm text-text-muted">Sin mesas registradas.</li>
      }
    </ul>

    <ng-template #dialogoMesa>
      <form [formGroup]="formulario" (ngSubmit)="guardar()" class="dialogo">
        <app-dialogo-x (cerrar)="cerrarDialogo()" />
        <h2 class="pr-8 text-sm font-medium">{{ editando() ? 'Editar mesa' : 'Nueva mesa' }}</h2>
        <div class="mt-3 space-y-3">
          <label class="block text-sm">
            Número
            <input
              type="number"
              formControlName="numero"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            />
          </label>
          <label class="block text-sm">
            Nombre (opcional)
            <input
              formControlName="nombre"
              placeholder="Terraza, Ventana…"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            />
          </label>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            (click)="cerrarDialogo()"
            class="h-11 rounded-lg border border-border px-4 text-sm sm:h-9"
          >
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="formulario.invalid"
            class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-white disabled:opacity-50 sm:h-9"
          >
            Guardar
          </button>
        </div>
      </form>
    </ng-template>
  `,
})
export default class MesasPage {
  private readonly http = inject(HttpClient);
  private readonly toasts = inject(ToastService);
  private readonly dialogo = inject(Dialog);
  private readonly fb = inject(FormBuilder);

  protected readonly mesas = httpResource<Mesa[]>(() => '/api/admin/mesas');
  protected readonly editando = signal<Mesa | null>(null);

  protected readonly formulario = this.fb.nonNullable.group({
    numero: [1, [Validators.required, Validators.min(1)]],
    nombre: [''],
  });

  private readonly plantillaDialogo = viewChild.required<TemplateRef<unknown>>('dialogoMesa');
  private ref: DialogRef | null = null;

  protected nueva(): void {
    this.editando.set(null);
    const siguiente = (this.mesas.value()?.length ?? 0) + 1;
    this.formulario.reset({ numero: siguiente, nombre: '' });
    this.abrirDialogo();
  }

  protected editar(mesa: Mesa): void {
    this.editando.set(mesa);
    this.formulario.reset({ numero: mesa.numero, nombre: mesa.nombre ?? '' });
    this.abrirDialogo();
  }

  private abrirDialogo(): void {
    this.ref = this.dialogo.open(this.plantillaDialogo(), {
      ariaLabel: this.editando() ? 'Editar mesa' : 'Nueva mesa',
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
    const valores = this.formulario.getRawValue();
    const cuerpo = {
      numero: Number(valores.numero),
      nombre: valores.nombre.trim() === '' ? null : valores.nombre.trim(),
    };
    const actual = this.editando();
    const peticion = actual
      ? this.http.put(`/api/admin/mesas/${actual.id}`, cuerpo)
      : this.http.post('/api/admin/mesas', cuerpo);

    peticion.subscribe({
      next: () => {
        this.toasts.exito(actual ? 'Mesa actualizada.' : 'Mesa creada.');
        this.cerrarDialogo();
        this.mesas.reload();
      },
      error: (e: unknown) => this.toasts.error(mensajeError(e, 'No se pudo guardar la mesa.')),
    });
  }

  protected alternar(mesa: Mesa): void {
    const retirando = mesa.activa;
    confirmar(this.dialogo, {
      titulo: retirando ? 'Retirar mesa' : 'Reponer mesa',
      mensaje: retirando
        ? `¿Retirar la mesa ${mesa.numero} del salón?`
        : `¿Reponer la mesa ${mesa.numero} en el salón?`,
      textoConfirmar: retirando ? 'Retirar' : 'Reponer',
      peligroso: retirando,
    }).subscribe((ok) => {
      if (!ok) return;
      this.http.post(`/api/admin/mesas/${mesa.id}/alternar`, {}).subscribe({
        next: () => this.mesas.reload(),
        error: (e: unknown) =>
          this.toasts.error(mensajeError(e, 'No se pudo cambiar el estado.')),
      });
    });
  }
}
