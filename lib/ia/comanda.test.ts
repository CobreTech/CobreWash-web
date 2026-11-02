import { describe, expect, it } from "vitest";
import { estimarConsumoComanda, formatoCantidad, leerPesoKg, repartirPeso, type ModeloComanda } from "./comanda";

describe("peso de la comanda", () => {
  it.each([["12,5", 12.5], ["12.5", 12.5], [" 8 ", 8], ["10000", 10000]])("lee %j", (texto, kg) => expect(leerPesoKg(texto)).toBe(kg));
  it.each(["", "0", "-3", "abc", "1.234,5", "10000,01", "1e3"])("rechaza %j", (texto) => expect(leerPesoKg(texto)).toBeNull());

  it("reparte el peso según la cantidad y la suma es exacta", () => {
    expect(repartirPeso(12.5, [4, 2])).toEqual([8.33, 4.17]);
    const partes = repartirPeso(10, [1, 1, 1]);
    expect(partes).toEqual([3.33, 3.33, 3.34]);
    expect(partes.reduce((s, p) => s + p, 0)).toBeCloseTo(10, 10);
    expect(repartirPeso(7, [0, 5])).toEqual([1.17, 5.83]);
  });

  it("sin peso o sin líneas no inventa kilos", () => {
    expect(repartirPeso(0, [2, 3])).toEqual([0, 0]);
    expect(repartirPeso(5, [])).toEqual([]);
  });
});

const DET = "10000000-0000-4000-8000-000000000001", CLO = "10000000-0000-4000-8000-000000000002";
const LAV = "20000000-0000-4000-8000-000000000001";
const modelo = (extra: Partial<ModeloComanda> = {}): ModeloComanda => ({
  configuracionIa: { margenSeguridad: 0.2 },
  tasaConsumos: [
    { tipoServicioId: LAV.replaceAll("-", ""), insumoId: DET.replaceAll("-", ""), tasaInicial: 12, tasaActual: 10, unidad: "ml" },
    { tipoServicioId: LAV.replaceAll("-", ""), insumoId: CLO.replaceAll("-", ""), tasaInicial: 2, tasaActual: 2, unidad: "ml" },
  ],
  insumos: [{ id: DET, nombre: "Detergente", unidadMedida: "L", stockActual: 1 }, { id: CLO, nombre: "Cloro", unidadMedida: "L", stockActual: 0.03 }],
  modeloVigente: [{ desviacionRelativa: 0.2, tasasJson: JSON.stringify({ insumos: [{ insumoId: DET.replaceAll("-", ""), desviacionRelativa: 0.1 }], descartados: [], totalDescartados: 0 }) }],
  ...extra,
});

describe("estimación para el formulario de comandas", () => {
  it("usa la tasa actual, la desviación de cada insumo y el margen configurado", () => {
    const r = estimarConsumoComanda(modelo(), LAV, 15);
    const det = r.insumos.find((i) => i.nombre === "Detergente")!;
    expect(det.estimado).toBeCloseTo(0.15);
    expect([det.minimo, det.maximo]).toEqual([expect.closeTo(0.135), expect.closeTo(0.165)]);
    expect(det.reservado).toBeCloseTo(0.18);
    expect(det.nivel).toBe("ok");
    const cloro = r.insumos.find((i) => i.nombre === "Cloro")!;
    // El cloro no tiene detalle propio: usa la desviación general del ajuste.
    expect(cloro.maximo).toBeCloseTo(0.03 * 1.2);
    expect(cloro.nivel).toBe("justo");
    expect(r.alerta).toBe(false);
  });

  it("alerta cuando el consumo estimado supera el stock", () => {
    expect(estimarConsumoComanda(modelo(), LAV, 200).alerta).toBe(true);
  });

  it("sin ajustes ni configuración usa la incertidumbre previa y el margen de 15%", () => {
    const r = estimarConsumoComanda(modelo({ modeloVigente: [], configuracionIa: null }), LAV, 10);
    const det = r.insumos.find((i) => i.nombre === "Detergente")!;
    expect(det.reservado).toBeCloseTo(0.1 * 1.15);
    expect(det.maximo).toBeCloseTo(0.1 * 1.25);
  });

  it("informa servicios sin tasas", () => {
    const r = estimarConsumoComanda(modelo(), "otro-servicio", 10);
    expect(r.insumos).toEqual([]);
    expect(r.serviciosSinTasa).toEqual(["otro-servicio".replaceAll("-", "")]);
  });
});

describe("formato de cantidades", () => {
  it("pasa a la subunidad cuando la cantidad es menor que una unidad", () => {
    expect(formatoCantidad(0.18, "L")).toEqual({ valor: "180", unidad: "ml" });
    expect(formatoCantidad(0.0125, "kg")).toEqual({ valor: "12,5", unidad: "g" });
    expect(formatoCantidad(2.345, "L")).toEqual({ valor: "2,35", unidad: "L" });
    expect(formatoCantidad(0.5, "ml")).toEqual({ valor: "0,5", unidad: "ml" });
  });
});
