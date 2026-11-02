import type { MetodoError, Observacion, ResultadoInsumo, TasaServicio } from "./modelo";
import { nnlsGram } from "./nnls";

/** Incertidumbre supuesta antes de tener evidencia (±25%). */
export const DESVIACION_PREVIA = 0.25;
/** Piso del rango: nunca se promete más precisión que ±5%. */
export const DESVIACION_MINIMA = 0.05;
/** Peso de la incertidumbre previa, en número de períodos equivalentes. */
const PESO_PREVIA = 2;
/** Desde cuántos períodos se mide el error con validación cruzada. */
export const MINIMO_VALIDACION = 3;

/** Consumo que el modelo explica para un conjunto de kg por servicio. */
export function consumoModelo(kgPorServicio: Record<string, number>, tasas: Record<string, number>) {
  return Object.entries(kgPorServicio).reduce((s, [servicioId, kg]) => s + kg * (tasas[servicioId] ?? 0), 0);
}

/**
 * Ajusta las tasas de un insumo:
 *   min ||Xθ − y||² + λ·escala·||θ − θ0||²  con θ ≥ 0
 *
 * X son los kg por servicio de cada período e y el consumo medido. `escala`
 * es el promedio de kg² por período y servicio, de modo que λ = 1 pesa como
 * un período de evidencia: con pocos conteos las tasas quedan cerca de las
 * iniciales y con muchos domina lo observado. Los servicios sin kg en ningún
 * período conservan su tasa inicial.
 */
export function ajustarTasas(observaciones: Observacion[], servicios: TasaServicio[], lambda: number): Record<string, number> {
  const tasas: Record<string, number> = Object.fromEntries(servicios.map((s) => [s.servicioId, s.tasaInicial]));
  const activos = servicios.filter((s) => observaciones.some((o) => (o.kgPorServicio[s.servicioId] ?? 0) > 0));
  if (!activos.length) return tasas;

  const X = observaciones.map((o) => activos.map((s) => o.kgPorServicio[s.servicioId] ?? 0));
  const y = observaciones.map((o) => o.consumo);
  const n = activos.length;
  const G = activos.map((_, i) => activos.map((__, j) => X.reduce((s, fila) => s + fila[i] * fila[j], 0)));
  const h = activos.map((_, i) => X.reduce((s, fila, p) => s + fila[i] * y[p], 0));
  const escala = G.reduce((s, fila, i) => s + fila[i], 0) / (n * observaciones.length);
  const peso = Math.max(0, lambda) * escala;
  for (let i = 0; i < n; i++) {
    G[i][i] += peso;
    h[i] += peso * activos[i].tasaInicial;
  }
  nnlsGram(G, h).forEach((valor, i) => (tasas[activos[i].servicioId] = valor));
  return tasas;
}

const media = (valores: number[]) => valores.reduce((s, v) => s + v, 0) / valores.length;

/**
 * Ajusta un insumo y mide su error. Con al menos tres períodos el error se
 * mide dejando cada período fuera del ajuste y prediciéndolo (validación
 * cruzada), que muestra cómo se comporta el modelo con datos que no vio.
 */
export function ajustarInsumo(insumoId: string, observaciones: Observacion[], servicios: TasaServicio[], lambda: number): ResultadoInsumo {
  const propias = observaciones.filter((o) => o.insumoId === insumoId);
  const tasas = ajustarTasas(propias, servicios, lambda);
  if (!propias.length) {
    return { insumoId, tasas, observaciones: 0, mae: null, mape: null, desviacionRelativa: DESVIACION_PREVIA, metodoError: "sin-datos" };
  }
  const metodoError: MetodoError = propias.length >= MINIMO_VALIDACION ? "validacion-cruzada" : "ajuste";
  const predicciones = propias.map((o, i) =>
    consumoModelo(o.kgPorServicio, metodoError === "ajuste" ? tasas : ajustarTasas(propias.filter((_, k) => k !== i), servicios, lambda)),
  );
  const errores = propias.map((o, i) => o.consumo - predicciones[i]);
  const conConsumo = propias.flatMap((o, i) => (o.consumo > 0 ? [Math.abs(errores[i]) / o.consumo] : []));
  const relativos = predicciones.flatMap((p, i) => (p > 0 ? [errores[i] / p] : []));
  const rms = relativos.length ? Math.sqrt(media(relativos.map((r) => r * r))) : DESVIACION_PREVIA;
  const desviacion = Math.sqrt((PESO_PREVIA * DESVIACION_PREVIA ** 2 + relativos.length * rms ** 2) / (PESO_PREVIA + relativos.length));
  return {
    insumoId,
    tasas,
    observaciones: propias.length,
    mae: media(errores.map(Math.abs)),
    mape: conConsumo.length ? media(conConsumo) * 100 : null,
    desviacionRelativa: Math.max(DESVIACION_MINIMA, desviacion),
    metodoError,
  };
}

export interface ResumenAjuste {
  observaciones: number;
  /** Promedio de los MAE de cada insumo. Cada uno está en la unidad de su insumo. */
  mae: number | null;
  /** MAPE ponderado por la cantidad de períodos de cada insumo. */
  mape: number | null;
  desviacionRelativa: number;
}

/** Ajusta todos los insumos con tasas definidas y resume el error global. */
export function ajustarModelo(
  observaciones: Observacion[],
  tasasPorInsumo: Record<string, TasaServicio[]>,
  lambda: number,
): { insumos: ResultadoInsumo[]; resumen: ResumenAjuste } {
  const insumos = Object.entries(tasasPorInsumo)
    .filter(([, servicios]) => servicios.length > 0)
    .map(([insumoId, servicios]) => ajustarInsumo(insumoId, observaciones, servicios, lambda));
  const conError = insumos.filter((r) => r.mae !== null);
  const conMape = insumos.filter((r) => r.mape !== null);
  const total = insumos.reduce((s, r) => s + r.observaciones, 0);
  const pesoMape = conMape.reduce((s, r) => s + r.observaciones, 0);
  return {
    insumos,
    resumen: {
      observaciones: total,
      mae: conError.length ? media(conError.map((r) => r.mae!)) : null,
      mape: pesoMape ? conMape.reduce((s, r) => s + r.mape! * r.observaciones, 0) / pesoMape : null,
      desviacionRelativa: insumos.length
        ? insumos.reduce((s, r) => s + r.desviacionRelativa * Math.max(1, r.observaciones), 0) / insumos.reduce((s, r) => s + Math.max(1, r.observaciones), 0)
        : DESVIACION_PREVIA,
    },
  };
}
