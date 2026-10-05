import { describe, expect, it } from "vitest";
import { esRolInterno, rutaPermitida, NAV_POR_ROL } from "@/lib/roles";

describe("autorización por rol", () => {
  it("permite consultar avisos a ambos equipos desde la navegación y la ruta", () => {
    for (const rol of ["admin", "operario", "recepcionista"] as const) {
      expect(rutaPermitida(rol, "/intranet/comunicacion")).toBe(true);
      expect(NAV_POR_ROL[rol].some(item => item.href === "/intranet/comunicacion")).toBe(true);
    }
    expect(rutaPermitida("cliente", "/intranet/comunicacion")).toBe(false);
  });
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
