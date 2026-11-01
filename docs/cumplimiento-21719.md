# Adecuación a la Ley 21.719

Revisión: 1/11/2026. Estado: preparación local en `test`; **cumplimiento integral
pendiente de implantación, decisiones y evidencia del cliente**. Sin despliegue.

Se revisó el PDF entregado por el usuario (56 páginas, generado el 1/11/2026,
versión con vigencia diferida al 1/12/2026, modificación Ley 21.806 de 5/2/2026).
Se contrastó con https://www.bcn.cl/leychile/Navegar/imprimir?idNorma=1209272.
Los artículos siguientes son de la Ley 19.628 según su reforma por la Ley 21.719.
Hasta su vigencia se mantiene el régimen actualmente aplicable: los objetivos
internos de atención de 24/48 horas no se sustituyen por el plazo futuro de 30 días.

Las reglas de órganos públicos y competencias, procedimientos y registros de la
Agencia no se implementan como funciones de esta lavandería privada. Sí se deben
atender sus instrucciones, reclamaciones y fiscalizaciones aplicables y preservar
la evidencia correspondiente. Si cambia el rol o actividad del negocio, revisar
esa aplicabilidad; no se presume una excepción general al régimen de protección.

## Matriz de obligaciones

| Artículos / control | Preparado en el proyecto | Evidencia o actuación pendiente |
|---|---|---|
| 1, 1 bis, 2, 3, 14 / responsable y alcance | RAT y distinción de roles | Identidad legal y tratamientos fuera del software |
| 3 / finalidad, calidad, proporcionalidad | Formularios acotados, teléfono opcional, fotos sin EXIF, seguimiento sin identidad ni importes | Justificación de RUT y campos laborales; datos históricos |
| 12 y 13 / licitud | Autorizaciones versionadas y fechadas | Base por finalidad, no mezclar contrato y consentimiento sin distinguirlos |
| 14 ter / transparencia | Aviso con fuentes, fines, canales y límites | Aprobar identidad, conservación, destinatarios y transferencias |
| 5, 10, 11 / acceso | Canal sin cuenta y JSON del perfil propio verificado | Entregar datos íntegros de todas las fuentes, origen, fines, destinatarios y plazo |
| 6 / rectificación | Expediente de gestión | Aplicar corrección y comunicarla a destinatarios; evitar restaurar datos obsoletos |
| 7 / supresión | Recepción y cierre con evidencia | Aplicar borrado/anonimización, excepciones y copias; no equivale a desactivar una cuenta |
| 8 y 12 / oposición y revocación | Canal gratuito, sin suscripción comercial | Detener tratamiento afectado y motivar fundamento distinto si subsiste |
| 8 bis / decisiones automatizadas | No se identificaron perfiles decisorios en el alcance revisado | Confirmar procesos externos; revisión e intervención humana si se incorporan |
| 8 ter y 11 / bloqueo | Prioridad urgente y advertencia administrativa | Suspender tratamiento requerido mientras se resuelve; decidir y acreditar oportunamente |
| 9 / portabilidad | JSON acotado y canal para solicitud completa | Requisitos legales, datos facilitados y transmisión directa si es técnicamente posible |
| 10 y 11 / procedimiento | Comprobante privado, actor autenticado, revisión concurrente, cierre con resultado y ejecución | Titular/suplente, respuesta íntegra y entrega, prórroga única y reclamación |
| 14 bis / confidencialidad | Roles y autorización actual | Compromisos, capacitación y bajas de personal y proveedores |
| 14 quáter y quinquies / seguridad | Controles y regresiones aisladas | IAM/MFA, respaldos, restauración, alertas y evaluación periódica operativas |
| 14 sexies / brechas | Protocolo y evaluación local | Contactos atendidos, reporte sin dilaciones indebidas y comunicación de categorías legales |
| 14 septies / estándares | Lista de revisión | Tamaño/volumen y nuevas instrucciones de la Agencia; pyme no implica exención |
| 15 y 15 bis / cesión y encargados | Inventario y pauta contractual | Contratos efectivos, subencargados, devolución/supresión, comunicaciones |
| 15 ter / impacto | Evaluación inicial y criterios de activación | Volumen real y EIPD previa cuando corresponda |
| 16 a 16 sexies / datos especiales | Advertencias, minimización y ausencia de permiso de ubicación en funciones revisadas | Confirmar salud, menores, biometría, geolocalización y procesos externos |
| 27 a 29 / transferencias | Inventario sin presumir residencia en Chile | Países, mecanismo válido, garantías, contratos y subprocesadores |
| 48 / prevención | Plan y evidencias técnicas | Procedimientos implantados, responsables y capacitación |
| 49 a 53 / modelo, delegado y certificación | Evaluación de adopción | Son voluntarios en este régimen; decisión formal y certificación solo si realmente se obtiene |

La bandeja registra la gestión; no ejecuta por sí sola bloqueos, borrados,
rectificaciones ni correos. El expediente y la actuación por personal autorizado
son parte del procedimiento. La descarga del perfil no acredita una respuesta de
acceso completa ni entrega todo el inventario de datos personales.

## Entregables y puesta en marcha

- [RAT](ley-21719-rat.md), [conservación](politica-retencion.md) y
  [brechas](protocolo-brechas.md).
- [Procedimiento de derechos](procedimiento-derechos.md).
- [Proveedores, riesgos y continuidad](proveedores-riesgos-21719.md).
- [Antecedentes para pedir al cliente](solicitud-cliente-21719.md).
- [Infraestructura documentada](infraestructura-datos-21719.md) y
  [comprobaciones internas](validaciones-operativas-21719.md). La solicitud de
  identificación al cliente queda limitada a razón social, RUT, domicilio y
  representante. Storage en Chile y Vercel en Brasil fueron confirmados por el usuario.
- `cumplimiento-21719.json`: registro de controles pendientes y evidencia.

Solicitar los antecedentes, aprobar bases/plazos/contratos y asignar responsables.
Guardar evidencias reales en un expediente restringido, nunca datos de titulares
en Git. Después revisar el aviso `2026-11-01`, completar `LEGAL_*` y obtener su
aprobación antes de configurar `LEGAL_AVISO_APROBADO_VERSION=2026-11-01`.
Conservar la versión previa del aviso y condiciones mostradas al autorizar.

Implantar canal atendido, suplencia, bloqueo, conservación, respaldos, alertas y
simulacro. No activar purgas con plazos sin aprobar. Revisar instrucciones vigentes
de la Agencia y vigencia normativa antes de publicar coordinadamente web,
conectores y app móvil. No se compiló Android en esta tarea; la revisión de sus
avisos y conectores no acredita el comportamiento completo del móvil.

El verificador de preparación devuelve código 2 mientras existan controles
obligatorios pendientes. Completar un JSON no sustituye evidencia ni certifica
cumplimiento jurídico.

## Validación técnica de esta revisión

En el entorno aislado documentado: 313 pruebas unitarias en 59 archivos,
TypeScript y ESLint sin errores, 13 escenarios de portal y 9 de privacidad
aprobados. El emulador compiló los conectores y verificó la versión actualizada
del aviso. El verificador declaró correctamente 24 controles obligatorios
pendientes de evidencia, sin convertir los resultados técnicos en aprobación legal.
No se modificaron datos desplegados ni se enviaron comunicaciones a terceros.
