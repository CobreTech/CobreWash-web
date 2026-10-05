import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ cuentas: vi.fn(), detalle: vi.fn(), filtros: vi.fn() }));
vi.mock("@/src/dataconnect-generated", () => ({ getReporteCuentas: mocks.cuentas, getDetalleReporteCuentas: mocks.detalle, getFiltrosReportes: mocks.filtros }));
vi.mock("@/lib/firebase/client", () => ({ dataConnect: {} }));
import { consultarReporte, todasLasPaginas } from "./consultar";
const filtros = { desde: "2026-10-01", hasta: "2026-10-05", clienteId: "", empresa: "" };

beforeEach(() => {
  mocks.cuentas.mockReset().mockResolvedValue({ data: { cuentas: [], prendas: [] } });
  mocks.detalle.mockReset().mockResolvedValue({ data: { comandas: [] } });
});
describe("reportes completos", () => {
  it("un periodo vacío devuelve ceros", async () => {
    expect(await consultarReporte("cliente", filtros)).toEqual({ resumen: [], detalle: [], comandas: 0, prendas: 0, facturado: 0 });
  });
  it("conserva cuentas homónimas y aplica los filtros a todas las consultas", async () => {
    const cuenta = (id: string) => ({ cliente: { id, nombre: "Cuenta" }, empresa: "Minera", _count: 1, valorTotal_sum: 1000 });
    mocks.cuentas.mockResolvedValue({ data: { cuentas: [cuenta("a"), cuenta("b")], prendas: ["a", "b"].map((id) => ({ comanda: cuenta(id), cantidad_sum: 2 })) } });
    mocks.detalle.mockResolvedValue({ data: { comandas: ["a", "b"].map((id) => ({ id, numeroComanda: id, fechaRecepcion: "2026-10-02T03:00:00Z", cliente: cuenta(id).cliente, empresa: "Minera", estado: "FINALIZADA", prendas: [{ cantidad_sum: 2 }], valorTotal: 1000 })) } });
    const datos = await consultarReporte("cliente", { ...filtros, clienteId: "a", empresa: "Minera" });
    expect(new Set(datos.resumen.map((r) => r.id)).size).toBe(2);
    expect(datos.prendas).toBe(4);
    expect(datos.facturado).toBe(2000);
    expect(mocks.detalle).toHaveBeenCalledWith({}, expect.objectContaining({ clienteId: "a", empresa: "Minera", desde: "2026-10-01T03:00:00.000Z", hasta: "2026-10-06T03:00:00.000Z" }), { fetchPolicy: "SERVER_ONLY" });
  });
  it("recupera todas las páginas y propaga errores de páginas posteriores", async () => {
    const consulta = vi.fn().mockResolvedValueOnce(Array.from({ length: 500 }, (_, i) => i)).mockResolvedValueOnce([500]);
    expect((await todasLasPaginas(consulta)).length).toBe(501);
    expect(consulta.mock.calls).toEqual([[0], [500]]);
    consulta.mockResolvedValueOnce(Array(500)).mockRejectedValueOnce(new Error("red"));
    await expect(todasLasPaginas(consulta)).rejects.toThrow("red");
  });
});
