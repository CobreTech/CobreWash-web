import { isValidRut } from "@/lib/validators";
import { VERSION_PRIVACIDAD } from "./modelo";

export function configuracionLegal() {
  const razonSocial = process.env.LEGAL_RAZON_SOCIAL?.trim() || "";
  const rut = process.env.LEGAL_RUT?.trim() || "";
  const domicilio = process.env.LEGAL_DOMICILIO?.trim() || "";
  const email = process.env.LEGAL_EMAIL_DERECHOS?.trim() || "";
  const representante = process.env.LEGAL_REPRESENTANTE?.trim() || "";
  const conservacion = process.env.LEGAL_CONSERVACION?.trim() || "";
  const transferencias = process.env.LEGAL_PROVEEDORES_TRANSFERENCIAS?.trim() || "";
  const identidadCompleta = !!(razonSocial && isValidRut(rut) && domicilio && representante);
  // El formulario público es el canal de derechos. Un correo adicional es opcional.
  const contactoValido = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const completa = !!(identidadCompleta && conservacion && transferencias && contactoValido);
  const publicada = completa && process.env.LEGAL_AVISO_APROBADO_VERSION === VERSION_PRIVACIDAD;
  return { razonSocial, rut, domicilio, email, representante, conservacion, transferencias, identidadCompleta, publicada, version: VERSION_PRIVACIDAD };
}
