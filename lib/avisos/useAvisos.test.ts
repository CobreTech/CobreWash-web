// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ consultar: vi.fn() }));
vi.mock("./consultar", () => ({ consultarAvisos: mocks.consultar }));
import { useAvisos } from "./useAvisos";

const data = { avisos: [{ id: "aviso", titulo: "Cambio de turno" }], total: 1 };
const iniciar = () => act(() => vi.advanceTimersByTimeAsync(0));
beforeEach(() => {
  vi.useFakeTimers();
  mocks.consultar.mockReset().mockResolvedValue(data);
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("actualización de avisos", () => {
  it("carga y actualiza los avisos del rol actual cada 30 segundos", async () => {
    const { result } = renderHook(() => useAvisos("operario-1", "operario", true, 1));
    expect(result.current.cargando).toBe(true);
    await iniciar();
    expect(result.current.avisos).toEqual(data.avisos);
    expect(mocks.consultar).toHaveBeenCalledWith("operario", 1);
    mocks.consultar.mockResolvedValue({ avisos: [...data.avisos, { id: "nuevo" }], total: 2 });
    await act(() => vi.advanceTimersByTimeAsync(30_000));
    expect(result.current.total).toBe(2);
  });
  it("no acumula peticiones y solo actualiza con la página visible", async () => {
    mocks.consultar.mockReturnValue(new Promise(() => {}));
    renderHook(() => useAvisos("operario-1", "operario", true, 1));
    await iniciar();
    await act(() => vi.advanceTimersByTimeAsync(90_000));
    expect(mocks.consultar).toHaveBeenCalledTimes(1);
  });
  it("pausa las consultas en segundo plano y actualiza al volver", async () => {
    renderHook(() => useAvisos("recepcion-1", "recepcionista", true, 1));
    await iniciar();
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    await act(() => vi.advanceTimersByTimeAsync(60_000));
    expect(mocks.consultar).toHaveBeenCalledTimes(1);
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    await act(async () => document.dispatchEvent(new Event("visibilitychange")));
    expect(mocks.consultar).toHaveBeenCalledTimes(2);
    await act(async () => window.dispatchEvent(new Event("focus")));
    expect(mocks.consultar).toHaveBeenCalledTimes(3);
  });
  it("descarta respuestas antiguas al cambiar de usuario, rol y página", async () => {
    let resolver!: (data: unknown) => void;
    mocks.consultar.mockReturnValueOnce(new Promise(resolve => { resolver = resolve; }));
    const { result, rerender } = renderHook(
      ({ id, rol, pagina }) => useAvisos(id, rol, true, pagina),
      { initialProps: { id: "admin-1", rol: "admin", pagina: 1 } },
    );
    await iniciar();
    rerender({ id: "recepcion-1", rol: "recepcionista", pagina: 2 });
    expect(result.current.avisos).toEqual([]);
    await iniciar();
    await act(async () => resolver({ avisos: [{ id: "privado" }], total: 1 }));
    expect(result.current.avisos).toEqual(data.avisos);
    expect(mocks.consultar).toHaveBeenLastCalledWith("recepcionista", 2);
  });
  it("oculta inmediatamente los avisos anteriores al revocar el acceso", async () => {
    const { result, rerender } = renderHook(
      ({ habilitado }) => useAvisos("admin-1", "admin", habilitado, 1),
      { initialProps: { habilitado: true } },
    );
    await iniciar();
    expect(result.current.avisos).toEqual(data.avisos);
    rerender({ habilitado: false });
    expect(result.current.avisos).toEqual([]);
    await act(() => vi.advanceTimersByTimeAsync(60_000));
    expect(mocks.consultar).toHaveBeenCalledTimes(1);
  });
  it("distingue un error de red de una lista vacía y permite reintentar", async () => {
    mocks.consultar.mockRejectedValueOnce(new Error("red")).mockResolvedValueOnce({ avisos: [], total: 0 });
    const { result } = renderHook(() => useAvisos("operario-1", "operario", true, 1));
    await iniciar();
    expect(result.current.error).toMatch(/conexión/);
    expect(result.current.cargando).toBe(false);
    await act(() => result.current.recargar());
    expect(result.current.error).toBe("");
    expect(result.current.avisos).toEqual([]);
  });
  it("limpia los temporizadores y eventos al abandonar la página", async () => {
    const { unmount } = renderHook(() => useAvisos("operario-1", "operario", true, 1));
    await iniciar();
    unmount();
    await act(async () => {
      window.dispatchEvent(new Event("focus"));
      document.dispatchEvent(new Event("visibilitychange"));
      await vi.advanceTimersByTimeAsync(60_000);
    });
    expect(mocks.consultar).toHaveBeenCalledTimes(1);
  });
});
