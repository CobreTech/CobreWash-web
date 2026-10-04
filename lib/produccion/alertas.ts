import { limiteEtapaMin } from "./limites";

export type DatosAlertaEtapa = {
  estado: string;
  orden: number;
  fechaInicio?: string | null;
  fechaRecepcion: string;
  tiempoEstimadoMin?: number | null;
};

function inicioEtapa(datos: DatosAlertaEtapa) {
  return datos.fechaInicio ?? (datos.orden === 1 ? datos.fechaRecepcion : null);
}

function vencimiento(datos: DatosAlertaEtapa) {
  if (datos.estado !== "EN_PROCESO" && !(datos.estado === "PENDIENTE" && datos.orden === 1)) return null;
  const inicio = inicioEtapa(datos);
  if (!inicio || !datos.tiempoEstimadoMin || datos.tiempoEstimadoMin <= 0) return null;
  const fecha = Date.parse(inicio);
  return Number.isFinite(fecha) ? fecha + datos.tiempoEstimadoMin * 60_000 : null;
}

export function estaEtapaAtrasada(datos: DatosAlertaEtapa, ahora = Date.now()) {
  const fecha = vencimiento(datos);
  return fecha != null && fecha < ahora;
}

export function minutosExcedidos(datos: DatosAlertaEtapa, ahora = Date.now()) {
  const fecha = vencimiento(datos);
  return fecha == null ? 0 : Math.max(0, Math.ceil((ahora - fecha) / 60_000));
}
type EtapaAlerta = {
  etapaId: string; nombreEtapa?: string | null; ordenEtapa?: number | null;
  tiempoEstimadoMin?: number | null; estado: string; fechaInicio?: string | null;
  asignadoA?: { nombre: string; apellido?: string | null } | null;
  etapa: { nombre: string; orden: number; tiempoEstimadoMin?: number | null };
};
export type ComandaAlerta = {
  id: string; numeroComanda: string; estado: string; fechaRecepcion: string;
  comandaEtapas_on_comanda: EtapaAlerta[];
};

export function alertaComanda(comanda: ComandaAlerta, ahora = Date.now()) {
  if (!["PENDIENTE", "EN_PROCESO", "FINALIZADA"].includes(comanda.estado)) return null;
  const etapa = [...comanda.comandaEtapas_on_comanda]
    .sort((a, b) => (a.ordenEtapa ?? a.etapa.orden) - (b.ordenEtapa ?? b.etapa.orden))
    .find((e) => e.estado !== "COMPLETADA");
  if (!etapa) return null;
  const orden = etapa.ordenEtapa ?? etapa.etapa.orden;
  // Una copia vacía conserva el límite inicial, sin heredar cambios futuros
  // del catálogo. Solo los registros antiguos sin copia usan el catálogo.
  const esperado = limiteEtapaMin(orden, etapa.nombreEtapa != null ? etapa.tiempoEstimadoMin : etapa.etapa.tiempoEstimadoMin);
  const datos = { estado: etapa.estado, orden, fechaInicio: etapa.fechaInicio, fechaRecepcion: comanda.fechaRecepcion, tiempoEstimadoMin: esperado };
  if (!estaEtapaAtrasada(datos, ahora)) return null;
  return {
    id: `${comanda.id}:${etapa.etapaId}`, comandaId: comanda.id,
    numeroComanda: comanda.numeroComanda, etapa: etapa.nombreEtapa ?? etapa.etapa.nombre,
    esperadoMin: esperado!, excedidoMin: minutosExcedidos(datos, ahora),
    responsable: etapa.asignadoA ? [etapa.asignadoA.nombre, etapa.asignadoA.apellido].filter(Boolean).join(" ") : "Sin asignar",
    href: `/intranet/seguimiento?${new URLSearchParams({ comanda: comanda.id, buscar: comanda.numeroComanda })}`,
  };
}

export function detectarAlertas(comandas: ComandaAlerta[], ahora = Date.now()) {
  return comandas.map((c) => alertaComanda(c, ahora)).filter((a) => a != null)
    .sort((a, b) => b.excedidoMin - a.excedidoMin || a.id.localeCompare(b.id));
}
