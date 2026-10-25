import { afterEach, beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ query: vi.fn(), mutation: vi.fn(), verify: vi.fn() }));
vi.mock("@/lib/firebase/admin", () => ({ serviciosAdmin: () => ({ auth: { verifyIdToken: m.verify }, db: { executeQuery: m.query, executeMutation: m.mutation } }) }));
import { POST as recibir } from "./solicitudes/route";
import { POST as consultar } from "./seguimiento/route";
import { GET as listar } from "./gestion/route";
import { POST as gestionar } from "./gestion/[id]/route";
import { hash } from "@/lib/privacidad/servidor";
const id = "10000000-0000-4000-8000-000000000001", secreto = "c".repeat(64);
const body = { id, secreto, nombre: "Titular", email: "titular@example.test", derecho: "ACCESO", detalle: "" };
const request = (datos: unknown, bearer = "") => new Request("https://web.test/api/privacidad", { method: "POST", headers: { "Content-Type": "application/json", ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) }, body: JSON.stringify(datos) });
beforeEach(() => { vi.resetAllMocks(); vi.stubEnv("CONTACT_RATE_LIMIT_SALT", "s".repeat(32)); m.verify.mockResolvedValue({ uid: "admin-real", sub: "admin-real" }); m.query.mockResolvedValue({ data: {} }); m.mutation.mockResolvedValue({ data: {} }); });
afterEach(() => vi.unstubAllEnvs());
it("recepción idempotente tras perderse la respuesta: un solo registro y sin almacenar el secreto", async () => {
  let guardada: unknown = null;
  m.query.mockImplementation(async () => ({ data: { solicitudDerecho: guardada } }));
  m.mutation.mockImplementation(async (op, args) => { if (op === "RecibirSolicitudDerecho") { expect(args).not.toHaveProperty("secreto"); guardada = { ...args, estado: "RECIBIDA", creadoEn: "2026-10-25T12:00:00Z" }; throw new Error("Respuesta perdida"); } });
  expect((await recibir(request(body))).status).toBe(200);
  expect((await recibir(request(body))).status).toBe(200);
  expect(m.mutation.mock.calls.filter(([op]) => op === "RecibirSolicitudDerecho")).toHaveLength(1);
});
it("un comprobante válido solo devuelve estado y fechas, jamás identidad o actuaciones", async () => {
  m.query.mockResolvedValue({ data: { solicitudDerecho: { secretoHash: hash(secreto), estado: "VERIFICACION", creadoEn: "fecha", objetivoAtencion: "objetivo", nombre: "PRIVADO", email: "privado@example.test", detalle: "PRIVADO" } } });
  const r = await consultar(request({ id, secreto })); expect(r.status).toBe(200);
  expect(await r.json()).toEqual({ estado: "VERIFICACION", recibidoEn: "fecha", objetivoAtencion: "objetivo" });
  expect(r.headers.get("cache-control")).toContain("no-store");
  expect((await consultar(request({ id, secreto: "a".repeat(64) }))).status).toBe(404);
});
it("autorización administrativa se comprueba con token revocable y perfil actual", async () => {
  expect((await listar(new Request("https://web.test"))).status).toBe(401);
  m.query.mockRejectedValue(new Error("operario"));
  expect((await listar(new Request("https://web.test", { headers: { Authorization: "Bearer token" } }))).status).toBe(403);
  expect(m.verify).toHaveBeenCalledWith("token", true);
  expect(m.query).toHaveBeenCalledWith("AutorizarGestionPrivacidad", {}, { impersonate: { authClaims: { uid: "admin-real", sub: "admin-real" } } });
  expect(m.mutation).not.toHaveBeenCalled();
});
it("no acepta actor inyectado ni cerrar sin evidencia", async () => {
  const ctx = { params: Promise.resolve({ id }) };
  const datos = { estado: "RESPONDIDA", revision: 1, nota: "Fundamento y respuesta", actorId: "atacante" };
  expect((await gestionar(request(datos, "token"), ctx)).status).toBe(400);
  expect(m.mutation).not.toHaveBeenCalled();
  expect((await gestionar(request({ ...datos, evidenciaIdentidad: "Verificación", evidenciaEnvio: "Envío confirmado" }, "token"), ctx)).status).toBe(200);
  expect(m.mutation.mock.calls[0][1].actorId).toBe("admin-real");
});
it("rechaza cuerpos enormes antes de consultar el backend", async () => {
  expect((await recibir(new Request("https://web.test", { method: "POST", body: "x".repeat(20_001) }))).status).toBe(413);
  expect(m.query).not.toHaveBeenCalled();
});
it("normaliza UUID de la bandeja para que la gestión acepte comprobantes serializados sin guiones", async () => {
  m.query.mockImplementation(async op => ({ data: op === "AutorizarGestionPrivacidad" ? {} : { solicitudDerechos: [{ id: id.replaceAll("-", ""), estado: "RECIBIDA" }], total: [{ _count: 1 }] } }));
  const r = await listar(new Request("https://web.test", { headers: { Authorization: "Bearer token" } }));
  expect(r.status).toBe(200); expect((await r.json()).solicitudDerechos[0].id).toBe(id);
});
