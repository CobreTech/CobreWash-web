import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ admin: vi.fn(), equipo: vi.fn(), dc: {} }));
vi.mock("@/src/dataconnect-generated", () => ({ getAvisosAdministracion: mocks.admin, getAvisosParaEquipo: mocks.equipo }));
vi.mock("@/lib/firebase/client", () => ({ dataConnect: mocks.dc }));
import { consultarAvisos } from "./consultar";

beforeEach(() => {
  mocks.admin.mockReset().mockResolvedValue({ data: { avisos: [], total: [{ _count: 25 }] } });
  mocks.equipo.mockReset().mockResolvedValue({ data: { avisos: [], total: [{ _count: 3 }] } });
});

describe("consulta de avisos por rol", () => {
  it("consulta todos los avisos solo para administración y pagina en el servidor", async () => {
    expect(await consultarAvisos("admin", 2)).toEqual({ avisos: [], total: 25 });
    expect(mocks.admin).toHaveBeenCalledWith(mocks.dc, { limit: 20, offset: 20 }, { fetchPolicy: "SERVER_ONLY" });
    expect(mocks.equipo).not.toHaveBeenCalled();
  });
  it.each(["operario", "recepcionista"])("solicita la lista filtrada para %s", async (rol) => {
    expect(await consultarAvisos(rol, 1)).toEqual({ avisos: [], total: 3 });
    expect(mocks.equipo).toHaveBeenCalledWith(mocks.dc, { limit: 20, offset: 0, rol }, { fetchPolicy: "SERVER_ONLY" });
    expect(mocks.admin).not.toHaveBeenCalled();
  });
  it("rechaza roles externos antes de consultar", async () => {
    await expect(consultarAvisos("cliente", 1)).rejects.toThrow(/personal/);
    expect(mocks.admin).not.toHaveBeenCalled();
    expect(mocks.equipo).not.toHaveBeenCalled();
  });
});
