import { getComandasParaAlertas, type GetComandasParaAlertasData } from "@/src/dataconnect-generated";
import { dataConnect } from "@/lib/firebase/client";

const PAGE_SIZE = 100;
type Comanda = GetComandasParaAlertasData["comandas"][number];
export async function consultarComandasAlertas(vigente: () => boolean, consultar = async (offset: number) => {
  const resultado = await getComandasParaAlertas(dataConnect, { limit: PAGE_SIZE, offset }, { fetchPolicy: "SERVER_ONLY" });
  return resultado.data.comandas;
}) {
  const comandas = new Map<string, Comanda>();
  for (let offset = 0; vigente(); offset += PAGE_SIZE) {
    const pagina = await consultar(offset);
    if (!vigente()) return null;
    for (const c of pagina) comandas.set(c.id, c);
    if (pagina.length < PAGE_SIZE) return [...comandas.values()];
  }
  return null;
}
