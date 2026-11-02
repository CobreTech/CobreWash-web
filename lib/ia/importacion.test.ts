import { describe, expect, it } from "vitest";
import type { FilaCsv } from "./csv";
import { rangoFilas, registrosParaGuardar, separarRepetidas } from "./importacion";

const ID = "10000000-0000-4000-8000-000000000001";
const filas: FilaCsv[] = [
  { linea: 2, insumoId: ID, insumoNombre: "Cloro", cantidad: 5, fecha: "2026-10-02T02:59:59.000Z" },
  { linea: 3, insumoId: ID, insumoNombre: "Cloro", cantidad: 4, fecha: "2026-09-02T02:59:59.000Z" },
];

describe("importación de CSV", () => {
  it("calcula el rango de fechas del archivo", () => {
    expect(rangoFilas(filas)).toEqual({ desde: "2026-09-02T02:59:59.000Z", hasta: "2026-10-02T02:59:59.000Z" });
  });

  it("detecta conteos ya importados aunque el UUID y la fecha vengan en otro formato", () => {
    const r = separarRepetidas(filas, "conteos", {
      conteoInventarios: [{ insumoId: ID.replaceAll("-", ""), fechaConteo: "2026-10-02T02:59:59Z" }, { insumoId: ID, fechaConteo: null }],
      movimientoInventarios: [],
    });
    expect(r.nuevas.map((f) => f.linea)).toEqual([3]);
    expect(r.repetidas).toEqual([{ linea: 2, mensaje: "Ya estaba registrada (Cloro)." }]);
  });

  it("una compra solo se repite si coincide insumo, fecha y cantidad", () => {
    const existentes = { conteoInventarios: [], movimientoInventarios: [{ insumoId: ID, fecha: "2026-10-02T02:59:59Z", cantidad: 6 }] };
    expect(separarRepetidas(filas, "compras", existentes).repetidas).toEqual([]);
    existentes.movimientoInventarios[0].cantidad = 5;
    expect(separarRepetidas(filas, "compras", existentes).repetidas.map((r) => r.linea)).toEqual([2]);
  });

  it("arma conteos aprobados y compras reales sin campos que dependan del cliente", () => {
    let n = 0;
    const crearId = () => `id-${++n}`;
    const ahora = new Date("2026-11-01T12:00:00Z");
    expect(registrosParaGuardar(filas.slice(0, 1), "conteos", "admin-1", ahora, crearId)).toEqual([{
      id: "id-1", insumoId: ID, cantidadContada: 5, stockSistema: 5, revisionStock: 0, registradoPorId: "admin-1",
      estado: "APROBADO", resueltoPorId: "admin-1", resueltoEn: "2026-11-01T12:00:00.000Z",
      motivoResolucion: "Conteo histórico importado desde CSV", origen: "REAL", fechaConteo: "2026-10-02T02:59:59.000Z",
    }]);
    expect(registrosParaGuardar(filas.slice(1), "compras", "admin-1", ahora, crearId)).toEqual([{
      id: "id-2", insumoId: ID, usuarioId: "admin-1", tipoMovimiento: "ENTRADA", cantidad: 4,
      motivo: "Compra histórica importada desde CSV", fecha: "2026-09-02T02:59:59.000Z", clase: "COMPRA", origen: "REAL",
    }]);
  });
});
