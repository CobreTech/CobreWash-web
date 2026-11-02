import { describe, expect, it } from "vitest";
import { ajustarModelo } from "./ajuste";
import type { TasaServicio } from "./modelo";
import { construirObservaciones } from "./periodos";
import { crearAzar, generarSimulacion, PARAMETROS_SIMULACION_INICIALES, validarParametrosSimulacion, type ParametrosSimulacion } from "./simulacion";

const tasas: Record<string, TasaServicio[]> = {
  det: [{ servicioId: "lav", tasaInicial: 0.012, tasaActual: 0.012 }, { servicioId: "des", tasaInicial: 0.02, tasaActual: 0.02 }],
  cloro: [{ servicioId: "des", tasaInicial: 0.006, tasaActual: 0.006 }],
  vacio: [],
};
const parametros = (extra: Partial<ParametrosSimulacion> = {}): ParametrosSimulacion => ({
  ...PARAMETROS_SIMULACION_INICIALES, semilla: 42, inicio: "2026-01-04T23:00:00.000Z", ...extra,
});

describe("parámetros de simulación", () => {
  it("acepta los valores iniciales", () => {
    expect(validarParametrosSimulacion(parametros())).toBeNull();
  });
  it.each([
    [{ semanas: 0 }, "semanas"],
    [{ semanas: 2.5 }, "semanas"],
    [{ semanas: 53 }, "semanas"],
    [{ kgSemanalMin: 5000 }, "6.000 y 9.000"],
    [{ kgSemanalMax: 9500 }, "6.000 y 9.000"],
    [{ kgSemanalMin: 8000, kgSemanalMax: 7000 }, "no puede superar"],
    [{ ruido: 0.6 }, "ruido"],
    [{ desvioTasas: -0.1 }, "tasas verdaderas"],
    [{ semilla: 1.5 }, "semilla"],
    [{ inicio: "ayer" }, "fecha de inicio"],
  ])("rechaza %o con un mensaje claro", (extra, texto) => {
    expect(validarParametrosSimulacion(parametros(extra))).toContain(texto);
  });
});

describe("generador de datos simulados", () => {
  it("es reproducible con la misma semilla", () => {
    expect(generarSimulacion({ parametros: parametros(), tasas })).toEqual(generarSimulacion({ parametros: parametros(), tasas }));
    expect(generarSimulacion({ parametros: parametros({ semilla: 7 }), tasas })).not.toEqual(generarSimulacion({ parametros: parametros(), tasas }));
    const a = crearAzar(1), b = crearAzar(1);
    expect([a.u(), a.normal()]).toEqual([b.u(), b.normal()]);
  });

  it("genera un conteo semanal, producción diaria por servicio y kg dentro del rango", () => {
    const r = generarSimulacion({ parametros: parametros({ semanas: 8 }), tasas });
    expect(r.conteos).toHaveLength(9 * 2);
    expect(r.produccion).toHaveLength(8 * 7 * 2);
    for (let semana = 0; semana < 8; semana++) {
      const kg = r.produccion.slice(semana * 14, semana * 14 + 14).reduce((s, p) => s + p.kg, 0);
      expect(kg).toBeGreaterThanOrEqual(6000 * 0.8);
      expect(kg).toBeLessThanOrEqual(9000 * 1.2);
    }
    expect(r.conteos.every((c) => c.cantidad >= 0)).toBe(true);
    expect(r.compras.length).toBeGreaterThan(0);
    expect(r.compras.every((c) => c.cantidad > 0 && Number.isInteger(c.cantidad))).toBe(true);
  });

  it("oculta tasas verdaderas dentro de la desviación pedida", () => {
    const { tasasVerdaderas } = generarSimulacion({ parametros: parametros({ desvioTasas: 0.3 }), tasas });
    expect(Object.keys(tasasVerdaderas).sort()).toEqual(["cloro", "det"]);
    for (const [insumo, porServicio] of Object.entries(tasasVerdaderas)) {
      for (const t of tasas[insumo]) {
        expect(porServicio[t.servicioId]).toBeGreaterThanOrEqual(t.tasaInicial * 0.7);
        expect(porServicio[t.servicioId]).toBeLessThanOrEqual(t.tasaInicial * 1.3);
      }
    }
  });

  it("sin ruido el consumo entre conteos coincide con las tasas verdaderas", () => {
    const r = generarSimulacion({ parametros: parametros({ ruido: 0, semanas: 4 }), tasas });
    const { observaciones } = construirObservaciones({
      conteos: r.conteos.map((c) => ({ ...c, origen: "SIMULADO" as const })),
      compras: r.compras.map((c) => ({ ...c, origen: "SIMULADO" as const })),
      produccion: r.produccion.map((p) => ({ ...p, origen: "SIMULADO" as const })),
    }, { incluirSimulado: true });
    expect(observaciones).toHaveLength(8);
    for (const o of observaciones) {
      const esperado = Object.entries(o.kgPorServicio).reduce((s, [sv, kg]) => s + kg * (r.tasasVerdaderas[o.insumoId][sv] ?? 0), 0);
      expect(o.consumo).toBeCloseTo(esperado, 1);
    }
  });

  it("el modelo se acerca a las tasas ocultas y su error baja al sumar semanas", () => {
    const entrenar = (semanas: number) => {
      const r = generarSimulacion({ parametros: parametros({ semanas, ruido: 0.1 }), tasas });
      const { observaciones } = construirObservaciones({
        conteos: r.conteos.map((c) => ({ ...c, origen: "SIMULADO" as const })),
        compras: r.compras.map((c) => ({ ...c, origen: "SIMULADO" as const })),
        produccion: r.produccion.map((p) => ({ ...p, origen: "SIMULADO" as const })),
      }, { incluirSimulado: true });
      return { r, ajuste: ajustarModelo(observaciones, { det: tasas.det, cloro: tasas.cloro }, 1) };
    };
    const corto = entrenar(4), largo = entrenar(40);
    expect(largo.ajuste.resumen.mape!).toBeLessThan(corto.ajuste.resumen.mape!);
    const cloro = largo.ajuste.insumos.find((i) => i.insumoId === "cloro")!;
    const verdad = largo.r.tasasVerdaderas.cloro.des;
    expect(Math.abs(cloro.tasas.des - verdad)).toBeLessThan(Math.abs(tasas.cloro[0].tasaInicial - verdad) + 1e-9);
    expect(Math.abs(cloro.tasas.des - verdad) / verdad).toBeLessThan(0.05);
  });

  it("exige tasas definidas y parámetros válidos", () => {
    expect(() => generarSimulacion({ parametros: parametros(), tasas: { vacio: [] } })).toThrow("Define al menos una tasa");
    expect(() => generarSimulacion({ parametros: parametros({ semanas: 0 }), tasas })).toThrow("semanas");
  });
});
