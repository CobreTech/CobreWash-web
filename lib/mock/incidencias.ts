export const MOTIVOS_INCIDENCIA = [
  "Prenda dañada",
  "Mancha persistente",
  "Prenda extraviada",
  "Falla de maquinaria",
  "Retraso en producción",
  "Otro",
] as const;

export type MotivoIncidencia = (typeof MOTIVOS_INCIDENCIA)[number];
export type EstadoIncidencia = "ABIERTA" | "EN_REVISION" | "RESUELTA";

export interface IncidenciaMock {
  id: string;
  comandaId: string;
  cliente: string;
  motivo: MotivoIncidencia;
  descripcion?: string;
  estado: EstadoIncidencia;
  registradaPor: string;
  fecha: string;
}

const STORAGE_KEY = "cobrewash-incidencias-mock";
export const INCIDENCIAS_EVENT = "cobrewash:incidencias";

export const INCIDENCIAS_DEMO: IncidenciaMock[] = [
  {
    id: "INC-024",
    comandaId: "ELCOBRE-14r3",
    cliente: "Hotel Agua del Desierto",
    motivo: "Mancha persistente",
    descripcion: "Dos fundas mantienen una mancha después del segundo ciclo. Se separaron para revisión.",
    estado: "EN_REVISION",
    registradaPor: "Carlos Muñoz",
    fecha: "2026-09-07T12:18:00-03:00",
  },
  {
    id: "INC-023",
    comandaId: "ELCOBRE-13a8",
    cliente: "Constructora Norte SpA",
    motivo: "Prenda dañada",
    descripcion: "Cierre de una chaqueta llegó trabado desde recepción.",
    estado: "ABIERTA",
    registradaPor: "María Soto",
    fecha: "2026-09-07T10:42:00-03:00",
  },
  {
    id: "INC-022",
    comandaId: "ELCOBRE-11p2",
    cliente: "Particular / Empresa",
    motivo: "Falla de maquinaria",
    descripcion: "Secadora 2 se detuvo; la carga fue reasignada sin pérdida de prendas.",
    estado: "RESUELTA",
    registradaPor: "Carlos Muñoz",
    fecha: "2026-09-06T16:05:00-03:00",
  },
];

function notificarCambio() {
  window.dispatchEvent(new CustomEvent(INCIDENCIAS_EVENT));
}

export function listarIncidenciasMock(): IncidenciaMock[] {
  if (typeof window === "undefined") return INCIDENCIAS_DEMO;
  try {
    const guardadas = window.localStorage.getItem(STORAGE_KEY);
    if (!guardadas) return INCIDENCIAS_DEMO;
    const parsed = JSON.parse(guardadas);
    return Array.isArray(parsed) ? parsed : INCIDENCIAS_DEMO;
  } catch {
    return INCIDENCIAS_DEMO;
  }
}

export function registrarIncidenciaMock(data: Omit<IncidenciaMock, "id" | "estado" | "fecha">) {
  const actuales = listarIncidenciasMock();
  const correlativo = Math.max(24, ...actuales.map((item) => Number(item.id.replace("INC-", "")) || 0)) + 1;
  const incidencia: IncidenciaMock = {
    ...data,
    id: `INC-${String(correlativo).padStart(3, "0")}`,
    estado: "ABIERTA",
    fecha: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([incidencia, ...actuales]));
  notificarCambio();
  return incidencia;
}

export function actualizarEstadoIncidenciaMock(id: string, estado: EstadoIncidencia) {
  const actualizadas = listarIncidenciasMock().map((item) => item.id === id ? { ...item, estado } : item);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
  notificarCambio();
}
