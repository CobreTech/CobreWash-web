import { serviciosAdmin } from "@/lib/firebase/admin";
import { objetivoAtencion, validarSolicitudDerecho, VERSION_PRIVACIDAD } from "@/lib/privacidad/modelo";
import { ErrorPrivacidad, errorPrivacidad, hash, leerJsonLimitado, limitarDerechos, responder } from "@/lib/privacidad/servidor";
export const runtime = "nodejs";
type Comprobante = { solicitudDerecho: { id: string; secretoHash: string; contenidoHash: string; estado: string; creadoEn: string; objetivoAtencion: string } | null };
export async function POST(request: Request) {
  try {
    const raw = await leerJsonLimitado(request); let entrada;
    try { entrada = validarSolicitudDerecho(raw); }
    catch (e) { throw new ErrorPrivacidad(400, (e as Error).message); }
    const { secreto, ...datos } = entrada;
    const secretoHash = hash(secreto), contenidoHash = hash(JSON.stringify(datos));
    const { db } = serviciosAdmin();
    const consultar = async () => (await db.executeQuery<Comprobante, { id: string }>("GetComprobanteDerecho", { id: datos.id })).data.solicitudDerecho;
    const recibo = (s: NonNullable<Comprobante["solicitudDerecho"]>) => responder({ id: datos.id, estado: s.estado, recibidoEn: s.creadoEn, objetivoAtencion: s.objetivoAtencion, mensaje: "Solicitud recibida. Conserva el comprobante. Verificaremos la identidad antes de comunicar datos o ejecutar cambios. Solicitar bloqueo no confirma su ejecución." });
    const previo = await consultar();
    if (previo) {
      if (previo.secretoHash === secretoHash && previo.contenidoHash === contenidoHash) return recibo(previo);
      throw new ErrorPrivacidad(409, "El comprobante no corresponde a esta solicitud. Genera uno nuevo.");
    }
    const limiteId = await limitarDerechos(request, db);
    try { await db.executeMutation("RecibirSolicitudDerecho", { ...datos, secretoHash, contenidoHash, limiteId, versionAviso: VERSION_PRIVACIDAD, objetivoAtencion: objetivoAtencion(datos.derecho) }); }
    catch (e) {
      const guardada = await consultar();
      if (guardada?.secretoHash === secretoHash && guardada.contenidoHash === contenidoHash) return recibo(guardada);
      if (String(e).includes("LIMITE_DERECHOS")) throw new ErrorPrivacidad(429, "Se alcanzó el límite temporal. Reintenta en una hora o utiliza el canal de contacto de privacidad.");
      throw e;
    }
    const guardada = await consultar();
    if (!guardada) throw new ErrorPrivacidad(503, "No se pudo confirmar la recepción. Reintenta con el mismo comprobante.");
    return recibo(guardada);
  } catch (e) { return errorPrivacidad(e); }
}
