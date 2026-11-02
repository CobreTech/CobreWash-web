// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi, type Mock } from "vitest";
const api = vi.hoisted(() => ({ token: vi.fn(), historial: vi.fn() }));
vi.mock("@/lib/firebase/client", () => ({ dataConnect: {}, auth: { currentUser: { getIdToken: api.token } } }));
vi.mock("@/lib/registro-seguro", () => ({ registrarError: () => {} }));
vi.mock("@/src/dataconnect-generated", () => ({ getHistorialAjustesIa: api.historial }));
import SimulacionIa from "./SimulacionIa";
import HistorialIa from "./HistorialIa";
import GraficoLineas, { COLORES_SERIE } from "./GraficoLineas";
import type { Avisar } from "./ui";

const LOTE = "30000000-0000-4000-8000-000000000001";
const curva = [{ periodos: 0, mape: null, errorTasas: 24 }, { periodos: 1, mape: 12, errorTasas: 15 }, { periodos: 2, mape: 8, errorTasas: 6 }];
const parametros = { semanas: 2, kgSemanalMin: 6000, kgSemanalMax: 9000, ruido: 0.1, desvioTasas: 0.3, semilla: 77, inicio: "2026-10-18T12:00:00Z" };
const panel = (extra = {}) => ({
  configuracionIa: { margenSeguridad: 0.15, lambda: 1, incluirSimulado: false, actualizadoEn: "" },
  tasaConsumos: [], modeloVigente: [], insumos: [], tipoServicios: [], conteosReales: [{ _count: 0 }], conteosSimulados: [{ _count: 6 }],
  simulaciones: [{ id: LOTE, semanas: 2, creadoEn: "2026-11-01T12:00:00Z", parametrosJson: JSON.stringify({ parametros, curva }), tasasVerdaderasJson: JSON.stringify([{ insumo: "Detergente", servicio: "Lavado", unidad: "ml", inicial: 12, verdadera: 9.8 }]) }],
  ...extra,
}) as never;

let recargar: Mock<() => Promise<void>>, avisar: Mock<Avisar>, fetchMock: Mock;
beforeEach(() => {
  vi.clearAllMocks();
  recargar = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  avisar = vi.fn<Avisar>();
  api.token.mockResolvedValue("token-admin");
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("genera una simulación con los parámetros convertidos y avisa cuánto bajó el error", async () => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ conteos: 26, errorTasasInicial: 24.4, errorTasasFinal: 3.2 }) });
  render(createElement(SimulacionIa, { panel: panel({ simulaciones: [] }), recargar, avisar }));
  expect(screen.getByText(/no afectan al modelo hasta que actives/)).toBeTruthy();
  fireEvent.change(screen.getByRole("textbox", { name: /Semanas/ }), { target: { value: "8" } });
  fireEvent.change(screen.getByRole("textbox", { name: /Ruido/ }), { target: { value: "15" } });
  fireEvent.change(screen.getByRole("textbox", { name: /Semilla/ }), { target: { value: "42" } });
  fireEvent.click(screen.getByRole("button", { name: "Generar simulación" }));
  await waitFor(() => expect(avisar).toHaveBeenCalledWith("Simulación lista: 26 conteos. El error de las tasas bajó de 24,4% a 3,2%.", "success"));
  const [url, opciones] = fetchMock.mock.calls[0];
  expect(url).toBe("/api/ia/simulacion");
  expect(opciones.method).toBe("POST");
  expect(opciones.headers.Authorization).toBe("Bearer token-admin");
  expect(JSON.parse(opciones.body)).toEqual({ semanas: 8, kgSemanalMin: 6000, kgSemanalMax: 9000, ruido: 0.15, desvioTasas: 0.3, semilla: 42 });
  expect(recargar).toHaveBeenCalled();
});

it("muestra el error del servidor al generar", async () => {
  fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: "Define al menos una tasa de consumo antes de simular." }) });
  render(createElement(SimulacionIa, { panel: panel({ simulaciones: [] }), recargar, avisar }));
  fireEvent.click(screen.getByRole("button", { name: "Generar simulación" }));
  await waitFor(() => expect(avisar).toHaveBeenCalledWith("Define al menos una tasa de consumo antes de simular.", "error"));
  expect(JSON.parse(fetchMock.mock.calls[0][1].body).semilla).toBeUndefined();
});

it("muestra la curva del lote, revela las tasas ocultas y borra con confirmación", async () => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ borrado: LOTE }) });
  render(createElement(SimulacionIa, { panel: panel({ configuracionIa: { margenSeguridad: 0.15, lambda: 1, incluirSimulado: true, actualizadoEn: "" } }), recargar, avisar }));
  expect(screen.getByText(/está usando los datos simulados/)).toBeTruthy();
  expect(screen.getByText(/Semilla 77/)).toBeTruthy();
  expect(screen.getByRole("img", { name: "Error del modelo según la cantidad de conteos" })).toBeTruthy();
  expect(screen.queryByText("9,8 ml/kg")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Revelar tasas verdaderas" }));
  expect(screen.getByText("9,8 ml/kg")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Borrar este lote" }));
  expect(fetchMock).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Confirmar borrado de este lote" }));
  await waitFor(() => expect(avisar).toHaveBeenCalledWith("Simulación borrada.", "success"));
  expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: "DELETE", body: JSON.stringify({ id: LOTE }) });
});

