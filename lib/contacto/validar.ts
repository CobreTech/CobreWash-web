import { isValidChileanPhone } from "@/lib/validators";
export const SERVICIOS_CONTACTO = ["industrial", "domestica", "retiro-entrega", "otro"];
export function validarContacto(body: unknown) {
  if (!body || typeof body !== "object") throw new Error("Solicitud inválida.");
  const entrada = body as Record<string, unknown>;
  const texto = (key: string, max: number) => {
    if (typeof entrada[key] !== "string") throw new Error("Completa todos los campos del formulario.");
    const value = (entrada[key] as string).trim();
    if (!value || value.length > max) throw new Error(`Revisa el campo ${key}.`);
    return value;
  };
  const id = texto("id", 36);
  if (!/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)) throw new Error("Identificador de solicitud inválido.");
  const nombre = texto("nombre", 100), email = texto("correo", 120).toLowerCase(), telefono = texto("telefono", 20);
  const servicio = texto("servicio", 30), mensaje = texto("mensaje", 2000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n]/.test(nombre)) throw new Error("Revisa el nombre y el correo.");
  if (!isValidChileanPhone(telefono)) throw new Error("Ingresa un teléfono chileno válido.");
  if (!SERVICIOS_CONTACTO.includes(servicio)) throw new Error("Selecciona un servicio válido.");
  return { id, nombre, email, telefono, servicio, mensaje };
}
