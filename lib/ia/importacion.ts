import type { ErrorCsv, FilaCsv, TipoCsv } from "./csv";

const uuid = (id: string) => id.replaceAll("-", "").toLowerCase();
const instante = (fecha: string) => Date.parse(fecha);

export interface RegistrosExistentes {
  conteoInventarios: { insumoId: string; fechaConteo?: string | null }[];
  movimientoInventarios: { insumoId: string; fecha: string; cantidad: number }[];
}

/** Rango de fechas que cubre el archivo, para buscar registros ya guardados. */
export function rangoFilas(filas: FilaCsv[]) {
  const tiempos = filas.map((f) => instante(f.fecha));
  return { desde: new Date(Math.min(...tiempos)).toISOString(), hasta: new Date(Math.max(...tiempos)).toISOString() };
}

/**
 * Separa las filas que ya existen en la base para que volver a subir el mismo
 * archivo no duplique datos. Un conteo se repite si coincide insumo y fecha;
 * una compra, si además coincide la cantidad.
 */
export function separarRepetidas(filas: FilaCsv[], tipo: TipoCsv, existentes: RegistrosExistentes) {
  const claves = new Set(
    tipo === "conteos"
      ? existentes.conteoInventarios.filter((c) => c.fechaConteo).map((c) => `${uuid(c.insumoId)}|${instante(c.fechaConteo!)}`)
      : existentes.movimientoInventarios.map((m) => `${uuid(m.insumoId)}|${instante(m.fecha)}|${m.cantidad}`),
  );
  const nuevas: FilaCsv[] = [];
  const repetidas: ErrorCsv[] = [];
  for (const f of filas) {
    const clave = tipo === "conteos" ? `${uuid(f.insumoId)}|${instante(f.fecha)}` : `${uuid(f.insumoId)}|${instante(f.fecha)}|${f.cantidad}`;
    if (claves.has(clave)) repetidas.push({ linea: f.linea, mensaje: `Ya estaba registrada (${f.insumoNombre}).` });
    else nuevas.push(f);
  }
  return { nuevas, repetidas };
}

/**
 * Filas listas para insertar. Los conteos importados quedan aprobados y las
 * compras como COMPRA, ambos de origen REAL y sin tocar el stock actual.
 */
export function registrosParaGuardar(filas: FilaCsv[], tipo: TipoCsv, usuarioId: string, ahora: Date, crearId: () => string) {
  if (tipo === "conteos") {
    return filas.map((f) => ({
      id: crearId(), insumoId: f.insumoId, cantidadContada: f.cantidad, stockSistema: f.cantidad, revisionStock: 0,
      registradoPorId: usuarioId, estado: "APROBADO", resueltoPorId: usuarioId, resueltoEn: ahora.toISOString(),
      motivoResolucion: "Conteo histórico importado desde CSV", origen: "REAL", fechaConteo: f.fecha,
    }));
  }
  return filas.map((f) => ({
    id: crearId(), insumoId: f.insumoId, usuarioId, tipoMovimiento: "ENTRADA", cantidad: f.cantidad,
    motivo: "Compra histórica importada desde CSV", fecha: f.fecha, clase: "COMPRA", origen: "REAL",
  }));
}
