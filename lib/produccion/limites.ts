/** Valores iniciales ajustables por administración, en minutos continuos. */
export const LIMITES_ETAPAS = [
  { orden: 1, nombre: "Recepción", minutos: 15 },
  { orden: 2, nombre: "Lavado", minutos: 90 },
  { orden: 3, nombre: "Secado", minutos: 60 },
  { orden: 4, nombre: "Planchado", minutos: 60 },
  { orden: 5, nombre: "Entrega", minutos: 1440 },
] as const;

export function limiteEtapaMin(orden: number, minutos?: number | null) {
  return minutos ?? LIMITES_ETAPAS.find((e) => e.orden === orden)?.minutos ?? null;
}

export function convertirLimiteMin(valor: string, unidad: "minutos" | "horas") {
  if (!valor.trim()) return null;
  const minutos = Number(valor) * (unidad === "horas" ? 60 : 1);
  const entero = Math.round(minutos);
  return Number.isSafeInteger(entero) && Math.abs(minutos - entero) < 1e-8 && entero > 0 && entero <= 43_200 ? entero : null;
}
