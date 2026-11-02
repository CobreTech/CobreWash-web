import { DESVIACION_PREVIA } from "./ajuste";
import { estimarComanda } from "./prediccion";
import { leerDetalleAjuste } from "./recalculo";
import { tasasPorInsumo } from "./tasas";

export const PESO_MAXIMO_KG = 10_000;
const uuid = (id: string) => id.replaceAll("-", "").toLowerCase();

/** Lee el peso escrito en el formulario ("12,5" o "12.5"); null si no es válido. */
export function leerPesoKg(texto: string): number | null {
  const limpio = texto.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(limpio)) return null;
  const kg = Number(limpio);
  return kg > 0 && kg <= PESO_MAXIMO_KG ? kg : null;
}

/**
 * Reparte el peso total de la comanda entre sus líneas según la cantidad de
 * prendas. La suma es exacta (la última línea absorbe el redondeo), que es lo
 * que usa el modelo: los kg por servicio.
 */
export function repartirPeso(totalKg: number, cantidades: number[]): number[] {
  if (!(totalKg > 0) || !cantidades.length) return cantidades.map(() => 0);
  const unidades = cantidades.map((c) => Math.max(1, c));
  const suma = unidades.reduce((s, c) => s + c, 0);
  const partes = unidades.map((c) => Math.round((totalKg * c / suma) * 100) / 100);
  const resto = Math.round((totalKg - partes.reduce((s, p) => s + p, 0)) * 100) / 100;
  partes[partes.length - 1] = Math.round((partes[partes.length - 1] + resto) * 100) / 100;
  return partes;
}

/** Datos de GetModeloComandaIa. */
export interface ModeloComanda {
  configuracionIa?: { margenSeguridad: number } | null;
  tasaConsumos: { tipoServicioId: string; insumoId: string; tasaInicial: number; tasaActual: number; unidad: string }[];
  insumos: { id: string; nombre: string; unidadMedida: string; stockActual: number }[];
  modeloVigente: { desviacionRelativa?: number | null; tasasJson?: string | null }[];
}

/**
 * Estima el consumo de una comanda con las tasas actuales: rango según la
 * desviación de cada insumo en el último ajuste y alerta si el stock no alcanza.
 */
export function estimarConsumoComanda(modelo: ModeloComanda, servicioId: string, kg: number) {
  const insumos = modelo.insumos.map((i) => ({ ...i, id: uuid(i.id) }));
  const { tasas } = tasasPorInsumo(
    modelo.tasaConsumos.map((t) => ({ ...t, servicioId: uuid(t.tipoServicioId), insumoId: uuid(t.insumoId) })),
    insumos,
  );
  const vigente = modelo.modeloVigente[0];
  const general = vigente?.desviacionRelativa ?? DESVIACION_PREVIA;
  const desviaciones: Record<string, number> = Object.fromEntries(insumos.map((i) => [i.id, general]));
  for (const i of leerDetalleAjuste(vigente?.tasasJson)?.insumos ?? []) desviaciones[uuid(i.insumoId)] = i.desviacionRelativa;
  return estimarComanda({
    lineas: [{ servicioId: uuid(servicioId), kg }],
    tasas,
    insumos,
    margenSeguridad: modelo.configuracionIa?.margenSeguridad ?? 0.15,
    desviaciones,
  });
}

/** Muestra cantidades pequeñas en la subunidad (0,18 L → 180 ml). */
export function formatoCantidad(valor: number, unidad: string): { valor: string; unidad: string } {
  const sub = unidad === "L" ? "ml" : unidad === "kg" ? "g" : null;
  const usarSub = sub !== null && valor < 1;
  const v = usarSub ? valor * 1000 : valor;
  return { valor: v.toLocaleString("es-CL", { maximumFractionDigits: v < 10 ? 2 : v < 100 ? 1 : 0 }), unidad: usarSub ? sub! : unidad };
}
