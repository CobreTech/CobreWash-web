"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUsuarioActualContext } from "@/components/intranet/AuthGuard";
import { LANDING_POR_ROL, type Rol } from "@/lib/roles";

/**
 * Guarda por página: redirige al usuario a su vista principal si su rol no
 * está entre los permitidos para la sección actual. AuthGuard ya garantiza
 * que el usuario está autenticado y es un rol interno, así que aquí solo
 * restringimos por sección (defensa en profundidad frente a URLs escritas a mano).
 *
 * Devuelve `true` mientras el rol es válido para renderizar la página.
 */
export function useRoleGuard(rolesPermitidos: Rol[]): boolean {
  const router = useRouter();
  const usuario = useUsuarioActualContext();
  const rol = usuario?.rol.nombre as Rol | undefined;
  const permitido = !!rol && rolesPermitidos.includes(rol);

  useEffect(() => {
    if (rol && !permitido) {
      router.replace(LANDING_POR_ROL[rol] ?? "/");
    }
  }, [rol, permitido, router]);

  return permitido;
}
