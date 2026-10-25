// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ComandaEstado } from "@/src/dataconnect-generated";
import type { VistaPedidos } from "./vistas";
const mocks = vi.hoisted(() => ({ consultar: vi.fn() }));
vi.mock("./consultar", () => ({ consultarMisComandas: mocks.consultar }));
import { usePedidosCliente } from "./usePedidosCliente";
beforeEach(() => { mocks.consultar.mockReset(); vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

it("oculta inmediatamente los pedidos al cambiar de cuenta y descarta respuestas antiguas", async () => {
  let resolver!: (value: unknown) => void;
  mocks.consultar.mockReturnValueOnce(new Promise(resolve => { resolver = resolve; }))
    .mockResolvedValueOnce({ pedidos: [{ numeroComanda: "cuenta-b" }], total: 1 });
  const { result, rerender } = renderHook(({ uid }) => usePedidosCliente(uid, null, 0), { initialProps: { uid: "a" as string | null } });
  await act(() => vi.advanceTimersByTimeAsync(0));
  rerender({ uid: "b" });
  expect(result.current.pedidos).toEqual([]);
  await act(() => vi.advanceTimersByTimeAsync(0));
  await act(async () => { resolver({ pedidos: [{ numeroComanda: "cuenta-a" }], total: 1 }); });
  expect(result.current.pedidos).toEqual([{ numeroComanda: "cuenta-b" }]);
  rerender({ uid: null });
  expect(result.current.pedidos).toEqual([]);
  await act(() => vi.advanceTimersByTimeAsync(0));
  expect(mocks.consultar).toHaveBeenCalledTimes(2);
});

it("cambia filtro y página, distingue errores y permite reintentar", async () => {
  mocks.consultar.mockResolvedValueOnce({ pedidos: [], total: 0 }).mockRejectedValueOnce(new Error("red"))
    .mockResolvedValueOnce({ pedidos: [{ numeroComanda: "recuperado" }], total: 12 });
  const { result, rerender } = renderHook(({ estado, pagina }) => usePedidosCliente("a", estado, pagina), {
    initialProps: { estado: null as ComandaEstado | null, pagina: 0 },
  });
  await act(() => vi.advanceTimersByTimeAsync(0));
  expect(result.current.error).toBe(""); expect(result.current.total).toBe(0);
  rerender({ estado: ComandaEstado.ENTREGADA, pagina: 1 });
  await act(() => vi.advanceTimersByTimeAsync(0));
  expect(mocks.consultar).toHaveBeenLastCalledWith(ComandaEstado.ENTREGADA, 1, "todos");
  expect(result.current.error).toMatch(/cargar/);
  await act(() => result.current.actualizar());
  expect(result.current.error).toBe(""); expect(result.current.total).toBe(12);
});
it("el historial no conserva filas ni respuestas pendientes de la vista de activos", async () => {
  let resolver!: (value: unknown) => void;
  mocks.consultar.mockReturnValueOnce(new Promise(resolve => { resolver = resolve; })).mockResolvedValueOnce({ pedidos: [{ numeroComanda: "histórico" }], total: 1 });
  const { result, rerender } = renderHook(({ vista }) => usePedidosCliente("a", null, 0, vista), { initialProps: { vista: "activos" as VistaPedidos } });
  await act(() => vi.advanceTimersByTimeAsync(0));
  rerender({ vista: "historial" }); expect(result.current.pedidos).toEqual([]);
  await act(() => vi.advanceTimersByTimeAsync(0));
  await act(async () => { resolver({ pedidos: [{ numeroComanda: "activo" }], total: 1 }); });
  expect(mocks.consultar).toHaveBeenLastCalledWith(null, 0, "historial");
  expect(result.current.pedidos).toEqual([{ numeroComanda: "histórico" }]);
});
