import { getSeguimientoPublicoPorQr, getSeguimientoPublicoPorNumero } from "@/src/dataconnect-generated";
import { dataConnect } from "@/lib/firebase/client";
import type { ConsultaSeguimiento, PedidoPublico } from "./publico";

export async function consultarSeguimiento(consulta: ConsultaSeguimiento): Promise<PedidoPublico | null> {
  const resultado = consulta.tipo === "qr"
    ? await getSeguimientoPublicoPorQr(dataConnect, { codigoQr: consulta.valor }, { fetchPolicy: "SERVER_ONLY" })
    : await getSeguimientoPublicoPorNumero(dataConnect, { numeroComanda: consulta.valor }, { fetchPolicy: "SERVER_ONLY" });
  return resultado.data.comanda ?? null;
}
