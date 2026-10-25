import { ComandaEstado } from "@/src/dataconnect-generated";
export type VistaPedidos = "todos" | "activos" | "historial";
export const ESTADOS_POR_VISTA: Record<VistaPedidos, ComandaEstado[]> = {
  todos: Object.values(ComandaEstado),
  activos: [ComandaEstado.PENDIENTE, ComandaEstado.EN_PROCESO, ComandaEstado.FINALIZADA],
  historial: [ComandaEstado.ENTREGADA, ComandaEstado.ANULADA],
};
