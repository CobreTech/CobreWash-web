import { describe, expect, it, vi } from "vitest";
import { consultarComandasAlertas } from "./consultar-alertas";
import { ComandaEstado, type GetComandasParaAlertasData } from "@/src/dataconnect-generated";
vi.mock("@/lib/firebase/client", () => ({ dataConnect: {} }));
type Comanda = GetComandasParaAlertasData["comandas"][number];
const c = (id: number): Comanda => ({ id: String(id), numeroComanda: `TEST-${id}`, estado: ComandaEstado.PENDIENTE, fechaRecepcion: "2026-10-04T12:00:00Z", comandaEtapas_on_comanda: [] });
describe("consulta de toda la cola para alertas", () => {
  it("consulta más de 100 comandas y deduplica las páginas", async () => {
    const consultar = vi.fn().mockResolvedValueOnce(Array.from({ length: 100 }, (_, i) => c(i))).mockResolvedValueOnce([c(99), c(100)]);
    const datos = await consultarComandasAlertas(() => true, consultar);
    expect(datos).toHaveLength(101);
    expect(consultar.mock.calls).toEqual([[0], [100]]);
  });
  it("no devuelve una respuesta si cambió la sesión durante la consulta", async () => {
    let vigente = true;
    const consultar = vi.fn(async () => { vigente = false; return [c(1)]; });
    expect(await consultarComandasAlertas(() => vigente, consultar)).toBeNull();
    expect(consultar).toHaveBeenCalledOnce();
  });
  it("propaga fallos de cualquier página sin entregar un total parcial", async () => {
    const consultar = vi.fn().mockResolvedValueOnce(Array.from({ length: 100 }, (_, i) => c(i))).mockRejectedValueOnce(new Error("sin conexión"));
    await expect(consultarComandasAlertas(() => true, consultar)).rejects.toThrow("sin conexión");
  });
});
