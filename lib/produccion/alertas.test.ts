import { describe, expect, it } from "vitest";
import { alertaComanda, detectarAlertas, estaEtapaAtrasada, minutosExcedidos, type ComandaAlerta } from "./alertas";

const ahora = Date.parse("2026-09-21T12:00:00Z");

describe("alertas de producción", () => {
  it("usa la recepción como inicio de la primera etapa", () => {
    const datos = { estado: "PENDIENTE", orden: 1, fechaRecepcion: "2026-09-21T10:00:00Z", tiempoEstimadoMin: 60 };
    expect(estaEtapaAtrasada(datos, ahora)).toBe(true);
    expect(minutosExcedidos(datos, ahora)).toBe(60);
  });

  it("detecta atraso desde el inicio de una etapa posterior", () => {
    const datos = { estado: "EN_PROCESO", orden: 2, fechaRecepcion: "2026-09-21T08:00:00Z", fechaInicio: "2026-09-21T11:00:00Z", tiempoEstimadoMin: 30 };
    expect(estaEtapaAtrasada(datos, ahora)).toBe(true);
    expect(minutosExcedidos(datos, ahora)).toBe(30);
  });

  it("no alerta etapas sin estimación, sin inicio o aún dentro del plazo", () => {
    expect(estaEtapaAtrasada({ estado: "EN_PROCESO", orden: 2, fechaRecepcion: "2026-09-21T08:00:00Z" }, ahora)).toBe(false);
    expect(estaEtapaAtrasada({ estado: "PENDIENTE", orden: 3, fechaRecepcion: "2026-09-21T08:00:00Z", tiempoEstimadoMin: 10 }, ahora)).toBe(false);
    expect(estaEtapaAtrasada({ estado: "EN_PROCESO", orden: 2, fechaRecepcion: "2026-09-21T08:00:00Z", fechaInicio: "2026-09-21T11:45:00Z", tiempoEstimadoMin: 30 }, ahora)).toBe(false);
  });
  it("no marca recepción completada ni fechas inválidas y respeta el instante límite", () => {
    const base = { estado: "PENDIENTE", orden: 1, fechaRecepcion: "2026-09-21T11:00:00Z", tiempoEstimadoMin: 60 };
    expect(estaEtapaAtrasada(base, ahora)).toBe(false);
    expect(estaEtapaAtrasada(base, ahora + 1)).toBe(true);
    expect(minutosExcedidos(base, ahora + 1)).toBe(1);
    for (const estado of ["COMPLETADA", "DESCONOCIDA"]) {
      expect(estaEtapaAtrasada({ ...base, estado }, ahora + 60_000)).toBe(false);
      expect(minutosExcedidos({ ...base, estado }, ahora + 60_000)).toBe(0);
    }
    expect(estaEtapaAtrasada({ ...base, fechaRecepcion: "inválida" }, ahora)).toBe(false);
    expect(minutosExcedidos({ ...base, fechaRecepcion: "inválida" }, ahora)).toBe(0);
  });
});

const comanda = (cambios: Partial<ComandaAlerta> = {}): ComandaAlerta => ({
  id: "c1", numeroComanda: "ELCOBRE-1234", estado: "EN_PROCESO", fechaRecepcion: "2026-09-21T08:00:00Z",
  comandaEtapas_on_comanda: [
    { etapaId: "recepcion", nombreEtapa: "Recepción", ordenEtapa: 1, estado: "COMPLETADA", tiempoEstimadoMin: 15, etapa: { nombre: "Recepción", orden: 1 } },
    { etapaId: "lavado", nombreEtapa: "Lavado original", ordenEtapa: 2, estado: "EN_PROCESO", fechaInicio: "2026-09-21T10:00:00Z", tiempoEstimadoMin: 30, asignadoA: { nombre: "Ana", apellido: "Pérez" }, etapa: { nombre: "Lavado nuevo", orden: 2, tiempoEstimadoMin: 240 } },
    { etapaId: "secado", ordenEtapa: 3, estado: "PENDIENTE", tiempoEstimadoMin: 1, etapa: { nombre: "Secado", orden: 3 } },
  ], ...cambios,
});
describe("alertas por comanda", () => {
  it("usa la primera etapa incompleta ordenada y respeta la copia guardada", () => {
    const c = comanda(); c.comandaEtapas_on_comanda.reverse();
    expect(alertaComanda(c, ahora)).toMatchObject({ etapa: "Lavado original", esperadoMin: 30, excedidoMin: 90, responsable: "Ana Pérez" });
    const link = new URL(alertaComanda(c, ahora)!.href, "https://example.test");
    expect(link.searchParams.get("buscar")).toBe(c.numeroComanda);
    expect(link.searchParams.get("comanda")).toBe(c.id);
  });
  it("aplica el valor inicial a copias antiguas sin tiempo, sin heredar ajustes posteriores", () => {
    const c = comanda(); c.comandaEtapas_on_comanda[1].tiempoEstimadoMin = null;
    expect(alertaComanda(c, ahora)).toMatchObject({ esperadoMin: 90, excedidoMin: 30 });
  });
  it("usa catálogo únicamente cuando no hay snapshot", () => {
    const c = comanda(); c.comandaEtapas_on_comanda[1].nombreEtapa = null;
    expect(alertaComanda(c, ahora)).toBeNull();
  });
  it("no alerta etapas pendientes futuras ni comandas sin etapas, entregadas o anuladas", () => {
    for (const estado of ["ENTREGADA", "ANULADA"]) expect(alertaComanda(comanda({ estado }), ahora)).toBeNull();
    expect(alertaComanda(comanda({ comandaEtapas_on_comanda: [] }), ahora)).toBeNull();
    const c = comanda(); c.comandaEtapas_on_comanda[1].estado = "PENDIENTE";
    expect(alertaComanda(c, ahora)).toBeNull();
  });
  it("incluye la espera de entrega y ordena por mayor exceso", () => {
    const c = comanda({ id: "c2", estado: "FINALIZADA", comandaEtapas_on_comanda: [{ etapaId: "entrega", ordenEtapa: 5, nombreEtapa: "Entrega", estado: "EN_PROCESO", fechaInicio: "2026-09-20T10:00:00Z", etapa: { nombre: "Entrega", orden: 5 } }] });
    expect(alertaComanda(c, ahora)).toMatchObject({ esperadoMin: 1440, excedidoMin: 120 });
    expect(detectarAlertas([comanda(), c], ahora).map((a) => a.comandaId)).toEqual(["c2", "c1"]);
  });
});
