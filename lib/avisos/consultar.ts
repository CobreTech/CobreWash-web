import { getAvisosAdministracion } from "@/src/dataconnect-generated";
import { dataConnect } from "@/lib/firebase/client";

export const AVISOS_POR_PAGINA = 20;

export async function consultarAvisos(pagina: number) {
  const { data } = await getAvisosAdministracion(
    dataConnect,
    { limit: AVISOS_POR_PAGINA, offset: (pagina - 1) * AVISOS_POR_PAGINA },
    { fetchPolicy: "SERVER_ONLY" },
  );
  return { avisos: data.avisos, total: data.total[0]?._count ?? 0 };
}
