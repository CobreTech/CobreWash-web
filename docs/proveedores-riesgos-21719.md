# Proveedores, riesgos y continuidad

Pendiente de validación operativa, 1/11/2026. No se presume que un plan pagado,
región del conector o contrato estándar pruebe cumplimiento o residencia en Chile.

## Registro de encargados y transferencias (arts. 15 bis y 27 a 29)

| Servicio identificado | Función/datos | Evidencia por obtener |
|---|---|---|
| Firebase Authentication / Google | Identidad, correo y autenticación; Google documenta tratamiento en EE. UU. | Entidad contractual, términos aplicables, soporte, subencargados, eliminación y exportación |
| Data Connect / PostgreSQL / Google | Fichas, pedidos, personal y derechos | Región efectiva (configuración menciona southamerica-west1), respaldos, IAM y países de acceso; no inferir ubicación de Auth/Storage |
| Firebase Storage / Google | Evidencias fotográficas; Chile según confirmación del usuario | Conservar evidencia de configuración; reglas, accesos, logs, copias, retención y eliminación conciliada |
| Vercel | Web/API; Brasil según confirmación del usuario; registros de peticiones | Conservar evidencia de configuración; logs, cachés, términos/DPA, subencargados, soporte y duración |
| Desarrollo, soporte y equipos del negocio | Acceso técnico/operacional | Rol responsable/encargado, instrucciones, confidencialidad, accesos y baja |
| Correo, mensajería, facturación y otros | Por inventariar con cliente | Destinatarios, contratos, países y finalidad; no asumir su ausencia |

Por contrato: objeto, duración, finalidad, tipos de datos, categorías de titulares,
derechos/obligaciones, instrucciones, seguridad, secreto, incidentes, colaboración
en derechos, devolución/supresión y subencargos autorizados por escrito. Registrar
versión aceptada, fecha y evidencia del contrato; no basta una URL genérica.

Por transferencia: país/organización, finalidad, categorías, destinatario,
mecanismo aplicable, garantías, acceso de soporte/subencargados y evidencia.
No dar por adecuada una jurisdicción sin decisión/base aplicable. Actualizar el
aviso cuando cambie el circuito. Revisar cesiones separadamente del encargo.

Detalle comprobado en los repositorios y límites de la inferencia:
[infraestructura-datos-21719.md](infraestructura-datos-21719.md). Los datos técnicos
conocidos se completan desde código y fuentes del proveedor; no se pide al cliente
que vuelva a describir la arquitectura. Las condiciones aceptadas y las opciones
de consola requieren verificación de quien administra las cuentas.

## Evaluación previa de impacto e interés legítimo

Art. 15 ter: evaluar antes de iniciar si hay probable alto riesgo; siempre revisar
decisiones automatizadas significativas, gran escala, monitoreo sistemático de
zona pública y datos sensibles/especialmente protegidos bajo excepciones al
consentimiento. El volumen real, las cámaras y los procesos externos son desconocidos.
No se declara innecesaria una EIPD solo porque el repositorio sea pequeño.

Ficha de evaluación: actividad/versión, necesidad, alternativas menos invasivas,
datos/población/volumen, flujo/países, probabilidad e impacto sobre personas,
medidas, riesgo residual, necesidad de EIPD, decisión motivada y responsable/fecha.
Revisar antes de biometría, ubicación, menores, datos de salud, marketing o IA.

Para interés legítimo: finalidad legítima concreta, necesidad, alternativas,
expectativas y derechos del titular, salvaguardas, oposición y balance aprobado.
Ejemplo candidato: fotos del estado del vehículo, sin rostros/EXIF; no autoriza
vigilancia indiscriminada de conductores ni consentimiento laboral forzado.

## Riesgos y comprobación operativa

| Riesgo | Medida y evidencia necesaria |
|---|---|
| Cuenta administrativa comprometida | MFA, mínimos privilegios, usuarios individuales, revocación y revisión periódica de accesos |
| Identidad falsa al ejercer derechos | Verificación proporcional, no confiar en RUT o comprobante de estado |
| Fotos/dispositivo perdido | Evitar personas/documentos, borrar temporales, bloqueo de equipo, revocar sesiones y comprobar cachés Android |
| QR compartido | Datos públicos mínimos; no exponer identidad/importes ni usar QR como identidad |
| Borrado inconsistente | Vista previa, excepciones, conciliación Storage/BD y evidencia de resultado |
| Restauración que pierde correcciones/bloqueos | Registro protegido de medidas vigentes y reaplicación antes de abrir el servicio |
| Logs o soporte que exponen datos | Minimización, secreto, accesos y conservación de proveedores |

## Continuidad (art. 14 quinquies)

Cliente debe aprobar RPO (pérdida admisible) y RTO (tiempo de recuperación), configurar
respaldos cifrados y accesos separados, probar restauración en un entorno sin
credenciales productivas y registrar integridad, tiempo real, incidencias y cierre.
La prueba debe cubrir base de datos, objetos, reglas/conectores y configuración
necesaria, sin guardar claves junto al respaldo. Revisar alertas y realizar
ejercicio de caída y pérdida de dispositivo. No consta evidencia de restauración
real por las pruebas unitarias o emuladores de esta tarea.

Arts. 48 a 53: implementar prevención y capacitación. El modelo, delegado y
certificación regulados allí son voluntarios; si se adoptan, designar por autoridad
competente, facultades, medios, independencia y reglas internas correspondientes.
No autodeclarar certificación. Registrar decisión de adopción y revisión normativa.
