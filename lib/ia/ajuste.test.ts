import { describe, expect, it } from "vitest";
import { ajustarInsumo, ajustarModelo, ajustarTasas, consumoModelo, DESVIACION_MINIMA, DESVIACION_PREVIA } from "./ajuste";
import type { Observacion, TasaServicio } from "./modelo";

const LAV = "lavado", DES = "desmanchado", PLA = "planchado";
const VERDAD: Record<string, number> = { [LAV]: 0.012, [DES]: 0.02 };
const iniciales: TasaServicio[] = [
  { servicioId: LAV, tasaInicial: 0.015, tasaActual: 0.015 },
  { servicioId: DES, tasaInicial: 0.015, tasaActual: 0.015 },
];

/** Generador reproducible con ruido gaussiano (Box-Muller). */
function azar(semilla: number) {
  const u = () => { semilla = (semilla * 1664525 + 1013904223) % 2 ** 32; return (semilla + 1) / (2 ** 32 + 1); };
  return { u, normal: () => Math.sqrt(-2 * Math.log(u())) * Math.cos(2 * Math.PI * u()) };
}

/** Períodos semanales con mezcla variable de servicios y ruido relativo opcional. */
function periodos(cantidad: number, ruido = 0, insumoId = "det", semilla = 1): Observacion[] {
  const r = azar(semilla);
  return Array.from({ length: cantidad }, (_, i) => {
    const kgPorServicio = { [LAV]: 3000 + 5000 * r.u(), [DES]: 200 + 2800 * r.u() };
    const perturbacion = ruido * r.normal();
    return {
      insumoId, origen: "REAL" as const, desde: `s${i}`, hasta: `s${i + 1}`,
      consumo: consumoModelo(kgPorServicio, VERDAD) * (1 + perturbacion), kgPorServicio,
    };
  });
}

describe("ajuste regularizado de tasas", () => {
  it("recupera las tasas verdaderas con datos exactos y sin regularización", () => {
    const tasas = ajustarTasas(periodos(6), iniciales, 0);
    expect(tasas[LAV]).toBeCloseTo(0.012, 8);
    expect(tasas[DES]).toBeCloseTo(0.02, 8);
  });

  it("con λ grande se queda cerca de las tasas iniciales", () => {
    const tasas = ajustarTasas(periodos(2), iniciales, 1000);
    expect(tasas[LAV]).toBeCloseTo(0.015, 3);
    expect(tasas[DES]).toBeCloseTo(0.015, 3);
  });

  it("la evidencia domina a medida que entran más conteos", () => {
    const distancia = (n: number) => {
      let total = 0;
      for (let semilla = 1; semilla <= 30; semilla++) {
        const t = ajustarTasas(periodos(n, 0.05, "det", semilla), iniciales, 1);
        total += Math.abs(t[LAV] - VERDAD[LAV]) + Math.abs(t[DES] - VERDAD[DES]);
      }
      return total / 30;
    };
    expect(distancia(2)).toBeGreaterThan(distancia(10));
    expect(distancia(10)).toBeGreaterThan(distancia(40));
    expect(distancia(40)).toBeLessThan(0.003);
  });

  it("nunca entrega tasas negativas", () => {
    const obs: Observacion[] = [
      { insumoId: "det", origen: "REAL", desde: "a", hasta: "b", consumo: 10, kgPorServicio: { [LAV]: 1000, [DES]: 1000 } },
      { insumoId: "det", origen: "REAL", desde: "b", hasta: "c", consumo: 0, kgPorServicio: { [LAV]: 0, [DES]: 1000 } },
      { insumoId: "det", origen: "REAL", desde: "c", hasta: "d", consumo: 20, kgPorServicio: { [LAV]: 2000, [DES]: 0 } },
    ];
    const tasas = ajustarTasas(obs, iniciales, 0);
    expect(tasas[DES]).toBe(0);
    expect(tasas[LAV]).toBeCloseTo(0.01, 6);
  });

  it("los servicios sin kg conservan su tasa inicial", () => {
    const tasas = ajustarTasas(periodos(5), [...iniciales, { servicioId: PLA, tasaInicial: 0.004, tasaActual: 0.009 }], 0);
    expect(tasas[PLA]).toBe(0.004);
    expect(ajustarTasas([], iniciales, 1)).toEqual({ [LAV]: 0.015, [DES]: 0.015 });
  });
});

