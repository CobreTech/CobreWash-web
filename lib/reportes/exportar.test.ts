import { describe, expect, it } from "vitest";
import { Workbook } from "exceljs";
import { prepararExportacion } from "./exportable";
import { generarExcel, generarPdf } from "./exportar";
import type { Reporte } from "./modelo";

const datos: Reporte = {
  comandas: 35,
  prendas: 70,
  facturado: 35000,
  resumen: [
    {
      id: "c",
      label: "José Muñoz · Minera",
      comandas: 35,
      prendas: 70,
      facturado: 35000,
    },
  ],
  detalle: Array.from({ length: 35 }, (_, i) => ({
    id: String(i),
    numero: `COM-${String(i + 1).padStart(3, "0")}`,
    fecha: "2026-10-02T12:00:00Z",
    cliente: i === 0 ? '=HYPERLINK("https://example.test")' : "José Muñoz",
    empresa: "Minera",
    estado: "ENTREGADA",
    prendas: 2,
    facturado: 1000,
    servicio: "Lavado",
    prenda: "Camisa",
    pesoKg: 1.5,
  })),
};
const filtros = {
  desde: "2026-10-01",
  hasta: "2026-10-05",
  clienteId: "c",
  empresa: "Minera",
  servicioId: "lavado",
};
const preparar = (vista: "cliente" | "servicio" | "volumen") =>
  prepararExportacion({
    vista,
    filtros,
    datos,
    clienteNombre: "José Muñoz",
    servicioNombre: "Lavado",
    generadoEn: new Date("2026-10-05T15:00:00Z"),
  });

describe("exportaciones reales", () => {
  it.each(["cliente", "servicio", "volumen"] as const)(
    "reabre el XLSX de %s y conserva números, filtros y todas las filas",
    async (vista) => {
      const archivo = await generarExcel(preparar(vista));
      expect(archivo.type).toBe(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      const libro = new Workbook();
      await libro.xlsx.load(await archivo.arrayBuffer());
      expect(libro.worksheets.map((s) => s.name)).toEqual([
        "Información",
        "Resumen",
        "Detalle",
      ]);
      const resumen = libro.getWorksheet("Resumen")!;
      expect(resumen.lastRow!.getCell(4).value).toBe(35000);
      const detalle = libro.getWorksheet("Detalle")!;
      expect(detalle.rowCount).toBe(36);
      expect(detalle.lastRow!.getCell(1).value).toBe("COM-035");
      expect(detalle.getRow(2).getCell(3).value).toBe(
        '=HYPERLINK("https://example.test")',
      );
      expect(
        detalle.getRow(2).getCell(vista === "servicio" ? 9 : 6).value,
      ).toBe(2);
      const info = libro.getWorksheet("Información")!;
      expect(info.getRow(3).values).toEqual([undefined, "Desde", "2026-10-01"]);
      expect(info.getRow(6).getCell(2).value).toBe("José Muñoz");
    },
  );
  it.each(["cliente", "servicio", "volumen"] as const)(
    "genera un PDF válido para %s",
    async (vista) => {
      const archivo = await generarPdf(preparar(vista));
      expect(archivo.type).toBe("application/pdf");
      const contenido = Buffer.from(await archivo.arrayBuffer()).toString(
        "latin1",
      );
      expect(contenido.startsWith("%PDF-")).toBe(true);
      expect(contenido).toContain("%%EOF");
      expect(
        (contenido.match(/\/Type \/Page\b/g) ?? []).length,
      ).toBeGreaterThanOrEqual(3);
    },
  );
  it("prepara volumen diario con periodos vacíos y sus indicadores", () => {
    const reporte = prepararExportacion({
      vista: "volumen",
      filtros,
      datos,
      agrupacion: "dia",
    });
    expect(reporte.resumen.filas.map((r) => r[2])).toEqual([
      0, 70, 0, 0, 0, 70,
    ]);
    expect(
      reporte.indicadores.find(
        ([nombre]) => nombre === "Promedio diario (prendas)",
      )?.[1],
    ).toBe(14);
    expect(
      preparar("cliente").metadatos.some(([nombre]) => nombre === "Servicio"),
    ).toBe(false);
  });
  it("exporta resultados vacíos con totales cero y encabezados", async () => {
    const reporte = prepararExportacion({
      vista: "cliente",
      filtros,
      datos: {
        resumen: [],
        detalle: [],
        comandas: 0,
        prendas: 0,
        facturado: 0,
      },
    });
    expect(
      reporte.indicadores.find(
        ([nombre]) => nombre === "Ticket promedio (CLP)",
      )?.[1],
    ).toBe(0);
    const libro = new Workbook();
    await libro.xlsx.load(await (await generarExcel(reporte)).arrayBuffer());
    expect(libro.getWorksheet("Detalle")!.rowCount).toBe(1);
    expect(libro.getWorksheet("Resumen")!.lastRow!.getCell(4).value).toBe(0);
  });
});
