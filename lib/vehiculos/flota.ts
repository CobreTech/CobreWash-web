import type {
  EstadoOperativoVehiculo,
  ResumenVehiculo,
  SalidaFlota,
} from "./modelo";
import { calcularKilometrosRecorridos, obtenerInspeccionMomento } from "./validaciones";

export const UMBRAL_DEMORA_MINUTOS = 480; // 8 horas en ruta

export function filtrarResumenFlota(
  resumen: ResumenVehiculo[],
  busqueda: string,
  estado: "Todos" | EstadoOperativoVehiculo,
): ResumenVehiculo[] {
  const termino = busqueda.trim().toLowerCase();
  return resumen.filter((item) => {
    if (estado !== "Todos" && item.estadoOperativo !== estado) {
      return false;
    }
    if (!termino) return true;
    const { vehiculo, salidaActiva } = item;
    const conductor = salidaActiva
      ? `${salidaActiva.repartidor.nombre} ${salidaActiva.repartidor.apellido ?? ""}`.toLowerCase()
      : "";
    return (
      vehiculo.patente.toLowerCase().includes(termino) ||
      vehiculo.marca.toLowerCase().includes(termino) ||
      vehiculo.modelo.toLowerCase().includes(termino) ||
      (vehiculo.descripcion ?? "").toLowerCase().includes(termino) ||
      String(vehiculo.anio ?? "").includes(termino) ||
      conductor.includes(termino)
    );
  });
}

export function mapearErrorVehiculos(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (/Ya existe un vehículo|Ya existe otro vehículo|unique constraint|already_exists/i.test(msg)) {
    return "Ya existe un vehículo registrado con esa patente.";
  }
  if (/No se puede desactivar un vehículo con una salida en curso/i.test(msg)) {
    return "No se puede desactivar un vehículo mientras tiene una salida en curso.";
  }
  if (/NO_APTO/i.test(msg)) {
    return "No se puede autorizar la salida de un vehículo calificado como NO APTO.";
  }
  if (/ya se encuentra en ruta|salida activa/i.test(msg)) {
    return "El vehículo ya registra una salida activa en curso.";
  }
  if (/kilometraje de retorno no puede ser menor/i.test(msg)) {
    return "El kilometraje de retorno no puede ser menor al kilometraje de salida.";
  }
  if (/inactivo/i.test(msg)) {
    return "El vehículo o conductor seleccionado se encuentra inactivo.";
  }
  if (/Solo administradores|No autorizado/i.test(msg)) {
    return "No tienes permisos para ejecutar esta operación.";
  }
  return "No fue posible guardar los cambios. Verifica los datos e intenta nuevamente.";
}

export function formatearFechaHoraVehiculo(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function calcularMinutosEnRuta(
  fechaSalida?: string | null,
  ahoraMs: number = Date.now(),
): number {
  if (!fechaSalida) return 0;
  const inicio = Date.parse(fechaSalida);
  if (Number.isNaN(inicio)) return 0;
  return Math.max(0, Math.floor((ahoraMs - inicio) / 60_000));
}

export function formatearDuracionRuta(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto > 0 ? `${horas} h ${resto} min` : `${horas} h`;
}

export interface FiltrosHistorialVehiculo {
  vehiculoId: string;
  repartidorId: string;
  estado: "TODOS" | SalidaFlota["estado"];
  desde: string;
  hasta: string;
}

export function filtrarSalidasHistorial(
  salidas: SalidaFlota[],
  filtros: FiltrosHistorialVehiculo,
): SalidaFlota[] {
  const desdeMs = filtros.desde ? Date.parse(`${filtros.desde}T00:00:00-03:00`) : null;
  const hastaMs = filtros.hasta ? Date.parse(`${filtros.hasta}T23:59:59.999-03:00`) : null;

  return salidas.filter((salida) => {
    if (filtros.vehiculoId && salida.vehiculo.id !== filtros.vehiculoId) {
      return false;
    }
    if (filtros.repartidorId && salida.repartidor.id !== filtros.repartidorId) {
      return false;
    }
    if (filtros.estado !== "TODOS" && salida.estado !== filtros.estado) {
      return false;
    }
    const refFecha = salida.fechaSalida ?? salida.creadoEn;
    const ms = Date.parse(refFecha);
    if (desdeMs !== null && !Number.isNaN(ms) && ms < desdeMs) {
      return false;
    }
    if (hastaMs !== null && !Number.isNaN(ms) && ms > hastaMs) {
      return false;
    }
    return true;
  });
}

export function crearCsvHistorialVehiculos(salidas: SalidaFlota[]): string {
  const escapar = (val: string | number | null | undefined) => {
    const str = String(val ?? "");
    const seguro = /^[=+\-@]/.test(str) ? `'${str}` : str;
    return `"${seguro.replace(/"/g, '""')}"`;
  };

  const encabezados = [
    "Patente",
    "Vehiculo",
    "Conductor",
    "Estado Viaje",
    "Fecha Salida",
    "Fecha Retorno",
    "Km Salida",
    "Km Retorno",
    "Km Recorridos",
    "Estado Inicial",
    "Estado Retorno",
    "Fotos Adjuntas",
    "Observaciones",
  ];

  const filas = salidas.map((s) => {
    const antes = obtenerInspeccionMomento(s, "ANTES");
    const despues = obtenerInspeccionMomento(s, "DESPUES");
    const recorridos = calcularKilometrosRecorridos(s);
    const totalFotos =
      (antes?.fotos.length ?? 0) + (despues?.fotos.length ?? 0);
    const conductor = `${s.repartidor.nombre} ${s.repartidor.apellido ?? ""}`.trim();
    const obs = [
      s.observaciones,
      antes?.observaciones ? `Salida: ${antes.observaciones}` : null,
      despues?.observaciones ? `Retorno: ${despues.observaciones}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    return [
      s.vehiculo.patente,
      `${s.vehiculo.marca} ${s.vehiculo.modelo}`,
      conductor,
      s.estado,
      formatearFechaHoraVehiculo(s.fechaSalida ?? s.creadoEn),
      formatearFechaHoraVehiculo(s.fechaRetorno),
      antes?.kilometraje ?? "",
      despues?.kilometraje ?? "",
      recorridos ?? "",
      antes?.estadoVehiculo ?? "",
      despues?.estadoVehiculo ?? "",
      totalFotos,
      obs,
    ]
      .map(escapar)
      .join(",");
  });

  return "\uFEFF" + [encabezados.map(escapar).join(","), ...filas].join("\r\n");
}
