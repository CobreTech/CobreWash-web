import { fechaChile } from "./fechas";
import {
  indicadoresVolumen,
  volumenPorPeriodo,
  type AgrupacionPeriodo,
} from "./volumen";
import type { FiltrosReporte, Reporte, VistaReporte } from "./modelo";

export type Celda = string | number;
export type TablaExportable = {
  titulo: string;
  columnas: string[];
  filas: Celda[][];
};
export type ReporteExportable = {
  titulo: string;
  nombre: string;
  generadoEn: Date;
  metadatos: [string, Celda][];
  indicadores: [string, Celda][];
  resumen: TablaExportable;
  detalle: TablaExportable;
};

export function prepararExportacion({
  vista,
  filtros,
  datos,
  agrupacion = "mes",
  clienteNombre,
  servicioNombre,
  generadoEn = new Date(),
}: {
  vista: VistaReporte;
  filtros: FiltrosReporte;
  datos: Reporte;
  agrupacion?: AgrupacionPeriodo;
  clienteNombre?: string;
  servicioNombre?: string;
  generadoEn?: Date;
}): ReporteExportable {
  const nombreVista = {
    cliente: "Comandas por cliente / empresa",
    servicio: "Demanda por tipo de servicio",
    volumen: "Volumen de prendas procesadas",
  }[vista];
  const resumen =
    vista === "volumen"
      ? volumenPorPeriodo(
          datos.detalle,
          filtros.desde,
          filtros.hasta,
          agrupacion,
        )
      : datos.resumen;
  const indicadores: [string, Celda][] = [
    ["Comandas únicas", datos.comandas],
    [
      vista === "volumen" ? "Prendas procesadas" : "Prendas recibidas",
      datos.prendas,
    ],
    ["Valor total (CLP)", datos.facturado],
    [
      "Ticket promedio (CLP)",
      datos.comandas ? datos.facturado / datos.comandas : 0,
    ],
  ];
  if (vista === "volumen") {
    const k = indicadoresVolumen(datos.detalle, filtros.desde, filtros.hasta);
    indicadores.push(
      ["Promedio diario (prendas)", k.promedioDiario],
      ["Prendas por comanda", k.prendasPorComanda],
      [
        "Día de mayor carga",
        k.pico
          ? `${k.pico.label} · ${k.pico.prendas} prendas`
          : "Sin actividad",
      ],
    );
  }
  const metadatos: [string, Celda][] = [
    ["Desde", filtros.desde],
    ["Hasta (incluido)", filtros.hasta],
    ["Zona horaria", "America/Santiago"],
    ["Cliente", clienteNombre || filtros.clienteId || "Todos"],
    ["Empresa", filtros.empresa || "Todas"],
    [
      "Fecha utilizada",
      vista === "volumen"
        ? "Primer cierre de producción; entrega registrada como respaldo"
        : "Recepción",
    ],
    ["Comandas anuladas", "Excluidas"],
  ];
  if (vista !== "cliente")
    metadatos.push([
      "Servicio",
      servicioNombre || filtros.servicioId || "Todos",
    ]);
  if (vista === "servicio")
    metadatos.push(
      [
        "Conteo por servicio",
        "Una comanda puede figurar en varios servicios; el total cuenta comandas únicas",
      ],
      ["Montos", "Subtotales de los servicios seleccionados"],
    );
  if (vista === "volumen")
    metadatos.push(
      ["Agrupación", agrupacion === "dia" ? "Por día" : "Por mes"],
      ["Prendas", "Suma de cantidades registradas en las líneas de servicio"],
    );
  return {
    titulo: nombreVista,
    nombre: `reporte-${vista}-${filtros.desde}-${filtros.hasta}`,
    generadoEn,
    metadatos,
    indicadores,
    resumen: {
      titulo: "Resumen",
      columnas: [
        vista === "cliente"
          ? "Cliente / empresa"
          : vista === "servicio"
            ? "Servicio"
            : "Periodo",
        "Comandas",
        "Prendas",
        "Valor (CLP)",
      ],
      filas: [
        ...resumen.map((r) => [r.label, r.comandas, r.prendas, r.facturado]),
        [
          "TOTAL (comandas únicas)",
          datos.comandas,
          datos.prendas,
          datos.facturado,
        ],
      ],
    },
    detalle: {
      titulo: "Detalle",
      columnas: [
        "Comanda",
        vista === "volumen" ? "Procesamiento" : "Recepción",
        "Cliente",
        "Empresa",
        "Estado",
        ...(vista === "servicio" ? ["Servicio", "Prenda", "Peso (kg)"] : []),
        "Prendas",
        "Valor (CLP)",
      ],
      filas: datos.detalle.map((r) => [
        r.numero,
        fechaChile(r.fecha),
        r.cliente,
        r.empresa,
        r.estado.replaceAll("_", " "),
        ...(vista === "servicio"
          ? [r.servicio ?? "", r.prenda ?? "", r.pesoKg ?? ""]
          : []),
        r.prendas,
        r.facturado,
      ]),
    },
  };
}
