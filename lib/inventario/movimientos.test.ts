import { describe, expect, it } from "vitest";
import { crearCsvMovimientos, filtrarMovimientos, obtenerEstadoStock } from "./movimientos";

const movimientos = [
  {
    id: "1", tipoMovimiento: "ENTRADA", cantidad: 10, motivo: "Compra, factura 1",
    fecha: "2026-09-20T13:00:00.000Z", insumo: { id: "a", nombre: "Detergente", unidadMedida: "L" },
    usuario: { nombre: "Ana", apellido: "Pérez" },
  },
  {
    id: "2", tipoMovimiento: "SALIDA", cantidad: 2, motivo: "Consumo",
    fecha: "2026-09-21T13:00:00.000Z", insumo: { id: "b", nombre: "Cloro", unidadMedida: "L" },
    usuario: null,
  },
] as const;

describe("inventario", () => {
  it("clasifica stock mínimo y crítico", () => {
    expect(obtenerEstadoStock({ activo: true, stockActual: 10, stockMinimo: 5 })).toBe("OK");
    expect(obtenerEstadoStock({ activo: true, stockActual: 5, stockMinimo: 5 })).toBe("Bajo");
    expect(obtenerEstadoStock({ activo: true, stockActual: 2.5, stockMinimo: 5 })).toBe("Crítico");
    expect(obtenerEstadoStock({ activo: false, stockActual: 2, stockMinimo: 5 })).toBe("Inactivo");
  });

  it("filtra por insumo, tipo y rango inclusivo", () => {
    expect(filtrarMovimientos([...movimientos], { tipo: "SALIDA" })).toHaveLength(1);
    expect(filtrarMovimientos([...movimientos], { insumoId: "a" })[0]?.id).toBe("1");
    expect(filtrarMovimientos([...movimientos], {
      fechaDesde: "2026-09-21", fechaHasta: "2026-09-21",
    })[0]?.id).toBe("2");
  });

  it("genera CSV compatible con Excel y escapa separadores", () => {
    const csv = crearCsvMovimientos([...movimientos]);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain('"Compra, factura 1"');
    expect(csv).toContain('"SALIDA"');
    expect(csv).toContain('"Ana Pérez"');
  });
});
