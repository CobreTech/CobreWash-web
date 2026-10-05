import { fechaChile, sumarDias } from "./fechas";
import { claveCuenta, type FilaDetalle, type FilaResumen } from "./modelo";

export type AgrupacionPeriodo = "dia" | "mes";

export function volumenPorCuenta(detalle: FilaDetalle[]) {
  const grupos = new Map<string, FilaResumen>();
  for (const d of detalle) {
    const id = claveCuenta(d.clienteId ?? d.cliente, d.empresa);
    const fila = grupos.get(id) ?? {
      id,
      label: d.cliente + (d.empresa ? ` · ${d.empresa}` : ""),
      comandas: 0,
      prendas: 0,
      facturado: 0,
    };
    fila.comandas++;
    fila.prendas += d.prendas;
    fila.facturado += d.facturado;
    grupos.set(id, fila);
  }
  return [...grupos.values()].sort((a, b) => b.prendas - a.prendas);
}

export function volumenPorPeriodo(
  detalle: FilaDetalle[],
  desde: string,
  hasta: string,
  agrupacion: AgrupacionPeriodo,
) {
  const grupos = new Map<string, FilaResumen>();
  for (let dia = desde; dia <= hasta; dia = sumarDias(dia, 1)) {
    const id = agrupacion === "mes" ? dia.slice(0, 7) : dia;
    if (!grupos.has(id))
      grupos.set(id, {
        id,
        label:
          agrupacion === "mes"
            ? `${id.slice(5, 7)}/${id.slice(0, 4)}`
            : `${id.slice(8, 10)}/${id.slice(5, 7)}/${id.slice(0, 4)}`,
        comandas: 0,
        prendas: 0,
        facturado: 0,
      });
  }
  for (const d of detalle) {
    const dia = fechaChile(d.fecha);
    const fila = grupos.get(agrupacion === "mes" ? dia.slice(0, 7) : dia);
    if (!fila) continue;
    fila.comandas++;
    fila.prendas += d.prendas;
    fila.facturado += d.facturado;
  }
  return [...grupos.values()];
}

export function indicadoresVolumen(
  detalle: FilaDetalle[],
  desde: string,
  hasta: string,
) {
  const dias = volumenPorPeriodo(detalle, desde, hasta, "dia");
  const prendas = detalle.reduce((s, d) => s + d.prendas, 0);
  const pico = [...dias].sort((a, b) => b.prendas - a.prendas)[0];
  return {
    promedioDiario: dias.length ? prendas / dias.length : 0,
    prendasPorComanda: detalle.length ? prendas / detalle.length : 0,
    pico: pico?.prendas ? pico : null,
  };
}
