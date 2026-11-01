import { beforeEach, expect, it, vi } from "vitest";
const m = vi.hoisted(() => ({ verify: vi.fn(), query: vi.fn() }));
vi.mock("@/lib/firebase/admin", () => ({ serviciosAdmin: () => ({ auth: { verifyIdToken: m.verify }, db: { executeQuery: m.query } }) }));
import { GET } from "./route";
const request = (url = "https://web.test/api/privacidad/mis-datos") => new Request(url, { headers: { Authorization: "Bearer token" } });
beforeEach(() => {
  vi.resetAllMocks();
  m.verify.mockResolvedValue({ uid: "propio", email_verified: true });
  m.query.mockResolvedValue({ data: { usuario: { id: "propio", activo: true, rol: { nombre: "cliente" }, nombre: "Ana", email: "ana@example.test", secreto: "NO_EXPORTAR", clientes_on_usuario: [{ direccion: "TERCERO" }] } } });
});
it("solo exporta una proyección del propio perfil y no acepta un identificador de terceros", async () => {
  const r = await GET(request("https://web.test/api/privacidad/mis-datos?uid=ajeno"));
  expect(r.status).toBe(200);
  expect(m.verify).toHaveBeenCalledWith("token", true);
  expect(m.query).toHaveBeenCalledWith("GetMiPerfil", {}, { impersonate: { authClaims: { uid: "propio", email_verified: true } } });
  const text = await r.text(); expect(text).toContain('"id":"propio"');
  for (const value of ["TERCERO", "NO_EXPORTAR", "email_verified", "clientes_on_usuario"]) expect(text).not.toContain(value);
  expect(r.headers.get("cache-control")).toContain("no-store");
  expect(r.headers.get("content-disposition")).toContain("attachment");
});
it("exige sesión revocable y correo verificado antes de consultar datos", async () => {
  expect((await GET(new Request("https://web.test"))).status).toBe(401);
  m.verify.mockRejectedValueOnce(new Error("revocada")); expect((await GET(request())).status).toBe(401);
  m.verify.mockResolvedValueOnce({ uid: "propio", email_verified: false }); expect((await GET(request())).status).toBe(403);
  expect(m.query).not.toHaveBeenCalled();
});
it.each([null, { id: "ajeno", activo: true, rol: { nombre: "cliente" } }, { id: "propio", activo: false, rol: { nombre: "cliente" } }, { id: "propio", activo: true, rol: { nombre: "admin" } }])("no exporta perfiles ausentes, ajenos, inactivos ni internos", async perfil => {
  m.query.mockResolvedValue({ data: { usuario: perfil } });
  const r = await GET(request()); expect(r.status).toBe(403); expect(await r.text()).not.toContain('"perfil"');
});
