import { describe, expect, it } from "vitest";
import { esRolInterno, rutaPermitida } from "@/lib/roles";

describe("autorización por rol", () => {
  it("distingue clientes de roles internos", () => {
    expect(esRolInterno("admin")).toBe(true);
    expect(esRolInterno("recepcionista")).toBe(true);
    expect(esRolInterno("operario")).toBe(true);
    expect(esRolInterno("cliente")).toBe(false);
    expect(esRolInterno(undefined)).toBe(false);
  });

  it("aplica la ruta más específica también en rutas anidadas", () => {
    expect(rutaPermitida("admin", "/intranet/usuarios/editar")).toBe(true);
    expect(rutaPermitida("recepcionista", "/intranet/clientes/123")).toBe(true);
    expect(rutaPermitida("operario", "/intranet/clientes/123")).toBe(false);
  });

  it("deniega roles ausentes, clientes y rutas fuera de la intranet", () => {
    expect(rutaPermitida(undefined, "/intranet")).toBe(false);
    expect(rutaPermitida("cliente", "/intranet")).toBe(false);
    expect(rutaPermitida("admin", "/cuenta")).toBe(false);
  });
});
