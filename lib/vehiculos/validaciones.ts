import { EstadoVehiculo } from "@/src/dataconnect-generated";
import type {
  ConductorFlota,
  InspeccionFlota,
  KpisFlota,
  ResumenVehiculo,
  SalidaFlota,
  VehiculoFlota,
} from "./modelo";

const ROLES_CONDUCTOR_PERMITIDOS = new Set(["conductor", "repartidor"]);

/**
 * Verifica que el rol pertenezca exclusivamente a "conductor" o "repartidor".
 */
export function esRolConductorORepartidor(rolNombre?: string | null): boolean {
  if (!rolNombre) return false;
  return ROLES_CONDUCTOR_PERMITIDOS.has(rolNombre.trim().toLowerCase());
}

/**
 * Filtra la lista de usuarios dejando únicamente aquellos con rol "conductor" o "repartidor".
 */
export function filtrarConductoresFlota<
  T extends Pick<ConductorFlota, "rol">,
>(conductores: T[]): T[] {
  return conductores.filter((c) => esRolConductorORepartidor(c.rol?.nombre));
}

const PATENTE_CHILENA_REGEX = /^([A-Z]{4}-?\d{2}|[A-Z]{2}-?\d{4}|[A-Z]{3}-?\d{3})$/;

/**
 * Normaliza una patente chilena a mayúsculas y formato estándar con guion
 * (ej. "hlrt24" -> "HLRT-24", "ab1234" -> "AB-1234").
 */
export function normalizarPatente(valor: string): string {
  const limpia = valor.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (/^[A-Z]{4}\d{2}$/.test(limpia)) {
    return `${limpia.slice(0, 4)}-${limpia.slice(4)}`;
  }
  if (/^[A-Z]{2}\d{4}$/.test(limpia)) {
    return `${limpia.slice(0, 2)}-${limpia.slice(2)}`;
  }
  if (/^[A-Z]{3}\d{3}$/.test(limpia)) {
    return `${limpia.slice(0, 3)}-${limpia.slice(3)}`;
  }
  return valor.trim().toUpperCase().replace(/\s+/g, "-");
}

export function esPatenteValida(valor: string): boolean {
  const normalizada = normalizarPatente(valor);
  return (
    normalizada.length >= 5 &&
    normalizada.length <= 10 &&
    PATENTE_CHILENA_REGEX.test(normalizada)
  );
}

export function validarFormularioVehiculo(
  input: {
    id?: string;
    patente: string;
    marca: string;
    modelo: string;
    anio: string;
    descripcion: string;
    activo: boolean;
  },
  existentes: Pick<VehiculoFlota, "id" | "patente">[],
  tieneSalidaActiva = false,
): string | null {
  const patente = normalizarPatente(input.patente);
  if (!patente) return "La patente es obligatoria.";
  if (!esPatenteValida(patente)) {
    return "Ingresa una patente chilena válida (ej. HLRT-24 o AB-1234).";
  }
  const duplicado = existentes.some(
    (v) =>
      v.id !== input.id &&
      normalizarPatente(v.patente) === patente,
  );
  if (duplicado) {
    return "Ya existe un vehículo registrado con esa patente.";
  }

  const marca = input.marca.trim();
  if (marca.length < 2 || marca.length > 50) {
    return "La marca debe tener entre 2 y 50 caracteres.";
  }

  const modelo = input.modelo.trim();
  if (modelo.length < 1 || modelo.length > 50) {
    return "El modelo es obligatorio (máximo 50 caracteres).";
  }

  if (input.anio.trim() !== "") {
    const anioNum = Number(input.anio);
    if (!Number.isInteger(anioNum) || anioNum < 1980 || anioNum > 2100) {
      return "El año debe ser un número entero entre 1980 y 2100.";
    }
  }

  if (input.descripcion.trim().length > 200) {
    return "La descripción no puede superar los 200 caracteres.";
  }

  if (!input.activo && tieneSalidaActiva) {
    return "No puedes desactivar un vehículo que tiene una salida en curso.";
  }

  return null;
}

