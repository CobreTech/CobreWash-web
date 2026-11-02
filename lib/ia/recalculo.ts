import { ajustarModelo } from "./ajuste";
import type { Compra, Conteo, MetodoError, Origen, Produccion } from "./modelo";
import { clasificarMovimiento, construirObservaciones, type ClaseMovimiento } from "./periodos";
import { consumoDiarioEstimado, consumoDiarioReciente } from "./prediccion";
import { convertirTasa, tasasPorInsumo } from "./tasas";

export const NOMBRE_MODELO = "Regresión regularizada no negativa";
const MAXIMO_DESCARTADOS = 50;

/** Datos que entrega GetDatosEntrenamientoIa. */
export interface DatosRecalculo {
  configuracionIa?: { margenSeguridad: number; lambda: number; incluirSimulado: boolean } | null;
  tasaConsumos: {
    tipoServicioId: string; insumoId: string; tasaInicial: number; tasaActual: number; unidad: string; fuente?: string | null;
    tipoServicio: { nombre: string };
  }[];
  insumos: { id: string; nombre: string; unidadMedida: string }[];
  conteoInventarios: { insumoId: string; cantidadContada: number; creadoEn: string; fechaConteo?: string | null; origen: Origen }[];
  movimientoInventarios: {
    insumoId: string; fecha: string; cantidad: number; origen: Origen;
    tipoMovimiento: "ENTRADA" | "SALIDA"; clase?: ClaseMovimiento | null; motivo?: string | null;
  }[];
  comandaDetalles: { tipoServicioId: string; pesoKg?: number | null; comanda: { fechaRecepcion: string } }[];
  produccionSimuladas: { tipoServicioId: string; fecha: string; kg: number }[];
  modelos: { _count: number }[];
}

/** Detalle de un ajuste que se guarda en ModeloIa.tasasJson. */
export interface DetalleAjuste {
  insumos: {
    insumoId: string;
    nombre: string;
    unidad: string;
    observaciones: number;
    mae: number | null;
    mape: number | null;
    desviacionRelativa: number;
    metodoError: MetodoError;
    /** Consumo diario reciente en la unidad del insumo; base de los días de stock. */
    consumoDiario: number | null;
    fuenteConsumo: "conteos" | "kg-recientes" | null;
    tasas: { servicioId: string; servicio: string; unidad: string; inicial: number; anterior: number; resultado: number }[];
  }[];
  descartados: { insumo: string; desde: string; hasta: string; motivo: string }[];
  totalDescartados: number;
}

const uuid = (id: string) => id.replaceAll("-", "").toLowerCase();
const redondear = (v: number) => Math.round(v * 1e4) / 1e4;

export const CONFIGURACION_INICIAL = { margenSeguridad: 0.15, lambda: 1, incluirSimulado: false };

/**
 * Prepara un recálculo completo: arma las observaciones entre conteos, ajusta
 * las tasas y devuelve el registro del modelo y las tasas a guardar. No toca
 * el stock: solo actualiza tasaActual y agrega una fila al historial.
 */
