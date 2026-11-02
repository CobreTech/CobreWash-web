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
it("reserva cupo antes de Storage y publica la foto solo después de guardarla", async () => {
  const bytes = await sharp({ create: { width: 10, height: 10, channels: 3, background: "red" } }).jpeg().toBuffer();
  const respuesta = await PUT(new Request("https://web.test?orden=1", { method: "PUT", headers: { authorization: "Bearer fixture" }, body: new Uint8Array(bytes) }), context);
  expect(respuesta.status).toBe(200);
  expect(m.mutation.mock.invocationCallOrder[0]).toBeLessThan(m.save.mock.invocationCallOrder[0]);
  expect(m.save.mock.invocationCallOrder[0]).toBeLessThan(m.mutation.mock.invocationCallOrder[1]);
  expect(m.query).toHaveBeenCalledWith("GetInspeccionParaEvidencias", { id }, { impersonate: { authClaims: { uid: "admin", sub: "admin" } } });
  expect(m.mutation).toHaveBeenNthCalledWith(1, "RegistrarEvidenciaGuardada", expect.objectContaining({ id: fotoId, inspeccionId: id, confirmar: false }));
  expect(m.mutation).toHaveBeenNthCalledWith(2, "RegistrarEvidenciaGuardada", expect.objectContaining({ id: fotoId, inspeccionId: id, confirmar: true }));
});
it("un fallo de Storage conserva la reserva sin publicar la foto y permite reintentar el mismo ID", async () => {
  const bytes = await sharp({ create: { width: 2, height: 2, channels: 3, background: "red" } }).jpeg().toBuffer();
  m.save.mockRejectedValue(new Error("Storage no disponible"));
  const respuesta = await PUT(new Request("https://web.test?orden=1", { method: "PUT", headers: { authorization: "Bearer fixture" }, body: new Uint8Array(bytes) }), context);
  expect(respuesta.status).toBe(503); expect(m.mutation).toHaveBeenCalledTimes(1);
  expect(m.mutation).toHaveBeenCalledWith("RegistrarEvidenciaGuardada", expect.objectContaining({ confirmar: false }));
  m.save.mockResolvedValue(undefined);
  const reintento = await PUT(new Request("https://web.test?orden=1", { method: "PUT", headers: { authorization: "Bearer fixture" }, body: new Uint8Array(bytes) }), context);
  expect(reintento.status).toBe(200);
  expect(m.mutation.mock.calls.every(([, args]) => args.id === fotoId)).toBe(true);
});
it("rechaza la fotografía 21 antes de escribir el objeto", async () => {
  const bytes = await sharp({ create: { width: 2, height: 2, channels: 3, background: "red" } }).jpeg().toBuffer();
  m.mutation.mockRejectedValue(new Error("LIMITE_FOTOS"));
  const r = await PUT(new Request("https://web.test?orden=1", { method: "PUT", headers: { authorization: "Bearer fixture" }, body: new Uint8Array(bytes) }), context);
  expect(r.status).toBe(409); expect(m.save).not.toHaveBeenCalled();
});
it("una respuesta perdida de Storage admite reintento sin sobrescribir otro archivo", async () => {
  const bytes = await sharp({ create: { width: 2, height: 2, channels: 3, background: "red" } }).jpeg().toBuffer();
  const { createHash } = await import("node:crypto");
  m.save.mockImplementationOnce(async (imagen: Buffer) => {
    m.metadata.mockResolvedValue([{ metadata: { sha256: createHash("sha256").update(imagen).digest("hex") } }]);
    throw Object.assign(new Error("El objeto ya existe"), { code: 412 });
  });
  const r = await PUT(new Request("https://web.test?orden=1", { method: "PUT", headers: { authorization: "Bearer fixture" }, body: new Uint8Array(bytes) }), context);
  expect(r.status).toBe(200);
  expect(m.mutation.mock.calls[1][1].confirmar).toBe(true);
});
