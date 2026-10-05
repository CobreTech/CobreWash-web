import { getAvisosAdministracion, getAvisosParaEquipo } from "@/src/dataconnect-generated";
import { dataConnect } from "@/lib/firebase/client";

export const AVISOS_POR_PAGINA = 20;

export async function consultarAvisos(rol: string, pagina: number) {
  const variables = { limit: AVISOS_POR_PAGINA, offset: (pagina - 1) * AVISOS_POR_PAGINA };
  const opciones = { fetchPolicy: "SERVER_ONLY" as const };
  if (!["admin", "operario", "recepcionista"].includes(rol)) {
    throw new Error("Acceso reservado al personal.");
  }
  const { data } = rol === "admin"
    ? await getAvisosAdministracion(dataConnect, variables, opciones)
    : await getAvisosParaEquipo(dataConnect, { ...variables, rol }, opciones);
  return { avisos: data.avisos, total: data.total[0]?._count ?? 0 };
}
