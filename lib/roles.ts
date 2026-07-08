import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Archive,
  Users,
  Settings,
  BarChart3,
  Megaphone,
  Contact,
  type LucideIcon,
} from "lucide-react";

/**
 * Roles del sistema (coinciden con Rol.nombre en la base de datos / Data Connect).
 * No existe un rol "Supervisor": sus funciones las cumple el Administrador.
 */
export type Rol = "admin" | "recepcionista" | "operario" | "cliente";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number;
}

/**
 * Navegación por rol. Cada rol ve ÚNICAMENTE las secciones a las que tiene
 * acceso según la matriz de accesos del proyecto (no secciones deshabilitadas).
 * Operario reutiliza rutas del admin (/seguimiento, /comunicacion) pero con
 * contenido y etiquetas propias — el contenido se adapta según el rol.
 */
export const NAV_POR_ROL: Record<Exclude<Rol, "cliente">, NavItem[]> = {
  admin: [
    { href: "/intranet", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/intranet/comandas", label: "Comandas", icon: ClipboardList, badge: 5 },
    { href: "/intranet/seguimiento", label: "Seguimiento", icon: Package, badge: 6 },
    { href: "/intranet/inventario", label: "Inventario", icon: Archive },
    { href: "/intranet/reportes", label: "Reportes", icon: BarChart3 },
    { href: "/intranet/comunicacion", label: "Comunicación", icon: Megaphone },
    { href: "/intranet/usuarios", label: "Usuarios", icon: Users },
    { href: "/intranet/configuracion", label: "Configuración", icon: Settings },
  ],
  recepcionista: [
    { href: "/intranet/comandas", label: "Comandas", icon: ClipboardList },
    { href: "/intranet/seguimiento", label: "Seguimiento", icon: Package },
    { href: "/intranet/clientes", label: "Clientes", icon: Contact },
    { href: "/intranet/configuracion", label: "Configuración", icon: Settings },
  ],
  operario: [
    { href: "/intranet/seguimiento", label: "Mis Tareas", icon: Package },
    { href: "/intranet/comunicacion", label: "Avisos", icon: Megaphone },
    { href: "/intranet/configuracion", label: "Configuración", icon: Settings },
  ],
};

/**
 * Qué roles pueden abrir cada ruta de la intranet. Se usa para el guardado por
 * página (defensa en profundidad, por si alguien escribe la URL a mano).
 */
export const ACCESO_POR_RUTA: Record<string, Rol[]> = {
  "/intranet": ["admin"],
  "/intranet/comandas": ["admin", "recepcionista"],
  "/intranet/clientes": ["admin", "recepcionista"],
  "/intranet/seguimiento": ["admin", "recepcionista", "operario"],
  "/intranet/inventario": ["admin"],
  "/intranet/reportes": ["admin"],
  "/intranet/comunicacion": ["admin", "operario"],
  "/intranet/usuarios": ["admin"],
  "/intranet/configuracion": ["admin", "recepcionista", "operario"],
};

/** Vista a la que se redirige a cada rol tras iniciar sesión. */
export const LANDING_POR_ROL: Record<Rol, string> = {
  admin: "/intranet",
  recepcionista: "/intranet/comandas",
  operario: "/intranet/seguimiento",
  cliente: "/cuenta",
};

/** Roles que usan el shell interno (sidebar oscuro) de la intranet. */
export const ROLES_INTERNOS: Rol[] = ["admin", "recepcionista", "operario"];

export function esRolInterno(rol: string | undefined): boolean {
  return !!rol && ROLES_INTERNOS.includes(rol as Rol);
}

/** Devuelve la ruta correspondiente al rol actual dentro de una sección. */
export function rutaPermitida(rol: string | undefined, pathname: string): boolean {
  if (!rol) return false;
  // Coincidencia por prefijo para rutas anidadas.
  const entry = Object.entries(ACCESO_POR_RUTA)
    .filter(([ruta]) => pathname === ruta || pathname.startsWith(ruta + "/"))
    // la ruta más específica (más larga) gana
    .sort((a, b) => b[0].length - a[0].length)[0];
  if (!entry) return false;
  return entry[1].includes(rol as Rol);
}
