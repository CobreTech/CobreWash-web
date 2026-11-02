import type { TasaServicio } from "./modelo";
import { factorConversion } from "./unidades";

/** Fila de TasaConsumo tal como la guarda la base de datos. */
export interface FilaTasa {
  servicioId: string;
  insumoId: string;
  tasaInicial: number;
  tasaActual: number;
  /** Unidad en que el admin escribió la tasa, por kg: ml, L, g o kg. */
  unidad: string;
}

export interface InsumoBase {
  id: string;
  unidadMedida: string;
}

/**
 * Agrupa las tasas por insumo y las lleva a la unidad del insumo por kg.
 * Las tasas con unidades incompatibles se omiten y se informan.
 */
export function tasasPorInsumo(filas: FilaTasa[], insumos: InsumoBase[]) {
  const unidad = new Map(insumos.map((i) => [i.id, i.unidadMedida]));
  const tasas: Record<string, TasaServicio[]> = {};
  const omitidas: FilaTasa[] = [];
  for (const fila of filas) {
    const unidadInsumo = unidad.get(fila.insumoId);
    const factor = unidadInsumo ? factorConversion(fila.unidad, unidadInsumo) : null;
    if (factor === null) { omitidas.push(fila); continue; }
    (tasas[fila.insumoId] ??= []).push({
      servicioId: fila.servicioId,
      tasaInicial: fila.tasaInicial * factor,
      tasaActual: fila.tasaActual * factor,
    });
  }
  return { tasas, omitidas };
}

/** Convierte una tasa por kg entre unidades; null si no son comparables. */
export function convertirTasa(valor: number, desde: string, hacia: string): number | null {
  const factor = factorConversion(desde, hacia);
  return factor === null ? null : valor * factor;
}
