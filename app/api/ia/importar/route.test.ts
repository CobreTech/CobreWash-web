import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ query: vi.fn(), mutation: vi.fn(), mutacionProduccion: vi.fn(), verify: vi.fn() }));
vi.mock("@/lib/firebase/admin", () => ({
  serviciosAdmin: () => ({
    auth: { verifyIdToken: m.verify },
    db: { executeQuery: m.query, executeMutation: m.mutation },
    dbProduccion: { executeMutation: m.mutacionProduccion },
  }),
}));
import { POST } from "./route";

const CLORO = "10000000-0000-4000-8000-000000000001";
const csv = "insumo;cantidad;fecha\nCloro;5;2026-10-01\nCloro;4,5;2026-10-08";
const pedir = (cuerpo: unknown, token = "token") => new Request("https://web.test/api/ia/importar", {
  method: "POST",
  headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  body: typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo),
});
let existentes = { conteoInventarios: [] as unknown[], movimientoInventarios: [] as unknown[] };

beforeEach(() => {
  vi.resetAllMocks();
  existentes = { conteoInventarios: [], movimientoInventarios: [] };
  m.verify.mockResolvedValue({ uid: "admin-real", sub: "admin-real" });
  m.query.mockImplementation(async (op: string) => ({
    data: op === "GetInsumosImportacionIa" ? { insumos: [{ id: CLORO, nombre: "Cloro", unidadMedida: "L" }] } : op === "GetRegistrosExistentesIa" ? existentes : {},
  }));
  m.mutacionProduccion.mockResolvedValue({ data: {} });
});

it("exige sesión vigente y rol administrador verificado en el servidor", async () => {
  expect((await POST(pedir({ tipo: "conteos", texto: csv }, ""))).status).toBe(401);
  m.verify.mockRejectedValueOnce(new Error("revocado"));
  expect((await POST(pedir({ tipo: "conteos", texto: csv }))).status).toBe(401);
  m.query.mockRejectedValueOnce(new Error("operario"));
  const r = await POST(pedir({ tipo: "conteos", texto: csv }));
  expect(r.status).toBe(403);
  expect(m.verify).toHaveBeenCalledWith("token", true);
  expect(m.query).toHaveBeenCalledWith("AutorizarModuloIa", {}, { impersonate: { authClaims: { uid: "admin-real", sub: "admin-real" } } });
  expect(m.mutacionProduccion).not.toHaveBeenCalled();
});

it("guarda conteos históricos aprobados con el autor de la sesión", async () => {
  const r = await POST(pedir({ tipo: "conteos", texto: csv }));
  expect(r.status).toBe(200);
  expect(await r.json()).toEqual({ guardadas: 2 });
  expect(r.headers.get("cache-control")).toContain("no-store");
  const [op, { conteos }] = m.mutacionProduccion.mock.calls[0];
  expect(op).toBe("ImportarConteosIa");
  expect(conteos).toHaveLength(2);
  expect(conteos[1]).toMatchObject({ insumoId: CLORO, cantidadContada: 4.5, registradoPorId: "admin-real", estado: "APROBADO", origen: "REAL" });
});

it("guarda compras como movimientos COMPRA", async () => {
  expect((await POST(pedir({ tipo: "compras", texto: csv }))).status).toBe(200);
  const [op, { compras }] = m.mutacionProduccion.mock.calls[0];
  expect(op).toBe("ImportarComprasIa");
  expect(compras[0]).toMatchObject({ usuarioId: "admin-real", clase: "COMPRA", tipoMovimiento: "ENTRADA", cantidad: 5 });
});

it("vuelve a validar en el servidor y no guarda nada si una fila falla", async () => {
  const r = await POST(pedir({ tipo: "conteos", texto: csv + "\nJabón;1;2026-10-09" }));
  expect(r.status).toBe(400);
  expect((await r.json()).errores).toEqual([{ linea: 4, mensaje: 'Insumo "Jabón" no existe o está inactivo.' }]);
  expect(m.mutacionProduccion).not.toHaveBeenCalled();
});

it("rechaza volver a subir filas ya registradas", async () => {
  existentes.conteoInventarios = [{ insumoId: CLORO.replaceAll("-", ""), fechaConteo: "2026-10-02T02:59:59Z" }];
  const r = await POST(pedir({ tipo: "conteos", texto: csv }));
  expect(r.status).toBe(409);
  expect((await r.json()).errores).toEqual([{ linea: 2, mensaje: "Ya estaba registrada (Cloro)." }]);
  expect(m.mutacionProduccion).not.toHaveBeenCalled();
});

it.each([
  [{ tipo: "ventas", texto: csv }, 400],
  [{ tipo: "conteos", texto: "  " }, 400],
  [{ tipo: "conteos", texto: "insumo;cantidad;fecha\n" }, 400],
  ["{no es json", 400],
  [{ tipo: "conteos", texto: "x".repeat(400_001) }, 413],
])("responde errores claros a cuerpos inválidos (%#)", async (cuerpo, estado) => {
  const r = await POST(pedir(cuerpo));
  expect(r.status).toBe(estado);
  expect((await r.json()).error).toBeTruthy();
  expect(m.mutacionProduccion).not.toHaveBeenCalled();
});

it("no expone detalles internos si falla la base de datos", async () => {
  m.mutacionProduccion.mockRejectedValueOnce(new Error("SQL interno"));
  const r = await POST(pedir({ tipo: "conteos", texto: csv }));
  expect(r.status).toBe(503);
  expect(JSON.stringify(await r.json())).not.toContain("SQL");
});

it("rechaza solicitudes sin cuerpo", async () => {
  const r = await POST(new Request("https://web.test/api/ia/importar", { method: "POST", headers: { Authorization: "Bearer token" } }));
  expect(r.status).toBe(400);
});
