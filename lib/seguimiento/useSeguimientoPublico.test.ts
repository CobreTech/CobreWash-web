// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PedidoPublico } from "./publico";
import { ComandaEstado } from "@/src/dataconnect-generated";
const mocks = vi.hoisted(() => ({ consultar: vi.fn() }));
vi.mock("./consultar", () => ({ consultarSeguimiento: mocks.consultar }));
import { useSeguimientoPublico } from "./useSeguimientoPublico";

const pedido: PedidoPublico = {
  numeroComanda: "ELCOBRE-14r3", estado: ComandaEstado.PENDIENTE,
  fechaRecepcion: "2026-10-04T12:00:00Z", actualizadoEn: "2026-10-04T12:00:00Z",
  comandaDetalles_on_comanda: [], comandaEtapas_on_comanda: [],
};
beforeEach(() => { mocks.consultar.mockReset(); vi.useFakeTimers(); Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" }); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("búsqueda y actualización pública", () => {
  it("una respuesta antigua no sustituye una búsqueda más reciente", async () => {
    let resolver!: (pedido: PedidoPublico) => void;
    mocks.consultar.mockReturnValueOnce(new Promise((resolve) => { resolver = resolve; })).mockResolvedValueOnce({ ...pedido, numeroComanda: "ELCOBRE-otro" });
    const { result } = renderHook(useSeguimientoPublico);
    let primera!: Promise<void>;
    act(() => { primera = result.current.ejecutar({ tipo: "numero", valor: "14r3" }); });
    await act(() => result.current.ejecutar({ tipo: "numero", valor: "otro" }));
    await act(async () => { resolver(pedido); await primera; });
    expect(result.current.pedido?.numeroComanda).toBe("ELCOBRE-otro");
    expect(result.current.buscando).toBe(false);
  });
  it("un código inválido invalida una petición anterior sin consultar el servidor", async () => {
    let resolver!: (pedido: PedidoPublico) => void;
    mocks.consultar.mockReturnValueOnce(new Promise((resolve) => { resolver = resolve; }));
    const { result } = renderHook(useSeguimientoPublico);
    let primera!: Promise<void>;
    act(() => { primera = result.current.ejecutar({ tipo: "numero", valor: "14r3" }); });
    await act(() => result.current.ejecutar({ tipo: "qr", valor: "inválido" }));
    await act(async () => { resolver(pedido); await primera; });
    expect(result.current.pedido).toBeNull(); expect(result.current.error).toMatch(/inválido/);
    expect(mocks.consultar).toHaveBeenCalledTimes(1);
  });
  it("distingue inexistente de fallo de red y permite reintentar", async () => {
    mocks.consultar.mockResolvedValueOnce(null).mockRejectedValueOnce(new Error("red")).mockResolvedValueOnce(pedido);
    const { result } = renderHook(useSeguimientoPublico);
    await act(() => result.current.ejecutar({ tipo: "numero", valor: "14r3" }));
    expect(result.current.consultado).toBe(true); expect(result.current.pedido).toBeNull(); expect(result.current.error).toBe("");
    await act(async () => { await result.current.actualizar(); });
    expect(result.current.error).toMatch(/conexión/);
    await act(async () => { await result.current.actualizar(); });
    expect(result.current.pedido).toEqual(pedido); expect(result.current.error).toBe("");
  });
  it("actualiza cada 30 segundos solo con la página visible y limpia al salir", async () => {
    mocks.consultar.mockResolvedValue(pedido);
    const { result, unmount } = renderHook(useSeguimientoPublico);
    await act(() => result.current.ejecutar({ tipo: "numero", valor: "14r3" }));
    await act(() => vi.advanceTimersByTimeAsync(30_000));
    expect(mocks.consultar).toHaveBeenCalledTimes(2);
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    await act(() => vi.advanceTimersByTimeAsync(60_000));
    expect(mocks.consultar).toHaveBeenCalledTimes(2);
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    await act(async () => { document.dispatchEvent(new Event("visibilitychange")); });
    expect(mocks.consultar).toHaveBeenCalledTimes(3);
    unmount(); await vi.advanceTimersByTimeAsync(30_000);
    expect(mocks.consultar).toHaveBeenCalledTimes(3);
  });
  it("no acumula polling mientras la consulta está pendiente", async () => {
    mocks.consultar.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(useSeguimientoPublico);
    act(() => { void result.current.ejecutar({ tipo: "numero", valor: "14r3" }); });
    await act(() => vi.advanceTimersByTimeAsync(90_000));
    expect(mocks.consultar).toHaveBeenCalledTimes(1);
  });
});
