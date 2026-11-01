# Infraestructura y tratamiento de datos

Revisión de código y documentación oficial: 1/11/2026. Alcance: repositorios web
y app; no se consultaron consolas ni cuentas productivas. El usuario confirmó en
este chat el 1/11/2026 que Storage está en Chile y Vercel en Brasil. Se identifica
esa fuente expresamente, sin presentarla como una consulta de consola.

## Hechos acreditados y límites

| Servicio | Información que se puede completar | Evidencia / límite |
|---|---|---|
| Firebase / Google Data Connect y PostgreSQL | Datos de cuentas, fichas, pedidos, personal, contactos y derechos; región configurada `southamerica-west1`, Santiago (Chile) | `dataconnect/dataconnect.yaml`, `lib/firebase/admin.ts`, SDK web y `ExampleConnector.kt` del SDK Android coinciden. Es configuración del proyecto, no comprobación del recurso desplegado ni sus copias |
| Firebase Authentication / Google | Inicio de sesión y datos de autenticación; tratamiento en Estados Unidos según Google | `lib/firebase/client.ts`, `lib/firebase/admin.ts`, `AuthRepository.android.kt`; ubicación del servicio documentada por Firebase, no deducida de la región de la base |
| Cloud Storage for Firebase / Google | Objetos de evidencia fotográfica; ubicación Chile, confirmada por el usuario | `lib/firebase/admin.ts`, API de fotos y cliente Android identifican el servicio. El país se incorpora desde la confirmación del usuario; el código solo parametriza el bucket y no prueba su ubicación |
| Vercel | Hosting y ejecución de API Node.js; región Brasil, confirmada por el usuario; datos recibidos/procesados por las rutas y registros del proveedor | Origen web en `.env.example`, `Evidencias.android.kt` y `AvisoPrivacidad.kt`; rutas declaran `runtime = "nodejs"`. La región no está fijada en el repositorio: su fuente es la confirmación del usuario, no el valor predeterminado del proveedor |

## Fuentes del proveedor

- Santiago: https://docs.cloud.google.com/sql/docs/postgres/locations?hl=en
- Firebase Auth y ubicaciones: https://firebase.google.com/support/privacy
- Regiones de funciones Vercel:
  https://vercel.com/docs/functions/configuring-functions/region
- La lista de Vercel identifica su región brasileña como São Paulo (`gru1`):
  https://vercel.com/docs/regions. La confirmación recibida fue del país; no se
  leyó el código de región desde la consola del proyecto.

La documentación de Vercel describe un valor predeterminado para proyectos nuevos,
pero eso no demuestra la configuración del proyecto existente. Google distingue
Auth en EE. UU. de otros servicios cuya ubicación puede seleccionarse. La región
de Data Connect no acredita la residencia de Storage, Auth, logs, respaldos ni
accesos de soporte. No se afirma que una lista pública de términos pruebe aceptación
contractual o un mecanismo válido de transferencia para este responsable.

## Qué informar en el aviso público

Proveedor/servicio, función, categorías de datos, destinatarios, países/transferencias
aplicables y garantías que efectivamente se hayan verificado. Separar la ubicación
principal de la base de otros tratamientos internacionales. No hace falta publicar
IPs, hostnames internos, identificadores de recursos, cuentas de servicio, versiones
de infraestructura ni credenciales para explicar estos tratamientos.

El aviso borrador ya identifica Google/Firebase y Vercel, Data Connect configurado
en Santiago, Storage en Chile, Vercel en Brasil y Auth en EE. UU. La base y garantías
de las transferencias y la operación de logs/copias/soporte siguen siendo revisiones
separadas; no se consideran acreditadas por la mera ubicación principal.

## Comprobaciones técnicas concretas

1. Ubicación de la instancia Cloud SQL/Data Connect desplegada, copias y restauración.
2. Conservar evidencia de la ubicación chilena de Storage confirmada y revisar
   política de objetos/copias.
3. Conservar evidencia de la región brasileña de Vercel confirmada y revisar logs
   y su retención; no confundir CDN
   de recursos estáticos con ejecución de una API que procesa datos personales.
4. Términos/DPA efectivamente aplicables y aceptados, entidad contratante,
   subencargados, países y mecanismo de transferencia que corresponda.

Estas comprobaciones pueden realizarlas quienes administran las cuentas. No se
solicitan contraseñas ni se cambia infraestructura productiva desde esta revisión.
