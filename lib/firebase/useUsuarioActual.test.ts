// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ auth: { currentUser: null as { uid: string } | null }, callback: null as ((user: { uid: string } | null) => void) | null, cargar: vi.fn(), unsubscribe: vi.fn() }));
vi.mock("firebase/auth", () => ({ onAuthStateChanged: (_auth: unknown, callback: typeof m.callback) => { m.callback = callback; return m.unsubscribe; } }));
vi.mock("@/lib/firebase/client", () => ({ auth: m.auth, dataConnect: {} }));
vi.mock("@/lib/firebase/auth-flows", () => ({ loadActiveUserProfile: m.cargar }));
import { useUsuarioActual } from "./useUsuarioActual";
beforeEach(() => { m.auth.currentUser = null; m.cargar.mockReset(); });
afterEach(cleanup);
it("un resultado anterior no restaura el perfil después del logout", async () => {
  let resolver!: (value: unknown) => void;
  m.cargar.mockReturnValue(new Promise(resolve => { resolver = resolve; }));
  const { result } = renderHook(useUsuarioActual);
  act(() => { m.auth.currentUser = { uid: "a" }; m.callback!(m.auth.currentUser); });
  act(() => { m.auth.currentUser = null; m.callback!(null); });
  await act(async () => { resolver({ id: "a" }); });
  expect(result.current.usuario).toBeNull(); expect(result.current.loading).toBe(false);
});
it("el cambio A a B descarta A y espera el perfil de B", async () => {
  let resolver!: (value: unknown) => void;
  m.cargar.mockReturnValueOnce(new Promise(resolve => { resolver = resolve; })).mockResolvedValueOnce({ id: "b" });
  const { result } = renderHook(useUsuarioActual);
  act(() => { m.auth.currentUser = { uid: "a" }; m.callback!(m.auth.currentUser); });
  await act(async () => { m.auth.currentUser = { uid: "b" }; m.callback!(m.auth.currentUser); });
  await act(async () => { resolver({ id: "a" }); });
  expect(result.current.usuario?.id).toBe("b");
});
