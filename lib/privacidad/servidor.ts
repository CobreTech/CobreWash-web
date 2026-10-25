import { createHash, createHmac } from "node:crypto";
import { serviciosAdmin } from "@/lib/firebase/admin";

export class ErrorPrivacidad extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export const hash = (valor: string) => createHash("sha256").update(valor).digest("hex");
export const responder = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" } });
export function errorPrivacidad(error: unknown) {
  return responder({ error: error instanceof ErrorPrivacidad ? error.message : "No se pudo completar la operación. Conserva el comprobante y reintenta." }, error instanceof ErrorPrivacidad ? error.status : 503);
}
export async function leerJsonLimitado(request: Request) {
  if (!request.body) throw new ErrorPrivacidad(400, "Solicitud vacía.");
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      total += value.length;
      if (total > 20_000) { await reader.cancel(); throw new ErrorPrivacidad(413, "Solicitud demasiado extensa."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new ErrorPrivacidad(400, "Solicitud inválida."); }
}
export async function limitarDerechos(request: Request, db: ReturnType<typeof serviciosAdmin>["db"]) {
  const salt = process.env.CONTACT_RATE_LIMIT_SALT;
  if (!salt || salt.length < 32) throw new ErrorPrivacidad(503, "El canal está temporalmente indisponible. Utiliza los datos de contacto de la página de privacidad.");
  const origen = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "sin-origen";
  const id = `derechos:${Math.floor(Date.now() / 3_600_000)}:${createHmac("sha256", salt).update(origen).digest("hex")}`;
  try { await db.executeMutation("PrepararLimiteContacto", { id }); }
  catch {
    const r = await db.executeQuery<{ limiteContacto: { id: string } | null }, { id: string }>("GetLimiteContacto", { id });
    if (!r.data.limiteContacto) throw new ErrorPrivacidad(503, "No se pudo preparar la recepción.");
  }
  return id;
}
export async function autorizarAdministrador(request: Request) {
  const bearer = request.headers.get("authorization")?.match(/^Bearer (\S+)$/)?.[1];
  if (!bearer) throw new ErrorPrivacidad(401, "Inicia sesión.");
  const admin = serviciosAdmin(); let token;
  try { token = await admin.auth.verifyIdToken(bearer, true); }
  catch { throw new ErrorPrivacidad(401, "La sesión venció."); }
  try { await admin.db.executeQuery("AutorizarGestionPrivacidad", {}, { impersonate: { authClaims: token } }); }
  catch { throw new ErrorPrivacidad(403, "Solo un administrador activo puede gestionar datos personales."); }
  return { ...admin, uid: token.uid };
}
