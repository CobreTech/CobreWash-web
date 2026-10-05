import { describe, expect, it } from "vitest";
import { errorRango, fechaChile, rangoConsulta } from "./fechas";

describe("periodos de reportes en Chile", () => {
  it("incluye todo el último día y cambia el offset según el periodo", () => {
    expect(rangoConsulta("2026-07-01", "2026-07-31")).toEqual({ desde: "2026-07-01T04:00:00.000Z", hasta: "2026-08-01T04:00:00.000Z" });
    expect(rangoConsulta("2026-10-01", "2026-10-05")).toEqual({ desde: "2026-10-01T03:00:00.000Z", hasta: "2026-10-06T03:00:00.000Z" });
  });
  it("resuelve el día que empieza a la 01:00 por el salto del horario de verano", () => {
    expect(rangoConsulta("2026-09-06", "2026-09-06")).toEqual({ desde: "2026-09-06T04:00:00.000Z", hasta: "2026-09-07T03:00:00.000Z" });
  });
  it("no depende de la zona del navegador y distingue años", () => {
    expect(fechaChile("2026-10-06T02:59:59Z")).toBe("2026-10-05");
    expect(fechaChile("2027-01-01T02:59:59Z")).toBe("2026-12-31");
  });
  it.each([["", "2026-10-05"], ["2026-02-30", "2026-03-01"], ["2026-10-05", "2026-10-01"], ["2020-01-01", "2026-01-01"]])("rechaza fechas inválidas o periodos excesivos: %s / %s", (desde, hasta) => {
    expect(errorRango(desde, hasta)).not.toBe("");
    expect(() => rangoConsulta(desde, hasta)).toThrow();
  });
});
