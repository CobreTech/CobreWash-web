// Art. 14 sexies: apoyo a la evaluación humana, sin enviar notificaciones.
export function evaluarNotificacionIncidente(datos: {
  vulneracionDatosPersonales: boolean | null;
  riesgoRazonable: boolean | null;
  datosSensibles: boolean;
  menoresDe14: boolean;
  obligacionesEconomicasFinancierasBancariasComerciales: boolean;
}) {
  if (datos.vulneracionDatosPersonales === false) return { agencia: "no_aplica", titulares: "no_aplica" } as const;
  if (datos.vulneracionDatosPersonales === null || datos.riesgoRazonable === null) return { agencia: "evaluacion_urgente", titulares: "evaluacion_urgente" } as const;
  if (!datos.riesgoRazonable) return { agencia: "documentar_no_reporte", titulares: "evaluar_comunicacion" } as const;
  return {
    agencia: "sin_dilaciones_indebidas",
    titulares: datos.datosSensibles || datos.menoresDe14 || datos.obligacionesEconomicasFinancierasBancariasComerciales
      ? "comunicacion_individual" : "evaluar_comunicacion",
  } as const;
}
