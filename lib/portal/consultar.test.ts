import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ consultar: vi.fn() }));
vi.mock("@/src/dataconnect-generated", () => ({
  getMisComandas: mocks.consultar,
  vincularMiComanda: vi.fn(),
  ComandaEstado: { PENDIENTE: "PENDIENTE", EN_PROCESO: "EN_PROCESO", FINALIZADA: "FINALIZADA", ENTREGADA: "ENTREGADA", ANULADA: "ANULADA" },
}));
vi.mock("@/lib/firebase/client", () => ({ auth: {}, dataConnect: {} }));
import { consultarMisComandas } from "./consultar";
import { ComandaEstado } from "@/src/dataconnect-generated";
beforeEach(() => {
  mocks.consultar.mockReset().mockResolvedValue({ data: { comandas: [], total: [{ _count: 0 }] } });
});

it.each(["todos", "activos", "historial"] as const)("omite estado en lugar de enviar null en la vista %s", async vista => {
  await consultarMisComandas(null, 0, vista);
  const variables = mocks.consultar.mock.calls[0][1];
  expect(variables).not.toHaveProperty("estado");
  expect(variables.estados.length).toBeGreaterThan(0);
  expect(mocks.consultar.mock.calls[0][2]).toEqual({ fetchPolicy: "SERVER_ONLY" });
});

it("conserva estado explícito y paginación", async () => {
  await consultarMisComandas(ComandaEstado.PENDIENTE, 2, "activos");
  expect(mocks.consultar.mock.calls[0][1]).toMatchObject({ estado: "PENDIENTE", limit: 10, offset: 20 });
});
