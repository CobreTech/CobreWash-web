import { getPanelProduccion, type GetPanelProduccionData } from "@/src/dataconnect-generated";
import { dataConnect } from "@/lib/firebase/client";
export async function consultarPanelProduccion() {
  let resultado: GetPanelProduccionData | null = null;
  const comandas = new Map<string, GetPanelProduccionData["comandas"][number]>();
  for (let offset = 0; ; offset += 100) {
    const { data } = await getPanelProduccion(dataConnect, { limit: 100, offset }, { fetchPolicy: "SERVER_ONLY" });
    resultado ??= data;
    data.comandas.forEach(c => comandas.set(c.id, c));
    if (data.comandas.length < 100) return { ...resultado, comandas: [...comandas.values()] };
  }
}
