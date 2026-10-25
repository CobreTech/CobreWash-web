import type { MovimientoExportable } from "./movimientos";

/** Recorre todas las páginas; nunca presenta una exportación truncada como completa. */
export async function leerHistorialCompleto<T extends MovimientoExportable>(
  cargar: (offset: number, limit: number) => Promise<{ movimientos: T[]; total: number }>,
): Promise<T[]> {
  const filas: T[] = [];
  const ids = new Set<string>();
  const limit = 500;
  let esperado: number | undefined;
  while (true) {
    const pagina = await cargar(filas.length, limit);
    esperado ??= pagina.total;
    if (pagina.total !== esperado || (pagina.movimientos.length === 0 && filas.length < esperado))
      throw new Error("El historial cambió durante la descarga. Intenta nuevamente.");
    for (const fila of pagina.movimientos) {
      if (ids.has(fila.id)) throw new Error("El historial cambió durante la descarga. Intenta nuevamente.");
      ids.add(fila.id); filas.push(fila);
    }
    if (filas.length === esperado) return filas;
    if (filas.length > esperado) throw new Error("El historial cambió durante la descarga. Intenta nuevamente.");
  }
}
