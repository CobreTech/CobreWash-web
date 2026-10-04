import { describe, expect, it, vi, afterEach } from "vitest";
import { crearUrlSeguimiento, normalizarNumeroComanda, obtenerEnlaceSeguimiento } from "./qr";

const uuid = "12345678-1234-4234-8234-123456789abc";
const dominio = "https://lavanderia-elcobre.vercel.app";
afterEach(() => vi.unstubAllEnvs());

describe("contrato QR", () => {
  it("usa solo el dominio configurado y el UUID persistido", () => {
    expect(crearUrlSeguimiento(uuid, dominio)).toBe(`${dominio}/seguimiento?qr=${uuid}`);
    expect(crearUrlSeguimiento(uuid.replaceAll("-", ""), dominio + "/")).toBe(crearUrlSeguimiento(uuid, dominio));
  });
  it.each(["", "http://example.com", "https://example.com/preview", "https://example.com/?x=1", "https://example.com/#qr", "https://user:secret@example.com", "dominio-invalido"])("rechaza origen inválido %s", (base) => {
    expect(() => crearUrlSeguimiento(uuid, base)).toThrow();
  });
  it.each([undefined, "", "ELCOBRE-14r3", "invalid-uuid"])("no emite QR para código %s", (codigo) => {
    expect(() => crearUrlSeguimiento(codigo, dominio)).toThrow();
  });
  it("bloquea emisión si falta la variable sin elegir un dominio alternativo", () => {
    vi.stubEnv("NEXT_PUBLIC_SEGUIMIENTO_BASE_URL", "");
    expect(obtenerEnlaceSeguimiento(uuid).url).toBeNull();
    expect(obtenerEnlaceSeguimiento(uuid).error).toMatch(/dominio/);
  });
  it.each(["14R3", " ELCOBRE-14r3 ", "elcobre-14R3", "COBRE-14r3"])("admite el número público %s", (numero) => {
    expect(normalizarNumeroComanda(numero)).toBe("ELCOBRE-14r3");
  });
  it.each(["", "14", "14r3otro", "https://example.com", "%14r3"])("rechaza números inválidos %s", (numero) => {
    expect(() => normalizarNumeroComanda(numero)).toThrow();
  });
});
