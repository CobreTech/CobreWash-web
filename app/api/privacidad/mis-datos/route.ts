import { serviciosAdmin } from "@/lib/firebase/admin";
import { ErrorPrivacidad, errorPrivacidad, responder } from "@/lib/privacidad/servidor";
import type { GetMiPerfilData } from "@/src/dataconnect-generated";

export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const bearer = request.headers.get("authorization")?.match(/^Bearer (\S+)$/)?.[1];
    if (!bearer) throw new ErrorPrivacidad(401, "Inicia sesión para descargar tus datos.");
    const { auth, db } = serviciosAdmin();
    let token;
    try { token = await auth.verifyIdToken(bearer, true); }
    catch { throw new ErrorPrivacidad(401, "La sesión venció."); }
    if (token.email_verified !== true) throw new ErrorPrivacidad(403, "Verifica el correo de tu cuenta o utiliza el canal de derechos.");
    const { data } = await db.executeQuery<GetMiPerfilData, Record<string, never>>("GetMiPerfil", {}, { impersonate: { authClaims: token } });
    const perfil = data.usuario;
    if (!perfil || perfil.id !== token.uid || !perfil.activo || perfil.rol.nombre !== "cliente") {
      throw new ErrorPrivacidad(403, "Utiliza el canal de derechos para solicitar tus datos.");
    }
    // Proyección explícita: nunca enviar la respuesta completa ni datos de fichas
    // comerciales compartidas, roles, tokens, secretos o información de terceros.
    const r = responder({
      formato: "cobrewash.perfil.v1", generadoEn: new Date().toISOString(),
      alcance: "Datos del perfil de cuenta. Para pedidos, otras fuentes o una respuesta íntegra de acceso o portabilidad utiliza el canal de derechos.",
      canalDerechos: "/privacidad/derechos",
      perfil: { id: perfil.id, nombre: perfil.nombre, apellido: perfil.apellido, rut: perfil.rut, email: perfil.email, telefono: perfil.telefono, creadoEn: perfil.creadoEn },
    });
    r.headers.set("Content-Disposition", 'attachment; filename="mis-datos-cobrewash.json"');
    r.headers.set("X-Content-Type-Options", "nosniff");
    return r;
  } catch (error) { return errorPrivacidad(error); }
}
