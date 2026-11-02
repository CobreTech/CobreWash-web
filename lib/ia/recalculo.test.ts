import { describe, expect, it } from "vitest";
import { leerDetalleAjuste, NOMBRE_MODELO, prepararRecalculo, type DatosRecalculo } from "./recalculo";

const DET = "10000000-0000-4000-8000-000000000001", BOL = "10000000-0000-4000-8000-000000000002";
const LAV = "20000000-0000-4000-8000-000000000001";
const sin = (id: string) => id.replaceAll("-", "");
const dia = (n: number, hora = 23) => new Date(Date.UTC(2026, 8, n, hora)).toISOString();
const ahora = new Date(dia(30, 12));

/** Cuatro semanas reales: 1.000 kg de lavado por semana y 10 L de consumo (tasa verdadera 10 ml/kg). */
function datos(extra: Partial<DatosRecalculo> = {}): DatosRecalculo {
  return {
    configuracionIa: { margenSeguridad: 0.15, lambda: 1, incluirSimulado: false },
    tasaConsumos: [{ tipoServicioId: LAV, insumoId: DET, tasaInicial: 12, tasaActual: 12, unidad: "ml", fuente: "Ficha técnica", tipoServicio: { nombre: "Lavado" } }],
    insumos: [{ id: sin(DET), nombre: "Detergente", unidadMedida: "L" }, { id: sin(BOL), nombre: "Bolsas", unidadMedida: "unidad" }],
    conteoInventarios: [1, 8, 15, 22, 29].map((d, i) => ({ insumoId: sin(DET), cantidadContada: 100 - 10 * i + (i >= 2 ? 20 : 0), creadoEn: dia(d), fechaConteo: null, origen: "REAL" as const })),
    movimientoInventarios: [
      { insumoId: sin(DET), fecha: dia(10, 12), cantidad: 20, origen: "REAL", tipoMovimiento: "ENTRADA", clase: null, motivo: "Factura 12" },
      { insumoId: sin(DET), fecha: dia(11, 12), cantidad: 500, origen: "REAL", tipoMovimiento: "ENTRADA", clase: null, motivo: "Stock inicial" },
      { insumoId: sin(DET), fecha: dia(12, 12), cantidad: 7, origen: "REAL", tipoMovimiento: "ENTRADA", clase: "AJUSTE_CONTEO", motivo: null },
    ],
    comandaDetalles: [3, 10, 17, 24].flatMap((d) => [
      { tipoServicioId: sin(LAV), pesoKg: 1000, comanda: { fechaRecepcion: dia(d, 12) } },
      { tipoServicioId: sin(LAV), pesoKg: null, comanda: { fechaRecepcion: dia(d, 13) } },
    ]),
    produccionSimuladas: [],
    modelos: [{ _count: 2 }],
    ...extra,
  };
}

