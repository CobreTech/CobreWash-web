import type { TipoCliente } from "@/src/dataconnect-generated";
import { isValidRut, validatePassword } from "@/lib/validators";

export interface ClientRegistrationInput {
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  email: string;
  direccion: string;
  tipoCliente: TipoCliente | "";
  password: string;
}

export interface PublicClientRegistrationInput extends ClientRegistrationInput {
  confirmPassword: string;
}

export interface ManagedUserRegistrationInput extends ClientRegistrationInput {
  rolId: string;
}

export function validateLogin(email: string, password: string): string | null {
  if (!email.trim() || !password.trim()) {
    return "Por favor ingresa tu correo y contraseña.";
  }
  return null;
}

export function validatePasswordReset(email: string): string | null {
  if (!email.trim()) return "Por favor ingresa tu correo electrónico.";
  return null;
}

export function validatePublicClientRegistration(
  input: PublicClientRegistrationInput,
): string | null {
  if (
    !input.nombre.trim() ||
    !input.apellido.trim() ||
    !input.rut.trim() ||
    !input.email.trim() ||
    !input.password.trim() ||
    !input.confirmPassword.trim()
  ) {
    return "Todos los campos son obligatorios.";
  }
  if (!input.tipoCliente) return "Selecciona el tipo de cliente.";
  if (!isValidRut(input.rut)) return "El RUT ingresado no es válido.";

  const passwordCheck = validatePassword(input.password);
  if (!passwordCheck.valid) return passwordCheck.message;
  if (input.password !== input.confirmPassword) return "Las contraseñas no coinciden.";

  return null;
}

export function validateManagedUserRegistration(
  input: ManagedUserRegistrationInput,
  roleName: string | undefined,
): string | null {
  if (
    !input.rolId ||
    !input.nombre.trim() ||
    !input.apellido.trim() ||
    !input.rut.trim() ||
    !input.email.trim() ||
    !input.password.trim()
  ) {
    return "Todos los campos son obligatorios.";
  }
  if (!isValidRut(input.rut)) return "El RUT ingresado no es válido.";

  const passwordCheck = validatePassword(input.password);
  if (!passwordCheck.valid) return passwordCheck.message;
  if (roleName === "cliente" && !input.tipoCliente) return "Selecciona el tipo de cliente.";

  return null;
}

export function validateManagedUserUpdate(roleId: string, name: string): string | null {
  if (!roleId || !name.trim()) return "El rol y el nombre son obligatorios.";
  return null;
}
