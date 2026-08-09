import { describe, expect, it } from "vitest";
import {
  validateLogin,
  validateManagedUserRegistration,
  validateManagedUserUpdate,
  validatePasswordReset,
  validatePublicClientRegistration,
  type ClientRegistrationInput,
  type ManagedUserRegistrationInput,
  type PublicClientRegistrationInput,
} from "@/lib/auth-validation";

const validClient: ClientRegistrationInput = {
  nombre: " Ana ",
  apellido: " Pérez ",
  rut: "12.345.678-5",
  telefono: "",
  email: " ana@example.com ",
  direccion: "",
  tipoCliente: "PARTICULAR" as ClientRegistrationInput["tipoCliente"],
  password: "clave1",
};

describe("validación de acceso y recuperación", () => {
  it("exige correo y contraseña para iniciar sesión", () => {
    expect(validateLogin(" ", "clave1")).toBe("Por favor ingresa tu correo y contraseña.");
    expect(validateLogin("ana@example.com", "clave1")).toBeNull();
  });

  it("exige correo para recuperar contraseña", () => {
    expect(validatePasswordReset(" ")).toBe("Por favor ingresa tu correo electrónico.");
    expect(validatePasswordReset(" ana@example.com ")).toBeNull();
  });
});

describe("validación del registro público de clientes", () => {
  const validRegistration: PublicClientRegistrationInput = {
    ...validClient,
    confirmPassword: "clave1",
  };

  it("exige los datos personales y credenciales obligatorios", () => {
    expect(
      validatePublicClientRegistration({ ...validRegistration, apellido: " " }),
    ).toBe("Todos los campos son obligatorios.");
  });

  it("exige tipo de cliente, RUT válido, contraseña robusta y confirmación coincidente", () => {
    expect(
      validatePublicClientRegistration({ ...validRegistration, tipoCliente: "" }),
    ).toBe("Selecciona el tipo de cliente.");
    expect(
      validatePublicClientRegistration({ ...validRegistration, rut: "12.345.678-9" }),
    ).toBe("El RUT ingresado no es válido.");
    expect(
      validatePublicClientRegistration({ ...validRegistration, password: "abcdef", confirmPassword: "abcdef" }),
    ).toBe("Debe incluir al menos un número");
    expect(
      validatePublicClientRegistration({ ...validRegistration, confirmPassword: "otra1" }),
    ).toBe("Las contraseñas no coinciden.");
  });

  it("acepta un registro válido y deja teléfono/dirección como opcionales", () => {
    expect(validatePublicClientRegistration(validRegistration)).toBeNull();
  });
});

describe("validación de usuarios creados por administración", () => {
  const validManagedUser: ManagedUserRegistrationInput = {
    ...validClient,
    rolId: "rol-cliente",
  };

  it("exige tipo de cliente solo para el rol cliente", () => {
    expect(validateManagedUserRegistration({ ...validManagedUser, tipoCliente: "" }, "cliente")).toBe(
      "Selecciona el tipo de cliente.",
    );
    expect(validateManagedUserRegistration({ ...validManagedUser, tipoCliente: "" }, "operario")).toBeNull();
  });

  it("exige rol y nombre al editar una cuenta", () => {
    expect(validateManagedUserUpdate("", "Ana")).toBe("El rol y el nombre son obligatorios.");
    expect(validateManagedUserUpdate("rol-cliente", " ")).toBe("El rol y el nombre son obligatorios.");
    expect(validateManagedUserUpdate("rol-cliente", " Ana ")).toBeNull();
  });
});
