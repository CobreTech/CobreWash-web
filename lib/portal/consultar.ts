import { getMisComandas, vincularMiComanda, type ComandaEstado, type GetMisComandasData } from "@/src/dataconnect-generated";
import { auth, dataConnect } from "@/lib/firebase/client";
import { normalizarNumeroComanda } from "@/lib/seguimiento/qr";

export type PedidoCliente = GetMisComandasData["comandas"][number];
export const TAMANO_PAGINA = 10;

export async function consultarMisComandas(estado: ComandaEstado | null, pagina: number) {
  const { data } = await getMisComandas(dataConnect, {
    estado, limit: TAMANO_PAGINA, offset: pagina * TAMANO_PAGINA,
  }, { fetchPolicy: "SERVER_ONLY" });
  return { pedidos: data.comandas, total: data.total[0]?._count ?? 0 };
}

export async function vincularPedido(numero: string) {
  const numeroComanda = normalizarNumeroComanda(numero);
  const user = auth.currentUser;
  if (!user) throw new Error("Inicia sesión para vincular pedidos.");
  await user.reload();
  await user.getIdToken(true);
  await vincularMiComanda(dataConnect, { numeroComanda });
}
