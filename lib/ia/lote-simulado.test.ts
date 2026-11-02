import { describe, expect, it } from "vitest";
import { curvaAprendizaje, leerLote, prepararLoteSimulado, type DatosSimulacion } from "./lote-simulado";
import { construirObservaciones } from "./periodos";
import { generarSimulacion } from "./simulacion";

const DET = "10000000-0000-4000-8000-000000000001", CLO = "10000000-0000-4000-8000-000000000002";
const LAV = "20000000-0000-4000-8000-000000000001", DES = "20000000-0000-4000-8000-000000000002";
const datos: DatosSimulacion = {
  configuracionIa: { lambda: 1 },
  tasaConsumos: [
    { tipoServicioId: LAV, insumoId: DET, tasaInicial: 12, tasaActual: 11, unidad: "ml", tipoServicio: { nombre: "Lavado" }, insumo: { nombre: "Detergente" } },
    { tipoServicioId: DES, insumoId: DET, tasaInicial: 20, tasaActual: 20, unidad: "ml", tipoServicio: { nombre: "Desmanchado" }, insumo: { nombre: "Detergente" } },
    { tipoServicioId: DES, insumoId: CLO, tasaInicial: 6, tasaActual: 6, unidad: "ml", tipoServicio: { nombre: "Desmanchado" }, insumo: { nombre: "Cloro" } },
  ],
  insumos: [{ id: DET.replaceAll("-", ""), nombre: "Detergente", unidadMedida: "L" }, { id: CLO.replaceAll("-", ""), nombre: "Cloro", unidadMedida: "L" }],
};
const parametros = { semanas: 20, kgSemanalMin: 6000, kgSemanalMax: 9000, ruido: 0.1, desvioTasas: 0.3, semilla: 11 };
const ahora = new Date("2026-11-01T12:00:00Z");
let n = 0;
const opciones = () => ({ id: "lote-1", usuarioId: "admin-1", ahora, crearId: () => `id-${++n}` });

describe("lote simulado", () => {
  it("genera filas marcadas como simuladas, ligadas al lote y que terminan hoy", () => {
    const lote = prepararLoteSimulado(datos, parametros, opciones());
    expect(lote.simulacion).toMatchObject({ id: "lote-1", semanas: 20, creadoPorId: "admin-1" });
    expect(lote.conteos).toHaveLength(21 * 2);
    expect(lote.produccion).toHaveLength(20 * 7 * 2);
    expect(lote.conteos.every((c) => c.origen === "SIMULADO" && c.simulacionId === "lote-1" && c.estado === "APROBADO")).toBe(true);
    expect(lote.compras.every((c) => c.origen === "SIMULADO" && c.clase === "COMPRA" && c.simulacionId === "lote-1")).toBe(true);
    expect(new Set(lote.conteos.map((c) => c.insumoId))).toEqual(new Set([DET, CLO]));
    expect(new Set(lote.produccion.map((p) => p.tipoServicioId))).toEqual(new Set([LAV, DES]));
    expect(lote.conteos.at(-1)!.fechaConteo).toBe(ahora.toISOString());
    expect(new Set([...lote.conteos, ...lote.compras, ...lote.produccion].map((f) => f.id)).size).toBe(lote.conteos.length + lote.compras.length + lote.produccion.length);
  });

  it("guarda las tasas verdaderas en la unidad del admin y la curva en los parámetros", () => {
    const lote = prepararLoteSimulado(datos, parametros, opciones());
    const leido = leerLote(lote.simulacion.parametrosJson, lote.simulacion.tasasVerdaderasJson)!;
    expect(leido.parametros).toMatchObject({ ...parametros, inicio: "2026-06-14T12:00:00.000Z" });
    expect(leido.verdaderas).toHaveLength(3);
    for (const v of leido.verdaderas) {
      expect(v.unidad).toBe("ml");
      expect(v.verdadera).toBeGreaterThanOrEqual(v.inicial * 0.7);
      expect(v.verdadera).toBeLessThanOrEqual(v.inicial * 1.3);
    }
    expect(leido.curva).toEqual(lote.curva);
  });

  it("la curva parte en el error de las tasas iniciales y baja al sumar conteos", () => {
    const { curva } = prepararLoteSimulado(datos, { ...parametros, semanas: 30, semilla: 7 }, opciones());
    // Un punto por cantidad de períodos vistos, mientras quede alguno por predecir.
    expect(curva).toHaveLength(30);
    expect(curva[0].periodos).toBe(0);
    // Con la semilla 7 las tasas ocultas quedan lejos de las iniciales (~33%).
    expect(curva[0].errorTasas).toBeGreaterThan(20);
    expect(curva.at(-1)!.errorTasas).toBeLessThan(curva[0].errorTasas / 2);
    expect(curva.at(-1)!.mape!).toBeLessThan(curva[0].mape!);
    expect(curva.at(-1)!.errorTasas).toBeLessThan(curva[2].errorTasas);
  });

  it("calcula la curva aunque un insumo tenga menos períodos", () => {
    const tasas = { det: [{ servicioId: "lav", tasaInicial: 0.012, tasaActual: 0.012 }] };
    const r = generarSimulacion({ parametros: { ...parametros, semanas: 3, inicio: "2026-01-01T00:00:00Z" }, tasas });
    const { observaciones } = construirObservaciones({
      conteos: r.conteos.map((c) => ({ ...c, origen: "SIMULADO" as const })),
      compras: r.compras.map((c) => ({ ...c, origen: "SIMULADO" as const })),
      produccion: r.produccion.map((p) => ({ ...p, origen: "SIMULADO" as const })),
    }, { incluirSimulado: true });
    expect(curvaAprendizaje(observaciones, tasas, r.tasasVerdaderas, 1).map((p) => p.periodos)).toEqual([0, 1, 2]);
    expect(curvaAprendizaje([], tasas, {}, 1)).toEqual([{ periodos: 0, mape: null, errorTasas: 0 }]);
  });

  it("exige tasas y valida los parámetros", () => {
    expect(() => prepararLoteSimulado({ ...datos, tasaConsumos: [] }, parametros, opciones())).toThrow("Define al menos una tasa");
    expect(() => prepararLoteSimulado(datos, { ...parametros, kgSemanalMax: 12000 }, opciones())).toThrow("6.000 y 9.000");
  });

  it("lee lotes guardados de forma segura", () => {
    expect(leerLote("{}", "[]")).toBeNull();
    expect(leerLote("no", "[]")).toBeNull();
    expect(leerLote('{"parametros":{},"curva":[]}', "{}")).toBeNull();
  });
});
