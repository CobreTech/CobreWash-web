# Política propuesta de conservación y supresión

Estado: pendiente de aprobación del cliente. Arts. 3 y 7. La Ley 21.719 no fija
un plazo universal de 90 días, 12 meses, 3 años o 6 años para estas categorías.
Las propuestas siguientes no autorizan una purga de producción.

| Categoría | Propuesta o criterio | Decisión y ejecución pendientes |
|---|---|---|
| Perfil y Auth | Mientras exista servicio/necesidad acreditada; revisar inactividad | Aprobar criterios, avisos, cierre, revocación de sesiones, desvinculación y supresión |
| Contacto sin contratación | 90 días desde resolución/última interacción relevante | No aplicar a casos abiertos o reclamaciones; validar y eliminar copias externas |
| Pedidos/comprobantes | Separar información operacional de documentos sujetos a obligaciones | Asesor contable debe identificar norma, documento, cómputo y plazo; no conservar todo pedido por una regla genérica de seis años |
| Fotos/flota | Propuesta de 12 meses desde cierre del viaje | Balance y reclamaciones; conciliar objeto Storage, miniaturas y fila; no liberar reservas con objeto incierto |
| Expediente de derechos | Necesidad de atención y prueba de cumplimiento | Aprobar plazo motivado; tres años no es aquí un mandato universal |
| Contadores técnicos | 48 horas desde creación | El script existente solo purga contadores vencidos; verificar y programar su ejecución |
| Logs | Mínimo necesario para seguridad/diagnóstico | Proveedor, acceso, duración efectiva; evitar cuerpos, tokens, correos y RUT |
| Respaldos/móvil | Ciclo separado, limitado y documentado | Cifrado, caducidad, acceso, eliminación local y reaplicación de supresiones al restaurar |

## Excepciones y ejecución

Una obligación legal, litigio o defensa de reclamación requiere registrar datos,
causa/norma, autorización, inicio y revisión. Segregar solo lo necesario, sin
reutilización comercial. Informar fundamento y alcance al titular.

1. Localizar fuentes y verificar identidad/representación de forma proporcional.
   Un bloqueo urgente no puede esperar al ciclo de purga.
2. Vista previa acotada: conteos, causa, dependencias, reservas y excepciones.
3. Aprobación del lote y ejecución por personal autorizado con privilegios mínimos.
4. Transacciones cuando corresponda; conciliar fallos Storage/base de datos antes
   de marcar completado. Verificar borrado, anonimización efectiva o segregación.
5. Comunicar rectificación/supresión/oposición a destinatarios cuando corresponda.
6. Mantener evidencia mínima y aplicar exclusiones tras restaurar, antes de volver
   a servicio. Un hash identificable no equivale a anonimización irreversible.

`scripts/privacidad-retencion.mjs` solo opera sobre contadores. No están declaradas
ni programadas purgas de cuentas, pedidos, fotografías o expedientes. No ejecutar
operaciones reales sin política y revisión del lote aprobadas.
