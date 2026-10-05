// @vitest-environment jsdom
import { createElement } from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  acceso: true,
  cargar: vi.fn(),
  exportar: vi.fn(),
  resultado: {
    datos: null,
    cargando: false,
    error: "",
    catalogos: { clientes: [], empresas: [], servicios: [] },
    recargar: vi.fn(),
  } as Record<string, unknown>,
}));
vi.mock("@/components/intranet/useRoleGuard", () => ({
  useRoleGuard: () => mocks.acceso,
}));
vi.mock("@/components/intranet/AuthGuard", () => ({
  useUsuarioActualContext: () => ({ id: "admin" }),
}));
vi.mock("@/lib/reportes/useReportes", () => ({
  useReportes: (...args: unknown[]) => {
    mocks.cargar(...args);
    return mocks.resultado;
  },
}));
vi.mock("@/lib/reportes/exportar", () => ({ exportarReporte: mocks.exportar }));
import ReportesPage from "./page";

beforeEach(() => {
  mocks.acceso = true;
  mocks.exportar.mockReset().mockResolvedValue(undefined);
  mocks.resultado = {
    datos: {
      resumen: [
        {
          id: "c",
          label: "Cliente · Minera",
          comandas: 25,
          prendas: 50,
          facturado: 25000,
        },
      ],
      detalle: Array.from({ length: 25 }, (_, i) => ({
        id: String(i),
        numero: `COM-${i + 1}`,
        fecha: "2026-10-02T12:00:00Z",
        cliente: "Cliente",
        empresa: "Minera",
        estado: "ENTREGADA",
        prendas: 2,
        facturado: 1000,
      })),
      comandas: 25,
      prendas: 50,
      facturado: 25000,
    },
    cargando: false,
    error: "",
    catalogos: {
      clientes: [{ id: "c", nombre: "Cliente" }],
      empresas: ["Minera"],
      servicios: [{ id: "s", nombre: "Lavado" }],
    },
    recargar: vi.fn(),
  };
});
afterEach(cleanup);

describe("reportes del administrador", () => {
  it("aplica filtros, cambia de vista, pagina y exporta todas las filas con el formato elegido", async () => {
    render(createElement(ReportesPage));
    expect(screen.getByText("Página 1 de 2 · 25 resultados")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(screen.getByText("Página 2 de 2 · 25 resultados")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Desde"), {
      target: { value: "2026-10-01" },
    });
    fireEvent.change(screen.getByLabelText("Hasta"), {
      target: { value: "2026-10-05" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Cliente" }),
    );
    fireEvent.click(
      within(
        screen.getByRole("option", { name: "Cliente" }),
      ).getByRole("button"),
    );
    expect(mocks.cargar).toHaveBeenLastCalledWith(
      "admin",
      true,
      "cliente",
      expect.objectContaining({
        clienteId: "c",
        desde: "2026-10-01",
        hasta: "2026-10-05",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Por tipo de servicio" }),
    );
    expect(screen.getByText("Distribución por servicio")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Exportar Excel" }));
    await waitFor(() => expect(mocks.exportar).toHaveBeenCalledTimes(1));
    expect(mocks.exportar.mock.calls[0][0].detalle.filas).toHaveLength(25);
    expect(mocks.exportar.mock.calls[0][1]).toBe("excel");
    await screen.findByText("Descarga de Excel iniciada.");
    fireEvent.click(
      screen.getByRole("button", { name: "Por volumen de prendas" }),
    );
    expect(screen.getByText("Volumen de prendas por periodo")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Exportar PDF" }));
    await waitFor(() => expect(mocks.exportar).toHaveBeenCalledTimes(2));
    expect(mocks.exportar.mock.calls[1][0].titulo).toBe(
      "Volumen de prendas procesadas",
    );
    expect(mocks.exportar.mock.calls[1][1]).toBe("pdf");
  });
  it("deshabilita descargas durante la carga o ante un error y permite reintentar", () => {
    mocks.resultado = { ...mocks.resultado, datos: null, cargando: true };
    const { rerender } = render(createElement(ReportesPage));
    expect(
      (
        screen.getByRole("button", {
          name: "Exportar PDF",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    mocks.resultado = {
      ...mocks.resultado,
      cargando: false,
      error: "No se pudo generar el reporte.",
    };
    rerender(createElement(ReportesPage));
    expect(screen.getByRole("alert").textContent).toContain(
      "No se pudo generar",
    );
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(mocks.resultado.recargar).toHaveBeenCalled();
    expect(mocks.exportar).not.toHaveBeenCalled();
  });
  it("muestra fallos de exportación y no permite exportar fuera del rol administrador", async () => {
    mocks.exportar.mockRejectedValueOnce(new Error("fallo"));
    const { rerender } = render(createElement(ReportesPage));
    fireEvent.click(screen.getByRole("button", { name: "Exportar PDF" }));
    expect((await screen.findByRole("alert")).textContent).toContain(
      "No se pudo exportar",
    );
    mocks.acceso = false;
    rerender(createElement(ReportesPage));
    expect(screen.queryByRole("button", { name: "Exportar PDF" })).toBeNull();
  });
});
