import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ mutate: vi.fn(), read: vi.fn() }));
vi.mock("firebase/data-connect", () => ({
  executeMutation: mocks.mutate, getDataConnect: () => ({}),
  mutationRef: (_dc: unknown, name: string, variables: unknown) => ({ name, variables }),
}));
vi.mock("@/lib/firebase/client", () => ({ app: {}, dataConnect: {} }));
vi.mock("@/src/dataconnect-generated", () => ({
  connectorConfig: {}, getMiComandaGuardada: mocks.read,
}));
import { guardarComandaConFlujo, type CrearComandaConFlujoVariables } from "./guardar";
const variables: CrearComandaConFlujoVariables = { id: "uuid", numeroComanda: "ELCOBRE-test", clienteId: "cliente", detalles: [] };
beforeEach(() => { mocks.mutate.mockReset(); mocks.read.mockReset(); });
describe("respuesta del guardado", () => {
  it("devuelve el UUID confirmado por el servidor", async () => {
    mocks.mutate.mockResolvedValue({ data: { comanda_insert: { id: "uuid" } } });
    expect(await guardarComandaConFlujo(variables)).toBe("uuid");
    expect(mocks.read).not.toHaveBeenCalled();
  });
  it("resuelve una respuesta perdida sin emitir un segundo INSERT", async () => {
    mocks.mutate.mockRejectedValue(new Error("red"));
    mocks.read.mockResolvedValue({ data: { comanda: { id: "uuid" } } });
    expect(await guardarComandaConFlujo(variables)).toBe("uuid");
    expect(mocks.mutate).toHaveBeenCalledTimes(1);
  });
  it("no presenta un fallo de conexión como un guardado exitoso", async () => {
    const error = new Error("red");
    mocks.mutate.mockRejectedValue(error); mocks.read.mockRejectedValue(error);
    await expect(guardarComandaConFlujo(variables)).rejects.toBe(error);
  });
});
