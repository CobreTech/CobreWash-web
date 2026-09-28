export type EstadoStock = "OK" | "Bajo" | "Crítico" | "Inactivo";

export interface StockEvaluable {
  activo: boolean;
  stockActual: number;
  stockMinimo: number;
}

export interface MovimientoExportable {
  id: string;
  tipoMovimiento: "ENTRADA" | "SALIDA" | string;
  cantidad: number;
  motivo?: string | null;
  fecha: string;
  insumo: { id: string; nombre: string; unidadMedida: string };
  usuario?: { nombre: string; apellido?: string | null } | null;
}

export interface FiltrosMovimiento {
  insumoId?: string;
  tipo?: "ENTRADA" | "SALIDA" | "TODOS";
  fechaDesde?: string;
  fechaHasta?: string;
}

export function obtenerEstadoStock(item: StockEvaluable): EstadoStock {
  if (!item.activo) return "Inactivo";
  if (item.stockMinimo > 0 && item.stockActual <= item.stockMinimo * 0.5) return "Crítico";
  if (item.stockMinimo > 0 && item.stockActual <= item.stockMinimo) return "Bajo";
  return "OK";
}

function inicioDia(fecha: string) {
  return fecha ? new Date(`${fecha}T00:00:00`).getTime() : Number.NEGATIVE_INFINITY;
}

function finDia(fecha: string) {
  return fecha ? new Date(`${fecha}T23:59:59.999`).getTime() : Number.POSITIVE_INFINITY;
}

export function filtrarMovimientos<T extends MovimientoExportable>(
  movimientos: T[],
  filtros: FiltrosMovimiento,
): T[] {
  const desde = filtros.fechaDesde ? inicioDia(filtros.fechaDesde) : Number.NEGATIVE_INFINITY;
  const hasta = filtros.fechaHasta ? finDia(filtros.fechaHasta) : Number.POSITIVE_INFINITY;

  return movimientos.filter((movimiento) => {
    const fecha = new Date(movimiento.fecha).getTime();
    return (!filtros.insumoId || movimiento.insumo.id === filtros.insumoId)
      && (!filtros.tipo || filtros.tipo === "TODOS" || movimiento.tipoMovimiento === filtros.tipo)
      && fecha >= desde
      && fecha <= hasta;
  });
}

function celdaCsv(valor: string | number) {
  const texto = String(valor).replaceAll('"', '""');
  return `"${texto}"`;
}

export function crearCsvMovimientos(movimientos: MovimientoExportable[]) {
  const encabezado = ["Fecha", "Tipo", "Insumo", "Cantidad", "Unidad", "Motivo", "Usuario"];
  const filas = movimientos.map((movimiento) => [
    new Date(movimiento.fecha).toLocaleString("es-CL"),
    movimiento.tipoMovimiento,
    movimiento.insumo.nombre,
    movimiento.cantidad,
    movimiento.insumo.unidadMedida,
    movimiento.motivo || "",
    movimiento.usuario
      ? `${movimiento.usuario.nombre} ${movimiento.usuario.apellido ?? ""}`.trim()
      : "Sistema",
  ]);
  return `\uFEFF${[encabezado, ...filas].map((fila) => fila.map(celdaCsv).join(";")).join("\r\n")}`;
}
