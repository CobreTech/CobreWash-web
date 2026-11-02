/**
 * Tipos compartidos del módulo IA de predicción de insumos.
 *
 * Todas las cantidades de insumo se expresan en la unidad del insumo
 * (Insumo.unidadMedida) y todas las tasas en "unidad del insumo por kg".
 * La conversión desde la unidad en que el admin escribe la tasa (ml, g...)
 * ocurre una sola vez en lib/ia/unidades.ts.
 */

export type Origen = "REAL" | "SIMULADO";

/** Conteo físico aprobado: el stock medido de un insumo en un instante. */
export interface Conteo {
  insumoId: string;
  fecha: string;
  cantidad: number;
  origen: Origen;
}

/** Compra o reposición de un insumo. */
export interface Compra {
  insumoId: string;
  fecha: string;
  cantidad: number;
  origen: Origen;
}

/** Kg de ropa procesados con un servicio (línea de comanda o día simulado). */
export interface Produccion {
  servicioId: string;
  fecha: string;
  kg: number;
  origen: Origen;
}

/** Consumo de un insumo medido entre dos conteos consecutivos del mismo origen. */
export interface Observacion {
  insumoId: string;
  origen: Origen;
  desde: string;
  hasta: string;
  /** stock_anterior + compras − stock_actual */
  consumo: number;
  kgPorServicio: Record<string, number>;
}

export interface PeriodoDescartado {
  insumoId: string;
  origen: Origen;
  desde: string;
  hasta: string;
  motivo: string;
}

/** Tasa de un servicio ya convertida a la unidad del insumo por kg. */
export interface TasaServicio {
  servicioId: string;
  tasaInicial: number;
  tasaActual: number;
}

/** Cómo se midió el error del ajuste. */
export type MetodoError = "validacion-cruzada" | "ajuste" | "sin-datos";

export interface ResultadoInsumo {
  insumoId: string;
  /** Tasas resultantes por servicio, en unidad del insumo por kg. */
  tasas: Record<string, number>;
  observaciones: number;
  /** Error absoluto medio por período, en la unidad del insumo. */
  mae: number | null;
  /** Error porcentual medio por período (0-100). */
  mape: number | null;
  /** Desviación relativa usada para el rango de cada estimación (0.25 = ±25%). */
  desviacionRelativa: number;
  metodoError: MetodoError;
}
