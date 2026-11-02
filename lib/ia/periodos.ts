import type { Compra, Conteo, Observacion, Origen, PeriodoDescartado, Produccion } from "./modelo";

export type ClaseMovimiento = "COMPRA" | "AJUSTE_CONTEO" | "STOCK_INICIAL" | "CONSUMO" | "OTRO";

/**
 * Clase de un movimiento de inventario. Las filas anteriores al módulo IA no
 * tienen clase: se deducen del motivo que dejaban las operaciones existentes.
 */
export function clasificarMovimiento(m: { clase?: ClaseMovimiento | null; tipoMovimiento: "ENTRADA" | "SALIDA"; motivo?: string | null }): ClaseMovimiento {
  if (m.clase) return m.clase;
  const motivo = (m.motivo ?? "").trim().toLowerCase();
  if (motivo.startsWith("conteo físico")) return "AJUSTE_CONTEO";
  if (m.tipoMovimiento === "SALIDA") return "CONSUMO";
  if (motivo === "stock inicial") return "STOCK_INICIAL";
  return "COMPRA";
}

const ms = (fecha: string) => Date.parse(fecha);
/** Pertenece al período (desde, hasta]: lo ocurrido junto al conteo final cuenta en ese período. */
const dentro = (fecha: string, desde: string, hasta: string) => ms(fecha) > ms(desde) && ms(fecha) <= ms(hasta);

export interface DatosEntrenamiento {
  conteos: Conteo[];
  compras: Compra[];
  produccion: Produccion[];
}

/**
 * Arma una observación por cada par de conteos consecutivos de un insumo.
 *
 * Los datos reales y los simulados forman series separadas: nunca se compara
 * un conteo real con uno simulado. Con `incluirSimulado` en false, lo simulado
 * se ignora por completo.
 */
export function construirObservaciones(datos: DatosEntrenamiento, opciones: { incluirSimulado: boolean }) {
  const observaciones: Observacion[] = [];
  const descartados: PeriodoDescartado[] = [];
  const origenes: Origen[] = opciones.incluirSimulado ? ["REAL", "SIMULADO"] : ["REAL"];

  for (const origen of origenes) {
    const porInsumo = new Map<string, Conteo[]>();
    for (const c of datos.conteos) {
      if (c.origen !== origen || !Number.isFinite(ms(c.fecha))) continue;
      porInsumo.set(c.insumoId, [...(porInsumo.get(c.insumoId) ?? []), c]);
    }
    const compras = datos.compras.filter((c) => c.origen === origen);
    const produccion = datos.produccion.filter((p) => p.origen === origen && p.kg > 0);

    for (const [insumoId, lista] of porInsumo) {
      const ordenados = [...lista].sort((a, b) => ms(a.fecha) - ms(b.fecha));
      for (let i = 1; i < ordenados.length; i++) {
        const anterior = ordenados[i - 1], actual = ordenados[i];
        const periodo = { insumoId, origen, desde: anterior.fecha, hasta: actual.fecha };
        if (ms(actual.fecha) === ms(anterior.fecha)) {
          descartados.push({ ...periodo, motivo: "Dos conteos con la misma fecha y hora" });
          continue;
        }
        const comprado = compras
          .filter((c) => c.insumoId === insumoId && dentro(c.fecha, anterior.fecha, actual.fecha))
          .reduce((s, c) => s + c.cantidad, 0);
        const consumo = anterior.cantidad + comprado - actual.cantidad;
        const kgPorServicio: Record<string, number> = {};
        for (const p of produccion) {
          if (dentro(p.fecha, anterior.fecha, actual.fecha)) kgPorServicio[p.servicioId] = (kgPorServicio[p.servicioId] ?? 0) + p.kg;
        }
        const hayProduccion = Object.keys(kgPorServicio).length > 0;
        // Tolerancia de redondeo: los conteos se guardan con dos decimales.
        if (consumo < -0.01) descartados.push({ ...periodo, motivo: "Consumo negativo: puede faltar registrar una compra" });
        else if (!hayProduccion) descartados.push({ ...periodo, motivo: "Sin kg registrados en el período" });
        else observaciones.push({ ...periodo, consumo: Math.max(0, consumo), kgPorServicio });
      }
    }
  }
  return { observaciones, descartados };
}
