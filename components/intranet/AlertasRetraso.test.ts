// @vitest-environment jsdom
import { createElement } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AlertasRetraso, { AlertasRetrasoProvider } from "./AlertasRetraso";
const mocks = vi.hoisted(() => ({ consultar: vi.fn(), usuario: { id: "admin", rol: { nombre: "admin" } } }));
vi.mock("./AuthGuard", () => ({ useUsuarioActualContext: () => mocks.usuario }));
vi.mock("@/lib/produccion/consultar-alertas", () => ({ consultarComandasAlertas: mocks.consultar }));
const comanda = { id: "c1", numeroComanda: "ELCOBRE-0001", estado: "PENDIENTE", fechaRecepcion: "2020-01-01T10:00:00Z", comandaEtapas_on_comanda: [{ etapaId: "e1", nombreEtapa: "Recepción", ordenEtapa: 1, estado: "PENDIENTE", tiempoEstimadoMin: 15, etapa: { nombre: "Recepción", orden: 1 } }] };
const vista = () => createElement(AlertasRetrasoProvider, null, createElement(AlertasRetraso));
beforeEach(() => { mocks.usuario.rol.nombre = "admin"; mocks.consultar.mockReset().mockResolvedValue([comanda]); });
afterEach(() => { cleanup(); vi.useRealTimers(); });
describe("alertas globales de administración", () => {
  it("muestra acceso a la comanda y retira alertas después de completar una etapa", async () => {
    render(vista());
    const link = await screen.findByRole("link", { name: /Abrir comanda/ });
    expect(link.getAttribute("href")).toContain("buscar=ELCOBRE-0001");
    mocks.consultar.mockResolvedValue([{ ...comanda, comandaEtapas_on_comanda: [] }]);
    fireEvent.click(screen.getByRole("button", { name: "Actualizar alertas" }));
    await waitFor(() => expect(screen.queryByRole("link", { name: /Abrir comanda/ })).toBeNull());
  });
  it("solo consulta como administrador y descarta respuestas pendientes al cambiar de rol", async () => {
    let resolver: (datos: typeof comanda[]) => void = () => {};
    mocks.consultar.mockImplementation(() => new Promise((resolve) => { resolver = resolve; }));
    const { rerender } = render(vista());
    expect(mocks.consultar).toHaveBeenCalledOnce();
    mocks.usuario.rol.nombre = "operario"; rerender(vista());
    await act(async () => resolver([comanda]));
    expect(screen.queryByRole("link")).toBeNull();
    expect(mocks.consultar).toHaveBeenCalledOnce();
  });
  it("conserva alertas y avisa cuando falla la conexión", async () => {
    render(vista());
    await screen.findByRole("link", { name: /Abrir comanda/ });
    mocks.consultar.mockRejectedValue(new Error("sin conexión"));
    fireEvent.click(screen.getByRole("button", { name: "Actualizar alertas" }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/desactualizados/);
    expect(screen.getByRole("link", { name: /Abrir comanda/ })).not.toBeNull();
  });
  it("actualiza cada 30 segundos y al volver de una pestaña oculta", async () => {
    vi.useFakeTimers();
    render(vista());
    await act(async () => {});
    expect(mocks.consultar).toHaveBeenCalledTimes(1);
    await act(async () => vi.advanceTimersByTime(30_000));
    expect(mocks.consultar).toHaveBeenCalledTimes(2);
    const visibilidad = vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    await act(async () => vi.advanceTimersByTime(30_000));
    expect(mocks.consultar).toHaveBeenCalledTimes(2);
    visibilidad.mockReturnValue("visible");
    await act(async () => document.dispatchEvent(new Event("visibilitychange")));
    expect(mocks.consultar).toHaveBeenCalledTimes(3);
  });
});
