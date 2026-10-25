export const VERSION_PRIVACIDAD = "2026-10-25";
export const DERECHOS = ["ACCESO", "RECTIFICACION", "SUPRESION", "OPOSICION", "BLOQUEO", "PORTABILIDAD", "REVOCACION"] as const;
export type Derecho = typeof DERECHOS[number];
export const ETIQUETAS_DERECHOS: Record<Derecho, string> = {
  ACCESO: "Acceso a mis datos", RECTIFICACION: "Rectificar mis datos", SUPRESION: "Solicitar supresión",
  OPOSICION: "Oponerme a un tratamiento", BLOQUEO: "Solicitar bloqueo temporal", PORTABILIDAD: "Solicitar portabilidad", REVOCACION: "Revocar una autorización",
};
export function validarSolicitudDerecho(body: unknown) {
  if (!body || typeof body !== "object") throw new Error("Solicitud inválida.");
  const b = body as Record<string, unknown>;
  const texto = (key: string, max: number, opcional = false) => {
    if (opcional && (b[key] === undefined || b[key] === "")) return "";
    if (typeof b[key] !== "string" || !(b[key] as string).trim() || (b[key] as string).length > max) throw new Error(`Revisa el campo ${key}.`);
    return (b[key] as string).trim();
  };
  const id = texto("id", 36), secreto = texto("secreto", 64);
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id) || !/^[\da-f]{64}$/i.test(secreto)) throw new Error("Comprobante inválido.");
  const nombre = texto("nombre", 160), email = texto("email", 120).toLowerCase();
  if (/[\r\n]/.test(nombre) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Revisa el nombre y el correo de respuesta.");
  const derecho = texto("derecho", 20) as Derecho;
  if (!DERECHOS.includes(derecho)) throw new Error("Selecciona un derecho.");
  const detalle = texto("detalle", 3000, derecho === "ACCESO");
  return { id, secreto, nombre, email, derecho, detalle };
}

// Objetivo operativo conservador: 24 h para bloqueo y 48 h para el resto.
// No sustituye los plazos legales ni requiere calcular feriados para priorizar.
export function objetivoAtencion(derecho: Derecho, ahora = new Date()) {
  return new Date(ahora.getTime() + (derecho === "BLOQUEO" ? 24 : 48) * 3_600_000).toISOString();
}

export function validarGestionDerecho(body: unknown) {
  const b = body as Record<string, unknown> | null;
  if (!b || !["VERIFICACION", "EN_GESTION", "RESPONDIDA"].includes(String(b.estado))) throw new Error("Estado inválido.");
  const campo = (key: string, max: number) => typeof b[key] === "string" && (b[key] as string).trim().length <= max ? (b[key] as string).trim() : "";
  const nota = campo("nota", 4000), evidenciaIdentidad = campo("evidenciaIdentidad", 500), evidenciaEnvio = campo("evidenciaEnvio", 500);
  if (!nota) throw new Error("Registra la actuación o respuesta y su fundamento.");
  if (b.estado === "RESPONDIDA" && (!evidenciaIdentidad || !evidenciaEnvio)) throw new Error("Antes de cerrar, registra cómo verificaste la identidad y la evidencia del envío de la respuesta.");
  return { estado: b.estado as "VERIFICACION" | "EN_GESTION" | "RESPONDIDA", nota, evidenciaIdentidad, evidenciaEnvio };
}
