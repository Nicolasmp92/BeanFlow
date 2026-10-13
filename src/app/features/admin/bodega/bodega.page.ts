import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, TemplateRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/toast.service';
import { confirmar } from '../../../shared/confirmar.dialog';
import { DialogoXComponent } from '../../../shared/dialogo-x.component';
import { mensajeError } from '../../../shared/mensaje-error';
import { Insumo, MovimientoInsumo } from '../../../shared/models';

/**
 * Bodega: insumos con su saldo y el libro de movimientos. El stock no se edita
 * a mano — se mueve con recepciones, mermas y ajustes, y cada cambio queda
 * firmado en el libro.
 */
@Component({
  imports: [DatePipe, DecimalPipe, DialogoXComponent, ReactiveFormsModule],
  selector: 'app-bodega-page',
  template: `
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Bodega</h1>
        <p class="text-sm text-text-muted">
          {{ bajoMinimo().length }} insumo(s) en o bajo el mínimo.
        </p>
      </div>
      <button
        type="button"
        (click)="nuevoInsumo()"
        class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Nuevo insumo
      </button>
    </header>

    <section class="mt-6">
      <h2 class="text-sm font-medium">Insumos</h2>
      <ul class="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
        @for (insumo of insumos.value(); track insumo.id) {
          <li class="flex flex-wrap items-center gap-3 p-3" [class.opacity-60]="!insumo.activo">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">{{ insumo.nombre }}</p>
              <p class="text-xs" [class]="insumo.bajoMinimo ? 'text-danger' : 'text-text-muted'">
                {{ insumo.stock | number: '1.0-3' }} {{ insumo.unidad }}
                · mínimo {{ insumo.stockMinimo | number: '1.0-3' }}
                {{ insumo.bajoMinimo ? '· reponer' : '' }}
              </p>
            </div>
            <button
              type="button"
              (click)="abrirMovimiento(insumo)"
              class="h-11 rounded-lg border border-border px-3 text-sm hover:bg-surface-muted"
            >
              Movimiento
            </button>
            <button
              type="button"
              (click)="editarInsumo(insumo)"
              class="h-11 rounded-lg border border-border px-3 text-sm hover:bg-surface-muted"
            >
              Editar
            </button>
            <button
              type="button"
              (click)="alternar(insumo)"
              class="h-11 rounded-lg px-3 text-sm"
              [class]="insumo.activo ? 'text-danger hover:bg-danger-soft' : 'text-success hover:bg-success-soft'"
            >
              {{ insumo.activo ? 'Desactivar' : 'Activar' }}
            </button>
          </li>
        } @empty {
          <li class="p-4 text-sm text-text-muted">Sin insumos cargados.</li>
        }
      </ul>
    </section>

    <section class="mt-8">
      <h2 class="text-sm font-medium">Libro de movimientos</h2>
      <ul class="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
        @for (movimiento of movimientos.value(); track movimiento.id) {
          <li class="flex flex-wrap items-center gap-3 p-3 text-sm">
            <span class="w-20 shrink-0 text-xs font-medium capitalize" [class]="colorTipo(movimiento.tipo)">
              {{ movimiento.tipo }}
            </span>
            <span class="min-w-0 flex-1 truncate">{{ movimiento.insumo }}</span>
            <span class="shrink-0">
              {{ movimiento.cantidad | number: '1.0-3' }} {{ movimiento.unidad }}
            </span>
            <span class="shrink-0 text-xs text-text-muted">
              saldo {{ movimiento.stockResultante | number: '1.0-3' }}
            </span>
            <span class="w-full truncate text-xs text-text-muted sm:w-auto">
              {{ movimiento.creadoEn | date: 'dd-MM HH:mm' }}
              {{ movimiento.motivo ? '· ' + movimiento.motivo : '' }}
            </span>
          </li>
        } @empty {
          <li class="p-4 text-sm text-text-muted">Sin movimientos registrados.</li>
        }
      </ul>
    </section>

    <!-- Alta/edición de insumo -->
    <ng-template #dialogoInsumo>
      <form [formGroup]="formInsumo" (ngSubmit)="guardarInsumo()" class="dialogo">
        <app-dialogo-x (cerrar)="cerrarInsumo()" />
        <h2 class="pr-8 text-sm font-medium">
          {{ editando() ? 'Editar insumo' : 'Nuevo insumo' }}
        </h2>
        <div class="mt-3 space-y-3">
          <label class="block text-sm">
            Nombre
            <input
              formControlName="nombre"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            />
          </label>
          <label class="block text-sm">
            Unidad de medida
            <select
              formControlName="unidad"
              [attr.disabled]="editando() ? '' : null"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            >
              <option value="g">gramos (g)</option>
              <option value="ml">mililitros (ml)</option>
              <option value="unidad">unidades</option>
            </select>
          </label>
          <label class="block text-sm">
            Stock mínimo
            <input
              type="number"
              step="0.001"
              formControlName="stockMinimo"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            />
          </label>
          <label class="block text-sm">
            Costo por unidad de medida
            <input
              type="number"
              step="0.01"
              formControlName="costoUnitario"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            />
          </label>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            (click)="cerrarInsumo()"
            class="h-11 rounded-lg border border-border px-4 text-sm sm:h-9"
          >
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="formInsumo.invalid"
            class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-white disabled:opacity-50 sm:h-9"
          >
            Guardar
          </button>
        </div>
      </form>
    </ng-template>

    <!-- Movimiento de stock -->
    <ng-template #dialogoMovimiento>
      <form [formGroup]="formMovimiento" (ngSubmit)="guardarMovimiento()" class="dialogo">
        <app-dialogo-x (cerrar)="cerrarMovimiento()" />
        <h2 class="pr-8 text-sm font-medium">Movimiento de {{ insumoMovimiento()?.nombre }}</h2>
        <p class="mt-1 text-xs text-text-muted">
          Saldo actual: {{ insumoMovimiento()?.stock }} {{ insumoMovimiento()?.unidad }}
        </p>
        <div class="mt-3 space-y-3">
          <label class="block text-sm">
            Tipo
            <select
              formControlName="tipo"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            >
              <option value="entrada">Entrada — recepción de mercadería</option>
              <option value="merma">Merma — pérdida o vencimiento</option>
              <option value="ajuste">Ajuste — fijar el saldo real contado</option>
            </select>
          </label>
          <label class="block text-sm">
            {{ formMovimiento.value.tipo === 'ajuste' ? 'Saldo real contado' : 'Cantidad' }}
            <input
              type="number"
              step="0.001"
              formControlName="cantidad"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            />
          </label>
          <label class="block text-sm">
            Motivo
            <input
              formControlName="motivo"
              placeholder="Factura 1234, inventario del lunes…"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            />
          </label>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            (click)="cerrarMovimiento()"
            class="h-11 rounded-lg border border-border px-4 text-sm sm:h-9"
          >
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="formMovimiento.invalid"
            class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-white disabled:opacity-50 sm:h-9"
          >
            Registrar
          </button>
        </div>
      </form>
    </ng-template>
  `,
})
export default class BodegaPage {
  private readonly http = inject(HttpClient);
  private readonly toasts = inject(ToastService);
  private readonly dialogo = inject(Dialog);
  private readonly fb = inject(FormBuilder);

