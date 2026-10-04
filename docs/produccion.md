# RF17 · Flujo de producción

## QR compartido y seguimiento público

La web codifica `Comanda.codigoQr` en una URL HTTPS de seguimiento y conserva el
mismo código al editar, avanzar o reimprimir. El seguimiento público consulta
estado, fechas, servicios y etapas reales; la app Android debe resolver el QR con
`GetComandaOperativaPorQr`, que comprueba perfil activo y rol en el servidor.
El contrato y la guía para Android están en [qr-android.md](qr-android.md).

El 4 de octubre de 2026 se desplegó el conector `example` con las tres consultas
nuevas y la recuperación del QR por UUID. No se modificó el esquema ni se
crearon pedidos de prueba en producción. Se verificaron las consultas públicas
y el rechazo de acceso operativo sin sesión en el servicio desplegado.
La publicación web en Vercel requiere una sesión de su encargado y configurar
`NEXT_PUBLIC_SEGUIMIENTO_BASE_URL` antes de compilar. La implementación Android
y la prueba física de teléfono, tablet e impresora corresponden a su encargado.

## Creación y etapas

Una comanda se considera aprobada cuando se guarda correctamente. La web usa
`CrearComandaConFlujo` para insertar cabecera, prendas, cinco etapas e historial
en una transacción; el total se calcula en el servidor desde las prendas.
Todas las etapas comienzan pendientes. RF18 permite que administración y operarios
completen, en orden, Recepción, Lavado, Secado, Planchado y Entrega. RF19 y RF24
registran la fecha de finalización y el usuario autenticado que reporta cada avance.

El catálogo vive en `EtapaProduccion`. La asociación `ComandaEtapa` conserva
nombre, orden, descripción y tiempo estimado al crear el flujo. La configuración
administrativa se aplica a asociaciones futuras; no cambia las existentes.
La secuencia inicial es Recepción → Lavado → Secado → Planchado → Entrega.

## Conectores y compatibilidad

- `example` mantiene los contratos existentes de web y Android. La operación
  anterior `CrearComanda` también asocia las cinco etapas, aunque los clientes
  antiguos siguen enviando sus prendas por separado.
- `produccion` contiene el guardado web con input de lote restringido mediante
  `@allow`. Comparte servicio, esquema y base de datos con `example`.
- Firebase CLI admite el input `_Data` en el servidor, pero todavía no genera su
  SDK. `lib/produccion/guardar.ts` declara el contrato acotado y usa `mutationRef`.
- El UUID de creación se conserva durante los reintentos. Si se pierde la respuesta,
  se consulta la comanda del mismo creador antes de presentar el guardado como fallido.
- El estado global de una comanda y el estado de sus etapas son conceptos distintos.

## RF18 · Avance por etapa

La primera etapa no completada es la etapa actual. La operación
`CompletarEtapaComanda` valida la secuencia dentro de una transacción: rechaza
saltos, repeticiones, etapas ajenas, flujos incompletos y comandas cerradas. Tras
cada avance activa la etapa siguiente. Al completar Planchado deja la comanda
`FINALIZADA`, lista para entregar; al completar Entrega la cierra como `ENTREGADA`.

La acción está disponible para perfiles activos `admin` y `operario`. Recepción
puede consultar el flujo, pero no reportar avances. La interfaz reutiliza el
lenguaje visual de Comandas, con las cinco tarjetas horizontales, estados,
animaciones y botón principal con gradiente.

## RF19 y RF24 · Fecha y autor del avance

`CompletarEtapaComanda` guarda `fechaCompletado` desde `request.time` y
`operarioId` desde `auth.uid` en la misma transacción que cambia el estado. El
cliente no puede enviar ni sustituir estos valores. La etapa siguiente recibe
`fechaInicio` al activarse; no se atribuye un responsable hasta que se completa.
La primera etapa permanece pendiente hasta su primer reporte, sin inventar una
fecha de inicio. Cada avance agrega una entrada al historial de la comanda.

