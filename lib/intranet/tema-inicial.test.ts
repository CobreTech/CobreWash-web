import { runInNewContext } from "node:vm";
import { expect, it, vi } from "vitest";
import { INICIALIZAR_TEMA_INTRANET } from "./tema-inicial";

function ejecutar(pathname: string, theme: string | null, sistemaOscuro = false, fallaStorage = false) {
  const toggle = vi.fn(), getItem = vi.fn(() => { if (fallaStorage) throw new Error("Storage no disponible"); return theme; });
  const matchMedia = vi.fn(() => ({ matches: sistemaOscuro }));
  runInNewContext(INICIALIZAR_TEMA_INTRANET, { window: { location: { pathname }, matchMedia }, localStorage: { getItem }, document: { documentElement: { classList: { toggle } } } });
  return { toggle, getItem, matchMedia };
}
it.each(["/", "/seguimiento", "/cuenta", "/privacidad", "/intranet-otra"])("no aplica el tema interno ni lee preferencias en %s", path => {
  const { toggle, getItem, matchMedia } = ejecutar(path, "dark", true);
  expect(toggle).not.toHaveBeenCalled(); expect(getItem).not.toHaveBeenCalled(); expect(matchMedia).not.toHaveBeenCalled();
});
it.each(["/intranet", "/intranet/comandas"])("aplica la preferencia oscura antes de la hidratación en %s", path => {
  expect(ejecutar(path, "dark").toggle).toHaveBeenCalledWith("dark", true);
  expect(ejecutar(path, "light", true).toggle).toHaveBeenCalledWith("dark", false);
});
it("respeta el sistema cuando no hay preferencia y tolera storage bloqueado", () => {
  expect(ejecutar("/intranet", null, true).toggle).toHaveBeenCalledWith("dark", true);
  expect(ejecutar("/intranet", "system", false).toggle).toHaveBeenCalledWith("dark", false);
  expect(() => ejecutar("/intranet", null, false, true)).not.toThrow();
});
