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

export function estaEtapaAtrasada(datos: DatosAlertaEtapa, ahora = Date.now()) {
  const inicio = inicioEtapa(datos);
  if (!inicio || !datos.tiempoEstimadoMin || datos.tiempoEstimadoMin <= 0) return false;
  if (datos.estado !== "EN_PROCESO" && datos.orden !== 1) return false;
  return new Date(inicio).getTime() + datos.tiempoEstimadoMin * 60_000 < ahora;
}

export function minutosExcedidos(datos: DatosAlertaEtapa, ahora = Date.now()) {
  const inicio = inicioEtapa(datos);
  if (!inicio || !datos.tiempoEstimadoMin) return 0;
  return Math.max(0, Math.floor((ahora - new Date(inicio).getTime()) / 60_000) - datos.tiempoEstimadoMin);
}
