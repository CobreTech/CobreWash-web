import { serviciosAdmin } from "@/lib/firebase/admin";

/** Error con código HTTP y mensaje apto para mostrar al administrador. */
export class ErrorIa extends Error {
  constructor(public status: number, message: string, public detalle?: unknown) { super(message); }
}

export const responder = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "private, no-store" } });

export function errorIa(error: unknown) {
  if (error instanceof ErrorIa) return responder({ error: error.message, ...(error.detalle ? { errores: error.detalle } : {}) }, error.status);
  return responder({ error: "No se pudo completar la operación. Intenta nuevamente." }, 503);
}

/**
 * Verifica en el servidor que la solicitud viene de un administrador activo:
 * token de Firebase vigente y no revocado, y perfil con rol admin en la base.
 */
export async function autorizarAdminIa(request: Request) {
  const bearer = request.headers.get("authorization")?.match(/^Bearer (\S+)$/)?.[1];
  if (!bearer) throw new ErrorIa(401, "Inicia sesión.");
  const admin = serviciosAdmin();
  let token;
  try { token = await admin.auth.verifyIdToken(bearer, true); }
  catch { throw new ErrorIa(401, "La sesión venció. Vuelve a iniciar sesión."); }
  try { await admin.db.executeQuery("AutorizarModuloIa", {}, { impersonate: { authClaims: token } }); }
  catch { throw new ErrorIa(403, "Solo un administrador activo puede usar el módulo IA."); }
  return { ...admin, uid: token.uid };
}

/** Lee un cuerpo JSON cortando antes de cargar en memoria más de `limite` bytes. */
export async function leerJson(request: Request, limite: number): Promise<unknown> {
  if (!request.body) throw new ErrorIa(400, "Solicitud vacía.");
  const reader = request.body.getReader();
  const partes: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > limite) { await reader.cancel(); throw new ErrorIa(413, "El archivo es demasiado grande."); }
      partes.push(value);
    }
  } finally { reader.releaseLock(); }
  try { return JSON.parse(Buffer.concat(partes).toString("utf8")); }
  catch { throw new ErrorIa(400, "Solicitud inválida."); }
}
