# CobreWash · Lavandería El Cobre

Plataforma web para **Lavandería El Cobre** (Calama, Chile): un sitio institucional
para clientes y una **intranet de gestión operacional** para el equipo interno.
Desde una sola aplicación se presenta el negocio al público y se administran las
comandas, la producción, el inventario y los usuarios de la lavandería.

Desarrollado por **[CobreTech](https://github.com/CobreTech)**.

---

## ✨ Características

### Sitio público
- **Landing** moderna con secciones de Hero, Servicios, Maquinaria, Recepción y
  formulario de contacto.
- Diseño responsivo, animado y con identidad de marca (paleta *copper* sobre
  fondo cálido).

### Intranet de gestión
Panel administrativo con tema oscuro y su propia navegación:

- **Dashboard** — resumen operativo.
- **Comandas** — registro y seguimiento de órdenes de trabajo.
- **Seguimiento de producción** — control por etapas del proceso.
- **Inventario** — gestión de insumos y stock.
- **Clientes** — administración de clientes (hoteles y particulares).
- **Usuarios y roles** — control de acceso interno.
- **Reportes y comunicación** — indicadores y mensajería.

---

## 🛠️ Stack tecnológico

| Área | Tecnología |
|------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | React 19, TypeScript |
| Estilos | Tailwind CSS v4 (configuración CSS-first) |
| Animación | Framer Motion |
| Iconos | Lucide React |
| Backend / Auth | Firebase (Auth + Data Connect / PostgreSQL) |
| Gestor de paquetes | pnpm |

---

## 🚀 Puesta en marcha

### Requisitos previos
- [Node.js](https://nodejs.org) compatible con Next.js 16 (entorno validado: 26.13)
- [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)
- Un proyecto de [Firebase](https://console.firebase.google.com)

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Configurar las variables de entorno
Copia el archivo de ejemplo y completa las credenciales de tu proyecto Firebase:

```bash
cp .env.example .env.local
```

Luego edita `.env.local` con los valores del **SDK web** de tu proyecto
(Firebase Console → Configuración del proyecto → Tus apps).

Los formularios públicos también requieren `CONTACT_RATE_LIMIT_SALT` y un origen
verificable: Vercel aporta su encabezado de plataforma; otros hosts usan un proxy
firmado. Consulta [Origen de los formularios](#origen-de-los-formularios).

Para emitir QR reales configura `NEXT_PUBLIC_SEGUIMIENTO_BASE_URL` como origen
HTTPS estable (actualmente `https://lavanderia-elcobre.vercel.app`). También debe
estar configurado en Vercel antes del build. No se usa el dominio de previews
como alternativa; una configuración ausente bloquea el comprobante QR.
El QR contiene `/seguimiento?qr=<UUID persistido>`, no el número corto de comanda.
La app Android debe usar ese mismo origen y contrato.

### 3. Levantar el entorno de desarrollo
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver el sitio público.
La intranet está disponible en [http://localhost:3000/intranet](http://localhost:3000/intranet).

---

## 📦 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia el servidor de desarrollo |
| `pnpm build` | Genera la build de producción |
| `pnpm start` | Sirve la build de producción |
| `pnpm lint` | Ejecuta ESLint |
| `pnpm test` | Ejecuta las pruebas unitarias |
| `pnpm dataconnect:compile:web` | Compila conectores y regenera el SDK web |
| `pnpm test:production` | Integración de producción con emulador demo |
| `pnpm test:portal` | Integración del portal y sus permisos |
| `pnpm test:estabilizacion` | Regresiones de concurrencia, flota y fotos |
| `pnpm test:privacidad` | Integración del canal de derechos |
| `pnpm verify:privacy` | Informa controles de privacidad pendientes de evidencia |

---

## 🗂️ Estructura del proyecto

```
app/                 Rutas (App Router): landing pública + intranet
  ├─ page.tsx        Landing principal
  ├─ intranet/       Panel de gestión (comandas, inventario, usuarios, ...)
  ├─ cuenta/         Cuenta de cliente
  └─ seguimiento/    Seguimiento de pedidos
components/          Componentes de UI
  ├─ landing/        Secciones del sitio público
  ├─ intranet/       Componentes del panel
  └─ layout/         Navbar y Footer compartidos
lib/                 Utilidades y helpers
dataconnect/         Esquema de datos (Firebase Data Connect / PostgreSQL)
src/                 SDK generado de Data Connect
public/              Recursos estáticos
```

---

## 🔐 Firebase Data Connect (opcional, entorno local)

El directorio `dataconnect/` contiene el esquema de datos del sistema
(comandas, etapas de producción, insumos, usuarios y roles). Para trabajar con
el emulador local usa la CLI de Firebase:

```bash
firebase emulators:start
```

Los datos del emulador se persisten en `dataconnect/.dataconnect/pgliteData`.

---

## Códigos de comanda

Los códigos nuevos `ELCOBRE-…` tienen cuatro caracteres en mayúsculas e incluyen
al menos una letra y un número, por ejemplo `ELCOBRE-1ABC`. El seguimiento y la
vinculación aceptan el código en minúsculas o mayúsculas, con o sin prefijo desde
los formularios web. Los códigos históricos siguen consultables sin modificarlos.
El servidor normaliza las nuevas altas ELCOBRE y rechaza códigos sin mezcla o
duplicados, incluida una coincidencia con históricos que solo difiera por letras
mayúsculas/minúsculas. Se conservan los formatos anteriores ajenos al prefijo
ELCOBRE para compatibilidad. Publicar web y conectores coordinadamente.

## Adecuación de privacidad

La matriz verificable está en `docs/cumplimiento-21719.json`. Faltan razón social,
RUT, domicilio y representante legal. Completar `LEGAL_*` y aprobar expresamente
la versión propuesta `2026-11-01` antes de habilitar nuevas autorizaciones.
No se declara cumplimiento integral por completar variables o pasar pruebas:
también se deben implantar y verificar los controles operativos del registro.

Infraestructura: Data Connect configurado en Santiago; Storage en Chile y Vercel
en Brasil según confirmación del administrador; Firebase Authentication procesa
datos en EE. UU. Las ubicaciones principales no acreditan por sí solas las de
logs, respaldos y soporte ni las garantías de transferencia.

El portal no ofrece contratación ni pagos en línea. El canal de derechos admite
solicitudes sin cuenta; el cierre administrativo registra resultado, ejecución y
evidencia de respuesta, pero no ejecuta por sí solo borrados, bloqueos o envíos.
La descarga JSON del perfil no sustituye una respuesta completa de acceso.

`pnpm verify:privacy` informa controles sin evidencia (código 2 mientras existan
pendientes). `pnpm privacy:incident indicadores.json` orienta la evaluación local
de brechas sin enviar comunicaciones; esta utilidad usa el runtime Node 26.13
preparado para las pruebas. Ejecutar la validación dentro del entorno aislado
descrito a continuación. El mantenimiento `scripts/privacidad-retencion.mjs`
solo purga contadores técnicos; no elimina automáticamente cuentas, pedidos,
fotografías o expedientes.

## Origen de los formularios

`CONTACT_RATE_LIMIT_SALT` debe ser un secreto de servidor de al menos 32 caracteres.
En Vercel se utiliza `x-vercel-forwarded-for` de la plataforma. No configurar
`VERCEL=1` manualmente en otros hosts ni confiar en `X-Forwarded-For` del cliente.

En otros hosts, el proxy debe eliminar los encabezados recibidos del cliente y
generar `x-cobre-client-ip`, `x-cobre-client-timestamp` (segundos Unix) y
`x-cobre-client-signature` (HMAC-SHA256 hexadecimal). Firma con
`CONTACT_PROXY_SECRET` el mensaje UTF-8 `cobre-solicitudes\n<timestamp>\n<ip>`, con
saltos de línea reales y sin salto final. La IP debe provenir de la conexión, sin
puerto, lista ni zona; se firma exactamente su representación enviada. La tolerancia
temporal es de 60 segundos. Mantener relojes sincronizados y secretos fuera del
navegador y logs. Sin origen verificable, las nuevas solicitudes fallan cerradas.

## Pruebas aisladas y publicación

En el equipo configurado se usa WSL2 `CobreWash-Security` con Bubblewrap, red sin
salida externa y loopback aislado para cada emulador. Entorno vacío con variables
permitidas, sin carpetas Windows, credenciales ni sockets del host. Herramientas
y dependencias de solo lectura; copia descartable de fuente en scratch.

Límites: tmpfs 1 GiB, memoria 3 GiB sin swap, CPU 200%, 128 procesos y 180 segundos
por trabajo; CPU 120 segundos por proceso, archivos 128 MiB, 1024 descriptores y
sin volcados. El lanzador comprueba los límites de cgroup antes de ejecutar código.

```powershell
powershell -NoProfile -File scratch/security-tooling/test-isolated.ps1 -Suite unit
powershell -NoProfile -File scratch/security-tooling/test-isolated.ps1 -Suite production
```

Suites locales: `unit`, `types`, `lint`, `sdk`, `portal`, `production`, `vehiculos`,
`privacidad` y `estabilizacion`. La configuración local en `scratch/` está ignorada
por Git y no se distribuye con el repositorio. El lanzador utiliza la copia Linux
`/opt/cobrewash/source`: actualizarla explícitamente con una lista de fuentes sin
secretos antes de probar una revisión nueva. No sincroniza automáticamente Windows.

Precargar dependencias con lockfile congelado y scripts desactivados antes del
trabajo sin red. Usar identidades ficticias y el proyecto `demo-production`.
No ejecutar pruebas contra producción. Publicar coordinadamente esquema,
conectores y web; un push de Git no publica operaciones en Firebase. El SDK está
versionado; su documentación Markdown generada se ignora. Las fotos requieren
reserva antes de Storage y confirmación posterior; conservar reservas con resultado
incierto para reintentar el mismo ID, sin liberar cupos automáticamente.

## 📄 Licencia

Proyecto privado — © CobreTech. Todos los derechos reservados.