describe("recálculo del modelo", () => {
  it("ajusta con los conteos reales y devuelve la tasa actual en la unidad del admin", () => {
    const r = prepararRecalculo(datos(), { id: "modelo-3", usuarioId: "admin-1", ahora });
    expect(r.modelo).toMatchObject({
      id: "modelo-3", nombre: NOMBRE_MODELO, version: "v3", activo: true, observaciones: 4,
      lambda: 1, margenSeguridad: 0.15, incluyeSimulado: false, ejecutadoPorId: "admin-1", fechaEntrenamiento: ahora.toISOString(),
    });
    expect(r.tasas).toHaveLength(1);
    expect(r.tasas[0]).toMatchObject({ tipoServicioId: LAV, insumoId: DET, tasaInicial: 12, unidad: "ml", fuente: "Ficha técnica", actualizadoPorId: "admin-1" });
    expect(r.tasas[0].tasaActual).toBeGreaterThan(10);
    expect(r.tasas[0].tasaActual).toBeLessThan(10.5);
    expect(r.modelo.precisionEstimada).toBeCloseTo(100 - r.modelo.mape!);
  });

  it("guarda el detalle por insumo con el consumo diario medido por conteos", () => {
    const r = prepararRecalculo(datos(), { id: "m", usuarioId: "a", ahora });
    const detalle = leerDetalleAjuste(r.modelo.tasasJson)!;
    expect(detalle.insumos).toHaveLength(1);
    expect(detalle.insumos[0]).toMatchObject({ nombre: "Detergente", unidad: "L", observaciones: 4, fuenteConsumo: "conteos", metodoError: "validacion-cruzada" });
    expect(detalle.insumos[0].consumoDiario).toBeCloseTo(10 / 7);
    expect(detalle.insumos[0].tasas[0]).toMatchObject({ servicio: "Lavado", unidad: "ml", inicial: 12, anterior: 12 });
    expect(detalle.totalDescartados).toBe(0);
  });

  it("solo cuenta como compra lo que es compra, aunque la fila sea antigua", () => {
    const sinCompra = datos();
    sinCompra.movimientoInventarios = sinCompra.movimientoInventarios.slice(1);
    // Sin la compra del día 10, ese período queda con consumo negativo y se descarta.
    const detalle = prepararRecalculo(sinCompra, { id: "m", usuarioId: "a", ahora }).detalle;
    expect(detalle.insumos[0].observaciones).toBe(3);
    expect(detalle.descartados[0]).toMatchObject({ insumo: "Detergente", motivo: expect.stringContaining("Consumo negativo") });
  });

  it("usa lo simulado solo si la configuración lo pide", () => {
    const conSimulado = datos({
      conteoInventarios: [
        { insumoId: DET, cantidadContada: 300, creadoEn: dia(2), fechaConteo: "2026-08-01T23:00:00Z", origen: "SIMULADO" },
        { insumoId: DET, cantidadContada: 230, creadoEn: dia(2), fechaConteo: "2026-08-08T23:00:00Z", origen: "SIMULADO" },
      ],
      produccionSimuladas: [{ tipoServicioId: LAV, fecha: "2026-08-04T12:00:00Z", kg: 7000 }],
    });
    expect(prepararRecalculo(conSimulado, { id: "m", usuarioId: "a", ahora }).modelo.observaciones).toBe(0);
    conSimulado.configuracionIa = { margenSeguridad: 0.1, lambda: 1, incluirSimulado: true };
    const r = prepararRecalculo(conSimulado, { id: "m", usuarioId: "a", ahora });
    expect(r.modelo.observaciones).toBe(1);
    expect(r.modelo.incluyeSimulado).toBe(true);
    // Lo simulado no sirve para los días de stock: se estima con los kg reales recientes.
    expect(r.detalle.insumos[0].fuenteConsumo).toBe("kg-recientes");
  });

  it("sin conteos conserva las tasas iniciales y estima el consumo con los kg recientes", () => {
    const r = prepararRecalculo(datos({ conteoInventarios: [], configuracionIa: null }), { id: "m", usuarioId: "a", ahora });
    expect(r.modelo).toMatchObject({ observaciones: 0, mae: null, mape: null, precisionEstimada: null, lambda: 1 });
    expect(r.tasas[0].tasaActual).toBe(12);
    const insumo = r.detalle.insumos[0];
    expect(insumo.fuenteConsumo).toBe("kg-recientes");
    // Las cuatro semanas de comandas caen dentro de los últimos 30 días.
    expect(insumo.consumoDiario).toBeCloseTo((4000 * 0.012) / 30);
    const sinNada = prepararRecalculo(datos({ conteoInventarios: [], comandaDetalles: [] }), { id: "m", usuarioId: "a", ahora });
    expect(sinNada.detalle.insumos[0]).toMatchObject({ consumoDiario: null, fuenteConsumo: null });
  });

  it("exige al menos una tasa de un insumo modelable", () => {
    expect(() => prepararRecalculo(datos({ tasaConsumos: [] }), { id: "m", usuarioId: "a", ahora })).toThrow("Define al menos una tasa");
    const soloBolsas = datos({ tasaConsumos: [{ tipoServicioId: LAV, insumoId: BOL, tasaInicial: 1, tasaActual: 1, unidad: "ml", tipoServicio: { nombre: "Lavado" } }] });
    expect(() => prepararRecalculo(soloBolsas, { id: "m", usuarioId: "a", ahora })).toThrow("Define al menos una tasa");
  });

  it("limita los descartados guardados pero informa el total", () => {
    const conteos = Array.from({ length: 60 }, (_, i) => ({ insumoId: DET, cantidadContada: i, creadoEn: dia(1, 0) .replace("T00", `T${String(i % 24).padStart(2, "0")}`).replace("-01T", `-${String(1 + Math.floor(i / 24)).padStart(2, "0")}T`), fechaConteo: null, origen: "REAL" as const }));
    const r = prepararRecalculo(datos({ conteoInventarios: conteos }), { id: "m", usuarioId: "a", ahora });
    expect(r.detalle.totalDescartados).toBeGreaterThan(50);
    expect(r.detalle.descartados).toHaveLength(50);
  });

  it("lee el detalle guardado de forma segura", () => {
    expect(leerDetalleAjuste(null)).toBeNull();
    expect(leerDetalleAjuste("no es json")).toBeNull();
    expect(leerDetalleAjuste('{"insumos":1}')).toBeNull();
    expect(leerDetalleAjuste('{"insumos":[],"descartados":[],"totalDescartados":0}')).toEqual({ insumos: [], descartados: [], totalDescartados: 0 });
  });
});
