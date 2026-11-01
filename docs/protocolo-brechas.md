# Gestión y reporte de vulneraciones de datos

Borrador operativo, 1/11/2026. Designar responsable/suplente, contacto de emergencia,
personal técnico y canales atendidos. No consta una designación de delegado,
alertas operativas ni reportes realizados.

## Decisión según art. 14 sexies

Reportar a la Agencia por los medios más expeditos y **sin dilaciones indebidas**
cuando una vulneración destruya, filtre, pierda o altere datos o permita comunicación
/acceso no autorizados y exista riesgo razonable para derechos y libertades.
No se limita a exfiltración ni exige daño efectivo. No esperar informe forense final.
No existe aquí el plazo general de 72 horas del RGPD: una meta interna no autoriza
una demora. Revisar las instrucciones vigentes y deberes adicionales de otras leyes.

Comunicar también a titulares cuando se trate de las categorías legales: datos
sensibles, menores de 14 años u obligaciones económicas, financieras, bancarias o
comerciales. Evaluar pedidos/importes, no solo contraseñas. Comunicación individual,
por representantes cuando corresponda; si no es posible, publicación en medio
masivo de alcance nacional según el artículo, justificando la imposibilidad.
No sustituir estos criterios por el umbral de alto riesgo del RGPD.

## Actuación

1. Abrir ID de incidente, registrar detección/conocimiento con zona horaria,
   fuente, hechos conocidos y sistemas. Escalar inmediatamente a titular y suplente.
2. Contener proporcionalmente: cerrar ruta afectada, limitar accesos y revocar
   sesiones/credenciales efectivamente comprometidas. La clave pública SDK Firebase
   no equivale a una clave privada de cuenta de servicio.
3. Preservar evidencia restringida, integridad y cadena de custodia. Nunca copiar
   secretos ni datos completos a Git, tickets públicos o chats abiertos.
4. Evaluar naturaleza, efectos, categorías, cantidad aproximada y riesgo. Lo
   desconocido requiere investigación urgente, no clasificación automática sin riesgo.
5. Decidir y registrar reporte/no reporte, criterio, autoridad, hora, destinatarios,
   contenido íntegro y constancia de envío. Completar antecedentes diligentemente;
   documentar demoras. Notificar no cierra el incidente.
6. Recuperar desde respaldo validado, comprobar integridad y accesos, reaplicar
   supresiones/bloqueos y verificar la causa antes de volver al servicio.
7. Registrar causa, mitigaciones, aprendizaje y comprobación posterior. Realizar
   simulacro y conservar resultados antes de declarar operativo el protocolo.

## Comunicación y bitácora

Agencia: identidad/contacto responsable, cronología, naturaleza, efectos, categorías,
número aproximado, medidas adoptadas y contra repetición, contacto para ampliaciones.
Titulares: lenguaje sencillo, datos afectados, consecuencias posibles y medidas de
solución/resguardo, recomendaciones pertinentes y canal atendido. Distinguir hechos
confirmados de investigación; no garantizar que contraseñas no fueron afectadas sin
análisis. Conservar cronología, responsables, decisiones, comunicaciones y recuperación.

Herramienta local: `node scripts/evaluar-incidente.mjs indicadores.json`, con:

```json
{
  "vulneracionDatosPersonales": null,
  "riesgoRazonable": null,
  "datosSensibles": false,
  "menoresDe14": false,
  "obligacionesEconomicasFinancierasBancariasComerciales": false
}
```

Solo orienta, no envía reportes ni acredita notificaciones. Mantener expediente
real fuera del repositorio. Verificar canal oficial antes de cualquier envío.

La plantilla reutilizable está en `docs/plantillas/indicadores-incidente.json`.
No sustituye los valores desconocidos por `false`: `null` exige evaluación urgente.
