import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { Component, TemplateRef, inject, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/toast.service';
import { confirmar } from '../../../shared/confirmar.dialog';
import { DialogoXComponent } from '../../../shared/dialogo-x.component';
import { mensajeError } from '../../../shared/mensaje-error';
import { Categoria, Insumo, Producto, RenglonReceta } from '../../../shared/models';

/**
 * Mantención de la carta. La receta es la pieza clave: define qué insumo
 * consume cada producto, y de ahí sale tanto el descuento de stock al
 * preparar como la disponibilidad que ve el garzón.
 */
@Component({
  imports: [CurrencyPipe, DecimalPipe, DialogoXComponent, ReactiveFormsModule],
  selector: 'app-carta-admin-page',
  template: `
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">Carta</h1>
        <p class="text-sm text-text-muted">Categorías, productos y su receta.</p>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          (click)="nuevaCategoria()"
          class="h-11 rounded-lg border border-border px-4 text-sm hover:bg-surface-muted"
        >
          Nueva categoría
        </button>
        <button
          type="button"
          (click)="nuevoProducto()"
          [disabled]="!(categorias.value()?.length ?? 0)"
          class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          Nuevo producto
        </button>
      </div>
    </header>

    <section class="mt-6">
      <h2 class="text-sm font-medium">Categorías</h2>
      <ul class="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
        @for (categoria of categorias.value(); track categoria.id) {
          <li class="flex items-center gap-3 p-3" [class.opacity-60]="!categoria.activo">
            <span class="min-w-0 flex-1 truncate text-sm font-medium">{{ categoria.nombre }}</span>
            <button
              type="button"
              (click)="editarCategoria(categoria)"
              class="h-11 rounded-lg border border-border px-3 text-sm hover:bg-surface-muted"
            >
              Editar
            </button>
            <button
              type="button"
              (click)="alternarCategoria(categoria)"
              class="h-11 rounded-lg px-3 text-sm"
              [class]="
                categoria.activo ? 'text-danger hover:bg-danger-soft' : 'text-success hover:bg-success-soft'
              "
            >
              {{ categoria.activo ? 'Desactivar' : 'Activar' }}
            </button>
          </li>
        } @empty {
          <li class="p-4 text-sm text-text-muted">
            Sin categorías. Crea una antes de agregar productos.
          </li>
        }
      </ul>
    </section>

    <section class="mt-8">
      <h2 class="text-sm font-medium">Productos</h2>
      <ul class="mt-2 divide-y divide-border rounded-xl border border-border bg-surface">
        @for (producto of productos.value(); track producto.id) {
          <li class="flex flex-wrap items-center gap-3 p-3" [class.opacity-60]="!producto.activo">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">{{ producto.nombre }}</p>
              <p class="text-xs text-text-muted">
                {{ producto.categoriaNombre }} ·
                {{ producto.precio | currency: 'CLP' : 'symbol-narrow' : '1.0-0' }}
                {{ producto.requierePreparacion ? '· pasa por barra' : '· entrega directa' }}
              </p>
            </div>
            <button
              type="button"
              (click)="abrirReceta(producto)"
              class="h-11 rounded-lg border border-border px-3 text-sm hover:bg-surface-muted"
            >
              Receta
            </button>
            <button
              type="button"
              (click)="editarProducto(producto)"
              class="h-11 rounded-lg border border-border px-3 text-sm hover:bg-surface-muted"
            >
              Editar
            </button>
            <button
              type="button"
              (click)="alternarProducto(producto)"
              class="h-11 rounded-lg px-3 text-sm"
              [class]="
                producto.activo ? 'text-danger hover:bg-danger-soft' : 'text-success hover:bg-success-soft'
              "
            >
              {{ producto.activo ? 'Quitar de la carta' : 'Volver a la carta' }}
            </button>
          </li>
        } @empty {
          <li class="p-4 text-sm text-text-muted">Sin productos cargados.</li>
        }
      </ul>
    </section>

    <!-- Categoría -->
    <ng-template #dialogoCategoria>
      <form [formGroup]="formCategoria" (ngSubmit)="guardarCategoria()" class="dialogo">
        <app-dialogo-x (cerrar)="cerrarCategoria()" />
        <h2 class="pr-8 text-sm font-medium">
          {{ categoriaEditando() ? 'Editar categoría' : 'Nueva categoría' }}
        </h2>
        <label class="mt-3 block text-sm">
          Nombre
          <input
            formControlName="nombre"
            class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
          />
        </label>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            (click)="cerrarCategoria()"
            class="h-11 rounded-lg border border-border px-4 text-sm sm:h-9"
          >
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="formCategoria.invalid"
            class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-white disabled:opacity-50 sm:h-9"
          >
            Guardar
          </button>
        </div>
      </form>
    </ng-template>

    <!-- Producto -->
    <ng-template #dialogoProducto>
      <form [formGroup]="formProducto" (ngSubmit)="guardarProducto()" class="dialogo">
        <app-dialogo-x (cerrar)="cerrarProducto()" />
        <h2 class="pr-8 text-sm font-medium">
          {{ productoEditando() ? 'Editar producto' : 'Nuevo producto' }}
        </h2>
        <div class="mt-3 space-y-3">
          <label class="block text-sm">
            Categoría
            <select
              formControlName="categoriaId"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            >
              @for (categoria of categorias.value(); track categoria.id) {
                <option [value]="categoria.id">{{ categoria.nombre }}</option>
              }
            </select>
          </label>
          <label class="block text-sm">
            Nombre
            <input
              formControlName="nombre"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            />
          </label>
          <label class="block text-sm">
            Descripción
            <input
              formControlName="descripcion"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            />
          </label>
          <label class="block text-sm">
            Precio
            <input
              type="number"
              formControlName="precio"
              class="mt-1 h-11 w-full rounded-lg border border-border bg-surface px-3"
            />
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" formControlName="requierePreparacion" class="h-5 w-5" />
            Pasa por la barra (aparece en el tablero de cocina)
          </label>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            (click)="cerrarProducto()"
            class="h-11 rounded-lg border border-border px-4 text-sm sm:h-9"
          >
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="formProducto.invalid"
            class="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-white disabled:opacity-50 sm:h-9"
          >
            Guardar
          </button>
        </div>
      </form>
    </ng-template>

    <!-- Receta -->
    <ng-template #dialogoReceta>
      <div class="dialogo">
        <app-dialogo-x (cerrar)="cerrarReceta()" />
        <h2 class="pr-8 text-sm font-medium">Receta de {{ productoReceta()?.nombre }}</h2>
        <p class="mt-1 text-xs text-text-muted">
          Cantidades por UNA unidad del producto. Sin receta, el producto no
          descuenta stock al prepararse.
        </p>

        <ul class="mt-3 divide-y divide-border rounded-lg border border-border">
          @for (renglon of receta.value(); track renglon.id) {
            <li class="flex items-center gap-2 p-2 text-sm">
              <span class="min-w-0 flex-1 truncate">{{ renglon.insumoNombre }}</span>
              <span class="shrink-0">
                {{ renglon.cantidad | number: '1.0-3' }} {{ renglon.unidad }}
              </span>
              <button
                type="button"
                (click)="quitarRenglon(renglon)"
                [attr.aria-label]="'Quitar ' + renglon.insumoNombre"
                class="h-11 w-11 shrink-0 rounded-lg text-danger hover:bg-danger-soft"
              >
                ×
              </button>
            </li>
          } @empty {
            <li class="p-3 text-sm text-text-muted">Sin insumos en la receta.</li>
          }
        </ul>

        <form [formGroup]="formRenglon" (ngSubmit)="agregarRenglon()" class="mt-3 flex gap-2">
          <select
            formControlName="insumoId"
            aria-label="Insumo"
            class="h-11 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-sm"
          >
            @for (insumo of insumosActivos(); track insumo.id) {
              <option [value]="insumo.id">{{ insumo.nombre }} ({{ insumo.unidad }})</option>
            }
          </select>
          <input
            type="number"
            step="0.001"
            formControlName="cantidad"
            aria-label="Cantidad"
            class="h-11 w-24 rounded-lg border border-border bg-surface px-3 text-sm"
          />
          <button
            type="submit"
            [disabled]="formRenglon.invalid"
            class="h-11 shrink-0 rounded-lg bg-primary px-3 text-sm font-medium text-white disabled:opacity-50"
          >
            Agregar
          </button>
        </form>
      </div>
    </ng-template>
  `,
})
export default class CartaAdminPage {
  private readonly http = inject(HttpClient);
  private readonly toasts = inject(ToastService);
  private readonly dialogo = inject(Dialog);
  private readonly fb = inject(FormBuilder);

  protected readonly categorias = httpResource<Categoria[]>(() => '/api/admin/carta/categorias');
  protected readonly productos = httpResource<Producto[]>(() => '/api/admin/carta/productos');
  protected readonly insumos = httpResource<Insumo[]>(() => '/api/admin/inventario/insumos');

  protected readonly categoriaEditando = signal<Categoria | null>(null);
  protected readonly productoEditando = signal<Producto | null>(null);
  protected readonly productoReceta = signal<Producto | null>(null);

  /** La receta se consulta solo cuando hay un producto seleccionado. */
  protected readonly receta = httpResource<RenglonReceta[]>(() => {
    const producto = this.productoReceta();
    return producto ? `/api/admin/carta/productos/${producto.id}/receta` : undefined;
  });

  protected readonly formCategoria = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
  });

  protected readonly formProducto = this.fb.nonNullable.group({
    categoriaId: [0, Validators.required],
    nombre: ['', Validators.required],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0)]],
    requierePreparacion: [true],
  });

  protected readonly formRenglon = this.fb.nonNullable.group({
    insumoId: [0, Validators.required],
    cantidad: [0, [Validators.required, Validators.min(0.001)]],
  });

  private readonly plantillaCategoria =
    viewChild.required<TemplateRef<unknown>>('dialogoCategoria');
  private readonly plantillaProducto = viewChild.required<TemplateRef<unknown>>('dialogoProducto');
  private readonly plantillaReceta = viewChild.required<TemplateRef<unknown>>('dialogoReceta');
  private refCategoria: DialogRef | null = null;
  private refProducto: DialogRef | null = null;
  private refReceta: DialogRef | null = null;

  protected insumosActivos(): Insumo[] {
    return this.insumos.value()?.filter((insumo) => insumo.activo) ?? [];
  }

  // --- Categorías ---

  protected nuevaCategoria(): void {
    this.categoriaEditando.set(null);
    this.formCategoria.reset({ nombre: '' });
    this.abrirCategoria();
  }

  protected editarCategoria(categoria: Categoria): void {
    this.categoriaEditando.set(categoria);
    this.formCategoria.reset({ nombre: categoria.nombre });
    this.abrirCategoria();
  }

  private abrirCategoria(): void {
    this.refCategoria = this.dialogo.open(this.plantillaCategoria(), {
      ariaLabel: this.categoriaEditando() ? 'Editar categoría' : 'Nueva categoría',
    });
    this.refCategoria.closed.subscribe(() => {
      this.refCategoria = null;
      this.categoriaEditando.set(null);
    });
  }

  protected cerrarCategoria(): void {
    this.refCategoria?.close();
  }

  protected guardarCategoria(): void {
    if (this.formCategoria.invalid) return;
    const cuerpo = this.formCategoria.getRawValue();
    const actual = this.categoriaEditando();
    const peticion = actual
      ? this.http.put(`/api/admin/carta/categorias/${actual.id}`, cuerpo)
      : this.http.post('/api/admin/carta/categorias', cuerpo);

    peticion.subscribe({
      next: () => {
        this.toasts.exito(actual ? 'Categoría actualizada.' : 'Categoría creada.');
        this.cerrarCategoria();
        this.categorias.reload();
      },
      error: (e: unknown) => this.toasts.error(mensajeError(e, 'No se pudo guardar.')),
    });
  }

  protected alternarCategoria(categoria: Categoria): void {
    const desactivando = categoria.activo;
    confirmar(this.dialogo, {
      titulo: desactivando ? 'Desactivar categoría' : 'Activar categoría',
      mensaje: desactivando
        ? `¿Desactivar "${categoria.nombre}"? Desaparece de la carta.`
        : `¿Volver a mostrar "${categoria.nombre}" en la carta?`,
      textoConfirmar: desactivando ? 'Desactivar' : 'Activar',
      peligroso: desactivando,
    }).subscribe((ok) => {
      if (!ok) return;
      this.http.post(`/api/admin/carta/categorias/${categoria.id}/alternar`, {}).subscribe({
        next: () => this.categorias.reload(),
        error: (e: unknown) =>
          this.toasts.error(mensajeError(e, 'No se pudo cambiar el estado.')),
      });
    });
  }

  // --- Productos ---

  protected nuevoProducto(): void {
    this.productoEditando.set(null);
    const primera = this.categorias.value()?.[0];
    this.formProducto.reset({
      categoriaId: primera?.id ?? 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      requierePreparacion: true,
    });
    this.abrirProducto();
  }

  protected editarProducto(producto: Producto): void {
    this.productoEditando.set(producto);
    this.formProducto.reset({
      categoriaId: producto.categoriaId,
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      precio: producto.precio,
      requierePreparacion: producto.requierePreparacion,
    });
    this.abrirProducto();
  }

  private abrirProducto(): void {
    this.refProducto = this.dialogo.open(this.plantillaProducto(), {
      ariaLabel: this.productoEditando() ? 'Editar producto' : 'Nuevo producto',
    });
    this.refProducto.closed.subscribe(() => {
      this.refProducto = null;
      this.productoEditando.set(null);
    });
  }

  protected cerrarProducto(): void {
    this.refProducto?.close();
  }

  protected guardarProducto(): void {
    if (this.formProducto.invalid) return;
    const valores = this.formProducto.getRawValue();
    const cuerpo = {
      ...valores,
      categoriaId: Number(valores.categoriaId),
      descripcion: valores.descripcion.trim() === '' ? null : valores.descripcion,
    };
    const actual = this.productoEditando();
    const peticion = actual
      ? this.http.put(`/api/admin/carta/productos/${actual.id}`, cuerpo)
      : this.http.post('/api/admin/carta/productos', cuerpo);

    peticion.subscribe({
      next: () => {
        this.toasts.exito(actual ? 'Producto actualizado.' : 'Producto creado.');
        this.cerrarProducto();
        this.productos.reload();
      },
      error: (e: unknown) => this.toasts.error(mensajeError(e, 'No se pudo guardar.')),
    });
  }

  protected alternarProducto(producto: Producto): void {
    const quitando = producto.activo;
    confirmar(this.dialogo, {
      titulo: quitando ? 'Quitar de la carta' : 'Volver a la carta',
      mensaje: quitando
        ? `¿Quitar "${producto.nombre}" de la carta? Las cuentas ya cobradas lo conservan.`
        : `¿Volver a ofrecer "${producto.nombre}"?`,
      textoConfirmar: quitando ? 'Quitar' : 'Activar',
      peligroso: quitando,
    }).subscribe((ok) => {
      if (!ok) return;
      this.http.post(`/api/admin/carta/productos/${producto.id}/alternar`, {}).subscribe({
        next: () => this.productos.reload(),
        error: (e: unknown) =>
          this.toasts.error(mensajeError(e, 'No se pudo cambiar el estado.')),
      });
    });
  }

  // --- Receta ---

  protected abrirReceta(producto: Producto): void {
    this.productoReceta.set(producto);
    const primero = this.insumosActivos()[0];
    this.formRenglon.reset({ insumoId: primero?.id ?? 0, cantidad: 0 });
    this.refReceta = this.dialogo.open(this.plantillaReceta(), { ariaLabel: 'Receta' });
    this.refReceta.closed.subscribe(() => {
      this.refReceta = null;
      this.productoReceta.set(null);
    });
  }

  protected cerrarReceta(): void {
    this.refReceta?.close();
  }

  protected agregarRenglon(): void {
    const producto = this.productoReceta();
    if (!producto || this.formRenglon.invalid) return;
    const valores = this.formRenglon.getRawValue();

    this.http
      .post(`/api/admin/carta/productos/${producto.id}/receta`, {
        insumoId: Number(valores.insumoId),
        cantidad: valores.cantidad,
      })
      .subscribe({
        next: () => {
          this.receta.reload();
          this.formRenglon.patchValue({ cantidad: 0 });
        },
        error: (e: unknown) =>
          this.toasts.error(mensajeError(e, 'No se pudo agregar el insumo.')),
      });
  }

  protected quitarRenglon(renglon: RenglonReceta): void {
    this.http.delete(`/api/admin/carta/receta/${renglon.id}`).subscribe({
      next: () => this.receta.reload(),
      error: (e: unknown) => this.toasts.error(mensajeError(e, 'No se pudo quitar el insumo.')),
    });
  }
}