  protected readonly insumos = httpResource<Insumo[]>(() => '/api/admin/inventario/insumos');
  protected readonly movimientos = httpResource<MovimientoInsumo[]>(
    () => '/api/admin/inventario/movimientos',
  );

  protected readonly editando = signal<Insumo | null>(null);
  protected readonly insumoMovimiento = signal<Insumo | null>(null);

  protected readonly bajoMinimo = computed(
    () => this.insumos.value()?.filter((insumo) => insumo.activo && insumo.bajoMinimo) ?? [],
  );

  protected readonly formInsumo = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    unidad: ['g', Validators.required],
    stockMinimo: [0, [Validators.required, Validators.min(0)]],
    costoUnitario: [0, [Validators.required, Validators.min(0)]],
  });

  protected readonly formMovimiento = this.fb.nonNullable.group({
    tipo: ['entrada', Validators.required],
    cantidad: [0, [Validators.required, Validators.min(0)]],
    motivo: [''],
  });

  private readonly plantillaInsumo = viewChild.required<TemplateRef<unknown>>('dialogoInsumo');
  private readonly plantillaMovimiento =
    viewChild.required<TemplateRef<unknown>>('dialogoMovimiento');
  private refInsumo: DialogRef | null = null;
  private refMovimiento: DialogRef | null = null;

  protected colorTipo(tipo: MovimientoInsumo['tipo']): string {
    return {
      entrada: 'text-success',
      salida: 'text-text-muted',
      ajuste: 'text-primary',
      merma: 'text-danger',
    }[tipo];
  }

  protected nuevoInsumo(): void {
    this.editando.set(null);
    this.formInsumo.reset({ unidad: 'g', stockMinimo: 0, costoUnitario: 0 });
    this.abrirInsumo();
  }

  protected editarInsumo(insumo: Insumo): void {
    this.editando.set(insumo);
    this.formInsumo.reset({
      nombre: insumo.nombre,
      unidad: insumo.unidad,
      stockMinimo: insumo.stockMinimo,
      costoUnitario: insumo.costoUnitario,
    });
    this.abrirInsumo();
  }

  private abrirInsumo(): void {
    this.refInsumo = this.dialogo.open(this.plantillaInsumo(), {
      ariaLabel: this.editando() ? 'Editar insumo' : 'Nuevo insumo',
    });
    this.refInsumo.closed.subscribe(() => {
      this.refInsumo = null;
      this.editando.set(null);
    });
  }

  protected cerrarInsumo(): void {
    this.refInsumo?.close();
  }

  protected guardarInsumo(): void {
    if (this.formInsumo.invalid) return;
    const cuerpo = this.formInsumo.getRawValue();
    const actual = this.editando();
    const peticion = actual
      ? this.http.put(`/api/admin/inventario/insumos/${actual.id}`, cuerpo)
      : this.http.post('/api/admin/inventario/insumos', cuerpo);

    peticion.subscribe({
      next: () => {
        this.toasts.exito(actual ? 'Insumo actualizado.' : 'Insumo creado.');
        this.cerrarInsumo();
        this.insumos.reload();
      },
      error: (e: unknown) => this.toasts.error(mensajeError(e, 'No se pudo guardar el insumo.')),
    });
  }

  protected abrirMovimiento(insumo: Insumo): void {
    this.insumoMovimiento.set(insumo);
    this.formMovimiento.reset({ tipo: 'entrada', cantidad: 0, motivo: '' });
    this.refMovimiento = this.dialogo.open(this.plantillaMovimiento(), {
      ariaLabel: 'Movimiento de stock',
    });
    this.refMovimiento.closed.subscribe(() => {
      this.refMovimiento = null;
      this.insumoMovimiento.set(null);
    });
  }

  protected cerrarMovimiento(): void {
    this.refMovimiento?.close();
  }

  protected guardarMovimiento(): void {
    const insumo = this.insumoMovimiento();
    if (!insumo || this.formMovimiento.invalid) return;

    this.http
      .post('/api/admin/inventario/movimientos', {
        insumoId: insumo.id,
        ...this.formMovimiento.getRawValue(),
      })
      .subscribe({
        next: () => {
          this.toasts.exito('Movimiento registrado.');
          this.cerrarMovimiento();
          this.insumos.reload();
          this.movimientos.reload();
        },
        error: (e: unknown) =>
          this.toasts.error(mensajeError(e, 'No se pudo registrar el movimiento.')),
      });
  }

  protected alternar(insumo: Insumo): void {
    const desactivando = insumo.activo;
    confirmar(this.dialogo, {
      titulo: desactivando ? 'Desactivar insumo' : 'Activar insumo',
      mensaje: desactivando
        ? `¿Desactivar "${insumo.nombre}"? No podrá usarse en recetas nuevas.`
        : `¿Volver a activar "${insumo.nombre}"?`,
      textoConfirmar: desactivando ? 'Desactivar' : 'Activar',
      peligroso: desactivando,
    }).subscribe((ok) => {
      if (!ok) return;
      this.http.post(`/api/admin/inventario/insumos/${insumo.id}/alternar`, {}).subscribe({
        next: () => this.insumos.reload(),
        error: (e: unknown) =>
          this.toasts.error(mensajeError(e, 'No se pudo cambiar el estado.')),
      });
    });
  }
}
