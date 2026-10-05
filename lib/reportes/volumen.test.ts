import { describe, expect, it } from "vitest";
import {
  indicadoresVolumen,
  volumenPorCuenta,
  volumenPorPeriodo,
} from "./volumen";
import type { FilaDetalle } from "./modelo";
const fila = (fecha: string, prendas = 4): FilaDetalle => ({
  id: fecha,
  numero: "001",
  fecha,
  clienteId: "c",
  cliente: "Cliente",
  empresa: "Minera",
  estado: "ENTREGADA",
  prendas,
  facturado: 1000,
});

describe("volumen operacional", () => {
  it("separa meses de distintos años y muestra periodos sin actividad", () => {
    const resultado = volumenPorPeriodo(
      [fila("2026-12-31T15:00:00Z"), fila("2027-01-02T03:00:00Z", 6)],
      "2026-12-01",
      "2027-02-28",
      "mes",
    );
    expect(resultado.map((r) => [r.label, r.prendas])).toEqual([
      ["12/2026", 4],
      ["01/2027", 6],
      ["02/2027", 0],
    ]);
  });
  it("agrupa según el día chileno y calcula promedio sobre todos los días del rango", () => {
    const detalle = [
      fila("2026-10-02T02:59:59Z", 4),
      fila("2026-10-02T03:00:00Z", 6),
    ];
    expect(
      volumenPorPeriodo(detalle, "2026-10-01", "2026-10-03", "dia").map(
        (r) => r.prendas,
      ),
    ).toEqual([4, 6, 0]);
    const indicadores = indicadoresVolumen(detalle, "2026-10-01", "2026-10-05");
    expect(indicadores.promedioDiario).toBe(2);
    expect(indicadores.prendasPorComanda).toBe(5);
    expect(indicadores.pico?.label).toBe("02/10/2026");
    expect(indicadoresVolumen([], "2026-10-01", "2026-10-05").pico).toBeNull();
  });
  it("mantiene distintas cuentas que comparten nombre", () => {
    expect(
      volumenPorCuenta([
        fila("2026-10-02T03:00:00Z"),
        { ...fila("2026-10-03T03:00:00Z"), clienteId: "otro" },
      ]),
    ).toHaveLength(2);
  });
});
