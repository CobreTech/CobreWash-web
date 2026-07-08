/**
 * Datos mock en memoria compartidos por todas las vistas de rol (admin,
 * recepcionista, operario y cliente) y por el módulo de reportes. No hay
 * backend real conectado para comandas: esto emula el "store" del prototipo.
 *
 * Las 5 etapas de producción coinciden con EtapaProduccion del schema:
 * recepción → lavado → secado → planchado → entrega.
 */

export const ETAPAS = ["Recepción", "Lavado", "Secado", "Planchado", "Entrega"] as const;
export type Etapa = (typeof ETAPAS)[number];

export type EstadoComanda = "Pendiente" | "En proceso" | "Listo" | "Entregado" | "Anulado";

export interface PrendaLinea {
  tipoPrenda: string;
  servicio: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Comanda {
  id: string; // numeroComanda público, ej. "COBRE-2848"
  cliente: string;
  tipoCliente: "Particular" | "Hotel/Empresa";
  telefono: string;
  email: string;
  direccion?: string;
  servicio: string;
  detalle: PrendaLinea[];
  fechaRecepcion: string;
  fechaEntregaEstimada?: string;
  /** Índice 0-4 de la etapa en curso; 5 = entregado; null = pendiente/anulado. */
  etapaActual: number | null;
  estado: EstadoComanda;
  operario?: string; // operario asignado a producción
  recepcionista?: string;
  observaciones?: string;
  /** Horas que la comanda lleva detenida en la etapa actual (para alertas). */
  horasEnEtapa?: number;
  motivoAnulacion?: string;
}

export const prendasTotales = (c: Comanda) =>
  c.detalle.reduce((s, d) => s + d.cantidad, 0);

export const valorTotal = (c: Comanda) =>
  c.detalle.reduce((s, d) => s + d.cantidad * d.precioUnitario, 0);

/** Progreso 0-100 según la etapa completada. */
export const progreso = (c: Comanda) => {
  if (c.estado === "Anulado") return 0;
  if (c.estado === "Entregado") return 100;
  if (c.etapaActual === null) return 0;
  return Math.round((c.etapaActual / ETAPAS.length) * 100);
};

/** Umbral de horas a partir del cual una etapa se considera estancada. */
export const UMBRAL_ESTANCADA = 6;

export const estaEstancada = (c: Comanda) =>
  c.estado === "En proceso" && (c.horasEnEtapa ?? 0) >= UMBRAL_ESTANCADA;

export const estadoConfig: Record<
  EstadoComanda,
  { bg: string; text: string; dot: string }
> = {
  Pendiente: { bg: "bg-amber-500/15", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-400" },
  "En proceso": { bg: "bg-brand-500/15", text: "text-brand-600 dark:text-brand-400", dot: "bg-brand-400" },
  Listo: { bg: "bg-green-500/15", text: "text-green-600 dark:text-green-400", dot: "bg-green-400" },
  Entregado: { bg: "bg-sky-500/15", text: "text-sky-600 dark:text-sky-400", dot: "bg-sky-400" },
  Anulado: { bg: "bg-red-500/15", text: "text-red-600 dark:text-red-400", dot: "bg-red-400" },
};

/** Operario mock que "inicia sesión" en la vista de operario. */
export const OPERARIO_DEMO = "Carlos Herrera";
/** Cliente mock cuyas comandas ve el dashboard de cliente. */
export const CLIENTE_DEMO = "Laura Vega";

export const COMANDAS: Comanda[] = [
  {
    id: "COBRE-2848",
    cliente: "Laura Vega",
    tipoCliente: "Particular",
    telefono: "+56 9 8812 3344",
    email: "laura.vega@gmail.com",
    direccion: "Av. Granaderos 1450, Calama",
    servicio: "Doméstica y Particular",
    detalle: [
      { tipoPrenda: "Camisa", servicio: "Lavado + Planchado", cantidad: 6, precioUnitario: 1200 },
      { tipoPrenda: "Pantalón", servicio: "Lavado + Planchado", cantidad: 4, precioUnitario: 1400 },
      { tipoPrenda: "Sábana 2 plazas", servicio: "Lavado", cantidad: 2, precioUnitario: 900 },
    ],
    fechaRecepcion: "01/06/2026 08:30",
    fechaEntregaEstimada: "03/06/2026",
    etapaActual: 1,
    estado: "En proceso",
    operario: "Carlos Herrera",
    recepcionista: "Paula Soto",
    horasEnEtapa: 2,
  },
  {
    id: "COBRE-2847",
    cliente: "María González",
    tipoCliente: "Particular",
    telefono: "+56 9 7723 4455",
    email: "m.gonzalez@gmail.com",
    direccion: "Los Aromos 320, Calama",
    servicio: "Doméstica y Particular",
    detalle: [
      { tipoPrenda: "Vestido", servicio: "Lavado en seco", cantidad: 3, precioUnitario: 3200 },
      { tipoPrenda: "Blusa", servicio: "Lavado + Planchado", cantidad: 6, precioUnitario: 950 },
    ],
    fechaRecepcion: "01/06/2026 08:00",
    fechaEntregaEstimada: "02/06/2026",
    etapaActual: 5,
    estado: "Listo",
    operario: "Carlos Herrera",
    recepcionista: "Paula Soto",
    horasEnEtapa: 0,
  },
  {
    id: "COBRE-2846",
    cliente: "Empresa TechCorp S.A.",
    tipoCliente: "Hotel/Empresa",
    telefono: "+56 2 2234 5566",
    email: "operaciones@techcorp.cl",
    direccion: "Parque Industrial APIAC, Calama",
    servicio: "Industrial / Empresa",
    detalle: [
      { tipoPrenda: "Overol", servicio: "Lavado industrial", cantidad: 60, precioUnitario: 2800 },
      { tipoPrenda: "Toalla", servicio: "Lavado + Secado", cantidad: 25, precioUnitario: 700 },
    ],
    fechaRecepcion: "01/06/2026 07:45",
    fechaEntregaEstimada: "04/06/2026",
    etapaActual: 2,
    estado: "En proceso",
    operario: "Diego Rojas",
    recepcionista: "Paula Soto",
    horasEnEtapa: 7,
  },
  {
    id: "COBRE-2845",
    cliente: "Pedro Rodríguez",
    tipoCliente: "Particular",
    telefono: "+56 9 6634 7788",
    email: "pedro.r@gmail.com",
    direccion: "Balmaceda 2233, Calama",
    servicio: "Retiro a Domicilio",
    detalle: [
      { tipoPrenda: "Chaqueta", servicio: "Lavado en seco", cantidad: 2, precioUnitario: 3800 },
      { tipoPrenda: "Camisa", servicio: "Lavado + Planchado", cantidad: 4, precioUnitario: 1200 },
    ],
    fechaRecepcion: "31/05/2026 17:20",
    fechaEntregaEstimada: "02/06/2026",
    etapaActual: 5,
    estado: "Listo",
    operario: "Carlos Herrera",
    recepcionista: "Ignacio Díaz",
    horasEnEtapa: 0,
  },
  {
    id: "COBRE-2843",
    cliente: "Hotel Plaza Calama",
    tipoCliente: "Hotel/Empresa",
    telefono: "+56 2 2456 7890",
    email: "ama.llaves@hotelplaza.cl",
    direccion: "Sotomayor 1987, Calama",
    servicio: "Industrial / Empresa",
    detalle: [
      { tipoPrenda: "Sábana 2 plazas", servicio: "Lavado + Planchado", cantidad: 120, precioUnitario: 1100 },
      { tipoPrenda: "Funda de almohada", servicio: "Lavado + Planchado", cantidad: 80, precioUnitario: 450 },
    ],
    fechaRecepcion: "31/05/2026 14:00",
    fechaEntregaEstimada: "03/06/2026",
    etapaActual: 3,
    estado: "En proceso",
    operario: "Carlos Herrera",
    recepcionista: "Ignacio Díaz",
    horasEnEtapa: 9,
  },
  {
    id: "COBRE-2841",
    cliente: "Clínica Santa María",
    tipoCliente: "Hotel/Empresa",
    telefono: "+56 2 2987 6543",
    email: "abastecimiento@csm.cl",
    direccion: "Av. Circunvalación 500, Calama",
    servicio: "Industrial / Empresa",
    detalle: [
      { tipoPrenda: "Uniforme clínico", servicio: "Lavado sanitizado", cantidad: 90, precioUnitario: 2600 },
      { tipoPrenda: "Toalla", servicio: "Lavado + Secado", cantidad: 40, precioUnitario: 700 },
    ],
    fechaRecepcion: "31/05/2026 10:00",
    fechaEntregaEstimada: "02/06/2026",
    etapaActual: 4,
    estado: "En proceso",
    operario: "Diego Rojas",
    recepcionista: "Ignacio Díaz",
    horasEnEtapa: 1,
  },
  {
    id: "COBRE-2840",
    cliente: "Carmen López",
    tipoCliente: "Particular",
    telefono: "+56 9 4456 2233",
    email: "carmen.lopez@gmail.com",
    direccion: "El Peumo 145, Calama",
    servicio: "Retiro a Domicilio",
    detalle: [
      { tipoPrenda: "Cortina", servicio: "Lavado en seco", cantidad: 5, precioUnitario: 2400 },
    ],
    fechaRecepcion: "30/05/2026 18:00",
    fechaEntregaEstimada: "02/06/2026",
    etapaActual: null,
    estado: "Pendiente",
    recepcionista: "Ignacio Díaz",
  },
  {
    id: "COBRE-2838",
    cliente: "Laura Vega",
    tipoCliente: "Particular",
    telefono: "+56 9 8812 3344",
    email: "laura.vega@gmail.com",
    direccion: "Av. Granaderos 1450, Calama",
    servicio: "Doméstica y Particular",
    detalle: [
      { tipoPrenda: "Edredón King", servicio: "Lavado + Secado", cantidad: 1, precioUnitario: 6500 },
      { tipoPrenda: "Toalla", servicio: "Lavado + Secado", cantidad: 8, precioUnitario: 700 },
    ],
    fechaRecepcion: "28/05/2026 11:00",
    fechaEntregaEstimada: "30/05/2026",
    etapaActual: 5,
    estado: "Entregado",
    operario: "Carlos Herrera",
    recepcionista: "Paula Soto",
  },
  {
    id: "COBRE-2837",
    cliente: "Valentina Ríos",
    tipoCliente: "Particular",
    telefono: "+56 9 3322 7788",
    email: "vale.rios@gmail.com",
    direccion: "Vicuña Mackenna 78, Calama",
    servicio: "Doméstica y Particular",
    detalle: [
      { tipoPrenda: "Camisa", servicio: "Lavado + Planchado", cantidad: 8, precioUnitario: 1200 },
    ],
    fechaRecepcion: "30/05/2026 09:30",
    etapaActual: 0,
    estado: "En proceso",
    operario: "Carlos Herrera",
    recepcionista: "Paula Soto",
    horasEnEtapa: 3,
  },
  {
    id: "COBRE-2835",
    cliente: "Constructora Norte",
    tipoCliente: "Hotel/Empresa",
    telefono: "+56 2 2111 3344",
    email: "bodega@cnorte.cl",
    direccion: "Ruta 25 km 4, Calama",
    servicio: "Industrial / Empresa",
    detalle: [
      { tipoPrenda: "Overol", servicio: "Lavado industrial", cantidad: 45, precioUnitario: 2800 },
    ],
    fechaRecepcion: "29/05/2026 15:30",
    etapaActual: null,
    estado: "Anulado",
    recepcionista: "Ignacio Díaz",
    motivoAnulacion: "Cliente reprogramó el retiro para la próxima semana.",
  },
];

/** Comandas asignadas a un operario (para su vista "Mis Tareas"). */
export const comandasDeOperario = (nombre: string) =>
  COMANDAS.filter(
    (c) => c.operario === nombre && (c.estado === "En proceso" || c.estado === "Pendiente"),
  );

/** Comandas de un cliente (para su dashboard e historial). */
export const comandasDeCliente = (nombre: string) =>
  COMANDAS.filter((c) => c.cliente === nombre);