`operario` identifica al usuario que reportó el avance, que también puede ser
administración. No es una asignación de trabajo: RF23 deberá conservar esta
autoría al reasignar tareas. Los reintentos y avances concurrentes no sobrescriben
la fecha ni el responsable del reporte confirmado.

El cierre por Seguimiento registra además la fecha real de entrega y la
notificación persistente. `EntregarComanda`, disponible para administración y
recepción, completa la quinta etapa con la misma trazabilidad y valida las cuatro
anteriores. Las comandas históricas finalizadas sin flujo siguen admitiendo
entrega sin reconstruir etapas.

Seguimiento y el detalle de Comandas muestran fecha, hora y nombre del responsable
por etapa. Las horas usan `America/Santiago` y respetan el horario de verano. Los
avances históricos sin fecha o responsable muestran explícitamente la ausencia
de registro. Esta implementación utiliza columnas existentes y no rellena datos
históricos. Requiere desplegar los contratos actualizados de Data Connect.

El 7 de septiembre de 2026 se desplegó la primera versión de estos contratos en
`lavanderia-el-cobre-16fd5`. Firebase confirmó compatibilidad del esquema existente.
La revisión posterior añadió controles de acceso al catálogo administrativo y una
edición transaccional de cabecera, prendas y monto con bloqueo optimista; esta
revisión queda pendiente de despliegue. La validación local aprobó 53 pruebas
unitarias, 32 escenarios de integración, TypeScript, ESLint y build de producción.
No se crearon comandas de prueba en la base real; las pruebas de avance,
autorización, rollback y concurrencia se ejecutaron en el emulador.

## Indicadores y filtros de comandas

El badge de Comandas en el sidebar consulta la base de datos y suma únicamente
comandas `PENDIENTE` y `EN_PROCESO`. Los indicadores del módulo Comandas permiten
seleccionar uno o varios estados; un segundo clic deselecciona cada estado y, sin
selecciones, la tabla vuelve a mostrar todos. La consulta pagina y filtra la
selección completa en el servidor y mantiene compatible la variable individual
usada por clientes anteriores.

Admin y recepción crean y asocian comandas. El personal activo consulta producción;
solo admin configura el catálogo. Las operaciones comprueban la existencia del
perfil, su estado activo y su rol en SQL Connect.

## Datos anteriores

Las comandas pendientes sin flujo pueden asociarse desde Seguimiento, una sola vez.
Las comandas anteriores en proceso, finalizadas, entregadas o anuladas mantienen
su estado sin reconstruir etapas o fechas ficticias.

El diagnóstico previo al despliegue encontró el catálogo vacío, ninguna asociación
de etapas y una única comanda anulada. No fue necesaria una migración de comandas.
La migración de esquema añade cuatro columnas opcionales a `comanda_etapa`.

El 6 de septiembre de 2026 se desplegaron el esquema y los conectores `example`
y `produccion` en `lavanderia-el-cobre-16fd5`, y se inicializó el catálogo.
La verificación posterior por SDK confirmó cinco etapas, cero comandas activas
y la misma comanda anulada. Las consultas desplegadas se verificaron con
impersonación de un administrador activo, sin crear comandas de prueba en producción.
La ruta experimental de migración de Firebase CLI devolvió 404; se utilizó su
ruta estándar IAM, sin cambiar preferencias permanentes.

## Verificación

```sh
pnpm test
pnpm lint
pnpm build
pnpm test:production
pnpm dataconnect:compile:web
```

La prueba de integración usa exclusivamente el proyecto `demo-production` y el
emulador local del puerto 9499. Sus fixtures están en `dataconnect/seed_data.gql`
y no se despliegan. No ejecutar simultáneamente los dos últimos comandos:
comparten la copia temporal de configuración en `scratch/production-test`.

La suite incluye 53 pruebas unitarias y 32 escenarios de integración: trazabilidad
de admin/operario/recepción, rechazo de autor y fecha enviados por el cliente,
control de acceso al catálogo, edición atómica, rollback, concurrencia, reintentos,
entrega histórica y lectura de los datos persistidos.
La comprobación manual autenticada queda disponible para el usuario.

