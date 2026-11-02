import { describe, expect, it, vi, afterEach } from "vitest";
import { objetivoAtencion, validarGestionDerecho, validarSolicitudDerecho } from "./modelo";
import { configuracionLegal } from "./configuracion";
const solicitud = { id: "10000000-0000-4000-8000-000000000001", secreto: "a".repeat(64), nombre: " Ana ", email: " ANA@example.test ", derecho: "ACCESO" };
afterEach(() => vi.unstubAllEnvs());
describe("solicitudes de datos", () => {
  it("acceso no exige RUT, consentimiento comercial ni detalle", () => {
    expect(validarSolicitudDerecho(solicitud)).toMatchObject({ nombre: "Ana", email: "ana@example.test", detalle: "" });
  });
  it("exige fundamento en otros derechos y limita los campos", () => {
    for (const cambio of [{ derecho: "SUPRESION" }, { secreto: "a" }, { email: "sin-correo" }, { nombre: "x".repeat(161) }, { detalle: "x".repeat(3001) }, { derecho: "ADMIN" }]) expect(() => validarSolicitudDerecho({ ...solicitud, ...cambio })).toThrow();
  });
  it("no permite cerrar una petición sin verificación ni evidencia de respuesta", () => {
    const datos = { estado: "RESPONDIDA", nota: "Respuesta fundada" };
    expect(() => validarGestionDerecho(datos)).toThrow();
    expect(validarGestionDerecho({ ...datos, evidenciaIdentidad: "Verificación presencial, referencia 100", evidenciaEnvio: "Entrega presencial, 25/10/2026", resultado: "ACOGIDA", evidenciaEjecucion: "Copia entregada", comunicacionDestinatarios: "No procede: acceso" }).estado).toBe("RESPONDIDA");
    expect(() => validarGestionDerecho({ estado: "RECIBIDA", nota: "Reiniciar" })).toThrow();
  });
  it("prioriza bloqueo sin ampliar plazos por fines de semana", () => {
    const inicio = new Date("2026-10-24T12:00:00Z");
    expect(objetivoAtencion("BLOQUEO", inicio)).toBe("2026-10-25T12:00:00.000Z");
    expect(objetivoAtencion("ACCESO", inicio)).toBe("2026-10-26T12:00:00.000Z");
  });
  it("exige trazabilidad de ejecución y reclamación antes de cerrar con rechazo", () => {
    const base = { estado: "RESPONDIDA", nota: "Respuesta y fundamento", evidenciaIdentidad: "Identidad comprobada", evidenciaEnvio: "Mensaje entregado", resultado: "DENEGADA", evidenciaEjecucion: "Excepción legal documentada", comunicacionDestinatarios: "No hubo cambios comunicables" };
    expect(() => validarGestionDerecho(base)).toThrow(/reclamación/);
    const valida = validarGestionDerecho({ ...base, reclamacionInformada: true });
    expect(valida.nota).toContain("Resultado: DENEGADA");
    expect(valida.nota).toContain("Excepción legal documentada");
    expect(() => validarGestionDerecho({ ...base, reclamacionInformada: true, evidenciaEjecucion: "" })).toThrow();
    expect(() => validarGestionDerecho({ ...base, reclamacionInformada: true, nota: "x".repeat(4000) })).toThrow(/4000/);
  });
});
describe("publicación del aviso", () => {
  it("no publica si faltan datos aunque se marque aprobada la versión", () => {
    vi.stubEnv("LEGAL_RUT", ""); vi.stubEnv("LEGAL_AVISO_APROBADO_VERSION", "2026-11-01");
    expect(configuracionLegal().publicada).toBe(false);
  });
  it("exige identidad válida, condiciones y aprobación de la versión actual", () => {
    for (const [k,v] of Object.entries({ LEGAL_RAZON_SOCIAL: "Empresa de prueba", LEGAL_RUT: "12.345.678-5", LEGAL_DOMICILIO: "Domicilio de prueba", LEGAL_REPRESENTANTE: "Representante", LEGAL_EMAIL_DERECHOS: "privacidad@example.test", LEGAL_CONSERVACION: "Condiciones aprobadas de prueba", LEGAL_PROVEEDORES_TRANSFERENCIAS: "Condiciones de prueba", LEGAL_AVISO_APROBADO_VERSION: "2026-11-01" })) vi.stubEnv(k,v);
    expect(configuracionLegal().publicada).toBe(true);
    vi.stubEnv("LEGAL_EMAIL_DERECHOS", ""); expect(configuracionLegal().publicada).toBe(true);
    vi.stubEnv("LEGAL_EMAIL_DERECHOS", "no-es-correo"); expect(configuracionLegal().publicada).toBe(false);
    vi.stubEnv("LEGAL_EMAIL_DERECHOS", "");
    vi.stubEnv("LEGAL_AVISO_APROBADO_VERSION", "anterior"); expect(configuracionLegal().publicada).toBe(false);
  });
});
