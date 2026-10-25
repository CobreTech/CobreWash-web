import { createHash } from "node:crypto";
import { serviciosAdmin } from "@/lib/firebase/admin";

export const MAX_FOTO_BYTES = 3 * 1024 * 1024;
export const UUID_FOTO = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export class ErrorEvidencia extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function autorizarInspeccion(request: Request, inspeccionId: string) {
  if (!UUID_FOTO.test(inspeccionId)) throw new ErrorEvidencia(400, "Inspección inválida.");
  const bearer = request.headers.get("authorization")?.match(/^Bearer (\S+)$/)?.[1];
  if (!bearer) throw new ErrorEvidencia(401, "Inicia sesión nuevamente.");
  const admin = serviciosAdmin();
  let token;
  try { token = await admin.auth.verifyIdToken(bearer, true); }
  catch { throw new ErrorEvidencia(401, "La sesión venció. Inicia sesión nuevamente."); }
  try {
    await admin.db.executeQuery("GetInspeccionParaEvidencias", { id: inspeccionId }, { impersonate: { authClaims: token } });
  } catch { throw new ErrorEvidencia(403, "No tienes permiso para consultar o adjuntar evidencia en esta inspección."); }
  return admin;
}

export async function leerFoto(request: Request): Promise<Buffer> {
  const size = Number(request.headers.get("content-length"));
  if (size > MAX_FOTO_BYTES) throw new ErrorEvidencia(413, "La fotografía supera los 3 MB.");
  if (!request.body) throw new ErrorEvidencia(400, "Falta la fotografía.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > MAX_FOTO_BYTES) { await reader.cancel(); throw new ErrorEvidencia(413, "La fotografía supera los 3 MB."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = Buffer.concat(chunks);
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff)
    throw new ErrorEvidencia(400, "La fotografía debe ser una imagen JPEG válida.");
  return bytes;
}

export const hashFoto = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
export const rutaFoto = (inspeccionId: string, fotoId: string) => `vehiculos/inspecciones/${inspeccionId}/${fotoId}.jpg`;

export function respuestaErrorEvidencia(error: unknown) {
  return Response.json({ error: error instanceof ErrorEvidencia ? error.message : "No se pudo guardar o recuperar la evidencia. Intenta nuevamente." }, { status: error instanceof ErrorEvidencia ? error.status : 503 });
}
