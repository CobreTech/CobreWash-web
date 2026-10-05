// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ reporte: vi.fn(), filtros: vi.fn() }));
vi.mock("./consultar", () => ({
  consultarReporte: mocks.reporte,
  consultarFiltrosReportes: mocks.filtros,
}));
import { useReportes } from "./useReportes";
const filtros = {
  desde: "2026-10-01",
  hasta: "2026-10-05",
  clienteId: "",
  empresa: "",
};
const datos = {
  resumen: [],
  detalle: [],
  comandas: 0,
  prendas: 0,
  facturado: 0,
};
beforeEach(() => {
  mocks.reporte.mockReset().mockResolvedValue(datos);
  mocks.filtros.mockReset().mockResolvedValue({ clientes: [], empresas: [] });
});
afterEach(cleanup);
describe("carga de reportes", () => {
  it("no consulta sin acceso o con fechas inválidas", async () => {
    const { rerender, result } = renderHook(
      ({ acceso, hasta }) =>
        useReportes("admin", acceso, "cliente", { ...filtros, hasta }),
      { initialProps: { acceso: false, hasta: filtros.hasta } },
    );
    expect(mocks.reporte).not.toHaveBeenCalled();
    rerender({ acceso: true, hasta: "2026-09-01" });
    expect(result.current.error).toMatch(/inicial/);
    expect(mocks.reporte).not.toHaveBeenCalled();
  });
  it("descarta solicitudes antiguas al cambiar los filtros y oculta datos al revocar acceso", async () => {
    let resolver!: (datos: unknown) => void;
    mocks.reporte.mockReturnValueOnce(
      new Promise((resolve) => {
        resolver = resolve;
      }),
    );
    const { result, rerender } = renderHook(
      ({ empresa, acceso }) =>
        useReportes("admin", acceso, "cliente", { ...filtros, empresa }),
      { initialProps: { empresa: "Anterior", acceso: true } },
    );
    rerender({ empresa: "Actual", acceso: true });
    await waitFor(() => expect(result.current.datos).toEqual(datos));
    await act(async () => resolver({ ...datos, comandas: 99 }));
    expect(result.current.datos?.comandas).toBe(0);
    rerender({ empresa: "Actual", acceso: false });
    expect(result.current.datos).toBeNull();
  });
  it("distingue errores de resultados vacíos y permite reintentar", async () => {
    mocks.reporte.mockRejectedValueOnce(new Error("red"));
    const { result } = renderHook(() =>
      useReportes("admin", true, "cliente", filtros),
    );
    await waitFor(() => expect(result.current.error).toMatch(/conexión/));
    act(() => result.current.recargar());
    await waitFor(() => expect(result.current.datos).toEqual(datos));
    expect(result.current.error).toBe("");
  });
});
