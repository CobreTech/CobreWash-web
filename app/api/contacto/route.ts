import { createHash, createHmac } from "node:crypto";
import { serviciosAdmin } from "@/lib/firebase/admin";
import { validarContacto } from "@/lib/contacto/validar";
import { configuracionLegal } from "@/lib/privacidad/configuracion";
import { VERSION_PRIVACIDAD } from "@/lib/privacidad/modelo";

export const runtime = "nodejs";
type Confirmacion = { solicitudContacto?: { id: string; hashContenido: string } | null };
export async function POST(request: Request) {
  if (!configuracionLegal().publicada) return Response.json({ error: "El formulario se habilitará cuando se publique el aviso de privacidad aprobado. Puedes contactarnos por los canales de atención indicados en el sitio." }, { status: 503 });
  let entrada;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Solicitud vacía.");
    const chunks: Uint8Array[] = []; let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.length;
        if (size > 16_384) { await reader.cancel(); throw new Error("La solicitud supera el tamaño permitido."); }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    entrada = validarContacto(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Revisa el formulario." }, { status: 400 }); }
  try {
    const { db } = serviciosAdmin();
    const hashContenido = createHash("sha256").update(JSON.stringify(entrada)).digest("hex");
    const comprobar = () => db.executeQuery<Confirmacion, { id: string }>("GetSolicitudContactoConfirmada", { id: entrada.id });
    const previo = (await comprobar()).data.solicitudContacto;
    if (previo) return previo.hashContenido === hashContenido ? Response.json({ id: previo.id }) : Response.json({ error: "Esa solicitud ya fue recibida con otros datos." }, { status: 409 });
    const salt = process.env.CONTACT_RATE_LIMIT_SALT;
    if (!salt || salt.length < 32) return Response.json({ error: "El canal de solicitudes no está disponible. Contáctanos por teléfono o correo." }, { status: 503 });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "sin-origen";
    const origen = createHmac("sha256", salt).update(ip).digest("hex");
    const limiteId = `${Math.floor(Date.now() / 3_600_000)}:${origen}`;
    try { await db.executeMutation("PrepararLimiteContacto", { id: limiteId }); }
    catch {
      const existente = await db.executeQuery<{ limiteContacto: { id: string } | null }, { id: string }>("GetLimiteContacto", { id: limiteId });
      if (!existente.data.limiteContacto) throw new Error("No se pudo preparar el límite.");
    }
    try { await db.executeMutation("RegistrarSolicitudContacto", { ...entrada, hashContenido, limiteId, versionPrivacidad: VERSION_PRIVACIDAD }); }
    catch (error) {
      const guardada = (await comprobar()).data.solicitudContacto;
      if (guardada?.hashContenido === hashContenido) return Response.json({ id: guardada.id });
      if (String(error).includes("Límite de solicitudes")) return Response.json({ error: "Alcanzaste el límite de solicitudes. Intenta más tarde o contáctanos directamente." }, { status: 429 });
      throw error;
    }
    return Response.json({ id: entrada.id }, { status: 201 });
  } catch { return Response.json({ error: "No pudimos guardar tu solicitud. Conservamos tus datos para que puedas reintentar." }, { status: 503 }); }
}
