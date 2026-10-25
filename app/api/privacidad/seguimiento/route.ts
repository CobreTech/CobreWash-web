import { timingSafeEqual } from "node:crypto";
import { serviciosAdmin } from "@/lib/firebase/admin";
import { ErrorPrivacidad, errorPrivacidad, hash, leerJsonLimitado, responder } from "@/lib/privacidad/servidor";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const b = await leerJsonLimitado(request);
    if (!b || typeof b.id !== "string" || !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(b.id) || typeof b.secreto !== "string" || !/^[\da-f]{64}$/i.test(b.secreto)) throw new ErrorPrivacidad(400, "Comprobante inválido.");
    const { db } = serviciosAdmin();
    const { data } = await db.executeQuery<{ solicitudDerecho: { secretoHash: string; estado: string; creadoEn: string; objetivoAtencion: string } | null }, { id: string }>("GetComprobanteDerecho", { id: b.id });
    const s = data.solicitudDerecho;
    if (!s || !timingSafeEqual(Buffer.from(hash(b.secreto), "hex"), Buffer.from(s.secretoHash, "hex"))) throw new ErrorPrivacidad(404, "Comprobante no encontrado.");
    // Nunca devuelve nombre, correo, detalle ni actuaciones internas.
    return responder({ estado: s.estado, recibidoEn: s.creadoEn, objetivoAtencion: s.objetivoAtencion });
  } catch (e) { return errorPrivacidad(e); }
}
