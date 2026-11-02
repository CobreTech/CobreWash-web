// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi, type Mock } from "vitest";
const api = vi.hoisted(() => ({ token: vi.fn() }));
vi.mock("@/lib/firebase/client", () => ({ dataConnect: {}, auth: { currentUser: { getIdToken: api.token } } }));
vi.mock("@/lib/registro-seguro", () => ({ registrarError: () => {} }));
import ResumenIa from "./ResumenIa";
import type { Avisar } from "./ui";

const DET = "10000000-0000-4000-8000-000000000001";
const detalle = {
  insumos: [{
    insumoId: DET.replaceAll("-", ""), nombre: "Detergente", unidad: "L", observaciones: 6, mae: 0.8, mape: 6.25, desviacionRelativa: 0.12,
    metodoError: "validacion-cruzada", consumoDiario: 2, fuenteConsumo: "conteos",
    tasas: [{ servicioId: "s", servicio: "Lavado", unidad: "ml", inicial: 12, anterior: 12, resultado: 10.2 }],
  }],
  descartados: [{ insumo: "Detergente", desde: "2026-09-01T23:00:00Z", hasta: "2026-09-08T23:00:00Z", motivo: "Consumo negativo: puede faltar registrar una compra" }],
  totalDescartados: 1,
};
const base = {
  configuracionIa: null,
  tasaConsumos: [{ tipoServicioId: "s", insumoId: DET, tasaInicial: 12, tasaActual: 10.2, unidad: "ml", fuente: null, actualizadoEn: "", tipoServicio: { id: "s", nombre: "Lavado" }, insumo: { id: DET, nombre: "Detergente", unidadMedida: "L" } }],
  modeloVigente: [] as unknown[],
  insumos: [{ id: DET, nombre: "Detergente", unidadMedida: "L", stockActual: 80, stockMinimo: 10, revisionStock: 0 }],
  tipoServicios: [], conteosReales: [{ _count: 7 }], conteosSimulados: [{ _count: 0 }], simulaciones: [],
};
const conModelo = { ...base, modeloVigente: [{ id: "m", version: "v4", fechaEntrenamiento: "2026-10-01T15:00:00Z", mae: 0.8, mape: 6.25, desviacionRelativa: 0.12, observaciones: 6, lambda: 1, margenSeguridad: 0.15, incluyeSimulado: true, tasasJson: JSON.stringify(detalle) }] };

let recargar: Mock<() => Promise<void>>, avisar: Mock<Avisar>;
beforeEach(() => {
  vi.clearAllMocks();
  recargar = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  avisar = vi.fn<Avisar>();
  api.token.mockResolvedValue("token-admin");
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("sin ajustes invita a recalcular y muestra igual la comparación de tasas", () => {
  render(createElement(ResumenIa, { panel: base as never, recargar, avisar }));
  expect(screen.getByText(/Aún no hay ajustes/)).toBeTruthy();
  expect(screen.getByText("Error medio (MAPE)").nextElementSibling!.textContent).toBe("—");
  expect(screen.getByText("Conteos reales").nextElementSibling!.textContent).toBe("7");
  expect(screen.getByText("-15%")).toBeTruthy();
});

it("muestra el error, los días de stock y los períodos descartados del ajuste vigente", () => {
  render(createElement(ResumenIa, { panel: conModelo as never, recargar, avisar }));
  expect(screen.getByText(/Ajuste v4 del/)).toBeTruthy();
  expect(screen.getByText("Incluye datos simulados")).toBeTruthy();
  expect(screen.getByText("Rango de estimación").nextElementSibling!.textContent).toBe("±12%");
  const fila = screen.getAllByText("Detergente").map((e) => e.closest("tr")!).find((tr) => tr.textContent!.includes("L/día"))!;
  expect(fila.textContent).toContain("6,3%");
  expect(fila.textContent).toContain("2 L/día");
  expect(fila.lastElementChild!.textContent).toBe("40");
  expect(screen.getByText(/Períodos descartados \(1\)/)).toBeTruthy();
  expect(screen.getByText(/puede faltar registrar una compra/)).toBeTruthy();
});

it("recalcula con la sesión del admin, recarga el panel y resume el resultado", async () => {
  const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ version: "v5", observaciones: 8, mape: 5.5, descartados: 0 }) });
  vi.stubGlobal("fetch", fetch);
  render(createElement(ResumenIa, { panel: conModelo as never, recargar, avisar }));
  fireEvent.click(screen.getByRole("button", { name: "Recalcular ahora" }));
  await waitFor(() => expect(avisar).toHaveBeenCalledWith("Ajuste v5 listo: 8 períodos entre conteos, error medio 5,5%.", "success"));
  expect(fetch).toHaveBeenCalledWith("/api/ia/recalcular", expect.objectContaining({ method: "POST", headers: { Authorization: "Bearer token-admin" } }));
  expect(recargar).toHaveBeenCalled();
});

it("avisa los descartes y muestra el error del servidor", async () => {
  const fetch = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ version: "v1", observaciones: 0, mape: null, descartados: 2 }) })
    .mockResolvedValueOnce({ ok: false, json: async () => ({ error: "Define al menos una tasa." }) })
    .mockRejectedValueOnce(new Error("offline"));
  vi.stubGlobal("fetch", fetch);
  render(createElement(ResumenIa, { panel: base as never, recargar, avisar }));
  const boton = screen.getByRole("button", { name: "Recalcular ahora" });
  fireEvent.click(boton);
  await waitFor(() => expect(avisar).toHaveBeenLastCalledWith("Ajuste v1 listo: 0 períodos entre conteos, aún sin error medible. 2 períodos descartados.", "warning"));
  fireEvent.click(await screen.findByRole("button", { name: "Recalcular ahora" }));
  await waitFor(() => expect(avisar).toHaveBeenLastCalledWith("Define al menos una tasa.", "error"));
  fireEvent.click(await screen.findByRole("button", { name: "Recalcular ahora" }));
  await waitFor(() => expect(avisar).toHaveBeenLastCalledWith(expect.stringContaining("Revisa tu conexión"), "error"));
});
