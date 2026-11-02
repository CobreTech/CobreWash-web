import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ query: vi.fn(), mutation: vi.fn(), mutacionProduccion: vi.fn(), verify: vi.fn() }));
vi.mock("@/lib/firebase/admin", () => ({
  serviciosAdmin: () => ({
    auth: { verifyIdToken: m.verify },
    db: { executeQuery: m.query, executeMutation: m.mutation },
    dbProduccion: { executeMutation: m.mutacionProduccion },
  }),
}));
import { DELETE, POST } from "./route";

const DET = "10000000000040008000000000000001", LAV = "20000000000040008000000000000001";
const tasas = {
  configuracionIa: null,
  tasaConsumos: [{ tipoServicioId: LAV, insumoId: DET, tasaInicial: 12, tasaActual: 12, unidad: "ml", tipoServicio: { nombre: "Lavado" }, insumo: { nombre: "Detergente" } }],
  insumos: [{ id: DET, nombre: "Detergente", unidadMedida: "L" }],
};
const params = { semanas: 6, kgSemanalMin: 6000, kgSemanalMax: 9000, ruido: 0.1, desvioTasas: 0.3, semilla: 5 };
const pedir = (metodo: string, cuerpo?: unknown, token = "token") => new Request("https://web.test/api/ia/simulacion", {
  method: metodo, headers: token ? { Authorization: `Bearer ${token}` } : {}, body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
});

beforeEach(() => {
  vi.resetAllMocks();
  m.verify.mockResolvedValue({ uid: "admin-real", sub: "admin-real" });
  m.query.mockImplementation(async (op: string) => ({ data: op === "GetTasasSimulacionIa" ? tasas : {} }));
  m.mutation.mockResolvedValue({ data: {} });
  m.mutacionProduccion.mockResolvedValue({ data: {} });
});

it("solo un administrador verificado puede generar o borrar simulaciones", async () => {
  expect((await POST(pedir("POST", params, ""))).status).toBe(401);
  m.query.mockRejectedValueOnce(new Error("operario"));
  expect((await POST(pedir("POST", params))).status).toBe(403);
  m.query.mockRejectedValueOnce(new Error("operario"));
  expect((await DELETE(pedir("DELETE", {}))).status).toBe(403);
  expect(m.mutacionProduccion).not.toHaveBeenCalled();
  expect(m.mutation).not.toHaveBeenCalled();
});

it("genera el lote completo en una operación y resume la curva", async () => {
  const r = await POST(pedir("POST", params));
  expect(r.status).toBe(200);
  const cuerpo = await r.json();
  expect(cuerpo).toMatchObject({ semilla: 5, conteos: 7, periodos: 5 });
  expect(cuerpo.errorTasasFinal).toBeLessThanOrEqual(cuerpo.errorTasasInicial);
  const [op, vars] = m.mutacionProduccion.mock.calls[0];
  expect(op).toBe("GuardarSimulacionIa");
  expect(vars.simulacion).toMatchObject({ id: cuerpo.id, semanas: 6, creadoPorId: "admin-real" });
  expect(vars.conteos.every((c: { origen: string; registradoPorId: string }) => c.origen === "SIMULADO" && c.registradoPorId === "admin-real")).toBe(true);
  expect(vars.produccion).toHaveLength(42);
});

it("elige una semilla al azar si no se indica", async () => {
  const { semilla, ...sinSemilla } = params;
  void semilla;
  const r = await POST(pedir("POST", sinSemilla));
  expect(r.status).toBe(200);
  expect(Number.isInteger((await r.json()).semilla)).toBe(true);
});

it.each([
  [{ ...params, semanas: 60 }, "semanas"],
  [{ ...params, kgSemanalMin: "6000" }, "6.000 y 9.000"],
  [{ ...params, ruido: 2 }, "ruido"],
])("rechaza parámetros inválidos con un mensaje claro (%#)", async (cuerpo, texto) => {
  const r = await POST(pedir("POST", cuerpo));
  expect(r.status).toBe(400);
  expect((await r.json()).error).toContain(texto);
  expect(m.mutacionProduccion).not.toHaveBeenCalled();
});

it("pide tasas antes de simular", async () => {
  m.query.mockImplementation(async (op: string) => ({ data: op === "GetTasasSimulacionIa" ? { ...tasas, tasaConsumos: [] } : {} }));
  const r = await POST(pedir("POST", params));
  expect(r.status).toBe(400);
  expect((await r.json()).error).toContain("Define al menos una tasa");
});

it("borra un lote por id o todos los datos simulados", async () => {
  const id = "10000000-0000-4000-8000-0000000000aa";
  expect(await (await DELETE(pedir("DELETE", { id }))).json()).toEqual({ borrado: id });
  expect(m.mutation).toHaveBeenLastCalledWith("BorrarSimulacionIa", { id });
  expect(await (await DELETE(pedir("DELETE", {}))).json()).toEqual({ borrado: "todos" });
  expect(m.mutation).toHaveBeenLastCalledWith("BorrarSimulacionesIa");
});

it("valida el id y avisa si el lote ya no existe", async () => {
  expect((await DELETE(pedir("DELETE", { id: "1 OR 1=1" }))).status).toBe(400);
  m.mutation.mockRejectedValueOnce(new Error("La simulación ya no existe (aborted)"));
  expect((await DELETE(pedir("DELETE", { id: "10000000-0000-4000-8000-0000000000aa" }))).status).toBe(404);
  m.mutation.mockRejectedValueOnce(new Error("pq: interno"));
  const r = await DELETE(pedir("DELETE", { id: "10000000-0000-4000-8000-0000000000aa" }));
  expect(r.status).toBe(503);
  expect(JSON.stringify(await r.json())).not.toContain("pq");
});
