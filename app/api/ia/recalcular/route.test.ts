import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ query: vi.fn(), mutacionProduccion: vi.fn(), verify: vi.fn() }));
vi.mock("@/lib/firebase/admin", () => ({
  serviciosAdmin: () => ({
    auth: { verifyIdToken: m.verify },
    db: { executeQuery: m.query },
    dbProduccion: { executeMutation: m.mutacionProduccion },
  }),
}));
import { POST } from "./route";

const DET = "10000000000040008000000000000001", LAV = "20000000000040008000000000000001";
const dia = (n: number) => new Date(Date.UTC(2026, 8, n, 23)).toISOString();
const entrenamiento = {
  configuracionIa: null,
  tasaConsumos: [{ tipoServicioId: LAV, insumoId: DET, tasaInicial: 12, tasaActual: 12, unidad: "ml", fuente: null, tipoServicio: { nombre: "Lavado" } }],
  insumos: [{ id: DET, nombre: "Detergente", unidadMedida: "L" }],
  conteoInventarios: [{ insumoId: DET, cantidadContada: 100, creadoEn: dia(1), fechaConteo: null, origen: "REAL" }, { insumoId: DET, cantidadContada: 90, creadoEn: dia(8), fechaConteo: null, origen: "REAL" }],
  movimientoInventarios: [],
  comandaDetalles: [{ tipoServicioId: LAV, pesoKg: 1000, comanda: { fechaRecepcion: dia(3) } }],
  produccionSimuladas: [],
  modelos: [{ _count: 0 }],
};
const pedir = (token = "token") => new Request("https://web.test/api/ia/recalcular", { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {} });

beforeEach(() => {
  vi.resetAllMocks();
  m.verify.mockResolvedValue({ uid: "admin-real", sub: "admin-real" });
  m.query.mockImplementation(async (op: string) => ({ data: op === "GetDatosEntrenamientoIa" ? entrenamiento : {} }));
  m.mutacionProduccion.mockResolvedValue({ data: {} });
});

it("solo un administrador verificado en el servidor puede recalcular", async () => {
  expect((await POST(pedir(""))).status).toBe(401);
  m.query.mockRejectedValueOnce(new Error("recepcionista"));
  expect((await POST(pedir())).status).toBe(403);
  expect(m.query).not.toHaveBeenCalledWith("GetDatosEntrenamientoIa");
  expect(m.mutacionProduccion).not.toHaveBeenCalled();
});

it("guarda el ajuste y las tasas actuales en una sola operación y resume el resultado", async () => {
  const r = await POST(pedir());
  expect(r.status).toBe(200);
  expect(await r.json()).toEqual({ version: "v1", observaciones: 1, mae: expect.any(Number), mape: expect.any(Number), insumos: 1, descartados: 0 });
  expect(m.mutacionProduccion).toHaveBeenCalledTimes(1);
  const [op, { modelo, tasas }] = m.mutacionProduccion.mock.calls[0];
  expect(op).toBe("GuardarAjusteIa");
  expect(modelo).toMatchObject({ version: "v1", activo: true, ejecutadoPorId: "admin-real", observaciones: 1 });
  expect(tasas).toEqual([expect.objectContaining({ tipoServicioId: LAV, insumoId: DET, tasaInicial: 12, unidad: "ml", actualizadoPorId: "admin-real" })]);
  expect(Object.keys(modelo)).not.toContain("stockActual");
});

it("explica cuando aún no hay tasas que ajustar", async () => {
  m.query.mockImplementation(async (op: string) => ({ data: op === "GetDatosEntrenamientoIa" ? { ...entrenamiento, tasaConsumos: [] } : {} }));
  const r = await POST(pedir());
  expect(r.status).toBe(400);
  expect((await r.json()).error).toContain("Define al menos una tasa");
  expect(m.mutacionProduccion).not.toHaveBeenCalled();
});

it("no expone detalles internos si falla el guardado", async () => {
  m.mutacionProduccion.mockRejectedValueOnce(new Error("pq: deadlock"));
  const r = await POST(pedir());
  expect(r.status).toBe(503);
  expect(JSON.stringify(await r.json())).not.toContain("pq");
});
