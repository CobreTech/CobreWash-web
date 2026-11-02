import { beforeEach, afterEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ query: vi.fn(), mutation: vi.fn() }));
vi.mock("@/lib/privacidad/configuracion", () => ({ configuracionLegal: () => ({ publicada: true }) }));
vi.mock("@/lib/firebase/admin", () => ({ serviciosAdmin: () => ({ db: { executeQuery: m.query, executeMutation: m.mutation } }) }));
import { POST } from "./route";
const entrada = { autorizaDatos: true, versionPrivacidad: "2026-11-01", id: "10000000-0000-4000-8000-000000000001", nombre: "Cliente de prueba", correo: "cliente@example.test", telefono: "+56912345678", servicio: "otro", mensaje: "Solicito una cotización." };
const solicitud = (headers: Record<string, string> = {}) => new Request("https://web.test/api/contacto", { method: "POST", headers: { "content-type": "application/json", "x-vercel-forwarded-for": "203.0.113.10", ...headers }, body: JSON.stringify(entrada) });
beforeEach(() => {
  vi.resetAllMocks(); vi.stubEnv("CONTACT_RATE_LIMIT_SALT", "s".repeat(32));
  vi.stubEnv("VERCEL", "1");
  vi.spyOn(Date, "now").mockReturnValue(1_793_534_400_000);
  m.query.mockResolvedValue({ data: { solicitudContacto: null } }); m.mutation.mockResolvedValue({ data: {} });
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });
it("un backend caído devuelve error y jamás confirma la recepción", async () => {
  m.query.mockRejectedValue(new Error("credenciales no disponibles"));
  const r = await POST(solicitud()); expect(r.status).toBe(503);
  expect(await r.json()).toHaveProperty("error"); expect(m.mutation).not.toHaveBeenCalled();
});
it("confirma una sola solicitud aunque se pierda la respuesta posterior al commit", async () => {
  let hash = "";
  m.mutation.mockImplementation(async (operacion, args) => {
    if (operacion === "RegistrarSolicitudContacto") { hash = args.hashContenido; throw new Error("respuesta perdida"); }
  });
  m.query.mockImplementation(async () => ({ data: { solicitudContacto: hash ? { id: entrada.id, hashContenido: hash } : null } }));
  expect((await POST(solicitud())).status).toBe(200);
  expect((await POST(solicitud())).status).toBe(200);
  expect(m.mutation.mock.calls.filter(([op]) => op === "RegistrarSolicitudContacto")).toHaveLength(1);
});
it("rechaza formularios excesivos antes de acceder al backend", async () => {
  const r = await POST(new Request("https://web.test", { method: "POST", body: "x".repeat(16_385) }));
  expect(r.status).toBe(400); expect(m.query).not.toHaveBeenCalled();
});
it("no cambia de contador al falsificar X-Forwarded-For", async () => {
  expect((await POST(solicitud({ "x-forwarded-for": "198.51.100.1" }))).status).toBe(201);
  expect((await POST(solicitud({ "x-forwarded-for": "198.51.100.2" }))).status).toBe(201);
  const ids = m.mutation.mock.calls.filter(([op]) => op === "PrepararLimiteContacto").map(([, args]) => args.id);
  expect(ids).toHaveLength(2); expect(ids[0]).toBe(ids[1]);
});
it("no escribe solicitudes nuevas si no se puede verificar el origen", async () => {
  const request = new Request("https://web.test/api/contacto", { method: "POST", headers: { "x-forwarded-for": "198.51.100.1" }, body: JSON.stringify(entrada) });
  expect((await POST(request)).status).toBe(503);
  expect(m.mutation).not.toHaveBeenCalled();
});
