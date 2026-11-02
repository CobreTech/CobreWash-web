import { describe, expect, it } from "vitest";
import { clasificarMovimiento, construirObservaciones, type DatosEntrenamiento } from "./periodos";

const D = "det", LAV = "lavado", DES = "desmanchado";
const dia = (n: number, hora = 23) => new Date(Date.UTC(2026, 0, n, hora)).toISOString();

const base = (): DatosEntrenamiento => ({
  conteos: [
    { insumoId: D, fecha: dia(1), cantidad: 100, origen: "REAL" },
    { insumoId: D, fecha: dia(8), cantidad: 70, origen: "REAL" },
    { insumoId: D, fecha: dia(15), cantidad: 90, origen: "REAL" },
  ],
  compras: [{ insumoId: D, fecha: dia(10, 12), cantidad: 50, origen: "REAL" }],
  produccion: [
    { servicioId: LAV, fecha: dia(3, 12), kg: 1000, origen: "REAL" },
    { servicioId: DES, fecha: dia(5, 12), kg: 200, origen: "REAL" },
    { servicioId: LAV, fecha: dia(12, 12), kg: 1500, origen: "REAL" },
  ],
});

describe("clasificación de movimientos", () => {
  it("respeta la clase guardada", () => {
    expect(clasificarMovimiento({ clase: "OTRO", tipoMovimiento: "ENTRADA", motivo: "Stock inicial" })).toBe("OTRO");
  });
  it("deduce la clase de filas antiguas por su motivo", () => {
    expect(clasificarMovimiento({ tipoMovimiento: "ENTRADA", motivo: "Stock inicial" })).toBe("STOCK_INICIAL");
    expect(clasificarMovimiento({ tipoMovimiento: "ENTRADA", motivo: "Conteo físico aprobado: ok" })).toBe("AJUSTE_CONTEO");
    expect(clasificarMovimiento({ tipoMovimiento: "SALIDA", motivo: "Conteo físico aprobado: ok" })).toBe("AJUSTE_CONTEO");
    expect(clasificarMovimiento({ tipoMovimiento: "SALIDA", motivo: "Derrame" })).toBe("CONSUMO");
    expect(clasificarMovimiento({ clase: null, tipoMovimiento: "ENTRADA", motivo: null })).toBe("COMPRA");
  });
});

describe("observaciones entre conteos", () => {
  it("calcula consumo = stock anterior + compras − stock actual con los kg del período", () => {
    const { observaciones, descartados } = construirObservaciones(base(), { incluirSimulado: false });
    expect(descartados).toEqual([]);
    expect(observaciones).toEqual([
      { insumoId: D, origen: "REAL", desde: dia(1), hasta: dia(8), consumo: 30, kgPorServicio: { [LAV]: 1000, [DES]: 200 } },
      { insumoId: D, origen: "REAL", desde: dia(8), hasta: dia(15), consumo: 30, kgPorServicio: { [LAV]: 1500 } },
    ]);
  });

  it("ordena los conteos por fecha aunque lleguen desordenados", () => {
    const datos = base();
    datos.conteos.reverse();
    expect(construirObservaciones(datos, { incluirSimulado: false }).observaciones.map((o) => o.consumo)).toEqual([30, 30]);
  });

  it("asigna al período lo ocurrido en el instante del conteo final y no en el inicial", () => {
    const datos = base();
    datos.compras = [{ insumoId: D, fecha: dia(8), cantidad: 10, origen: "REAL" }];
    datos.conteos[2].cantidad = 60;
    datos.produccion.push({ servicioId: LAV, fecha: dia(1), kg: 999, origen: "REAL" });
    const [primera, segunda] = construirObservaciones(datos, { incluirSimulado: false }).observaciones;
    // La compra del día 8 coincide con el conteo final del primer período.
    expect(primera.consumo).toBe(40);
    expect(primera.kgPorServicio[LAV]).toBe(1000);
    expect(segunda.consumo).toBe(10);
  });

  it("descarta consumos negativos, períodos sin kg y conteos duplicados explicando el motivo", () => {
    const datos: DatosEntrenamiento = {
      conteos: [
        { insumoId: D, fecha: dia(1), cantidad: 10, origen: "REAL" },
        { insumoId: D, fecha: dia(1), cantidad: 10, origen: "REAL" },
        { insumoId: D, fecha: dia(8), cantidad: 50, origen: "REAL" },
        { insumoId: D, fecha: dia(15), cantidad: 40, origen: "REAL" },
      ],
      compras: [],
      produccion: [{ servicioId: LAV, fecha: dia(3), kg: 100, origen: "REAL" }],
    };
    const r = construirObservaciones(datos, { incluirSimulado: false });
    expect(r.observaciones).toEqual([]);
    expect(r.descartados.map((d) => d.motivo)).toEqual([
      "Dos conteos con la misma fecha y hora",
      "Consumo negativo: puede faltar registrar una compra",
      "Sin kg registrados en el período",
    ]);
  });

  it("tolera diferencias de redondeo de los conteos sin descartar el período", () => {
    const datos = base();
    datos.conteos[1].cantidad = 100.005;
    expect(construirObservaciones(datos, { incluirSimulado: false }).observaciones[0].consumo).toBe(0);
  });

  it("separa las series reales y simuladas y solo usa lo simulado si se pide", () => {
    const datos = base();
    datos.conteos.push(
      { insumoId: D, fecha: dia(2), cantidad: 500, origen: "SIMULADO" },
      { insumoId: D, fecha: dia(9), cantidad: 400, origen: "SIMULADO" },
    );
    datos.produccion.push({ servicioId: LAV, fecha: dia(4), kg: 7000, origen: "SIMULADO" });
    datos.compras.push({ insumoId: D, fecha: dia(5), cantidad: 1000, origen: "SIMULADO" });
    expect(construirObservaciones(datos, { incluirSimulado: false }).observaciones).toHaveLength(2);
    const conSimulado = construirObservaciones(datos, { incluirSimulado: true }).observaciones;
    expect(conSimulado).toHaveLength(3);
    const simulada = conSimulado.find((o) => o.origen === "SIMULADO")!;
    expect(simulada.consumo).toBe(1100);
    expect(simulada.kgPorServicio).toEqual({ [LAV]: 7000 });
  });

  it("ignora fechas inválidas y producción sin kg", () => {
    const datos = base();
    datos.conteos.push({ insumoId: D, fecha: "no-es-fecha", cantidad: 1, origen: "REAL" });
    datos.produccion.push({ servicioId: "otro", fecha: dia(4), kg: 0, origen: "REAL" });
    const { observaciones } = construirObservaciones(datos, { incluirSimulado: false });
    expect(observaciones).toHaveLength(2);
    expect(observaciones[0].kgPorServicio).not.toHaveProperty("otro");
  });
});
