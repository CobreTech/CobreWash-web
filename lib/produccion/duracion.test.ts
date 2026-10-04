import { describe, expect, it } from "vitest";
import { formatearDuracion } from "./duracion";
describe("presentación de tiempos de alerta", () => {
  it.each([
    [0, "0 minutos"], [1, "1 minuto"], [59, "59 minutos"],
    [60, "1 hora"], [61, "1 hora y 1 minuto"], [100, "1 hora y 40 minutos"],
    [180, "3 horas"], [220, "3 horas y 40 minutos"], [1440, "24 horas"],
  ])("presenta %i minutos como %s", (minutos, texto) => {
    expect(formatearDuracion(minutos)).toBe(texto);
  });
});
