export interface Sesion {
  correo: string;
  nombre: string;
  rol: string;
}

export interface Usuario {
  id: number;
  correo: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

export interface Health {
  status: string;
  db: string;
  timestamp: string;
}

/** Item de la navegación lateral; `icono` apunta al set inline del sidebar. */
export interface NavItem {
  ruta: string;
  etiqueta: string;
  icono: 'panel' | 'lista' | 'usuarios' | 'mesas' | 'cocina' | 'carta' | 'bodega';
}

// --- Carta ---

export interface ProductoCarta {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  requierePreparacion: boolean;
  /** Unidades que alcanzan los insumos; null = sin receta, sin límite. */
  disponibles: number | null;
}

export interface CategoriaCarta {
  id: number;
  nombre: string;
  productos: ProductoCarta[];
}

// --- Salón y cuentas ---

export interface MesaSalon {
  id: number;
  numero: number;
  nombre: string | null;
  /** Null = mesa libre. */
  comandaId: number | null;
  total: number | null;
  itemsPendientes: number | null;
}

export type EstadoItem = 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'anulado';

export interface ComandaItem {
  id: number;
  productoId: number;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  estado: EstadoItem;
  nota: string | null;
  creadoEn: string;
}

export interface Comanda {
  id: number;
  mesaId: number | null;
  mesaNumero: number | null;
  estado: 'abierta' | 'cobrada' | 'anulada';
  total: number;
  metodoPago: string | null;
  nota: string | null;
  abiertaEn: string;
  cerradaEn: string | null;
  items: ComandaItem[];
}

export const METODOS_PAGO = ['efectivo', 'debito', 'credito', 'transferencia'] as const;
export type MetodoPago = (typeof METODOS_PAGO)[number];

// --- Cocina ---

export interface LineaCocina {
  id: number;
  comandaId: number;
  mesaNumero: number | null;
  nombreProducto: string;
  cantidad: number;
  estado: EstadoItem;
  nota: string | null;
  creadoEn: string;
}

// --- Bodega ---

export type UnidadInsumo = 'g' | 'ml' | 'unidad';

export interface Insumo {
  id: number;
  nombre: string;
  unidad: UnidadInsumo;
  stock: number;
  stockMinimo: number;
  costoUnitario: number;
  activo: boolean;
  bajoMinimo: boolean;
}

export interface MovimientoInsumo {
  id: number;
  insumo: string;
  unidad: UnidadInsumo;
  tipo: 'entrada' | 'salida' | 'ajuste' | 'merma';
  cantidad: number;
  stockResultante: number;
  motivo: string | null;
  creadoEn: string;
}

// --- Mantención de la carta ---

export interface Categoria {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface Producto {
  id: number;
  categoriaId: number;
  categoriaNombre: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  requierePreparacion: boolean;
  activo: boolean;
}

export interface RenglonReceta {
  id: number;
  insumoId: number;
  insumoNombre: string;
  unidad: UnidadInsumo;
  cantidad: number;
}

export interface Mesa {
  id: number;
  numero: number;
  nombre: string | null;
  activa: boolean;
}
