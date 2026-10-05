export type VistaReporte = "cliente" | "servicio" | "volumen";
export type FiltrosReporte = {
  desde: string;
  hasta: string;
  clienteId: string;
  empresa: string;
  servicioId?: string;
};
export type FilaResumen = {
  id: string;
  label: string;
  comandas: number;
  prendas: number;
  facturado: number;
};
export type FilaDetalle = {
  id: string;
  comandaId?: string;
  clienteId?: string;
  numero: string;
  fecha: string;
  cliente: string;
  empresa: string;
  estado: string;
  prendas: number;
  facturado: number;
  servicio?: string;
  prenda?: string;
  pesoKg?: number | null;
};
export type Reporte = {
  resumen: FilaResumen[];
  detalle: FilaDetalle[];
  comandas: number;
  prendas: number;
  facturado: number;
};

export function claveCuenta(clienteId: string, empresa?: string | null) {
  return JSON.stringify([clienteId, empresa ?? ""]);
}

export function totales(
  resumen: FilaResumen[],
  detalle: FilaDetalle[],
): Reporte {
  return {
    resumen,
    detalle,
    comandas: new Set(detalle.map((r) => r.comandaId ?? r.id)).size,
    prendas: resumen.reduce((s, r) => s + r.prendas, 0),
    facturado: resumen.reduce((s, r) => s + r.facturado, 0),
  };
}
