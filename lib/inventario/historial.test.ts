import { expect, it, vi } from "vitest";
import { leerHistorialCompleto } from "./historial";
const filas = Array.from({ length: 1027 }, (_, i) => ({
  id: String(i), tipoMovimiento: "ENTRADA", cantidad: 1, fecha: "2026-10-25T12:00:00Z",
  insumo: { id: "a", nombre: "Detergente", unidadMedida: "L" },
}));
it("exporta todas las páginas, incluyendo movimientos anteriores al límite de 500", async () => {
  const cargar = vi.fn(async (offset: number, limit: number) => ({ movimientos: filas.slice(offset, offset + limit), total: filas.length }));
  expect(await leerHistorialCompleto(cargar)).toEqual(filas);
  expect(cargar.mock.calls).toEqual([[0, 500], [500, 500], [1000, 500]]);
});
it("rechaza una descarga parcial, duplicada o cuyo total cambió", async () => {
  await expect(leerHistorialCompleto(async () => ({ movimientos: [], total: 1 }))).rejects.toThrow();
  await expect(leerHistorialCompleto(async () => ({ movimientos: [filas[0], filas[0]], total: 2 }))).rejects.toThrow();
  await expect(leerHistorialCompleto(async (offset) => ({ movimientos: filas.slice(offset, offset + 500), total: offset ? 1028 : 1027 }))).rejects.toThrow();
});
it("admite un historial sin movimientos", async () => {
  expect(await leerHistorialCompleto(async () => ({ movimientos: [], total: 0 }))).toEqual([]);
});