La compilación web genera el SDK de JavaScript sin escribir en el proyecto Android.
Se conserva la configuración original de Kotlin en `dataconnect/example/connector.yaml`.

Para inicializar el catálogo en otro entorno con credenciales administrativas,
definir `GCLOUD_PROJECT` y ejecutar `node scripts/init-production.mjs` primero.
Agregar `--apply` crea las cinco etapas si el catálogo está vacío. Si ya existe un
catálogo completo, el script no sobrescribe su configuración; si está incompleto,
requiere revisión.

## Comprobación manual

1. Ingresar como admin o recepción y guardar una comanda con prendas.
2. Abrir su detalle y verificar las cinco etapas pendientes, con progreso 0%.
3. Abrir Seguimiento y buscarla por número o cliente; recargar y comprobar persistencia.
4. Como admin, cambiar descripción o tiempo estimado de una etapa.
5. Verificar que la comanda anterior conserva su configuración y una nueva toma los cambios.
6. Como operario, comprobar que se puede consultar producción sin configurar etapas
   ni asociar manualmente comandas.
7. Completar una etapa como operario y la siguiente como admin: comprobar la hora
   de Chile y el nombre de cada responsable, incluso después de recargar.
8. Entregar otra comanda desde recepción: verificar en su detalle la quinta etapa
   completada, con la persona de recepción como responsable y las anteriores intactas.
# Alertas por tiempo de etapa

Administración dispone de **Configuración → Límites de etapas**. Los cinco
límites se guardan juntos mediante `ConfigurarLimitesEtapas`, con validación de
perfil activo y rol `admin` en el servidor. Se pueden ingresar minutos u horas
(incluidas horas fraccionarias equivalentes a minutos enteros), entre 1 minuto
y 30 días. Valores iniciales: Recepción 15 min, Lavado 90 min, Secado 60 min,
Planchado 60 min y Entrega 24 h. Son valores de partida que debe ajustar el
administrador a la operación de la lavandería.

Los nuevos flujos copian los límites vigentes del catálogo. Un límite todavía
vacío se sustituye por el valor inicial al crear el flujo. Las comandas ya
asociadas conservan su configuración; una copia antigua sin tiempo utiliza el
valor inicial correspondiente, sin heredar ediciones posteriores del catálogo.
Las comandas históricas sin etapas no generan alertas.

Recepción cuenta desde `fechaRecepcion`; las siguientes etapas, desde
`fechaInicio` guardada por el servidor al completar la anterior. Solo se evalúa
la primera etapa incompleta. Las etapas completadas, las futuras pendientes y
las comandas anuladas o entregadas quedan excluidas. El límite exacto todavía
no es retraso: se alerta cuando el tiempo transcurrido lo supera. Se cuentan
minutos continuos, incluidas noches y fines de semana; Entrega incluye la espera
de retiro por el cliente.

`GetComandasParaAlertas` es una consulta mínima exclusiva de administración
activa, paginada por identificador. La web recorre todas las páginas, sin
depender de los filtros ni del límite de 100 comandas del panel. Las alertas
aparecen en todas las secciones de la intranet, la campana y la barra lateral,
con número, etapa, límite, minutos excedidos y operario. El enlace abre la
comanda expandida en Seguimiento para actuar o reasignar un operario.

Se consulta cada 30 segundos mientras la intranet esté visible, al recuperar
el foco y tras reportar avances; el reloj de detección se evalúa cada 10 segundos.
En caso de fallo se muestran los últimos datos junto con un aviso y reintento.
La comparación utiliza el reloj del navegador, que debe estar sincronizado.
Las alertas son avisos dentro de la intranet: no hay envío de correo, push ni
proceso programado cuando está cerrada, y no se modifica `alertaRetraso`.

Publicar los conectores `example` (consulta y configuración) y `produccion`
(valores iniciales al crear flujos) antes de publicar la web. No se necesita
migración de esquema ni sobrescribir los tiempos configurados en producción.
