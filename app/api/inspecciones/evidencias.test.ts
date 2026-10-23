import { beforeEach, expect, it, vi } from "vitest";
import sharp from "sharp";
const m = vi.hoisted(() => ({ verify: vi.fn(), query: vi.fn(), mutation: vi.fn(), save: vi.fn(), metadata: vi.fn(), exists: vi.fn(), download: vi.fn() }));
vi.mock("@/lib/firebase/admin", () => ({ serviciosAdmin: () => ({ auth: { verifyIdToken: m.verify }, db: { executeQuery: m.query, executeMutation: m.mutation }, bucket: { file: () => ({ save: m.save, getMetadata: m.metadata, exists: m.exists, download: m.download }) } }) }));
import { PUT, GET } from "./[id]/fotos/[fotoId]/route";
const id = "10000000-0000-4000-8000-000000000001", fotoId = "20000000-0000-4000-8000-000000000001";
const context = { params: Promise.resolve({ id, fotoId }) };
beforeEach(() => { vi.resetAllMocks(); m.verify.mockResolvedValue({ uid: "admin", sub: "admin" }); m.query.mockResolvedValue({ data: {} }); m.save.mockResolvedValue(undefined); m.mutation.mockResolvedValue({}); });
it("requiere sesión y acceso a la inspección antes de escribir archivos", async () => {
  const sinSesion = await GET(new Request("https://web.test"), context); expect(sinSesion.status).toBe(401);
  m.query.mockRejectedValue(new Error("denegado"));
  const respuesta = await PUT(new Request("https://web.test?orden=1", { method: "PUT", headers: { authorization: "Bearer fixture" }, body: "foto" }), context);
  expect(respuesta.status).toBe(403); expect(m.save).not.toHaveBeenCalled(); expect(m.mutation).not.toHaveBeenCalled();
});
it("decodifica el JPEG y solo registra metadata después de guardar el archivo", async () => {
  const bytes = await sharp({ create: { width: 10, height: 10, channels: 3, background: "red" } }).jpeg().toBuffer();
  const respuesta = await PUT(new Request("https://web.test?orden=1", { method: "PUT", headers: { authorization: "Bearer fixture" }, body: new Uint8Array(bytes) }), context);
  expect(respuesta.status).toBe(200);
  expect(m.save.mock.invocationCallOrder[0]).toBeLessThan(m.mutation.mock.invocationCallOrder[0]);
  expect(m.query).toHaveBeenCalledWith("GetInspeccionParaEvidencias", { id }, { impersonate: { authClaims: { uid: "admin", sub: "admin" } } });
  expect(m.mutation).toHaveBeenCalledWith("RegistrarEvidenciaGuardada", expect.objectContaining({ id: fotoId, inspeccionId: id }));
});
it("un fallo de Storage no inserta un adjunto ni devuelve éxito", async () => {
  const bytes = await sharp({ create: { width: 2, height: 2, channels: 3, background: "red" } }).jpeg().toBuffer();
  m.save.mockRejectedValue(new Error("Storage no disponible"));
  const respuesta = await PUT(new Request("https://web.test?orden=1", { method: "PUT", headers: { authorization: "Bearer fixture" }, body: new Uint8Array(bytes) }), context);
  expect(respuesta.status).toBe(503); expect(m.mutation).not.toHaveBeenCalled();
});
