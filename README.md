# CobreWash · Lavandería El Cobre

Plataforma web para **Lavandería El Cobre** (Calama, Chile): un sitio institucional
para clientes y una **intranet de gestión operacional** para el equipo interno.
Desde una sola aplicación se presenta el negocio al público y se administran las
comandas, la producción, el inventario y los usuarios de la lavandería.

Desarrollado por **CobreTech**.

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
- [Node.js](https://nodejs.org) 18.18 o superior
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

## 📄 Licencia

Proyecto privado — © CobreTech. Todos los derechos reservados.
