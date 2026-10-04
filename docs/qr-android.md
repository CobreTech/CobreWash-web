# QR compartido: web y Android

## Contrato del comprobante

El QR contiene una URL HTTPS, no el número de comanda ni su ID interno:

```text
https://lavanderia-elcobre.vercel.app/seguimiento?qr=12345678-1234-4234-8234-123456789abc
```

`qr` es `Comanda.codigoQr`, generado por PostgreSQL al crear la comanda. Es único,
estable y distinto de `Comanda.id`. La web normaliza UUID compactos del SDK a
UUID canónicos con guiones antes de imprimir. Editar prendas, avanzar etapas,
entregar o reimprimir no cambia el código.

El cliente abre esta URL con su cámara habitual y consulta sin iniciar sesión.
El operario escanea **dentro de Android** y abre la pantalla interna. No se
requieren App Links, esquemas personalizados ni redirecciones según dispositivo.
La implementación del lector Android corresponde al encargado de esa app.

## Configuración web y dominios

La variable de build obligatoria es:

```dotenv
NEXT_PUBLIC_SEGUIMIENTO_BASE_URL=https://lavanderia-elcobre.vercel.app
```

Debe ser un origen HTTPS sin ruta, parámetros, fragmento ni credenciales. Se
admite una barra final. Configurar en Vercel **antes del build**; las variables
`NEXT_PUBLIC_*` quedan incorporadas al bundle. No usar `VERCEL_URL`, el dominio
de previews ni `window.location.origin` como alternativa. Una configuración
ausente/incorrecta bloquea el comprobante QR, pero no el guardado del pedido.

El dominio permitido en Android debe coincidir exactamente. Si en el futuro se
cambia, conservar el dominio anterior sirviendo `/seguimiento?qr=...` y añadir
ambos dominios a la lista Android antes de emitir nuevos comprobantes. Cambiar
la variable no modifica los QR ya impresos. Los patrones falsos anteriores
necesitan reimpresión para poder escanearse.

## Operaciones del conector `example`

Servicio: `lavanderia-el-cobre`, región: `southamerica-west1`, proyecto actual:
`lavanderia-el-cobre-16fd5`. Reutilizar la misma Firebase App y sesión que la app
emplea hoy. Los contratos fuente están en
`dataconnect/example/seguimiento-queries.gql`.

| Operación | Variables | Permiso |
|---|---|---|
| `GetSeguimientoPublicoPorQr` | `codigoQr: UUID!` | Público |
| `GetSeguimientoPublicoPorNumero` | `numeroComanda: String!` | Público |
| `GetComandaOperativaPorQr` | `codigoQr: UUID!` | Perfil activo admin, recepcionista u operario |

Las operaciones públicas solo devuelven `numeroComanda`, `estado`,
`fechaRecepcion`, `fechaEntregaEstimada`, `fechaEntregaReal`, `actualizadoEn`,
servicios de las líneas y etapas con nombre, orden, estado y fecha de
finalización. No devuelven `id`, `codigoQr`, cliente, precios, observaciones,
incidencias ni responsables. La búsqueda manual acepta `ELCOBRE-14r3`, `14r3`
y el prefijo antiguo `COBRE-`; la web normaliza a `ELCOBRE-14r3`.

**Android debe usar `GetComandaOperativaPorQr`**, que devuelve `comanda` con:

- `id`, `codigoQr`, `numeroComanda`, `estado`, `actualizadoEn` y fechas.
- `cliente { id nombre tipoCliente }`.
- Prendas: `id`, `cantidad`, `pesoKg`, `detalle`, nombre de prenda y servicio.
- Etapas: `etapaId`, snapshot de nombre/orden/descripción/tiempo, `estado`,
  `fechaInicio`, `fechaCompletado`, autor, asignado y referencia al catálogo.

`comanda` nula significa código inexistente. Un error de autorización es distinto:
el servidor verifica la sesión, existencia de perfil, estado activo y rol, incluso
si el cliente altera su UI. Los clientes y usuarios anónimos no pueden acceder.
Conservar `GetComandaPorQr` para consumidores anteriores; ese contrato público
heredado no debe emplearse para autorizar trabajo operativo.

## Regeneración Kotlin

Después de actualizar los contratos, regenerar el SDK; no copiar operaciones
manualmente al SDK generado. En `dataconnect/example/connector.yaml` ya existe:

```yaml
kotlinSdk:
  - outputDir: ..\..\..\CobreWash-App\shared\dataconnect-generated
    package: com.elcobre.lavanderiaelcobre.dataconnect
```

Verificar que `outputDir` corresponda al checkout Android del encargado antes
de ejecutar, desde la raíz web:

```powershell
npx -y firebase-tools@latest dataconnect:sdk:generate
```

El SDK web se regenera de forma aislada con `pnpm dataconnect:compile:web`, que
no escribe en el proyecto Android. Publicar las nuevas operaciones antes de
distribuir una app que las llame. Manejar valores desconocidos de enums del SDK
Kotlin mostrando un estado no disponible, sin asumir una transición.

## Implementar el lector en Android

1. Agregar una acción **Escanear comanda** a la pantalla operativa. Usar CameraX
   con `ImageAnalysis` y ML Kit, limitado a `Barcode.FORMAT_QR_CODE`. Usar el
   modelo incluido: `com.google.mlkit:barcode-scanning:17.3.0`, no el modelo que
   necesita descargarse en el primer uso. Requiere Android API 23 o superior.
   Reutilizar la versión CameraX del proyecto si ya la utiliza.
