import type {
  EstadoVehiculo,
  GetFlotaVehiculosData,
  MomentoInspeccion,
  SalidaVehiculoEstado,
} from "@/src/dataconnect-generated";

export type VehiculoFlota = GetFlotaVehiculosData["vehiculos"][number];
export type ConductorFlota = GetFlotaVehiculosData["conductores"][number];
export type SalidaFlota = GetFlotaVehiculosData["salidas"][number];
export type InspeccionFlota = SalidaFlota["inspecciones"][number];
export type FotoInspeccionFlota = InspeccionFlota["fotos"][number];

export type EstadoOperativoVehiculo = "Disponible" | "En ruta" | "Inactivo";

export interface ResumenVehiculo {
  vehiculo: VehiculoFlota;
  estadoOperativo: EstadoOperativoVehiculo;
  salidaActiva: SalidaFlota | null;
  kilometrajeActual: number;
  totalSalidas: number;
  ultimaSalida: SalidaFlota | null;
}

export interface KpisFlota {
  total: number;
  disponibles: number;
  enRuta: number;
  inactivos: number;
}

export interface EvidenciaFotoInput {
  id: string;
  rutaStorage: string;
  descripcion: string;
}

export interface VehiculoFormState {
  id?: string;
  patente: string;
  marca: string;
  modelo: string;
  anio: string;
  descripcion: string;
  activo: boolean;
}

export interface SalidaFormState {
  vehiculoId: string;
  repartidorId: string;
  kilometraje: string;
  estadoVehiculo: EstadoVehiculo;
  observaciones: string;
  observacionesInspeccion: string;
  fotos: EvidenciaFotoInput[];
}

export interface RetornoFormState {
  salidaId: string;
  vehiculoPatente: string;
  kilometrajeSalida: number;
  kilometrajeRetorno: string;
  estadoVehiculo: EstadoVehiculo;
  observacionesRetorno: string;
  observacionesInspeccion: string;
  fotos: EvidenciaFotoInput[];
}

export type VistaVehiculos = "flota" | "en-ruta" | "historial";

export type { EstadoVehiculo, MomentoInspeccion, SalidaVehiculoEstado };
