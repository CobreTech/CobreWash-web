import type { GetSeguimientoPublicoPorQrData } from "@/src/dataconnect-generated";
import { normalizarCodigoQr, normalizarNumeroComanda } from "./qr";

export type PedidoPublico = NonNullable<GetSeguimientoPublicoPorQrData["comanda"]>;
export type ConsultaSeguimiento = { tipo: "qr" | "numero"; valor: string };

export function validarConsulta(consulta: ConsultaSeguimiento): ConsultaSeguimiento {
  return { ...consulta, valor: consulta.tipo === "qr" ? normalizarCodigoQr(consulta.valor) : normalizarNumeroComanda(consulta.valor) };
}

export const ESTADOS_PUBLICOS: Record<string, string> = {
  PENDIENTE: "Pedido recibido", EN_PROCESO: "En proceso", FINALIZADA: "Listo para retirar",
  ENTREGADA: "Entregado", ANULADA: "Anulado",
};

export function presentarPedido(pedido: PedidoPublico) {
  const etapas = pedido.comandaEtapas_on_comanda.map((etapa) => ({
    nombre: etapa.nombreEtapa ?? etapa.etapa.nombre,
    orden: etapa.ordenEtapa ?? etapa.etapa.orden,
    estado: etapa.estado,
    fechaCompletado: etapa.fechaCompletado,
  })).sort((a, b) => a.orden - b.orden);
  return {
    estado: ESTADOS_PUBLICOS[pedido.estado] ?? "Estado no disponible",
    servicios: [...new Set(pedido.comandaDetalles_on_comanda.map((d) => d.tipoServicio.nombre))].join(" · ") || "Lavandería",
    etapas,
    // El estado global se presenta por separado. No inventar etapas históricas.
    progreso: etapas.length ? Math.round(etapas.filter((e) => e.estado === "COMPLETADA").length / etapas.length * 100) : null,
  };
}

export function fechaSeguimiento(value?: string | null): string {
  if (!value || Number.isNaN(Date.parse(value))) return "Sin registro";
  return new Intl.DateTimeFormat("es-CL", { timeZone: "America/Santiago", dateStyle: "short", timeStyle: "short", hourCycle: "h23" }).format(new Date(value));
}
