import { describe, expect, it } from "vitest";
import { etapaActualProduccion, normalizarEtapas, progresoProduccion, estadoEtapa, fechaProduccion, type EtapaPersistida } from "./modelo";

const etapa = (overrides: Partial<EtapaPersistida> = {}): EtapaPersistida => ({
  etapaId: "lavado", nombreEtapa: "Lavado original", ordenEtapa: 2,
  descripcionEtapa: null, tiempoEstimadoMin: null, estado: "PENDIENTE",
  etapa: { nombre: "Nuevo nombre", orden: 5, descripcion: "Nueva descripción", tiempoEstimadoMin: 90 },
  ...overrides,
});

describe("flujo persistido", () => {
  it("muestra la autoría real y conserva vacíos los datos históricos desconocidos", () => {
    const registro = normalizarEtapas([etapa({ estado: "COMPLETADA", fechaCompletado: "2026-09-07T15:30:00Z", operario: { id: "op", nombre: "Ana", apellido: "Pérez" } })])[0];
    expect(registro.responsable).toBe("Ana Pérez");
    expect(registro.fechaCompletado).toBe("2026-09-07T15:30:00Z");
    expect(normalizarEtapas([etapa({ estado: "COMPLETADA" })])[0]).toMatchObject({ fechaCompletado: null, responsable: null });
  });
  it("presenta la hora de Santiago con sus cambios de horario", () => {
    expect(fechaProduccion("2026-09-05T15:30:00Z")).toContain("11:30:00");
    expect(fechaProduccion("2026-09-07T15:30:00Z")).toContain("12:30:00");
    expect(fechaProduccion(null)).toBe("Sin registro");
  });
  it("mantiene la configuración original, incluidos valores opcionales vacíos", () => {
    expect(normalizarEtapas([etapa()])[0]).toMatchObject({
      nombre: "Lavado original", orden: 2, descripcion: null, tiempoEstimadoMin: null,
    });
  });
  it("ordena por la copia de cada etapa y calcula progreso por etapas completadas", () => {
    const etapas = normalizarEtapas([etapa(), etapa({ etapaId: "recepcion", ordenEtapa: 1, estado: "COMPLETADA" })]);
    expect(etapas[0].id).toBe("recepcion");
    expect(progresoProduccion(etapas)).toBe(50);
    expect(etapaActualProduccion(etapas)?.id).toBe("lavado");
    expect(estadoEtapa(etapas)).toBe("Lavado original");
  });
  it("no inventa progreso para comandas sin etapas o pendientes", () => {
    expect(progresoProduccion([])).toBe(0);
    expect(progresoProduccion(normalizarEtapas([etapa()]))).toBe(0);
  });
  it("lee el catálogo solo para asociaciones anteriores sin snapshot", () => {
    expect(normalizarEtapas([etapa({ nombreEtapa: null, ordenEtapa: null })])[0]).toMatchObject({ nombre: "Nuevo nombre", orden: 5 });
  });
  it("cierra el flujo cuando todas las etapas están completadas", () => {
    const etapas = normalizarEtapas([etapa({ estado: "COMPLETADA" })]);
    expect(etapaActualProduccion(etapas)).toBeNull();
    expect(estadoEtapa(etapas)).toBe("Flujo completado");
  });
});
