import { validarGestionDerecho } from "@/lib/privacidad/modelo";
import { autorizarAdministrador, ErrorPrivacidad, errorPrivacidad, leerJsonLimitado, responder } from "@/lib/privacidad/servidor";
export const runtime = "nodejs";
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { db, uid } = await autorizarAdministrador(request);
    const { id } = await context.params;
    if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) throw new ErrorPrivacidad(400, "Solicitud inválida.");
    const raw = await leerJsonLimitado(request); let datos;
    try { datos = validarGestionDerecho(raw); }
    catch (e) { throw new ErrorPrivacidad(400, (e as Error).message); }
    if (!Number.isSafeInteger(raw.revision) || raw.revision < 0) throw new ErrorPrivacidad(400, "Revisión inválida.");
    try { await db.executeMutation("GestionarSolicitudDerecho", { ...datos, id, actorId: uid, revision: raw.revision }); }
    catch (e) { if (String(e).includes("REVISION_PRIVACIDAD")) throw new ErrorPrivacidad(409, "La solicitud cambió. Actualiza la bandeja antes de guardar."); throw e; }
    return responder({ ok: true });
  } catch (e) { return errorPrivacidad(e); }
}