it("borra todos los datos simulados tras confirmar", async () => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ borrado: "todos" }) });
  render(createElement(SimulacionIa, { panel: panel(), recargar, avisar }));
  fireEvent.click(screen.getByRole("button", { name: "Borrar todos" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirmar: borrar todo lo simulado" }));
  await waitFor(() => expect(avisar).toHaveBeenCalledWith("Se borraron todos los datos simulados.", "success"));
  expect(fetchMock.mock.calls[0][1].body).toBe("{}");
});

it("el gráfico muestra todas las series en el tooltip y ofrece la tabla", () => {
  render(createElement(GraficoLineas, {
    titulo: "Curva", etiquetaX: "Períodos", formato: (v: number) => `${v}%`,
    puntos: curva.map((c) => ({ x: String(c.periodos), valores: [c.mape, c.errorTasas] })),
    series: [{ nombre: "MAPE", color: COLORES_SERIE.naranja }, { nombre: "Tasas", color: COLORES_SERIE.azul }],
  }));
  const grafico = screen.getByRole("img", { name: "Curva" });
  fireEvent.keyDown(grafico, { key: "ArrowRight" });
  fireEvent.keyDown(grafico, { key: "ArrowRight" });
  const tooltip = screen.getByRole("status");
  expect(tooltip.textContent).toContain("Períodos: 2");
  expect(tooltip.textContent).toContain("8%MAPE");
  expect(tooltip.textContent).toContain("6%Tasas");
  fireEvent.keyDown(grafico, { key: "ArrowLeft" });
  fireEvent.keyDown(grafico, { key: "ArrowLeft" });
  expect(screen.getByRole("status").textContent).toContain("—MAPE");
  fireEvent.blur(grafico);
  expect(screen.queryByRole("status")).toBeNull();
  const tabla = screen.getByText("Ver como tabla").closest("details")!;
  expect(within(tabla).getAllByRole("row")).toHaveLength(4);
});

const ajuste = (version: string, extra = {}) => ({
  id: `id-${version}`, version, fechaEntrenamiento: "2026-11-01T12:00:00Z", activo: false, mae: 1, mape: 7.5, desviacionRelativa: 0.1,
  observaciones: 10, lambda: 1, margenSeguridad: 0.15, incluyeSimulado: false, ejecutadoPor: { nombre: "Ana", apellido: "Rojas" },
  tasasJson: JSON.stringify({ insumos: [{ insumoId: "d", nombre: "Detergente", mape: 7.5, tasas: [{ servicioId: "l", servicio: "Lavado", unidad: "ml", inicial: 12, anterior: 11, resultado: 10.4 }] }], descartados: [], totalDescartados: 0 }),
  ...extra,
});

it("lista los ajustes, marca el vigente y despliega el detalle de tasas", async () => {
  api.historial.mockResolvedValue({ data: { modeloIas: [ajuste("v2", { activo: true, incluyeSimulado: true }), ajuste("v1", { mape: null, tasasJson: null })], total: [{ _count: 2 }] } });
  render(createElement(HistorialIa, { revision: "x" }));
  expect(await screen.findByText("2 ajustes registrados. Cada recálculo agrega uno y deja vigente el último.")).toBeTruthy();
  expect(screen.getByText("Vigente").closest("tr")!.textContent).toContain("v2");
  expect(screen.getByText("Con simulados")).toBeTruthy();
  expect(screen.getAllByText("Ana Rojas")).toHaveLength(2);
  fireEvent.click(screen.getByRole("button", { name: "Ver tasas del ajuste v2" }));
  expect(screen.getByText(/11 →/).textContent).toContain("Lavado");
  fireEvent.click(screen.getByRole("button", { name: "Ver tasas del ajuste v1" }));
  expect(screen.getByText("Este ajuste no tiene detalle de tasas.")).toBeTruthy();
  expect(api.historial).toHaveBeenCalledWith({}, { limit: 20, offset: 0 }, expect.anything());
});

it("pagina el historial y permite reintentar si falla", async () => {
  api.historial
    .mockRejectedValueOnce(new Error("red"))
    .mockResolvedValueOnce({ data: { modeloIas: [ajuste("v30")], total: [{ _count: 25 }] } })
    .mockResolvedValueOnce({ data: { modeloIas: [ajuste("v5")], total: [{ _count: 25 }] } });
  render(createElement(HistorialIa, { revision: "x" }));
  fireEvent.click(await screen.findByRole("button", { name: "Reintentar" }));
  expect(await screen.findByText("Página 1 de 2")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Anteriores" }));
  expect(await screen.findByText("Página 2 de 2")).toBeTruthy();
  expect(api.historial).toHaveBeenLastCalledWith({}, { limit: 20, offset: 20 }, expect.anything());
});

it("sin ajustes invita a recalcular", async () => {
  api.historial.mockResolvedValue({ data: { modeloIas: [], total: [{ _count: 0 }] } });
  render(createElement(HistorialIa, { revision: "x" }));
  expect(await screen.findByText(/Aún no hay ajustes/)).toBeTruthy();
});
