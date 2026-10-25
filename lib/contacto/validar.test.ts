import { expect, it } from "vitest";
import { validarContacto } from "./validar";
const input = { autorizaDatos: true, versionPrivacidad: "2026-10-25", id: "10000000-0000-4000-8000-000000000001", nombre: " Ana ", correo: " ANA@example.test ", telefono: "+56912345678", servicio: "industrial", mensaje: " Cotizar ropa " };
it("normaliza la solicitud sin agregar campos privilegiados", () => {
  expect(validarContacto({ ...input, estado: "ATENDIDA" })).toEqual({ id: input.id, nombre: "Ana", email: "ana@example.test", telefono: input.telefono, servicio: "industrial", mensaje: "Cotizar ropa" });
});
it("rechaza campos extensos, email, teléfono y servicio inválidos", () => {
  for (const extra of [{ mensaje: "x".repeat(2001) }, { correo: "sin-correo" }, { telefono: "123" }, { servicio: "interno" }, { id: "no-uuid" }]) expect(() => validarContacto({ ...input, ...extra })).toThrow();
});
it("permite cotizar sin teléfono y exige autorización específica vigente", () => {
  expect(validarContacto({ ...input, telefono: "" }).telefono).toBe("");
  expect(() => validarContacto({ ...input, autorizaDatos: false })).toThrow();
  expect(() => validarContacto({ ...input, versionPrivacidad: "obsoleta" })).toThrow();
});
