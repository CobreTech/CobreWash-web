import { ajustarModelo, consumoModelo } from "./ajuste";
import type { Observacion, TasaServicio } from "./modelo";
import { construirObservaciones } from "./periodos";
import { generarSimulacion, type ParametrosSimulacion } from "./simulacion";
import { convertirTasa, tasasPorInsumo } from "./tasas";

const DIA = 86_400_000;
const uuid = (id: string) => id.replaceAll("-", "").toLowerCase();

/** Datos que entrega GetTasasSimulacionIa. */
export interface DatosSimulacion {
  configuracionIa?: { lambda: number } | null;
  tasaConsumos: {
    tipoServicioId: string; insumoId: string; tasaInicial: number; tasaActual: number; unidad: string;
    tipoServicio: { nombre: string }; insumo: { nombre: string };
  }[];
  insumos: { id: string; nombre: string; unidadMedida: string }[];
}

export type ParametrosLote = Omit<ParametrosSimulacion, "inicio">;

/** Un punto de la curva: cómo queda el modelo con los primeros `periodos` de datos. */
export interface PuntoCurva {
  periodos: number;
  /** Error al predecir los períodos que el modelo aún no vio (MAPE, %); null si no queda ninguno. */
  mape: number | null;
  /** Distancia media de las tasas aprendidas a las verdaderas (%). */
  errorTasas: number;
}

export interface TasaVerdadera {
  insumo: string;
  servicio: string;
  unidad: string;
  inicial: number;
  verdadera: number;
}

/**
 * Ajusta el modelo con los primeros 0, 1, 2… períodos simulados y, en cada
 * paso, mide el error al predecir los períodos siguientes (que el modelo no
 * vio) y cuánto se alejan las tasas de las verdaderas ocultas. Es la
 * demostración de que el error baja a medida que entran conteos.
 */
export function curvaAprendizaje(
  observaciones: Observacion[],
  tasas: Record<string, TasaServicio[]>,
  verdaderas: Record<string, Record<string, number>>,
  lambda: number,
): PuntoCurva[] {
  const porInsumo = new Map<string, Observacion[]>();
  for (const o of observaciones) porInsumo.set(o.insumoId, [...(porInsumo.get(o.insumoId) ?? []), o]);
  for (const lista of porInsumo.values()) lista.sort((a, b) => Date.parse(a.hasta) - Date.parse(b.hasta));
  const maximo = Math.max(0, ...[...porInsumo.values()].map((l) => l.length));
  const curva: PuntoCurva[] = [];
  for (let n = 0; n < Math.max(1, maximo); n++) {
    const primeras = [...porInsumo.values()].flatMap((l) => l.slice(0, n));
    const { insumos } = ajustarModelo(primeras, tasas, lambda);
    const tasasDe = new Map(insumos.map((r) => [r.insumoId, r.tasas]));
    const futuras = [...porInsumo.values()].flatMap((l) => l.slice(n)).filter((o) => o.consumo > 0 && tasasDe.has(o.insumoId));
    const errorFuturo = futuras.map((o) => Math.abs(o.consumo - consumoModelo(o.kgPorServicio, tasasDe.get(o.insumoId)!)) / o.consumo * 100);
    const errores = insumos.flatMap((r) =>
      Object.entries(r.tasas).flatMap(([servicio, valor]) => {
        const v = verdaderas[r.insumoId]?.[servicio];
        return v ? [Math.abs(valor - v) / v * 100] : [];
      }),
    );
    curva.push({
      periodos: n,
      mape: errorFuturo.length ? errorFuturo.reduce((s, e) => s + e, 0) / errorFuturo.length : null,
      errorTasas: errores.length ? errores.reduce((s, e) => s + e, 0) / errores.length : 0,
    });
  }
  return curva;
}

/**
 * Genera un lote simulado listo para guardar: producción diaria, compras y un
 * conteo semanal por insumo, todo marcado SIMULADO y ligado al lote. El lote
 * termina en `ahora`, así sus fechas no se cruzan con datos futuros.
 */