describe("error y rango del ajuste", () => {
  it("sin conteos informa que no hay datos y usa la incertidumbre previa", () => {
    const r = ajustarInsumo("det", [], iniciales, 1);
    expect(r).toMatchObject({ observaciones: 0, mae: null, mape: null, metodoError: "sin-datos", desviacionRelativa: DESVIACION_PREVIA });
    expect(r.tasas).toEqual({ [LAV]: 0.015, [DES]: 0.015 });
  });

  it("con uno o dos períodos mide el error sobre el mismo ajuste", () => {
    expect(ajustarInsumo("det", periodos(2), iniciales, 1).metodoError).toBe("ajuste");
  });

  it("desde tres períodos usa validación cruzada y el error baja con más conteos", () => {
    // Promedio de 30 escenarios: con tasas iniciales erradas el error cae al sumar conteos.
    const promedio = (n: number) => {
      const r = Array.from({ length: 30 }, (_, k) => ajustarInsumo("det", periodos(n, 0.03, "det", k + 1), iniciales, 1));
      const m = (f: (x: (typeof r)[number]) => number) => r.reduce((s, x) => s + f(x), 0) / r.length;
      return { metodo: r[0].metodoError, mape: m((x) => x.mape!), mae: m((x) => x.mae!), desviacion: m((x) => x.desviacionRelativa) };
    };
    const pocos = promedio(3), muchos = promedio(30);
    expect(pocos.metodo).toBe("validacion-cruzada");
    expect(muchos.mape).toBeLessThan(pocos.mape);
    expect(muchos.mae).toBeLessThan(pocos.mae);
    expect(muchos.desviacion).toBeLessThan(pocos.desviacion);
  });

  it("calcula MAE y MAPE en la unidad del insumo y en porcentaje", () => {
    const obs: Observacion[] = [
      { insumoId: "det", origen: "REAL", desde: "a", hasta: "b", consumo: 110, kgPorServicio: { [LAV]: 10000 } },
      { insumoId: "det", origen: "REAL", desde: "b", hasta: "c", consumo: 90, kgPorServicio: { [LAV]: 10000 } },
    ];
    const r = ajustarInsumo("det", obs, [{ servicioId: LAV, tasaInicial: 0.01, tasaActual: 0.01 }], 0);
    expect(r.tasas[LAV]).toBeCloseTo(0.01);
    expect(r.mae).toBeCloseTo(10);
    expect(r.mape).toBeCloseTo((10 / 110 + 10 / 90) * 50);
  });

  it("el rango nunca baja del mínimo aunque los datos sean perfectos", () => {
    expect(ajustarInsumo("det", periodos(60), iniciales, 0).desviacionRelativa).toBe(DESVIACION_MINIMA);
  });

  it("ignora observaciones de otros insumos y períodos sin consumo en el MAPE", () => {
    const obs = [...periodos(2), ...periodos(4, 0, "otro")];
    obs[0] = { ...obs[0], consumo: 0 };
    const r = ajustarInsumo("det", obs, iniciales, 1);
    expect(r.observaciones).toBe(2);
    expect(r.mape).not.toBeNull();
  });
});

describe("ajuste del modelo completo", () => {
  it("ajusta cada insumo con sus tasas y resume el error ponderado", () => {
    const obs = [...periodos(4, 0.05, "det"), ...periodos(8, 0.05, "suav")];
    const { insumos, resumen } = ajustarModelo(obs, { det: iniciales, suav: iniciales, cloro: [] }, 1);
    expect(insumos.map((r) => r.insumoId)).toEqual(["det", "suav"]);
    expect(resumen.observaciones).toBe(12);
    const [det, suav] = insumos;
    expect(resumen.mape).toBeCloseTo((det.mape! * 4 + suav.mape! * 8) / 12);
    expect(resumen.mae).toBeCloseTo((det.mae! + suav.mae!) / 2);
  });

  it("sin insumos ni datos devuelve un resumen vacío", () => {
    expect(ajustarModelo([], {}, 1).resumen).toEqual({ observaciones: 0, mae: null, mape: null, desviacionRelativa: DESVIACION_PREVIA });
    expect(ajustarModelo([], { det: iniciales }, 1).resumen).toMatchObject({ observaciones: 0, mae: null, mape: null });
  });
});