export function prepararRecalculo(datos: DatosRecalculo, opciones: { id: string; usuarioId: string; ahora: Date }) {
  const config = datos.configuracionIa ?? CONFIGURACION_INICIAL;
  const insumos = datos.insumos.map((i) => ({ ...i, id: uuid(i.id) }));
  const filas = datos.tasaConsumos.map((t) => ({ ...t, original: t, servicioId: uuid(t.tipoServicioId), insumoId: uuid(t.insumoId) }));
  const { tasas } = tasasPorInsumo(filas, insumos);
  if (!Object.keys(tasas).length) throw new Error("Define al menos una tasa de consumo para un insumo medido en volumen o masa.");

  const conteos: Conteo[] = datos.conteoInventarios.map((c) => ({
    insumoId: uuid(c.insumoId), fecha: c.fechaConteo ?? c.creadoEn, cantidad: c.cantidadContada, origen: c.origen,
  }));
  const compras: Compra[] = datos.movimientoInventarios
    .filter((m) => clasificarMovimiento(m) === "COMPRA")
    .map((m) => ({ insumoId: uuid(m.insumoId), fecha: m.fecha, cantidad: m.cantidad, origen: m.origen }));
  const produccionReal: Produccion[] = datos.comandaDetalles
    .filter((d) => (d.pesoKg ?? 0) > 0)
    .map((d) => ({ servicioId: uuid(d.tipoServicioId), fecha: d.comanda.fechaRecepcion, kg: d.pesoKg!, origen: "REAL" }));
  const produccion: Produccion[] = [
    ...produccionReal,
    ...datos.produccionSimuladas.map((p) => ({ servicioId: uuid(p.tipoServicioId), fecha: p.fecha, kg: p.kg, origen: "SIMULADO" as const })),
  ];

  const { observaciones, descartados } = construirObservaciones({ conteos, compras, produccion }, { incluirSimulado: config.incluirSimulado });
  const { insumos: resultados, resumen } = ajustarModelo(observaciones, tasas, config.lambda);
  const reales = observaciones.filter((o) => o.origen === "REAL");
  const nombreInsumo = new Map(insumos.map((i) => [i.id, i]));
  const filaTasa = new Map(filas.map((f) => [`${f.servicioId}|${f.insumoId}`, f]));

  const detalle: DetalleAjuste = {
    insumos: resultados.map((r) => {
      const insumo = nombreInsumo.get(r.insumoId)!;
      const medido = consumoDiarioReciente(reales, r.insumoId);
      const estimado = medido === null
        ? consumoDiarioEstimado(produccionReal, Object.entries(r.tasas).map(([servicioId, tasaActual]) => ({ servicioId, tasaInicial: tasaActual, tasaActual })), opciones.ahora)
        : null;
      return {
        insumoId: r.insumoId, nombre: insumo.nombre, unidad: insumo.unidadMedida, observaciones: r.observaciones,
        mae: r.mae, mape: r.mape, desviacionRelativa: r.desviacionRelativa, metodoError: r.metodoError,
        consumoDiario: medido ?? estimado, fuenteConsumo: medido !== null ? "conteos" : estimado !== null ? "kg-recientes" : null,
        tasas: Object.entries(r.tasas).map(([servicioId, valor]) => {
          const fila = filaTasa.get(`${servicioId}|${r.insumoId}`)!;
          return {
            servicioId, servicio: fila.tipoServicio.nombre, unidad: fila.unidad,
            inicial: fila.tasaInicial, anterior: fila.tasaActual,
            resultado: redondear(convertirTasa(valor, insumo.unidadMedida, fila.unidad)!),
          };
        }),
      };
    }),
    descartados: descartados.slice(0, MAXIMO_DESCARTADOS).map((d) => ({
      insumo: nombreInsumo.get(d.insumoId)?.nombre ?? "Insumo inactivo", desde: d.desde, hasta: d.hasta, motivo: d.motivo,
    })),
    totalDescartados: descartados.length,
  };

  const tasasActualizadas = detalle.insumos.flatMap((i) => i.tasas.map((t) => {
    const fila = filaTasa.get(`${t.servicioId}|${i.insumoId}`)!;
    return {
      tipoServicioId: fila.original.tipoServicioId, insumoId: fila.original.insumoId, tasaInicial: fila.tasaInicial, tasaActual: t.resultado,
      unidad: fila.unidad, fuente: fila.fuente ?? null, actualizadoPorId: opciones.usuarioId, actualizadoEn: opciones.ahora.toISOString(),
    };
  }));

  const modelo = {
    id: opciones.id,
    nombre: NOMBRE_MODELO,
    version: `v${(datos.modelos[0]?._count ?? 0) + 1}`,
    fechaEntrenamiento: opciones.ahora.toISOString(),
    activo: true,
    mae: resumen.mae,
    mape: resumen.mape,
    precisionEstimada: resumen.mape === null ? null : Math.max(0, Math.min(100, 100 - resumen.mape)),
    desviacionRelativa: resumen.desviacionRelativa,
    observaciones: resumen.observaciones,
    lambda: config.lambda,
    margenSeguridad: config.margenSeguridad,
    incluyeSimulado: config.incluirSimulado,
    tasasJson: JSON.stringify(detalle),
    ejecutadoPorId: opciones.usuarioId,
  };
  return { modelo, tasas: tasasActualizadas, detalle, resumen };
}

/** Lee el detalle guardado de un ajuste; null si falta o está dañado. */
export function leerDetalleAjuste(json?: string | null): DetalleAjuste | null {
  if (!json) return null;
  try {
    const d = JSON.parse(json);
    return Array.isArray(d?.insumos) && Array.isArray(d?.descartados) ? d : null;
  } catch { return null; }
}
