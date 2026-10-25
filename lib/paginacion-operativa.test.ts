import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ panel: vi.fn(), flota: vi.fn() }));
vi.mock("@/lib/firebase/client", () => ({ dataConnect: {} }));
vi.mock("@/src/dataconnect-generated", () => ({ getPanelProduccion: m.panel, getFlotaVehiculos: m.flota }));
import { consultarPanelProduccion } from "./produccion/consultar-panel";
import { consultarFlotaCompleta } from "./vehiculos/consultar";
beforeEach(() => vi.resetAllMocks());
it("incluye comandas posteriores a la primera página de 100 y evita duplicados entre páginas", async () => {
  m.panel.mockResolvedValueOnce({ data: { comandas: Array.from({ length: 100 }, (_, id) => ({ id: String(id) })), etapas: ["lavado"] } })
    .mockResolvedValueOnce({ data: { comandas: [{ id: "99" }, { id: "100" }], etapas: [] } });
  const data = await consultarPanelProduccion();
  expect(data.comandas).toHaveLength(101);
  expect(data.comandas.at(-1)?.id).toBe("100");
  expect(m.panel.mock.calls[1][1]).toEqual({ limit: 100, offset: 100 });
});
it("conserva viajes anteriores a los primeros 200 y propaga fallos sin presentar totales parciales", async () => {
  m.flota.mockResolvedValueOnce({ data: { salidas: Array.from({ length: 200 }, (_, id) => ({ id: String(id) })), vehiculos: [], conductores: [] } })
    .mockResolvedValueOnce({ data: { salidas: [{ id: "200" }] } });
  expect((await consultarFlotaCompleta()).salidas).toHaveLength(201);
  expect(m.flota.mock.calls[1][1]).toEqual({ limit: 200, offset: 200 });
  m.flota.mockResolvedValueOnce({ data: { salidas: Array.from({ length: 200 }, (_, id) => ({ id: String(id) })) } })
    .mockRejectedValueOnce(new Error("sin conexión"));
  await expect(consultarFlotaCompleta()).rejects.toThrow("sin conexión");
});
