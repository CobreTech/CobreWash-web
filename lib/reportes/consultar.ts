import { getReporteCuentas, getDetalleReporteCuentas, getFiltrosReportes } from "@/src/dataconnect-generated";
import { dataConnect } from "@/lib/firebase/client";
import { rangoConsulta } from "./fechas";
import { claveCuenta, totales, type FiltrosReporte, type VistaReporte } from "./modelo";

const opciones = { fetchPolicy: "SERVER_ONLY" as const };
export const TAMANO_PAGINA = 500;

// Nunca se exporta ni grafica una primera página como si fuera el total.
export async function todasLasPaginas<T>(consulta: (offset: number) => Promise<T[]>) {
  const filas: T[] = [];
  for (let offset = 0; ; offset += TAMANO_PAGINA) {
    const pagina = await consulta(offset);
    filas.push(...pagina);
    if (pagina.length < TAMANO_PAGINA) return filas;
  }
}

export async function consultarFiltrosReportes() {
  const [clientes, empresas] = await Promise.all([
    todasLasPaginas(async (offset) => (await getFiltrosReportes(dataConnect, { limit: TAMANO_PAGINA, offset }, opciones)).data.clientes),
    todasLasPaginas(async (offset) => (await getFiltrosReportes(dataConnect, { limit: TAMANO_PAGINA, offset }, opciones)).data.empresas),
  ]);
  return { clientes, empresas: empresas.map((e) => e.empresa!).filter((e) => e.trim()) };
}

export async function consultarReporte(vista: VistaReporte, filtros: FiltrosReporte) {
  if (vista !== "cliente") throw new Error("Vista no disponible.");
  const variables = { ...rangoConsulta(filtros.desde, filtros.hasta), clienteId: filtros.clienteId || null, empresa: filtros.empresa || null, limit: TAMANO_PAGINA };
  const [cuentas, prendas, comandas] = await Promise.all([
    todasLasPaginas(async (offset) => (await getReporteCuentas(dataConnect, { ...variables, offset }, opciones)).data.cuentas),
    todasLasPaginas(async (offset) => (await getReporteCuentas(dataConnect, { ...variables, offset }, opciones)).data.prendas),
    todasLasPaginas(async (offset) => (await getDetalleReporteCuentas(dataConnect, { ...variables, offset }, opciones)).data.comandas),
  ]);
  const cantidades = new Map(prendas.map((p) => [claveCuenta(p.comanda.cliente.id, p.comanda.empresa), p.cantidad_sum ?? 0]));
  const resumen = cuentas.map((c) => ({
    id: claveCuenta(c.cliente.id, c.empresa), label: c.cliente.nombre + (c.empresa ? ` · ${c.empresa}` : ""),
    comandas: c._count, prendas: cantidades.get(claveCuenta(c.cliente.id, c.empresa)) ?? 0, facturado: c.valorTotal_sum ?? 0,
  })).sort((a, b) => b.facturado - a.facturado || a.label.localeCompare(b.label, "es"));
  const detalle = comandas.map((c) => ({ id: c.id, numero: c.numeroComanda, fecha: c.fechaRecepcion, cliente: c.cliente.nombre, empresa: c.empresa ?? "", estado: c.estado, prendas: c.prendas[0]?.cantidad_sum ?? 0, facturado: c.valorTotal }));
  return totales(resumen, detalle);
}
