import { describe, expect, it } from "vitest";
import { DESVIACION_PREVIA } from "./ajuste";
import type { Observacion, TasaServicio } from "./modelo";
import { consumoDiarioEstimado, consumoDiarioReciente, diasDeStock, estimarComanda, kgPorServicio } from "./prediccion";

const tasas: Record<string, TasaServicio[]> = {
  det: [{ servicioId: "lav", tasaInicial: 0.012, tasaActual: 0.01 }, { servicioId: "des", tasaInicial: 0.02, tasaActual: 0.02 }],
  cloro: [{ servicioId: "des", tasaInicial: 0.005, tasaActual: 0.005 }],
};
const insumos = [
  { id: "det", nombre: "Detergente", unidadMedida: "L", stockActual: 100 },
  { id: "cloro", nombre: "Cloro", unidadMedida: "L", stockActual: 0.5 },
  { id: "suav", nombre: "Suavizante", unidadMedida: "L", stockActual: 30 },
];

describe("estimación de consumo por comanda", () => {
  it("suma kg por servicio ignorando líneas vacías o inválidas", () => {
    expect(kgPorServicio([{ servicioId: "lav", kg: 10 }, { servicioId: "lav", kg: 5 }, { servicioId: "des", kg: 0 }, { servicioId: "x", kg: NaN }])).toEqual({ lav: 15 });
  });

  it("calcula estimado, rango y reserva con margen por insumo", () => {
    const r = estimarComanda({ lineas: [{ servicioId: "lav", kg: 80 }, { servicioId: "des", kg: 20 }], tasas, insumos, margenSeguridad: 0.15, desviaciones: { det: 0.1 } });
    expect(r.insumos.map((e) => e.nombre)).toEqual(["Cloro", "Detergente"]);
    const det = r.insumos.find((e) => e.insumoId === "det")!;
    expect(det.estimado).toBeCloseTo(1.2);
    expect(det.minimo).toBeCloseTo(1.08);
    expect(det.maximo).toBeCloseTo(1.32);
    expect(det.reservado).toBeCloseTo(1.38);
    expect(det.unidad).toBe("L");
    expect(det.nivel).toBe("ok");
    const cloro = r.insumos.find((e) => e.insumoId === "cloro")!;
    expect(cloro.maximo - cloro.estimado).toBeCloseTo(cloro.estimado * DESVIACION_PREVIA);
    expect(r.serviciosSinTasa).toEqual([]);
  });

  it("alerta cuando el estimado supera el stock y avisa cuando solo falta el margen", () => {
    const insuficiente = estimarComanda({ lineas: [{ servicioId: "des", kg: 200 }], tasas, insumos, margenSeguridad: 0.15 });
    expect(insuficiente.insumos.find((e) => e.insumoId === "cloro")!.nivel).toBe("insuficiente");
    expect(insuficiente.alerta).toBe(true);
    const justo = estimarComanda({ lineas: [{ servicioId: "des", kg: 95 }], tasas, insumos, margenSeguridad: 0.15 });
    expect(justo.insumos.find((e) => e.insumoId === "cloro")!.nivel).toBe("justo");
    expect(justo.alerta).toBe(false);
  });

  it("informa servicios sin tasas y no inventa consumos", () => {
    const r = estimarComanda({ lineas: [{ servicioId: "planchado", kg: 30 }], tasas, insumos, margenSeguridad: -1 });
    expect(r.insumos).toEqual([]);
    expect(r.serviciosSinTasa).toEqual(["planchado"]);
  });

  it("el rango inferior nunca es negativo", () => {
    const r = estimarComanda({ lineas: [{ servicioId: "lav", kg: 10 }], tasas, insumos, margenSeguridad: 0, desviaciones: { det: 1.5 } });
    expect(r.insumos[0].minimo).toBe(0);
  });
});

const dia = (n: number) => new Date(Date.UTC(2026, 0, n)).toISOString();
const obs = (desde: number, hasta: number, consumo: number, insumoId = "det"): Observacion =>
  ({ insumoId, origen: "REAL", desde: dia(desde), hasta: dia(hasta), consumo, kgPorServicio: { lav: 1 } });

describe("días de stock restante", () => {
  it("promedia el consumo de los períodos más recientes que cubren la ventana", () => {
    const lista = [obs(1, 8, 700), obs(8, 15, 70), obs(15, 22, 140), obs(22, 29, 210), obs(1, 29, 999, "otro")];
    expect(consumoDiarioReciente(lista, "det", 14)).toBeCloseTo((210 + 140) / 14);
    expect(consumoDiarioReciente(lista, "det", 365)).toBeCloseTo(1120 / 28);
    expect(consumoDiarioReciente([obs(5, 5, 10)], "det")).toBeNull();
    expect(consumoDiarioReciente([], "det")).toBeNull();
  });

  it("estima el consumo diario con los kg recientes cuando aún no hay conteos", () => {
    const ahora = new Date(dia(31));
    const produccion = [
      { servicioId: "lav", fecha: dia(20), kg: 1000, origen: "REAL" as const },
      { servicioId: "lav", fecha: dia(30), kg: 2000, origen: "REAL" as const },
      { servicioId: "lav", fecha: dia(1), kg: 9999, origen: "REAL" as const },
      { servicioId: "otro", fecha: dia(25), kg: 9999, origen: "REAL" as const },
    ];
    expect(consumoDiarioEstimado(produccion, tasas.det, ahora, 15)).toBeCloseTo((3000 * 0.01) / 15);
    expect(consumoDiarioEstimado(produccion.slice(2), tasas.det, ahora, 15)).toBeNull();
  });

  it("divide el stock por el consumo diario y no inventa días sin consumo", () => {
    expect(diasDeStock(100, 4)).toBe(25);
    expect(diasDeStock(-5, 4)).toBe(0);
    expect(diasDeStock(100, 0)).toBeNull();
    expect(diasDeStock(100, null)).toBeNull();
  });
});