export function prepararLoteSimulado(
  datos: DatosSimulacion,
  entrada: ParametrosLote,
  opciones: { id: string; usuarioId: string; ahora: Date; crearId: () => string },
) {
  const insumos = datos.insumos.map((i) => ({ ...i, id: uuid(i.id) }));
  const filas = datos.tasaConsumos.map((t) => ({ ...t, servicioId: uuid(t.tipoServicioId), insumoId: uuid(t.insumoId) }));
  const { tasas } = tasasPorInsumo(filas, insumos);
  if (!Object.keys(tasas).length) throw new Error("Define al menos una tasa de consumo antes de simular.");

  // Al guardar se usan los ids tal como vinieron de la base.
  const idServicio = new Map(datos.tasaConsumos.map((t) => [uuid(t.tipoServicioId), t.tipoServicioId]));
  const idInsumo = new Map(datos.tasaConsumos.map((t) => [uuid(t.insumoId), t.insumoId]));
  const parametros: ParametrosSimulacion = { ...entrada, inicio: new Date(opciones.ahora.getTime() - entrada.semanas * 7 * DIA).toISOString() };
  const r = generarSimulacion({ parametros, tasas });

  const { observaciones } = construirObservaciones({
    conteos: r.conteos.map((c) => ({ ...c, origen: "SIMULADO" as const })),
    compras: r.compras.map((c) => ({ ...c, origen: "SIMULADO" as const })),
    produccion: r.produccion.map((p) => ({ ...p, origen: "SIMULADO" as const })),
  }, { incluirSimulado: true });
  const curva = curvaAprendizaje(observaciones, tasas, r.tasasVerdaderas, datos.configuracionIa?.lambda ?? 1);

  const unidadInsumo = new Map(insumos.map((i) => [i.id, i.unidadMedida]));
  const verdaderas: TasaVerdadera[] = filas
    .filter((f) => r.tasasVerdaderas[f.insumoId]?.[f.servicioId] !== undefined)
    .map((f) => ({
      insumo: f.insumo.nombre, servicio: f.tipoServicio.nombre, unidad: f.unidad, inicial: f.tasaInicial,
      verdadera: Math.round(convertirTasa(r.tasasVerdaderas[f.insumoId][f.servicioId], unidadInsumo.get(f.insumoId)!, f.unidad)! * 1e4) / 1e4,
    }));

  const comun = { origen: "SIMULADO", simulacionId: opciones.id };
  return {
    simulacion: {
      id: opciones.id, semanas: entrada.semanas, creadoPorId: opciones.usuarioId,
      parametrosJson: JSON.stringify({ parametros, curva }),
      tasasVerdaderasJson: JSON.stringify(verdaderas),
    },
    produccion: r.produccion.map((p) => ({ id: opciones.crearId(), simulacionId: opciones.id, tipoServicioId: idServicio.get(p.servicioId)!, fecha: p.fecha, kg: p.kg })),
    conteos: r.conteos.map((c) => ({
      id: opciones.crearId(), insumoId: idInsumo.get(c.insumoId)!, cantidadContada: c.cantidad, stockSistema: c.cantidad, revisionStock: 0,
      registradoPorId: opciones.usuarioId, estado: "APROBADO", resueltoPorId: opciones.usuarioId, resueltoEn: opciones.ahora.toISOString(),
      motivoResolucion: "Conteo simulado", fechaConteo: c.fecha, ...comun,
    })),
    compras: r.compras.map((c) => ({
      id: opciones.crearId(), insumoId: idInsumo.get(c.insumoId)!, usuarioId: opciones.usuarioId, tipoMovimiento: "ENTRADA",
      cantidad: c.cantidad, motivo: "Compra simulada", fecha: c.fecha, clase: "COMPRA", ...comun,
    })),
    curva,
    verdaderas,
  };
}

/** Lee lo guardado de un lote; tolera JSON dañado para no romper la pantalla. */
export function leerLote(parametrosJson: string, tasasVerdaderasJson: string) {
  try {
    const p = JSON.parse(parametrosJson);
    const v = JSON.parse(tasasVerdaderasJson);
    if (!p?.parametros || !Array.isArray(p?.curva) || !Array.isArray(v)) return null;
    return { parametros: p.parametros as ParametrosSimulacion, curva: p.curva as PuntoCurva[], verdaderas: v as TasaVerdadera[] };
  } catch { return null; }
}
