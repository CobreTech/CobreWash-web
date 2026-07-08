import type { AuthError } from "firebase/auth";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use": "Ya existe una cuenta registrada con este correo.",
  "auth/invalid-email": "El correo electrónico no es válido.",
  "auth/weak-password": "La contraseña es demasiado débil.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/user-not-found": "Correo o contraseña incorrectos.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/too-many-requests": "Demasiados intentos. Intenta nuevamente más tarde.",
};

export function mapAuthError(error: unknown): string {
  const code = (error as AuthError)?.code;
  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];
  return "Ocurrió un error inesperado. Intenta nuevamente.";
}
