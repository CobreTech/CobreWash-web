export const MOTIVOS_INCIDENCIA = [
  "Prenda dañada",
  "Mancha persistente",
  "Prenda extraviada",
  "Falla de maquinaria",
  "Retraso en producción",
  "Otro",
] as const;

export type MotivoIncidencia = (typeof MOTIVOS_INCIDENCIA)[number];
