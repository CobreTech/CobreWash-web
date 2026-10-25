import { autorizarAdministrador, errorPrivacidad, responder } from "@/lib/privacidad/servidor";
import { normalizarCodigoQr } from "@/lib/seguimiento/qr";
import type { ListarSolicitudesDerechoData } from "@/src/dataconnect-generated";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const { db } = await autorizarAdministrador(request);
    const pagina = Math.max(0, Math.min(100_000, Number(new URL(request.url).searchParams.get("pagina")) || 0));
    const estados = new URL(request.url).searchParams.get("respondidas") === "1" ? ["RESPONDIDA"] : ["RECIBIDA", "VERIFICACION", "EN_GESTION"];
    const { data } = await db.executeQuery<ListarSolicitudesDerechoData, { offset: number; estados: string[] }>("ListarSolicitudesDerecho", { offset: Math.floor(pagina) * 20, estados });
    return responder({ ...data, solicitudDerechos: data.solicitudDerechos.map(s => ({ ...s, id: normalizarCodigoQr(s.id) })) });
  } catch (e) { return errorPrivacidad(e); }
}