export function validarSalidaVehiculo(input: {
  vehiculoId: string;
  repartidorId: string;
  kilometraje: string;
  kilometrajeMinimo: number;
  estadoVehiculo: EstadoVehiculo;
}): string | null {
  if (!input.vehiculoId) return "Selecciona un vehículo disponible.";
  if (!input.repartidorId) return "Selecciona el conductor responsable.";
  if (input.estadoVehiculo === EstadoVehiculo.NO_APTO) {
    return "Un vehículo calificado como NO APTO no puede salir a terreno.";
  }
  const textoKm = input.kilometraje.trim().replace(",", ".");
  if (!textoKm) return "Ingresa el kilometraje de salida.";
  const km = Number(textoKm);
  if (!Number.isFinite(km) || km < 0) {
    return "El kilometraje debe ser un número mayor o igual a cero.";
  }
  if (km < input.kilometrajeMinimo) {
    return `El kilometraje de salida no puede ser menor al último registrado (${input.kilometrajeMinimo.toLocaleString("es-CL")} km).`;
  }
  return null;
}

export function validarRetornoVehiculo(input: {
  salidaId: string;
  kilometrajeSalida: number;
  kilometrajeRetorno: string;
}): string | null {
  if (!input.salidaId) return "Salida no identificada.";
  const textoKm = input.kilometrajeRetorno.trim().replace(",", ".");
  if (!textoKm) return "Ingresa el kilometraje de retorno.";
  const km = Number(textoKm);
  if (!Number.isFinite(km) || km < 0) {
    return "El kilometraje de retorno debe ser un número válido.";
  }
  if (km < input.kilometrajeSalida) {
    return `El kilometraje de retorno (${km.toLocaleString("es-CL")} km) no puede ser menor al de salida (${input.kilometrajeSalida.toLocaleString("es-CL")} km).`;
  }
  return null;
}

export function obtenerInspeccionMomento(
  salida: Pick<SalidaFlota, "inspecciones">,
  momento: "ANTES" | "DESPUES",
): InspeccionFlota | null {
  return salida.inspecciones.find((i) => i.momento === momento) ?? null;
}

export function calcularKilometrosRecorridos(
  salida: Pick<SalidaFlota, "inspecciones">,
): number | null {
  const antes = obtenerInspeccionMomento(salida, "ANTES");
  const despues = obtenerInspeccionMomento(salida, "DESPUES");
  if (!antes || !despues) return null;
  const delta = Number((despues.kilometraje - antes.kilometraje).toFixed(1));
  return delta >= 0 ? delta : null;
}

export function construirResumenFlota(
  vehiculos: VehiculoFlota[],
  salidas: SalidaFlota[],
): { resumen: ResumenVehiculo[]; kpis: KpisFlota } {
  const salidasPorVehiculo = new Map<string, SalidaFlota[]>();
  for (const salida of salidas) {
    const id = salida.vehiculo.id;
    const lista = salidasPorVehiculo.get(id) ?? [];
    lista.push(salida);
    salidasPorVehiculo.set(id, lista);
  }

  let disponibles = 0;
  let enRuta = 0;
  let inactivos = 0;

  const resumen: ResumenVehiculo[] = vehiculos.map((vehiculo) => {
    const historial = salidasPorVehiculo.get(vehiculo.id) ?? [];
    const salidaActiva =
      historial.find(
        (s) => s.estado === "EN_SERVICIO" || s.estado === "PROGRAMADA",
      ) ?? null;

    let maxKm = 0;
    for (const s of historial) {
      for (const insp of s.inspecciones) {
        if (insp.kilometraje > maxKm) maxKm = insp.kilometraje;
      }
    }

    const estadoOperativo: ResumenVehiculo["estadoOperativo"] = salidaActiva
      ? "En ruta"
      : vehiculo.activo
        ? "Disponible"
        : "Inactivo";

    if (estadoOperativo === "En ruta") enRuta++;
    else if (estadoOperativo === "Disponible") disponibles++;
    else inactivos++;

    return {
      vehiculo,
      estadoOperativo,
      salidaActiva,
      kilometrajeActual: maxKm,
      totalSalidas: historial.length,
      ultimaSalida: historial[0] ?? null,
    };
  });

  return {
    resumen,
    kpis: {
      total: vehiculos.length,
      disponibles,
      enRuta,
      inactivos,
    },
  };
}
