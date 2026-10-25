// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const api = vi.hoisted(() => ({ conteos: vi.fn(), aprobar: vi.fn(), rechazar: vi.fn(), historial: vi.fn() }));
vi.mock("@/lib/firebase/client", () => ({ dataConnect: {} }));
vi.mock("@/src/dataconnect-generated", () => ({
  EstadoConteoInventario: { PENDIENTE: "PENDIENTE", APROBADO: "APROBADO", RECHAZADO: "RECHAZADO" },
  TipoMovimiento: { ENTRADA: "ENTRADA", SALIDA: "SALIDA" },
  getConteosInventario: api.conteos, aprobarConteoInventario: api.aprobar, rechazarConteoInventario: api.rechazar,
  getHistorialInventario: api.historial,
}));
import ConteosInventario from "./ConteosInventario";
import HistorialInventario from "./HistorialInventario";
const conteo = {
  id: "conteo-1", cantidadContada: 17.5, stockSistema: 20, revisionStock: 0, estado: "PENDIENTE", creadoEn: "2026-10-25T12:00:00Z",
  resueltoEn: null, motivoResolucion: null, resueltoPor: null,
  registradoPor: { id: "operario", nombre: "Operario", apellido: "de prueba" },
  insumo: { id: "insumo-1", nombre: "Detergente", unidadMedida: "L", stockActual: 20, revisionStock: 0, activo: true },
};
beforeEach(() => {
  vi.clearAllMocks();
  api.conteos.mockResolvedValue({ data: { conteoInventarios: [conteo], total: [{ _count: 1 }] } });
  api.aprobar.mockResolvedValue({}); api.rechazar.mockResolvedValue({});
});
afterEach(cleanup);
it("exige revisar y explicar antes de aprobar el ajuste enviado por Android", async () => {
  const guardar = vi.fn();
  render(createElement(ConteosInventario, { revision: "0", alGuardar: guardar }));
  fireEvent.click(await screen.findByRole("button", { name: "Revisar conteo" }));
  expect(screen.getByRole("button", { name: "Aprobar y ajustar" }).hasAttribute("disabled")).toBe(true);
  fireEvent.change(screen.getByRole("textbox", { name: "Motivo de la revisión" }), { target: { value: "Verificado en bodega" } });
  fireEvent.click(screen.getByRole("button", { name: "Aprobar y ajustar" }));
  await waitFor(() => expect(api.aprobar).toHaveBeenCalledWith({}, { id: conteo.id, motivo: "Verificado en bodega" }));
  expect(guardar).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("status").textContent).toContain("Conteo aprobado");
});
it("un conteo obsoleto solo permite rechazarlo y conserva el motivo", async () => {
  api.conteos.mockResolvedValue({ data: { conteoInventarios: [{ ...conteo, insumo: { ...conteo.insumo, revisionStock: 1 } }], total: [{ _count: 1 }] } });
  render(createElement(ConteosInventario, { revision: "1", alGuardar() {} }));
  fireEvent.click(await screen.findByRole("button", { name: "Revisar conteo" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Motivo de la revisión" }), { target: { value: "Recontar después de la reposición" } });
  expect(screen.getByRole("button", { name: "Aprobar y ajustar" }).hasAttribute("disabled")).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Rechazar" }));
  await waitFor(() => expect(api.rechazar).toHaveBeenCalledWith({}, { id: conteo.id, motivo: "Recontar después de la reposición" }));
  expect(api.aprobar).not.toHaveBeenCalled();
});
it("pagina y envía los filtros al servidor, volviendo a la primera página al cambiarlos", async () => {
  api.historial.mockImplementation(async (_dc, variables) => ({ data: { movimientoInventarios: [], total: [{ _count: variables.tipo ? 1 : 525 }] } }));
  render(createElement(HistorialInventario, { insumos: [{ id: "insumo-1", nombre: "Detergente" }], revision: "0" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Siguiente" }).hasAttribute("disabled")).toBe(false));
  fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
  await waitFor(() => expect(api.historial).toHaveBeenLastCalledWith({}, expect.objectContaining({ offset: 20 }), { fetchPolicy: "SERVER_ONLY" }));
  fireEvent.change(screen.getByRole("combobox", { name: "Tipo" }), { target: { value: "SALIDA" } });
  await waitFor(() => expect(api.historial).toHaveBeenLastCalledWith({}, expect.objectContaining({ offset: 0, tipo: "SALIDA" }), { fetchPolicy: "SERVER_ONLY" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Siguiente" }).hasAttribute("disabled")).toBe(true));
});
