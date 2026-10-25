import { describe, expect, it } from "vitest";
import { errorRango, fechaChile, limitesFechasConsulta, limitesFechasInclusivos, rangoConsulta } from "./fechas";

describe("periodos de reportes en Chile", () => {
  it("usa el día siguiente exclusivo para no perder fracciones de segundo del último día", () => {
    expect(limitesFechasConsulta("2026-10-25", "2026-10-25")).toEqual({ fechaDesde: "2026-10-25T03:00:00.000Z", fechaHastaExclusiva: "2026-10-26T03:00:00.000Z" });
    expect(limitesFechasConsulta("", "")).toEqual({ fechaDesde: undefined, fechaHastaExclusiva: undefined });
  });
  it.each([
    ["2026-10-25", "2026-10-25T03:00:00.000Z", "2026-10-26T02:59:59.999Z"],
    ["2026-07-25", "2026-07-25T04:00:00.000Z", "2026-07-26T03:59:59.999Z"],
    ["2026-09-06", "2026-09-06T04:00:00.000Z", "2026-09-07T02:59:59.999Z"],
  ])("filtra el día chileno completo con límites inclusivos: %s", (dia, inicio, fin) => {
    expect(limitesFechasInclusivos(dia, dia)).toEqual({ fechaDesde: inicio, fechaHasta: fin });
    expect(fechaChile(inicio)).toBe(dia);
    expect(fechaChile(fin)).toBe(dia);
    expect(fechaChile(new Date(Date.parse(fin) + 1))).not.toBe(dia);
  });
  it("permite filtrar desde o hasta una fecha sin exigir ambos extremos", () => {
    expect(limitesFechasInclusivos("", "")).toEqual({ fechaDesde: undefined, fechaHasta: undefined });
    expect(limitesFechasInclusivos("2026-10-25", "").fechaHasta).toBeUndefined();
    expect(limitesFechasInclusivos("", "2026-07-25").fechaDesde).toBeUndefined();
    expect(() => limitesFechasInclusivos("2026-02-30", "")).toThrow();
    expect(() => limitesFechasInclusivos("2026-10-25", "2026-10-24")).toThrow();
  });
  it("incluye todo el último día y cambia el offset según el periodo", () => {
    expect(rangoConsulta("2026-07-01", "2026-07-31")).toEqual({
      desde: "2026-07-01T04:00:00.000Z",
      hasta: "2026-08-01T04:00:00.000Z",
    });
    expect(rangoConsulta("2026-10-01", "2026-10-05")).toEqual({
      desde: "2026-10-01T03:00:00.000Z",
      hasta: "2026-10-06T03:00:00.000Z",
    });
  });
  it("resuelve el día que empieza a la 01:00 por el salto del horario de verano", () => {
    expect(rangoConsulta("2026-09-06", "2026-09-06")).toEqual({
      desde: "2026-09-06T04:00:00.000Z",
      hasta: "2026-09-07T03:00:00.000Z",
    });
  });
  it("no depende de la zona del navegador y distingue años", () => {
    expect(fechaChile("2026-10-06T02:59:59Z")).toBe("2026-10-05");
    expect(fechaChile("2027-01-01T02:59:59Z")).toBe("2026-12-31");
  });
  it.each([
    ["", "2026-10-05"],
    ["2026-02-30", "2026-03-01"],
    ["2026-10-05", "2026-10-01"],
    ["2020-01-01", "2026-01-01"],
  ])(
    "rechaza fechas inválidas o periodos excesivos: %s / %s",
    (desde, hasta) => {
      expect(errorRango(desde, hasta)).not.toBe("");
      expect(() => rangoConsulta(desde, hasta)).toThrow();
    },
  );
});
