import { describe, expect, it } from "vitest";
import {
  cleanChileanPhone,
  cleanRut,
  formatChileanPhone,
  formatRut,
  getChileanPhoneType,
  isValidChileanPhone,
  isValidRut,
  validatePassword,
} from "@/lib/validators";

describe("RUT", () => {
  it("normaliza y formatea entradas con puntos, guion y dígito K", () => {
    expect(cleanRut(" 12.345.67k- ")).toBe("1234567K");
    expect(formatRut("123456785")).toBe("12.345.678-5");
    expect(formatRut("6.831.384-k")).toBe("6.831.384-K");
  });

  it("acepta RUT válidos independientemente del formato", () => {
    expect(isValidRut("12.345.678-5")).toBe(true);
    expect(isValidRut("6k")).toBe(true);
  });

  it("rechaza RUT con dígito verificador incorrecto o cuerpo inválido", () => {
    expect(isValidRut("12.345.678-9")).toBe(false);
    expect(isValidRut("K-K")).toBe(false);
    expect(isValidRut("5")).toBe(false);
  });
});

describe("contraseña", () => {
  it.each([
    ["abc1", "Mínimo 6 caracteres"],
    ["123456", "Debe incluir al menos una letra"],
    ["abcdef", "Debe incluir al menos un número"],
  ])("rechaza %s con el mensaje de negocio correspondiente", (password, message) => {
    expect(validatePassword(password)).toEqual({ valid: false, message });
  });

  it("acepta una contraseña con seis o más caracteres, letras y números", () => {
    expect(validatePassword("clave1")).toEqual({
      valid: true,
      message: "Contraseña válida",
    });
  });
});

describe("teléfono chileno", () => {
  it("normaliza y formatea celulares con o sin código de país", () => {
    expect(cleanChileanPhone("+56 9 8765 4321")).toBe("987654321");
    expect(formatChileanPhone("987654321")).toBe("+56 9 8765 4321");
    expect(getChileanPhoneType("+56 9 8765 4321")).toBe("Celular");
  });

  it("formatea teléfonos fijos de Santiago y regiones", () => {
    expect(formatChileanPhone("223456789")).toBe("+56 2 2345 6789");
    expect(formatChileanPhone("552345678")).toBe("+56 55 234 5678");
    expect(getChileanPhoneType("+56 55 234 5678")).toBe("Teléfono fijo");
  });

  it("rechaza números incompletos y códigos de área inexistentes", () => {
    expect(isValidChileanPhone("+56 9 1234")).toBe(false);
    expect(isValidChileanPhone("+56 88 123 4567")).toBe(false);
    expect(isValidChileanPhone("+56 41 234 5678")).toBe(true);
  });
});
