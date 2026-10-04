import { describe, expect, it } from "vitest";
import { convertirLimiteMin, limiteEtapaMin, LIMITES_ETAPAS } from "./limites";
describe("límites de etapas", () => {
  it("define límites iniciales y conserva valores configurados", () => {
    expect(LIMITES_ETAPAS.map((e) => limiteEtapaMin(e.orden))).toEqual([15, 90, 60, 60, 1440]);
    expect(limiteEtapaMin(2, 45)).toBe(45);
    expect(limiteEtapaMin(9)).toBeNull();
  });
  it("convierte horas fraccionarias a minutos enteros sin errores de redondeo", () => {
    expect(convertirLimiteMin("1.5", "horas")).toBe(90);
    expect(convertirLimiteMin("24", "horas")).toBe(1440);
    for (let m = 1; m < 150; m++) expect(convertirLimiteMin(String(m / 60), "horas")).toBe(m);
  });
  it("rechaza vacío, cero, negativos, fracciones de minuto y valores fuera del rango", () => {
    for (const v of ["", " ", "0", "-1", "1.1", "NaN", "Infinity", "43201"]) expect(convertirLimiteMin(v, "minutos")).toBeNull();
    expect(convertirLimiteMin("720", "horas")).toBe(43200);
    expect(convertirLimiteMin("721", "horas")).toBeNull();
  });
});
