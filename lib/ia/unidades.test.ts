import { describe, expect, it } from "vitest";
import { esInsumoModelable, esUnidadTasa, factorConversion, unidadesTasaPara, unidadTasaSugerida } from "./unidades";

describe("unidades del modelo IA", () => {
  it("convierte entre unidades de la misma magnitud", () => {
    expect(factorConversion("ml", "L")).toBe(0.001);
    expect(factorConversion("L", "ml")).toBe(1000);
    expect(factorConversion("g", "kg")).toBe(0.001);
    expect(factorConversion("kg", "g")).toBe(1000);
    expect(factorConversion("ml", "ml")).toBe(1);
    expect(factorConversion(" l ", "L")).toBe(1);
  });
  it("no mezcla volumen con masa ni unidades de conteo", () => {
    expect(factorConversion("ml", "kg")).toBeNull();
    expect(factorConversion("g", "L")).toBeNull();
    expect(factorConversion("ml", "unidad")).toBeNull();
    expect(factorConversion("rollo", "rollo")).toBeNull();
  });
  it("ofrece solo las unidades de tasa compatibles con el insumo", () => {
    expect(unidadesTasaPara("L")).toEqual(["ml", "L"]);
    expect(unidadesTasaPara("kg")).toEqual(["g", "kg"]);
    expect(unidadesTasaPara("caja")).toEqual([]);
    expect(unidadTasaSugerida("L")).toBe("ml");
    expect(unidadTasaSugerida("g")).toBe("g");
    expect(unidadTasaSugerida("bolsa")).toBeNull();
  });
  it("reconoce insumos modelables y unidades de tasa válidas", () => {
    expect(esInsumoModelable("ml")).toBe(true);
    expect(esInsumoModelable("unidad")).toBe(false);
    expect(esUnidadTasa("ml")).toBe(true);
    expect(esUnidadTasa("litros")).toBe(false);
  });
});
