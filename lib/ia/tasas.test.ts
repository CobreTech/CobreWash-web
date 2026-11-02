import { describe, expect, it } from "vitest";
import { convertirTasa, tasasPorInsumo } from "./tasas";

describe("tasas en unidad del insumo", () => {
  it("convierte ml/kg a L/kg y g/kg a kg/kg agrupando por insumo", () => {
    const { tasas, omitidas } = tasasPorInsumo(
      [
        { servicioId: "lav", insumoId: "det", tasaInicial: 12, tasaActual: 10, unidad: "ml" },
        { servicioId: "des", insumoId: "det", tasaInicial: 0.02, tasaActual: 0.02, unidad: "L" },
        { servicioId: "lav", insumoId: "polvo", tasaInicial: 8, tasaActual: 8, unidad: "g" },
      ],
      [{ id: "det", unidadMedida: "L" }, { id: "polvo", unidadMedida: "kg" }],
    );
    expect(omitidas).toEqual([]);
    expect(tasas.det).toEqual([
      { servicioId: "lav", tasaInicial: 0.012, tasaActual: 0.01 },
      { servicioId: "des", tasaInicial: 0.02, tasaActual: 0.02 },
    ]);
    expect(tasas.polvo[0].tasaInicial).toBeCloseTo(0.008);
  });
  it("omite tasas de insumos desconocidos o con unidades incompatibles", () => {
    const filas = [
      { servicioId: "lav", insumoId: "bolsas", tasaInicial: 1, tasaActual: 1, unidad: "ml" },
      { servicioId: "lav", insumoId: "fantasma", tasaInicial: 1, tasaActual: 1, unidad: "ml" },
    ];
    const r = tasasPorInsumo(filas, [{ id: "bolsas", unidadMedida: "unidad" }]);
    expect(r.tasas).toEqual({});
    expect(r.omitidas).toEqual(filas);
  });
  it("convierte una tasa ajustada de vuelta a la unidad que usa el admin", () => {
    expect(convertirTasa(0.0105, "L", "ml")).toBeCloseTo(10.5);
    expect(convertirTasa(1, "L", "g")).toBeNull();
  });
});
