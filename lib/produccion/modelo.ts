import type { GetSeguimientoProduccionData } from "@/src/dataconnect-generated";

export type EtapaPersistida = GetSeguimientoProduccionData["comandas"][number]["comandaEtapas_on_comanda"][number];
export type EtapaVisible = ReturnType<typeof normalizarEtapas>[number];

export function normalizarEtapas(etapas: EtapaPersistida[]) {
  return etapas.map((e) => ({
    id: e.etapaId,
    nombre: e.nombreEtapa ?? e.etapa.nombre,
    orden: e.ordenEtapa ?? e.etapa.orden,
    descripcion: e.nombreEtapa != null ? e.descripcionEtapa : e.etapa.descripcion,
    tiempoEstimadoMin: e.nombreEtapa != null ? e.tiempoEstimadoMin : e.etapa.tiempoEstimadoMin,
    estado: e.estado,
  })).sort((a, b) => a.orden - b.orden);
}

export function progresoProduccion(etapas: EtapaVisible[]) {
  if (!etapas.length) return 0;
  return Math.round(etapas.filter((e) => e.estado === "COMPLETADA").length / etapas.length * 100);
}

export function estadoEtapa(etapas: EtapaVisible[]) {
  return etapas.find((e) => e.estado === "EN_PROCESO")?.nombre
    ?? (etapas.length && etapas.every((e) => e.estado === "COMPLETADA") ? "Flujo completado" : "En espera");
}
