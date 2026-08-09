import { describe, expect, it } from "vitest";
import { mapAuthError } from "@/lib/firebase/errors";

describe("mapAuthError", () => {
  it.each([
    ["auth/email-already-in-use", "Ya existe una cuenta registrada con este correo."],
    ["auth/invalid-email", "El correo electrónico no es válido."],
    ["auth/weak-password", "La contraseña es demasiado débil."],
    ["auth/invalid-credential", "Correo o contraseña incorrectos."],
    ["auth/user-disabled", "Esta cuenta se encuentra inactiva. Contacta a un administrador."],
    ["auth/too-many-requests", "Demasiados intentos. Intenta nuevamente más tarde."],
  ])("traduce %s a un mensaje seguro", (code, message) => {
    expect(mapAuthError({ code })).toBe(message);
  });

  it("no expone detalles de errores desconocidos", () => {
    expect(mapAuthError(new Error("credenciales internas"))).toBe(
      "Ocurrió un error inesperado. Intenta nuevamente.",
    );
  });
});
