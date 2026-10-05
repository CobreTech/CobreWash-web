import { beforeEach, describe, expect, it, vi } from "vitest";
import { validarAviso } from "./modelo";

const mocks = vi.hoisted(() => ({ crear: vi.fn(), roles: vi.fn(), dc: {} }));
vi.mock("@/src/dataconnect-generated", () => ({ crearAviso: mocks.crear, getRoles: mocks.roles }));
vi.mock("@/lib/firebase/client", () => ({ dataConnect: mocks.dc }));
import { publicarAviso } from "./publicar";

beforeEach(() => {
  mocks.crear.mockReset().mockResolvedValue({ data: { aviso_insert: { id: "aviso" } } });
  mocks.roles.mockReset().mockResolvedValue({ data: { rols: [
    { id: "rol-operario", nombre: "operario" },
    { id: "rol-recepcion", nombre: "recepcionista" },
  ] } });
});

describe("publicación de avisos", () => {
  it("normaliza el texto y publica para todos sin asignar un rol", async () => {
    await publicarAviso({ titulo: "  Turnos  ", contenido: "  Nuevo horario  ", destinatario: "todos" });
    expect(mocks.crear).toHaveBeenCalledWith(mocks.dc, {
      titulo: "Turnos", contenido: "Nuevo horario", rolDestinatarioId: null,
    });
    expect(mocks.roles).not.toHaveBeenCalled();
  });
  it.each([["operario", "rol-operario"], ["recepcionista", "rol-recepcion"]])("resuelve el rol %s con el catálogo real", async (destinatario, id) => {
    await publicarAviso({ titulo: "Turnos", contenido: "Nuevo horario", destinatario });
    expect(mocks.crear).toHaveBeenCalledWith(mocks.dc, { titulo: "Turnos", contenido: "Nuevo horario", rolDestinatarioId: id });
  });
  it.each([
    { titulo: " \n ", contenido: "Mensaje", destinatario: "todos" },
    { titulo: "Aviso", contenido: " \t ", destinatario: "todos" },
    { titulo: "x".repeat(121), contenido: "Mensaje", destinatario: "todos" },
    { titulo: "Aviso", contenido: "x".repeat(1001), destinatario: "todos" },
    { titulo: "Aviso", contenido: "Mensaje", destinatario: "cliente" },
  ])("rechaza un formulario inválido antes de enviar", async (form) => {
    await expect(publicarAviso(form)).rejects.toThrow();
    expect(mocks.crear).not.toHaveBeenCalled();
    expect(mocks.roles).not.toHaveBeenCalled();
  });
  it("acepta los límites del esquema", () => {
    expect(validarAviso({ titulo: "x".repeat(120), contenido: "x".repeat(1000), destinatario: "todos" })).toBeDefined();
  });
  it("no convierte un rol inexistente en un aviso para todos", async () => {
    mocks.roles.mockResolvedValue({ data: { rols: [] } });
    await expect(publicarAviso({ titulo: "Aviso", contenido: "Mensaje", destinatario: "operario" })).rejects.toThrow(/no está configurado/);
    expect(mocks.crear).not.toHaveBeenCalled();
  });
  it("propaga el rechazo del servidor", async () => {
    mocks.crear.mockRejectedValue(new Error("sin permisos"));
    await expect(publicarAviso({ titulo: "Aviso", contenido: "Mensaje", destinatario: "todos" })).rejects.toThrow("sin permisos");
  });
});
