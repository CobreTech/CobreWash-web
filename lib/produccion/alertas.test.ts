import { describe, expect, it } from "vitest";
import { estaEtapaAtrasada, minutosExcedidos } from "./alertas";

const ahora = Date.parse("2026-09-21T12:00:00Z");

describe("alertas de producción", () => {
  it("usa la recepción como inicio de la primera etapa", () => {
    const datos = { estado: "PENDIENTE", orden: 1, fechaRecepcion: "2026-09-21T10:00:00Z", tiempoEstimadoMin: 60 };
    expect(estaEtapaAtrasada(datos, ahora)).toBe(true);
    expect(minutosExcedidos(datos, ahora)).toBe(60);
  });

  it("detecta atraso desde el inicio de una etapa posterior", () => {
    const datos = { estado: "EN_PROCESO", orden: 2, fechaRecepcion: "2026-09-21T08:00:00Z", fechaInicio: "2026-09-21T11:00:00Z", tiempoEstimadoMin: 30 };
    expect(estaEtapaAtrasada(datos, ahora)).toBe(true);
    expect(minutosExcedidos(datos, ahora)).toBe(30);
  });

  it("no alerta etapas sin estimación, sin inicio o aún dentro del plazo", () => {
    expect(estaEtapaAtrasada({ estado: "EN_PROCESO", orden: 2, fechaRecepcion: "2026-09-21T08:00:00Z" }, ahora)).toBe(false);
    expect(estaEtapaAtrasada({ estado: "PENDIENTE", orden: 3, fechaRecepcion: "2026-09-21T08:00:00Z", tiempoEstimadoMin: 10 }, ahora)).toBe(false);
    expect(estaEtapaAtrasada({ estado: "EN_PROCESO", orden: 2, fechaRecepcion: "2026-09-21T08:00:00Z", fechaInicio: "2026-09-21T11:45:00Z", tiempoEstimadoMin: 30 }, ahora)).toBe(false);
  });
});
