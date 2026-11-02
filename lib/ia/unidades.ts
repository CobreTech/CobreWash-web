export const UNIDADES_TASA = ["ml", "L", "g", "kg"] as const;
export type UnidadTasa = (typeof UNIDADES_TASA)[number];

const BASE: Record<string, { magnitud: "volumen" | "masa"; factor: number }> = {
  ml: { magnitud: "volumen", factor: 1 },
  l: { magnitud: "volumen", factor: 1000 },
  g: { magnitud: "masa", factor: 1 },
  kg: { magnitud: "masa", factor: 1000 },
};

const base = (unidad: string) => BASE[unidad.trim().toLowerCase()];

export const esUnidadTasa = (valor: string): valor is UnidadTasa =>
  (UNIDADES_TASA as readonly string[]).includes(valor);

/** El modelo solo trabaja con insumos medidos en volumen o masa. */
export const esInsumoModelable = (unidadInsumo: string) => !!base(unidadInsumo);

/**
 * Factor que convierte una cantidad expresada en `desde` a la unidad `hacia`.
 * Devuelve null si las unidades no son comparables (ml frente a kg, "unidad"...).
 */
export function factorConversion(desde: string, hacia: string): number | null {
  const a = base(desde), b = base(hacia);
  if (!a || !b || a.magnitud !== b.magnitud) return null;
  return a.factor / b.factor;
}

/** Unidades de tasa que el admin puede elegir para un insumo. */
export function unidadesTasaPara(unidadInsumo: string): UnidadTasa[] {
  return UNIDADES_TASA.filter((u) => factorConversion(u, unidadInsumo) !== null);
}

/** Unidad sugerida para escribir tasas: la menor de su magnitud (ml o g). */
export function unidadTasaSugerida(unidadInsumo: string): UnidadTasa | null {
  return unidadesTasaPara(unidadInsumo)[0] ?? null;
}
