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
    fechaInicio: e.fechaInicio ?? null,
    fechaCompletado: e.fechaCompletado ?? null,
    responsable: e.operario ? [e.operario.nombre, e.operario.apellido].filter(Boolean).join(" ") : null,
  })).sort((a, b) => a.orden - b.orden);
}

/** Usa la zona de la lavandería, incluso si se consulta desde otro país. */
export function fechaProduccion(value: string | null) {
  if (!value || Number.isNaN(Date.parse(value))) return "Sin registro";
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago", dateStyle: "short", timeStyle: "medium",
  }).format(new Date(value));
}

export function progresoProduccion(etapas: EtapaVisible[]) {
  if (!etapas.length) return 0;
  return Math.round(etapas.filter((e) => e.estado === "COMPLETADA").length / etapas.length * 100);
}

export function etapaActualProduccion(etapas: EtapaVisible[]) {
  return etapas.find((e) => e.estado !== "COMPLETADA") ?? null;
}

export function estadoEtapa(etapas: EtapaVisible[]) {
  return etapaActualProduccion(etapas)?.nombre
    ?? (etapas.length && etapas.every((e) => e.estado === "COMPLETADA") ? "Flujo completado" : "En espera");
}
