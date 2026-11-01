import { expect, it } from "vitest";
import { evaluarNotificacionIncidente } from "./incidentes";
const base = { vulneracionDatosPersonales: true, riesgoRazonable: true, datosSensibles: false, menoresDe14: false, obligacionesEconomicasFinancierasBancariasComerciales: false };
it("no limita el reporte a exfiltraciones ni importa el plazo de 72 horas del RGPD", () => {
  expect(evaluarNotificacionIncidente(base).agencia).toBe("sin_dilaciones_indebidas");
  expect(evaluarNotificacionIncidente({ ...base, riesgoRazonable: null }).agencia).toBe("evaluacion_urgente");
});
it.each(["datosSensibles", "menoresDe14", "obligacionesEconomicasFinancierasBancariasComerciales"] as const)("activa comunicación individual en la categoría %s", categoria => {
  expect(evaluarNotificacionIncidente({ ...base, [categoria]: true }).titulares).toBe("comunicacion_individual");
});