2. Solicitar permiso de cámara; si se rechaza, mostrar instrucciones para
   habilitarlo y permitir volver. Cerrar `ImageProxy` en todos los caminos y
   liberar analizador/cámara al abandonar la pantalla.
3. Leer `rawValue` y validar el contrato; no abrir la URL en navegador ni WebView.
4. Tras una detección válida, pausar el análisis y bloquear nuevas detecciones
   mientras se resuelve ese pedido. Mostrar carga y permitir cancelar.
5. Si falta sesión o el token expiró, conservar el UUID pendiente en el estado
   de navegación/ViewModel y continuar después del login. No guardar credenciales
   en el QR. Una cuenta inactiva o sin rol permitido debe mostrar acceso denegado.
6. Ejecutar `GetComandaOperativaPorQr` con la sesión Firebase actual, solicitando
   lectura de servidor. Con resultado, navegar al detalle usando **`comanda.id`**;
   no confundirlo con `codigoQr` ni `numeroComanda`.
7. Si no existe, mostrar “No encontramos esa comanda”. En fallo de red, conservar
   el código y ofrecer Reintentar o Escanear otra. La lectura visual funciona
   offline, pero consultar/operar el pedido requiere conexión.
8. Escanear solamente abre el detalle. Completar etapas, registrar incidencias y
   entregar mantienen las acciones explícitas y los permisos de las mutaciones
   existentes. En pedidos entregados/anulados, respetar el estado de cierre.

Validación de referencia (Kotlin):

```kotlin
private val dominiosQr = setOf("lavanderia-elcobre.vercel.app")
private val patronUuid = Regex(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
)

fun extraerCodigoQr(raw: String): java.util.UUID? = runCatching {
    val uri = android.net.Uri.parse(raw.trim())
    require(uri.scheme == "https")
    require(uri.host?.lowercase(java.util.Locale.ROOT) in dominiosQr)
    require(uri.port == -1 || uri.port == 443)
    require(uri.userInfo == null && uri.fragment == null)
    require(uri.encodedPath == "/seguimiento")
    require(uri.queryParameterNames == setOf("qr"))
    val valores = uri.getQueryParameters("qr")
    require(valores.size == 1 && patronUuid.matches(valores.single()))
    java.util.UUID.fromString(valores.single())
}.getOrNull()
```

Rechazar HTTP, dominios parecidos, credenciales, otra ruta, parámetro vacío o
duplicado y texto arbitrario. No mezclar este contrato con QR de inventario.

Referencias oficiales:
[ML Kit para Android](https://developers.google.com/ml-kit/vision/barcode-scanning/android),
[CameraX ImageAnalysis](https://developer.android.com/media/camera/camerax/analyze),
[SDK Android de Data Connect](https://firebase.google.com/docs/data-connect/android-sdk).

## Pruebas de aceptación coordinadas

- Un mismo comprobante impreso abre el pedido público en el teléfono del cliente
  y el detalle operativo del mismo `id` dentro de la app de la tablet.
- Verificar permiso de cámara rechazado, detecciones repetidas, QR ajeno,
  URL inválida, código inexistente, red ausente y recuperación después del login.
- Verificar acceso con admin, recepción y operario; rechazar cliente, cuenta
  inactiva, usuario sin perfil y acceso anónimo desde el servidor.
- Editar/reimprimir/avanzar/entregar conserva `codigoQr`; el seguimiento muestra
  los cambios reales. “Listo para retirar” es distinto de “Entregado”.
- Los pedidos históricos sin etapas muestran su estado sin progreso inventado.
- Imprimir solo el ticket con QR de 35 mm como mínimo, margen blanco completo y
  sin recortes. Probar la impresora real antes de emitir comprobantes operativos.

El botón Imprimir mide el rectángulo mostrado y solicita ese ancho y alto como
tamaño de papel, con márgenes cero. Conserva el diseño, los colores y el QR de
la vista previa. La fecha y hora de generación se muestran dentro del ticket
en `America/Santiago`, separadas de la fecha de recepción. Si la impresora
requiere A4/Carta, el resto de la hoja queda blanco. Las preferencias del diálogo
de impresión pueden sobreescribir el tamaño o los encabezados/pies del navegador;
si aparecen, desactivar “Encabezados y pies de página” en ese diálogo.

## Publicación y comprobación

1. Ejecutar `pnpm test`, `pnpm test:production`, `pnpm exec tsc --noEmit`,
   `pnpm lint` y `pnpm build`. La suite de integración usa exclusivamente un
   proyecto demo en el emulador y no crea pedidos reales.
2. Desplegar el conector actualizado `example` en Firebase. No hay migración de
   esquema ni necesidad de cambiar códigos ya persistidos.
3. Configurar `NEXT_PUBLIC_SEGUIMIENTO_BASE_URL` en el proyecto Vercel correcto
   y publicar la web; comprobar el dominio y la ruta con una comanda real ya
   existente, sin crear pedidos de prueba en producción.
4. Distribuir la app Android actualizada y hacer la prueba conjunta de teléfono,
   tablet e impresora. Los QR falsos antiguos deben reimprimirse.

Cambiar/revertir la web no cambia la base ni los códigos. Conservar los contratos
existentes evita romper versiones anteriores de Android. La prueba física no
queda cubierta por tests del repositorio: debe completarse con el encargado.
