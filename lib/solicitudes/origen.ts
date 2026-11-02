import { createHmac, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";

export class ErrorOrigenSolicitud extends Error {
  constructor(public status: number) {
    super("No se pudo verificar el origen de la solicitud. Utiliza los canales de contacto indicados en el sitio.");
  }
}

function normalizarIp(valor: string | null) {
  if (!valor || valor !== valor.trim() || valor.includes("%") || !isIP(valor)) throw new ErrorOrigenSolicitud(403);
  // URL normaliza compresión y mayúsculas de IPv6; no admite listas ni puertos.
  return isIP(valor) === 6 ? new URL(`http://[${valor}]/`).hostname.slice(1, -1) : valor;
}

/** Nunca se confía en un X-Forwarded-For enviado directamente por el cliente. */
export function origenSolicitud(request: Request): string {
  // VERCEL es configuración del servidor, no una cabecera de la solicitud.
  // https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for
  if (process.env.VERCEL === "1") {
    const ip = request.headers.get("x-vercel-forwarded-for");
    if (!ip) throw new ErrorOrigenSolicitud(503);
    return normalizarIp(ip);
  }

  // Otros hosts deben recibir la dirección firmada por su proxy de entrada.
  const secreto = process.env.CONTACT_PROXY_SECRET;
  if (!secreto || secreto.length < 32) throw new ErrorOrigenSolicitud(503);
  const ip = request.headers.get("x-cobre-client-ip");
  const timestamp = request.headers.get("x-cobre-client-timestamp") ?? "";
  const firma = request.headers.get("x-cobre-client-signature") ?? "";
  if (!/^\d{10,11}$/.test(timestamp) || !/^[\da-f]{64}$/i.test(firma)) throw new ErrorOrigenSolicitud(403);
  const instante = Number(timestamp);
  if (!Number.isSafeInteger(instante) || Math.abs(Math.floor(Date.now() / 1000) - instante) > 60) throw new ErrorOrigenSolicitud(403);
  const direccion = normalizarIp(ip);
  // Se firma la representación recibida; la normalización solo fija la clave del contador.
  const esperada = createHmac("sha256", secreto).update(`cobre-solicitudes\n${timestamp}\n${ip}`).digest();
  if (!timingSafeEqual(esperada, Buffer.from(firma, "hex"))) throw new ErrorOrigenSolicitud(403);
  return direccion;
}
