import { DESVIACION_PREVIA } from "./ajuste";
import type { Observacion, Produccion, TasaServicio } from "./modelo";

export interface LineaComanda {
  servicioId: string;
  kg: number;
}

export interface InsumoStock {
  id: string;
  nombre: string;
  unidadMedida: string;
  stockActual: number;
}

/** ok: alcanza con margen · justo: alcanza solo sin margen · insuficiente: no alcanza. */
export type NivelStock = "ok" | "justo" | "insuficiente";

export interface EstimacionInsumo {
  insumoId: string;
  nombre: string;
  unidad: string;
  /** kg × tasa, sin margen. */
  estimado: number;
  minimo: number;
  maximo: number;
  /** Lo que conviene tener disponible: estimado × (1 + margen). */
  reservado: number;
  stockActual: number;
  nivel: NivelStock;
}

/** Suma los kg por servicio, ignorando líneas vacías o inválidas. */
export function kgPorServicio(lineas: LineaComanda[]): Record<string, number> {
  const total: Record<string, number> = {};
  for (const l of lineas) if (Number.isFinite(l.kg) && l.kg > 0) total[l.servicioId] = (total[l.servicioId] ?? 0) + l.kg;
  return total;
}

/**
 * Consumo estimado de una comanda por insumo:
 *   estimado = Σ kg × tasa(servicio, insumo)
 *   rango    = estimado × (1 ± desviación relativa del insumo)
 *   reserva  = estimado × (1 + margen de seguridad)
 * Las tasas deben venir en unidad del insumo por kg (ver tasasPorInsumo).
 */
export function estimarComanda(entrada: {
  lineas: LineaComanda[];
  tasas: Record<string, TasaServicio[]>;
  insumos: InsumoStock[];
  margenSeguridad: number;
  desviaciones?: Record<string, number>;
}) {
  const kg = kgPorServicio(entrada.lineas);
  const estimaciones: EstimacionInsumo[] = [];
  const conTasa = new Set<string>();
  for (const insumo of entrada.insumos) {
    const tasas = (entrada.tasas[insumo.id] ?? []).filter((t) => kg[t.servicioId]);
    if (!tasas.length) continue;
    tasas.forEach((t) => conTasa.add(t.servicioId));
    const estimado = tasas.reduce((s, t) => s + kg[t.servicioId] * t.tasaActual, 0);
    const desviacion = entrada.desviaciones?.[insumo.id] ?? DESVIACION_PREVIA;
    const reservado = estimado * (1 + Math.max(0, entrada.margenSeguridad));
    estimaciones.push({
      insumoId: insumo.id,
      nombre: insumo.nombre,
      unidad: insumo.unidadMedida,
      estimado,
      minimo: Math.max(0, estimado * (1 - desviacion)),
      maximo: estimado * (1 + desviacion),
      reservado,
      stockActual: insumo.stockActual,
      nivel: estimado > insumo.stockActual ? "insuficiente" : reservado > insumo.stockActual ? "justo" : "ok",
    });
  }
  estimaciones.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  return {
    insumos: estimaciones,
    /** Servicios con kg en la comanda que no tienen ninguna tasa definida. */
    serviciosSinTasa: Object.keys(kg).filter((s) => !conTasa.has(s)),
    alerta: estimaciones.some((e) => e.nivel === "insuficiente"),
  };
}

const DIA = 86_400_000;

/**
 * Consumo diario promedio medido en los períodos más recientes de un insumo,
 * tomando hacia atrás los períodos necesarios para cubrir `ventanaDias`.
 */
export function consumoDiarioReciente(observaciones: Observacion[], insumoId: string, ventanaDias = 28): number | null {
  const propias = observaciones
    .filter((o) => o.insumoId === insumoId)
    .sort((a, b) => Date.parse(b.hasta) - Date.parse(a.hasta));
  let dias = 0, consumo = 0;
  for (const o of propias) {
    const duracion = (Date.parse(o.hasta) - Date.parse(o.desde)) / DIA;
    if (!(duracion > 0)) continue;
    dias += duracion;
    consumo += o.consumo;
    if (dias >= ventanaDias) break;
  }
  return dias > 0 ? consumo / dias : null;
}

/**
 * Consumo diario esperado según los kg procesados en los últimos días. Sirve
 * mientras aún no hay dos conteos para medir el consumo real.
 */
export function consumoDiarioEstimado(produccion: Produccion[], tasas: TasaServicio[], ahora: Date, ventanaDias = 30): number | null {
  const desde = ahora.getTime() - ventanaDias * DIA;
  const tasa = new Map(tasas.map((t) => [t.servicioId, t.tasaActual]));
  const recientes = produccion.filter((p) => {
    const t = Date.parse(p.fecha);
    return t > desde && t <= ahora.getTime() && tasa.has(p.servicioId);
  });
  if (!recientes.length) return null;
  return recientes.reduce((s, p) => s + p.kg * tasa.get(p.servicioId)!, 0) / ventanaDias;
}

/** Días que dura el stock al ritmo de consumo indicado; null si no hay consumo. */
export function diasDeStock(stockActual: number, consumoDiario: number | null): number | null {
  if (consumoDiario === null || !(consumoDiario > 0)) return null;
  return Math.max(0, stockActual) / consumoDiario;
}
